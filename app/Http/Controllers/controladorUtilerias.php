<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class controladorUtilerias extends Controller
{
    
    /**
     * Genera un saludo dinámico (Buenos días, Buenas tardes, Buenas noches) basado en la hora actual.
     *
     * Este método determina la hora actual del sistema utilizando la función `obtenerHora()`
     * y, en base a ella, devuelve un saludo apropiado.
     *
     * @return string El saludo correspondiente a la hora del día.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public function saludoSistema()
    {

        $horaActual = $this->obtenerHora();

        if ($horaActual >= 6 && $horaActual < 12) {
            $saludo = "Buenos días";
        } elseif ($horaActual >= 12 && $horaActual < 18) {
            $saludo = "Buenas tardes";
        } else {
            $saludo = "Buenas noches";
        }

        return $saludo;
    }

    /**
     * Obtiene la fecha y hora actuales en el formato 'YYYY-MM-DD HH:i:s',
     * ajustando por el horario de verano si está activo.
     *
     * La función establece la zona horaria a 'America/Mexico_City'. Luego,
     * verifica si el horario de verano (DST) está en efecto. Si lo está,
     * resta una hora a la hora actual. En caso contrario, devuelve la hora actual
     * sin modificaciones.
     *
     * @return string La fecha y hora actual en formato 'YYYY-MM-DD HH:i:s'.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public function obtenerFechayHora()
    {

        date_default_timezone_set('America/Mexico_City');
        $horarioVerano = date('I');
        if ($horarioVerano) {
            $fecha = date('Y-m-d H:i:s', strtotime('-1 hour'));
        } else {
            $fecha = date('Y-m-d H:i:s', time());
        }

        return $fecha;
    }



    /**
     * Obtiene la fecha actual en el formato 'YYYY-MM-DD',
     * ajustando por el horario de verano si está activo.
     *
     * La función establece la zona horaria a 'America/Mexico_City'. Luego,
     * verifica si el horario de verano (DST) está en efecto. Si lo está,
     * resta una hora a la hora actual antes de formatear la fecha.
     * En caso contrario, devuelve la fecha actual sin modificaciones.
     *
     * @return string La fecha actual en formato 'YYYY-MM-DD'.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public function obtenerFecha()
    {

        date_default_timezone_set('America/Mexico_City');
        $horarioVerano = date('I');
        if ($horarioVerano) {
            $fecha = date('Y-m-d', strtotime('-1 hour'));
        } else {
            $fecha = date('Y-m-d', time());
        }

        return $fecha;
    }


    /**
     * Obtiene la hora actual en formato de 24 horas ('H'),
     * ajustando por el horario de verano si está activo.
     *
     * La función establece la zona horaria a 'America/Mexico_City'. Luego,
     * verifica si el horario de verano (DST) está en efecto. Si lo está,
     * resta una hora a la hora actual antes de formatear para obtener solo la hora.
     * En caso contrario, devuelve la hora actual sin modificaciones.
     *
     * @return string La hora actual en formato de 24 horas.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public function obtenerHora()
    {

        date_default_timezone_set('America/Mexico_City');
        $horarioVerano = date('I');
        if ($horarioVerano) {
            $fecha = date('H', strtotime('-1 hour'));
        } else {
            $fecha = date('H', time());
        }

        return $fecha;
    }

    /**
     * OBSOLETO: Obtiene una colección de los meses del año en español, mapeados por su número (1 al 12).
     *
     * Este método crea un array de nombres de meses y luego lo convierte en una colección
     * donde cada mes está asociado con su índice numérico (1-12).
     *
     * @deprecated Se recomienda buscar alternativas más robustas o nativas del framework para manejo de meses y localización.
     * @return \Illuminate\Support\Collection Una colección donde las claves son el número del mes (1-12) y los valores son los nombres de los meses en español.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public function meses()
    {
        return collect([
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ])->mapWithKeys(function ($mes, $indice) {
            return [$indice + 1 => $mes];
        });
    }


    /**
     * Valida un RFC (Registro Federal de Contribuyentes) mexicano.
     *
     * Esta función verifica la validez de un RFC proporcionado siguiendo dos pasos:
     * 1.  **Validación de Formato:** Utiliza una expresión regular para asegurar que el RFC cumpla con la estructura estándar (ej. 3 o 4 letras iniciales, 6 dígitos de fecha, 3 caracteres de homoclave, 1 dígito verificador).
     * 2.  **Validación del Dígito Verificador:** Si el formato es correcto, calcula el dígito verificador esperado para el RFC base (los primeros 12 caracteres) y lo compara con el último dígito del RFC proporcionado.
     *
     * @param string $rfc El RFC a validar.
     * @return bool `true` si el RFC es válido según el formato y el dígito verificador; `false` en caso contrario.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public static function validarRFC($rfc): bool
    {

        $regex = '/^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([A\d])$/';

        if (!preg_match($regex, $rfc)) {
            return false;
        }

        $rfcBase = substr($rfc, 0, 12);
        $digitoVerificadoroVerificador = substr($rfc, -1);

        return self::calcularDigitoVerificadorRFC($rfcBase) === $digitoVerificadoroVerificador;
    }


    /**
     * Calcula el dígito verificador de un RFC (Registro Federal de Contribuyentes) mexicano.
     *
     * Este método privado estático toma los primeros 12 caracteres de un RFC (sin el dígito verificador)
     * y aplica la lógica oficial para calcular el dígito que debería ir al final.
     *
     * Pasos del cálculo:
     * 1.  Define una tabla de valores donde cada carácter alfanumérico y especial (como '&' y 'Ñ')
     * tiene un valor numérico asignado.
     * 2.  Itera sobre cada carácter del `$rfcBase` (los primeros 12 caracteres del RFC).
     * 3.  Multiplica el valor numérico de cada carácter por un factor decreciente (desde 13 hasta 2).
     * 4.  Suma todos estos productos.
     * 5.  Calcula el residuo de la suma al dividirla por 11.
     * 6.  Determina el dígito verificador final basándose en el residuo:
     * - Si el residuo es 0, el dígito es '0'.
     * - Si el residuo es 1, el dígito es 'A'.
     * - En cualquier otro caso, el dígito es 11 menos el residuo.
     *
     * @param string $rfcBase Los primeros 12 caracteres del RFC (sin el dígito verificador).
     * @return string El dígito verificador calculado.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    private static function calcularDigitoVerificadorRFC($rfcBase): string
    {
        $tablaValores = [
            '0' => 0,
            '1' => 1,
            '2' => 2,
            '3' => 3,
            '4' => 4,
            '5' => 5,
            '6' => 6,
            '7' => 7,
            '8' => 8,
            '9' => 9,
            'A' => 10,
            'B' => 11,
            'C' => 12,
            'D' => 13,
            'E' => 14,
            'F' => 15,
            'G' => 16,
            'H' => 17,
            'I' => 18,
            'J' => 19,
            'K' => 20,
            'L' => 21,
            'M' => 22,
            'N' => 23,
            '&' => 24,
            'O' => 25,
            'P' => 26,
            'Q' => 27,
            'R' => 28,
            'S' => 29,
            'T' => 30,
            'U' => 31,
            'V' => 32,
            'W' => 33,
            'X' => 34,
            'Y' => 35,
            'Z' => 36,
            'Ñ' => 37,
            ' ' => 38,
        ];

        $suma = 0;
        $factor = 13;

        foreach (str_split($rfcBase) as $char) {
            $suma += $tablaValores[$char] * $factor;
            $factor--;
        }

        $residuo = $suma % 11;

        return $residuo === 0 ? '0' : ($residuo === 1 ? 'A' : (string)(11 - $residuo));
    }


    /**
     * Valida una CURP (Clave Única de Registro de Población) mexicana.
     *
     * Esta función verifica la validez de una CURP proporcionada, incluyendo su formato
     * y la corrección de su dígito verificador.
     *
     * Pasos de validación:
     * 1.  Verifica que la longitud de la CURP sea exactamente 18 caracteres.
     * 2.  Convierte la CURP a mayúsculas para estandarización.
     * 3.  Aplica una expresión regular detallada para validar el formato estructural de la CURP.
     * 4.  Si el formato es válido, procede a calcular el dígito verificador esperado:
     * a.  Establece un mapeo de caracteres a valores numéricos.
     * b.  Calcula una suma ponderada de los primeros 17 caracteres de la CURP.
     * 5.  Determina el dígito verificador a partir del residuo de la suma ponderada.
     * 6.  Compara el dígito verificador calculado con el último dígito de la CURP original.
     *
     * @param string $curp La CURP a validar.
     * @return bool `true` si la CURP es válida según el formato y el dígito verificador; `false` en caso contrario.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */
    public static function validarCURP($curp)
    {

        if (strlen($curp) !== 18) {
            return false;
        }

        $curp = mb_strtoupper($curp, "UTF-8");
        $patron = "/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/";
        $valido = preg_match($patron, $curp, $coincidencia);

        if ($valido === false) {
            return false;
        }

        $ind = preg_split('//u', '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', -1, PREG_SPLIT_NO_EMPTY);
        $vals = str_split(strrev($coincidencia[0] . "?"));
        unset($vals[0], $vals[1]);
        $tempSum = 0;

        foreach ($vals as $v => $d) {
            $tempSum = (array_search($d, $ind) * $v) + $tempSum;
        }

        $digitoVerificador = 10 - $tempSum % 10;
        $digitoVerificador = $digitoVerificador == 10 ? 0 : $digitoVerificador;

        return $coincidencia[2] == $digitoVerificador;
    }

    /**
     * Valida los datos de un formulario de petición utilizando las reglas y mensajes proporcionados.
     *
     * Si la validación falla, lanza una `Illuminate\Validation\ValidationException`
     * que incluye una respuesta JSON detallada con los errores y los campos que pasaron la validación.
     *
     * @param \Illuminate\Http\Request $peticion La instancia de la petición HTTP que contiene los datos a validar.
     * @param array $reglas Un arreglo asociativo de reglas de validación para cada campo de la petición.
     * @param array $mensajes Un arreglo asociativo de mensajes personalizados para las reglas de validación.
     * @throws \Illuminate\Validation\ValidationException Si la validación falla, se lanza esta excepción con una respuesta JSON.
     * @return void Este método no retorna explícitamente un valor; en caso de éxito, el flujo de ejecución continúa.
     * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
     */

    public function validarFormulario($peticion, $reglas, $mensajes)
    {
        $validar = Validator::make($peticion->all(), $reglas, $mensajes);

        if ($validar->fails()) {
            $errores = $validar->errors()->toArray();
            $errores_ = array_keys($errores);

            $todoPlano = data_get($peticion->all(), null);

            $todasLasClaves = array_keys(\Illuminate\Support\Arr::dot($todoPlano));

            $correctos = array_values(array_diff($todasLasClaves, $errores_));

            throw new \Illuminate\Validation\ValidationException($validar, response()->json([
                'success' => false,
                'mensaje' => 'Verifica el error',
                'errores' => $errores,
                'correctos' => $correctos
            ]));
        }
    }
}
