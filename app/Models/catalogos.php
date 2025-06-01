<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class catalogos extends Model
{
    const ESTADO_ICONS = [
        'ACTIVA' => 'check.svg',
        'EN REVISION' => 'alert.svg',
        'CAMBIO DE TITULAR' => 'alert.svg',
        'VERIFICACION RENAPO' => 'alert.svg',
        'BAJA' => 'baja.svg',
    ];

    const COLOR_STATUS_TXT = [
        'ACTIVA' => 'green',
        'BAJA' => 'red',
    ];

    const PROGRAMAS = [
        'BASICA' => 'Becas de Educación Básica para el Bienestar Benito Juárez',
        'BUEEMS' => 'Beca Universal para el Bienestar Benito Juárez de Educación Media Superior (BUEEMS)',
        'JEF' => 'Beca para el Bienestar Benito Juárez de Educación Superior (JEF)',
    ];
}
