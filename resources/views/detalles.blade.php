<div class="card">
    <div class="card-header text-center">
        <img src="{{ asset('img/becaicons/' . $json->datos->PROGRAMA . '.jpg') }}"
            class="card-img-top img-fluid d-block mx-auto m-3" style="width: 60%;" alt="...">

        <p><strong>Programa: </strong> {{ $apoyos[$json->datos->PROGRAMA] }}</p>

        <p><strong>CURP del beneficiario: </strong> {{ $json->datos->CURP }}</p>

        <p><strong>Nombre del beneficiario: </strong> {{$datos->data->consultarPorCurpOResult->nombres}} {{$datos->data->consultarPorCurpOResult->apellido1}} {{$datos->data->consultarPorCurpOResult->apellido2}}</p>


        @switch($json->datos->SITUACION_INSCRIPCION_ACTUAL)
            @case('ACTIVA')
                <p class="text-success text-uppercase">
                    <i class="fa-solid fa-circle-check"></i> <strong>Activo</strong>
                </p>
            @break

            @case('EN REVISION')
            @case('CAMBIO DE TITULAR')

            @case('VERIFICACION RENAPO')
                <p class="text-warning text-uppercase">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <strong>{{ $json->datos->SITUACION_INSCRIPCION_ACTUAL }}</strong>
                </p>
            @break

            @case('BAJA')
                <p class="text-danger text-uppercase">
                    <i class="fa-solid fa-circle-xmark"></i> <strong>{{ $json->datos->SITUACION_INSCRIPCION_ACTUAL }}</strong>
                </p>
            @break

            @default
                <p class="text-secondary text-uppercase">
                    <i class="fa-solid fa-question-circle"></i>
                    <strong>{{ $json->datos->SITUACION_INSCRIPCION_ACTUAL }}</strong>
                </p>
        @endswitch


    </div>
    <div class="card-body">

        <div class="accordion" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#divBecario" aria-expanded="false" aria-controls="divBecario">
                        <i class="fa-solid fa-graduation-cap me-3"></i> Información del becario
                    </button>
                </h2>
                <div id="divBecario" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <ul class="list-group list-group-flush">
                            @if (isset($json->datos->CCT))
                                <li class="list-group-item"><strong>C.C.T: </strong> {{ $json->datos->CCT }} </li>
                            @endif

                            @if (isset($json->datos->PERIODO_INCORPORACION))
                                <li class="list-group-item"><strong>Periodo de incorporación: </strong>
                                    {{ $json->datos->PERIODO_INCORPORACION }} </li>
                            @endif

                            @php
                                $total = $json->datos->TOTAL_PAGOS ?? null;
                                $maximo = $json->datos->MAXIMO_PAGOS ?? null;
                            @endphp

                            @if (!is_null($total) && !is_null($maximo))
                                @php
                                    $porcentaje = $maximo > 0 ? round(($total / $maximo) * 100) : 0;
                                @endphp
                                <li class="list-group-item">
                                    <strong>Pagos:</strong> {{ $total }} de {{ $maximo }}
                                    ({{ $porcentaje }}%)

                                    <div class="progress mt-2">
                                        <div class="progress-bar" role="progressbar"
                                            style="width: {{ $porcentaje }}%;" aria-valuenow="{{ $porcentaje }}"
                                            aria-valuemin="0" aria-valuemax="100">
                                            {{ $porcentaje }}%
                                        </div>
                                    </div>
                                </li>
                            @endif

                            @if (isset($json->datos->DIRECCION_ADSCRIPCION))
                                <li class="list-group-item"><strong>Dirección de adscripción: </strong>
                                    {{ $json->datos->DIRECCION_ADSCRIPCION }} </li>
                            @endif

                            @if (isset($json->datos->FECHA_NACIMIENTO))
                                <li class="list-group-item"><strong>Fecha de nacimiento: </strong>
                                    {{ $json->datos->FECHA_NACIMIENTO }} </li>
                            @endif

                            @if (isset($json->datos->INTEGRANTE_ID))
                                <li class="list-group-item"><strong>Identificador de beneficiario: </strong>
                                    {{ $json->datos->INTEGRANTE_ID }} </li>
                            @endif

                            @if (isset($json->datos->CURP_TUTOR))
                                <li class="list-group-item"><strong>CURP del tutor: </strong>
                                    {{ $json->datos->CURP_TUTOR }} </li>
                            @endif

                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#divBecas" aria-expanded="false" aria-controls="divBecas">
                        <i class="fa-solid fa-file-invoice-dollar me-3"></i> Becas emitidas
                    </button>
                </h2>
                <div id="divBecas" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">


                        <div class="container my-4">
                            @foreach ($emisionesPorAnio as $anio => $emisiones)
                                <div class="mb-4">
                                    <h3 class="text-dark border-bottom pb-2">{{ $anio }}</h3>

                                    @foreach ($emisiones as $num => $em)
                                        @php
                                            $pagado = $em['PAGADO'] ?? null;
                                            $pagadoTxt =
                                                $pagado == '0'
                                                    ? 'NO PAGADO'
                                                    : ($pagado == '1'
                                                        ? 'PAGADO'
                                                        : 'SIN INFORMACIÓN');
                                        @endphp

                                        <div
                                            class="card mb-3 shadow-sm border-{{ $pagado == '1' ? 'success' : ($pagado == '0' ? 'danger' : 'secondary') }}">
                                            <div class="card-body">
                                                <h5 class="card-title">Emisión #{{ $num }}</h5>

                                                @if (!empty($em['FORMA_ENTREGA_APOYO']))
                                                    <p class="mb-1"><strong>Forma de pago:</strong>
                                                        {{ $em['FORMA_ENTREGA_APOYO'] }}
                                                    </p>
                                                @endif

                                                @if (!empty($em['INSTITUCION_LIQUIDADORA']))
                                                    <p class="mb-1"><strong>Institución:</strong>
                                                        {{ $em['INSTITUCION_LIQUIDADORA'] }}</p>
                                                @endif

                                                <p class="mb-1">
                                                    <strong>Pago efectuado:</strong>
                                                    <span
                                                        class="badge bg-{{ $pagado == '1' ? 'success' : ($pagado == '0' ? 'danger' : 'secondary') }}">
                                                        {{ $pagadoTxt }}
                                                    </span>
                                                </p>

                                                @if (!empty($em['FECHA_PAGO']))
                                                    <p class="mb-1"><strong>Fecha de Pago:</strong>
                                                        {{ $em['FECHA_PAGO'] }}</p>
                                                @endif

                                                @if (!empty($em['ESTATUS_PAGO']))
                                                    <p class="mb-1"><strong>Estatus del Pago:</strong>
                                                        {{ $em['ESTATUS_PAGO'] }}</p>
                                                @endif

                                                {{-- @if (!empty($em['PERIODOS']))
                                                <p class="mb-1"><strong>Periodos:</strong> {{ $em['PERIODOS'] }}</p>
                                                @endif --}}

                                                @if (!empty($em['FECHA_PROGRAMADA_SOT']))
                                                    <p class="mb-1"><strong>Fecha Programada:</strong>
                                                        {{ $em['FECHA_PROGRAMADA_SOT'] }}</p>
                                                @endif

                                                @if (!empty($em['DIR_PROGRAMADA_SOT']))
                                                    <p class="mb-1"><strong>Dirección Programada:</strong>
                                                        {{ $em['DIR_PROGRAMADA_SOT'] }}</p>
                                                @endif
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            @endforeach
                        </div>


                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#divBancarizacion" aria-expanded="false" aria-controls="divBancarizacion">
                        <i class="fa-solid fa-credit-card me-3"></i> Bancarización
                    </button>
                </h2>
                <div id="divBancarizacion" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        @php
                            $d = $json->datos ?? (object) [];
                            $fases = [];
                            $mostrarFase1 = true;
                            $mostrarFase2 = false;
                            $mostrarFase3 = false;
                            $alertas = [];

                            $bancarizacionRechazada = $d->BANCARIZACION_RECHAZADA ?? null;
                            $programa = $d->PROGRAMA ?? null;
                            $bancarizacion = $d->BANCARIZACION ?? null;

                            if ($bancarizacionRechazada == 1 && $programa == 'BUEEMS') {
                                $alertas[] = [
                                    'tipo' => 'warning',
                                    'mensaje' =>
                                        'A partir de junio de 2024, revisa este apartado para saber cuándo y dónde recoger tu medio de pago.<br>Lleva tu documentación completa. Si eres menor de edad, ve acompañado/a de tu tutor.',
                                ];
                            } elseif (
                                $bancarizacionRechazada == 0 &&
                                is_array($bancarizacion) &&
                                count($bancarizacion) == 0
                            ) {
                                $alertas[] = [
                                    'tipo' => 'danger',
                                    'mensaje' => 'No se está llevando a cabo ninguna bancarización.',
                                ];
                                $mostrarFase1 = false;
                            } elseif ($bancarizacion === 'PENDIENTE') {
                                $alertas[] = [
                                    'tipo' => 'primary',
                                    'mensaje' =>
                                        '<b>¡Revisa constantemente este apartado!</b><br>Aún no te hemos asignado una fecha de entrega y lugar de entrega, revisa constantemente este apartado.',
                                ];
                            }

                            if ($mostrarFase1) {
                                $fases[] = ['nombre' => 'PENDIENTE', 'activa' => true, 'i' => 1];
                            }

                            if (is_array($bancarizacion)) {
                                foreach ($bancarizacion as $banco) {
                                    $medioPendiente = $banco->DESC_EST_FORMZ_UPD ?? '';
                                    $estrategia = $banco->TIPO_ESTRATEGIA_DGOVAC ?? '';
                                    $fechaHora = $banco->FECHA_HORA ?? '';
                                    $fechaProgramada = $banco->FECHA_PROGRAMADA ?? '';
                                    $sucursal = $banco->SUCURSAL ?? '';
                                    $direccionSucursal = $banco->DIRECCION_SUCURSAL ?? '';
                                    $remesa = $banco->NUMERO_REMESA ?? '';
                                    $ac = $banco->AC ?? null;

                                    $fecha = '';
                                    $hora = '';
                                    if (!empty($fechaHora)) {
                                        $partes = explode(',', $fechaHora);
                                        $fecha = trim($partes[0] ?? '');
                                        $hora = trim($partes[1] ?? '');
                                    }

                                    if (
                                        $medioPendiente === 'MEDIO PENDIENTE DE ENTREGAR' &&
                                        $estrategia &&
                                        $fechaHora
                                    ) {
                                        $mostrarFase2 = true;
                                        $alertas[] = [
                                            'tipo' => 'warning',
                                            'mensaje' => "Tienes una fecha asignada para recoger tu tarjeta el día <span elem-type='sensibledata'>{$fecha}</span> con horario de <span elem-type='sensibledata'>{$hora}</span> para recoger por medio de <span elem-type='sensibledata'>{$sucursal}</span> con dirección asignada en <span elem-type='sensibledata'>{$direccionSucursal}</span>.<br>Remesas asignadas: <span elem-type='sensibledata'>{$remesa}</span><br><b>¡RECUERDA LLEVAR TU DOCUMENTACIÓN COMPLETA!</b>",
                                        ];
                                    } elseif ($medioPendiente === 'MEDIO PENDIENTE DE ENTREGAR' && !$fechaHora) {
                                        $alertas[] = [
                                            'tipo' => 'info',
                                            'mensaje' =>
                                                '¡Tu tarjeta ya casi llega a tu localidad!<br><b>¡REVISA CONSTANTEMENTE PARA VER UNA FECHA ASIGNADA A LA ENTREGA DE TU TARJETA!</b>',
                                        ];
                                    }

                                    if ($medioPendiente === 'MEDIO ENTREGADO / FORMALIZADO') {
                                        $mostrarFase2 = true;
                                        $mostrarFase3 = true;
                                        if ($ac == 2) {
                                            $alertas[] = [
                                                'tipo' => 'danger',
                                                'mensaje' => "<b>¡NECESITAS CAMBIAR TU NIP DE TU TARJETA DEL BANCO BIENESTAR!</b><br>¡Las dispersiones pendientes de tu beca no se activarán hasta realizar esta acción!<br>Deberás acudir a una ventanilla de atención el día <span elem-type='sensibledata'>{$fechaProgramada}</span> en la hora sugerida de <span elem-type='sensibledata'>{$hora}</span> horas con tu tarjeta, identificación oficial y tu NIP actual.",
                                            ];
                                        } else {
                                            $alertas[] = [
                                                'tipo' => 'success',
                                                'mensaje' =>
                                                    "<b>¡BANCARIZACIÓN COMPLETADA!</b><br>Conoce las próximas fechas de las becas a emitir en la sección de \"Becas Emitidas\".<br>Consulta tu saldo o movimientos en la App Banco del Bienestar.",
                                            ];
                                        }
                                    }
                                }
                            }

                            if (($d->PERIODO_INCORPORACION ?? '') === 'SEP-2023') {
                                $mostrarFase2 = true;
                                $mostrarFase3 = true;
                            }

                            if ($mostrarFase2) {
                                $fases[] = ['nombre' => 'CITA PENDIENTE', 'activa' => true, 'i' => 2];
                            }

                            if ($mostrarFase3) {
                                $fases[] = ['nombre' => 'TARJETA ENTREGADA', 'activa' => true, 'i' => 3];
                            }
                        @endphp


                        @foreach ($alertas as $alerta)
                            <div class="alert alert-{{ $alerta['tipo'] }} mb-3">{!! $alerta['mensaje'] !!}</div>
                        @endforeach

                        <div class="d-flex justify-content-center flex-wrap gap-3 mt-2" style="align-items: center;">
                            @foreach ($fases as $fase)
                                <div class="text-center mx-2" fase-bancarizacion="{{ $fase['i'] }}">
                                    @php
                                        $iconoBootstrap = match ($fase['nombre']) {
                                            'PENDIENTE' => 'clock',
                                            'CITA PENDIENTE' => 'calendar-check',
                                            'TARJETA ENTREGADA' => 'credit-card',
                                            default => 'circle-question',
                                        };
                                    @endphp
                                    <i class="fa-solid fa-{{ $iconoBootstrap }} mb-1 status-icon-bancarizacion"
                                        style="font-size: 2rem; color: {{ $fase['activa'] ? '#198754' : '#6c757d' }};"></i>
                                    <div class="{{ $fase['activa'] ? 'fw-bold text-success' : 'text-muted' }}">
                                        {{ $fase['nombre'] }}</div>
                                </div>
                                @if (!$loop->last)
                                    <h1 style="-webkit-text-stroke: thick;" fase-bancarizacion="0">• • •</h1>
                                @endif
                            @endforeach
                        </div>



                    </div>
                </div>
            </div>


            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#divFormularios" aria-expanded="false" aria-controls="divFormularios">
                        <i class="fa-solid fa-clipboard-list me-3"></i> Historial de formularios
                    </button>
                </h2>
                <div id="divFormularios" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        @php
                            use Carbon\Carbon;

                            $historial_raw = $json->HISTORIAL_FORMULARIOS ?? [];
                            $historial_normalizado = [];
                            $mensaje = null;

                            if (is_object($historial_raw) && property_exists($historial_raw, 'MENSAJE')) {
                                $mensaje = $historial_raw->MENSAJE;
                            }
                          
                            elseif (is_array($historial_raw) && isset($historial_raw['MENSAJE'])) {
                                $mensaje = $historial_raw['MENSAJE'];
                            }
                         
                            elseif (is_array($historial_raw)) {
                                foreach ($historial_raw as $item) {
                                  
                                    if (is_array($item) && isset($item[0])) {
                                        $item = $item[0];
                                    }

                                    $item = (array) $item;

                                    try {
                                        $fecha = Carbon::parse(str_replace('/', '-', $item['FECHA_CAPTURA'] ?? ''));
                                    } catch (\Exception $e) {
                                        $fecha = Carbon::createFromTimestamp(0);
                                    }

                                    $item['fecha_parsed'] = $fecha;
                                    $historial_normalizado[] = $item;
                                }

                                usort($historial_normalizado, function ($a, $b) {
                                    return $b['fecha_parsed']->timestamp <=> $a['fecha_parsed']->timestamp;
                                });
                            }
                        @endphp

             
                        @if ($mensaje)
                          
                              <p class="text-center"><strong>{{ $mensaje }}</strong></p>  
                         
                        @endif

                  
                        @if (count($historial_normalizado) > 0)
                            <ul class="list-group">
                                @foreach ($historial_normalizado as $item)
                                    <li class="list-group-item">
                                        <strong>Folio:</strong> {{ $item['FOLIO'] ?? 'N/A' }}<br>
                                        <strong>Fecha:</strong>
                                        {{ $item['fecha_parsed']->format('d/m/Y') }}
                                        @if (str_contains($item['FECHA_CAPTURA'] ?? '', ':'))
                                            , {{ $item['fecha_parsed']->format('h:i A') }}
                                        @endif
                                        <br>
                                        <strong>Formulario:</strong> {{ $item['FORMULARIO'] ?? 'N/A' }}
                                    </li>
                                @endforeach
                            </ul>
                        @elseif (!$mensaje)
                            <p class="text-muted mb-0">No hay historial de formularios registrado.</p>
                        @endif


                    </div>
                </div>
            </div>

        </div>
    </div>

</div>
