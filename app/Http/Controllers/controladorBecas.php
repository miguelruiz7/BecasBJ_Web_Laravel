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
use GuzzleHttp\Cookie\CookieJar;


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
          /*   'h-captcha-response' => 'required|validar_captcha' */
        ];


        $mensajes = [
            'required' => 'El campo es obligatorio.',
            'txtCURP.validacurp' => 'El formato de CURP es incorrecto',
            'txtCURP.limitecurp' => 'Agotastes tus consultas, vuelve mañana',
            'txtCURP.max' => 'Deben ser :max dígitos como máximo',
            'txtCURP.min' => 'Deben ser :min dígitos como mínimo',
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

       $baseUrl = rtrim(env('BECAS_API_URL'), '/');

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
            $response = Http::asForm()->post($baseUrl, [
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


                    // Aquí llamamos a la función consultarCurp para obtener la info
        $resultadoCurp = $this->consultarCurp($curp);

          


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
                'datos' => $resultadoCurp
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



 private function procesarEmisiones($json)
{
    $emisionesPorAnio = [];

    if (isset($json->datos) && $json->datos) {
        foreach ($json->datos as $clave => $valor) {
            // Casos normales: 2023+
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

                $fechaPago = $valor;
                $formaEntrega = $json->datos->{"LIQUIDADORA_{$mesClave}"} ?? null;
                $estatusPago = $json->datos->{"SITUACION_ENTREGA_{$mesClave}"} ?? null;

                // Solo guardar si hay al menos un dato no nulo o no vacío
                if ($fechaPago || $formaEntrega || $estatusPago) {
                    $emisionesPorAnio[$anio][$num]['FECHA_PAGO'] = $fechaPago;
                    $emisionesPorAnio[$anio][$num]['FORMA_ENTREGA_APOYO'] = $formaEntrega;
                    $emisionesPorAnio[$anio][$num]['ESTATUS_PAGO'] = $estatusPago;
                }

                continue;
            }
        }
    }

    return $emisionesPorAnio;
}



public function consultarCurp($curp)
{
    $curp = strtoupper($curp);


    $baseUrl = rtrim(env('CURP_BASE_URL'), '/');
    $registroPath = ltrim(env('CURP_REGISTRO_PATH'), '/');
    $busquedaPath = ltrim(env('CURP_BUSQUEDA_PATH'), '/');


    $perticionInicial = Http::withHeaders([
        'User-Agent' => 'Mozilla/5.0',
        'Accept' => '*/*',
    ])->get("{$baseUrl}/{$registroPath}");


    $cookies = $perticionInicial->cookies()->toArray();
    $cadenaCookies = '';
    foreach ($cookies as $cookie) {
        $cadenaCookies .= $cookie['Name'] . '=' . $cookie['Value'] . '; ';
    }

  
    $encabezados = [
        'User-Agent' => 'Mozilla/5.0',
        'Accept' => 'application/json, text/javascript, */*; q=0.01',
        'Content-Type' => 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin' => $baseUrl,
        'Referer' => "{$baseUrl}/{$registroPath}",
        'Cookie' => $cadenaCookies,
    ];

    $respuesta = Http::withHeaders($encabezados)->asForm()->post(
        "{$baseUrl}/{$busquedaPath}",
        [
            'curp' => $curp,
            'habilitar' => 1,
        ]
    );


    $body = $respuesta->body();
    $body = preg_replace('/^\x{FEFF}/u', '', $body);
    $json = json_decode($body);

    return $json;
}









}
