<?php

namespace App\Http\Controllers;

use App\Models\catalogos;
use App\Models\query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use GuzzleHttp\Client;

class controladorBecas extends Controller
{

    /**
     * Procesa la solicitud de consulta de beca validando la CURP y opcionalmente el captcha,
     * y redirige a la función que obtiene la información del becario.
     *
     * Esta función define reglas de validación personalizadas:
     * - `validacurp`: Verifica el formato válido de una CURP.
     * - `limitecurp`: Limita el número de consultas por CURP a dos por día.
     * - `validar_captcha` (comentado): Verifica el captcha utilizando el servicio de hCaptcha.
     *
     * Si las validaciones son exitosas, obtiene la CURP del formulario y llama a
     * `getBecarioJSON($curp)` para procesar y devolver los datos correspondientes.
     *
     * @param \Illuminate\Http\Request $peticion Instancia del objeto Request con los datos del formulario.
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     * Retorna una respuesta JSON con los datos del becario, o redirige con errores de validación.
     *
     * @throws \Illuminate\Validation\ValidationException Si las reglas de validación fallan.
     * 
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public function consultaBeca(Request $peticion)
    {

        Validator::extend('validacurp', function ($attribute, $value, $parameters, $validator) {
            $ctrl_util = new controladorUtilerias();
            return $ctrl_util->validarCURP($value);
        });



        Validator::extend('limitecurp', function ($attribute, $value, $parameters, $validator) {
            $hoy = Carbon::now('America/Mexico_City')->startOfDay();
            $manana = Carbon::now('America/Mexico_City')->endOfDay();

            $consultaHoy = DB::table('queries')
                ->where('query_curp', $value)
                ->whereBetween('query_tmp', [$hoy, $manana])
                ->count();

            return $consultaHoy < 2;
        });


        Validator::extend('validar_captcha', function ($attribute, $value, $parameters, $validator) {
            $response = Http::asForm()->post('https://hcaptcha.com/siteverify', [
                'secret' => env('HCAPTCHA_SECRET'),
                'response' => $value,
                'remoteip' => request()->ip(),
            ]);

            $verification = $response->json();

            return $verification['success'];
        });

        $reglas = [
            'txtCURP' => 'required|min:18|max:18|validacurp|limitecurp',
            /* 'h-captcha-response' => 'required|validar_captcha' */
        ];


        $mensajes = [
            'required' => 'El campo es obligatorio.',
            'txtCURP.validacurp' => 'El formato de CURP es incorrecto',
            'txtCURP.limitecurp' => 'Agotastes tus consultas, vuelve mañana',
            'txtCURP.max' => 'Deben ser :max dígitos como máximo',
            'txtCURP.min' => 'Deben ser :max dígitos como mínimo',
            'validar_captcha' => 'Captcha inválido, recarga el captcha de nuevo'
        ];

        $ctrlUtilerias = new controladorUtilerias();
        $ctrlUtilerias->validarFormulario($peticion, $reglas, $mensajes);

        $curp = $peticion->txtCURP;
        return $this->buscarBecarioAPI($curp);
    }


    /**
     * Busca los datos de un becario usando su CURP desde la API oficial o desde un archivo local (modo pruebas).
     *
     * Dependiendo del modo especificado, la función puede:
     * - Consultar los datos en línea desde la API del Buscador de Becas Benito Juárez.
     * - Cargar los datos desde un archivo local `metadatos/becario.json` si se está en modo pruebas.
     *
     * También organiza las emisiones por año, y si no es modo prueba, guarda un registro de la consulta en la base de datos.
     *
     * @param string $curp La CURP del becario a buscar.
     * @param int $pruebas Indica si se usará modo prueba (1 = JSON local, 0 = API real). Por defecto es 0.
     *
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con los datos renderizados en una vista o un mensaje de error.
     * 
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
   

    public function buscarBecarioAPI($curp, $pruebas = 0)
{
    $apoyos = catalogos::PROGRAMAS;
    $json = null;

    try {
        if ($pruebas == 1) {

            $path = public_path('metadatos/' . $curp . '_becario.json');

            if (!file_exists($path)) {
                throw new \Exception( 'Archivo ' . $curp . '_becario.json no encontrado.');
            }

            $contenido = file_get_contents($path);
            $json = json_decode($contenido);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('El contenido del archivo no es un JSON válido.');
            }

            $modo = '(Pruebas)';
        } else {
            $response = Http::asForm()->post('https://buscador.becasbenitojuarez.gob.mx/consulta/metodos/wrapper.php', [
                'CURP' => $curp,
                'habilitar' => 1,
            ]);

            if (!$response->successful()) {
                throw new \Exception('Error consultando la beca.');
            }


            

            $json = json_decode($response);

            if ($json === null || $response->body() === 'null' || $json->status === 422) {
                throw new \Exception('No se encontraron datos para la CURP proporcionada.');
            }

            $modo = '';
        }

        $emisionesPorAnio = $this->procesarEmisiones($json);


           /*  if ($pruebas == 0) {
                // Guardar consulta
                $registro = new query();
                $registro->query_id = uniqid();
                $registro->query_curp = $curp;
                $registro->query_tmp = date('Y-m-d H:i:s');
                $registro->save();
            } */


        return response()->json([
            'success' => true,
            'vista' => view('detalles', [
                'json' => $json,
                'emisionesPorAnio' => $emisionesPorAnio,
                'apoyos' => $apoyos,
            ])->render(),
            'mensaje' => 'Datos cargados exitosamente. ' . $modo,
        ]);
    } catch (\Exception $e) {
      
        $mensaje = $e->getMessage();

        return response()->json([
            'success' => false,
            'mensaje' => $mensaje,
        ], 200);
    }
}


    /**
     * Procesa la información de emisiones de pagos del becario agrupándola por año y número de emisión.
     *
     * Esta función analiza las claves del objeto JSON recibido desde la API o archivo de prueba, 
     * extrayendo información sobre fechas de pago, estatus, formas de entrega, etc., y organiza
     * los datos en un arreglo estructurado por año y número de emisión.
     *
     * Maneja tanto las emisiones recientes (2023+, con formato estructurado) como casos especiales
     * de 2021 y 2022 con nombres de clave atípicos.
     *
     * @param object $json Objeto JSON decodificado que contiene los datos del becario, 
     *                     particularmente la propiedad `datos` con las emisiones.
     *
     * @return array Arreglo estructurado por año y número de emisión, con la información procesada.
     * 
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     *
     * Ejemplo de retorno:
     * [
     *     '2023' => [
     *         1 => [
     *             'FECHA_PAGO' => '2023-03-15',
     *             'FORMA_ENTREGA_APOYO' => 'Banco X',
     *             ...
     *         ],
     *         ...
     *     ],
     *     '2021' => [
     *         1 => [
     *             'FECHA_PAGO' => '2021-02-28',
     *             'FORMA_ENTREGA_APOYO' => 'Banco Y',
     *             ...
     *         ]
     *     ]
     * ]
     */
    private function procesarEmisiones($json)
    {
        $emisionesPorAnio = [];

        if (isset($json->datos) && $json->datos) {
            foreach ($json->datos as $clave => $valor) {
                // Casos normales: 2023+ (ej: FECHA_PAGO_25EMI2)
                if (preg_match('/^(EMI(?:SION)?|FORMA_ENTREGA_APOYO|INSTITUCION_LIQUIDADORA|PAGADO|FECHA_PAGO|PERIODOS|ESTATUS_PAGO|EMISION_APOYO|FECHA_PROGRAMADA_SOT|DIR_PROGRAMADA_SOT)_?(\d{2})(?:EMI(?:SION)?)(\d)$/', $clave, $match)) {
                    $tipo = $match[1];
                    $anio = '20' . $match[2];
                    $num = $match[3];

                    $emisionesPorAnio[$anio][$num][$tipo] = $valor;
                    continue;
                }

                // Casos especiales de 2021 y 2022
                if (preg_match('/^FECHA_PAGO_(FEB|JUN|SEPOCT_2022)$/', $clave, $match)) {
                    $mesClave = $match[1];

                    if ($mesClave === 'FEB' || $mesClave === 'JUN') {
                        $anio = '2021';
                        $num = $mesClave === 'FEB' ? 1 : 2;
                    } elseif ($mesClave === 'SEPOCT_2022') {
                        $anio = '2022';
                        $num = 3;
                    }

                    $emisionesPorAnio[$anio][$num]['FECHA_PAGO'] = $valor;
                    $emisionesPorAnio[$anio][$num]['FORMA_ENTREGA_APOYO'] = $json->datos->{"LIQUIDADORA_{$mesClave}"} ?? null;
                    $emisionesPorAnio[$anio][$num]['ESTATUS_PAGO'] = $json->datos->{"SITUACION_ENTREGA_{$mesClave}"} ?? null;
                    continue;
                }
            }
        }

        return $emisionesPorAnio;
    }



/* function consultarCurp(string $curp): array
{
    $url = "https://www.gob.mx/v1/renapoCURP/consulta";
    $headers = [
        'Host' => 'www.gob.mx',
        'Accept' => 'application/json',
        'Accept-Encoding' => 'gzip, deflate, br',
        'Referer' => 'https://www.gob.mx/',
        'Content-Type' => 'application/json',
        'Connection' => 'keep-alive',
    ];

    $payload = [
        "curp" => $curp,
        "tipoBusqueda" => "curp"
    ];

    $client = new Client();

    try {
        $response = $client->post($url, [
            'headers' => $headers,
            'json' => $payload,
        ]);

        $data = json_decode($response->getBody(), true);

        if (($data['codigo'] ?? '') !== "01") {
            return ['success' => false, 'message' => $data['mensaje'] ?? 'Error desconocido'];
        }

        return ['success' => true, 'data' => $data['registros'][0] ?? null];

    } catch (\Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}
 */

}
