<div class="card">
    <div class="card-header text-center">
        <img src="{{ asset('img/becaicons/'.$json->datos->PROGRAMA.'.jpg')}}" class="card-img-top img-fluid d-block mx-auto m-3"
            style="width: 60%;" alt="...">

        <p><strong>Programa: </strong> {{$apoyos[$json->datos->PROGRAMA]}}</p>

        <p><strong>CURP del beneficiario: </strong> {{$json->datos->CURP}}</p>

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
            <i class="fa-solid fa-triangle-exclamation"></i> <strong>{{ $json->datos->SITUACION_INSCRIPCION_ACTUAL }}</strong>
        </p>
        @break

    @case('BAJA')
        <p class="text-danger text-uppercase">
            <i class="fa-solid fa-circle-xmark"></i> <strong>{{ $json->datos->SITUACION_INSCRIPCION_ACTUAL }}</strong>
        </p>
        @break

    @default
        <p class="text-secondary text-uppercase">
            <i class="fa-solid fa-question-circle"></i> <strong>{{ $json->datos->SITUACION_INSCRIPCION_ACTUAL }}</strong>
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
                            <li class="list-group-item"><strong>C.C.T: </strong> {{$json->datos->CCT}} </li>
                            <li class="list-group-item"><strong>Periodo de incorporación: </strong>
                                {{$json->datos->PERIODO_INCORPORACION}} </li>
                            @php
                                $total = $json->datos->TOTAL_PAGOS;
                                $maximo = $json->datos->MAXIMO_PAGOS;
                                $porcentaje = $maximo > 0 ? round(($total / $maximo) * 100) : 0;
                            @endphp

                            <li class="list-group-item">
                                <strong>Pagos:</strong> {{ $total }} de {{ $maximo }} ({{ $porcentaje }}%)

                                <div class="progress mt-2">
                                    <div class="progress-bar" role="progressbar" style="width: {{ $porcentaje }}%;"
                                        aria-valuenow="{{ $porcentaje }}" aria-valuemin="0" aria-valuemax="100">
                                        {{ $porcentaje }}%
                                    </div>
                                </div>
                            </li>

                            <li class="list-group-item"><strong>Dirección de adscripción: </strong>
                                {{$json->datos->DIRECCION_ADSCRIPCION}} </li>
                            <li class="list-group-item"><strong>Fecha de nacimiento: </strong>
                                {{$json->datos->FECHA_NACIMIENTO}} </li>
                            <li class="list-group-item"><strong>Identificador de beneficiario: </strong>
                                {{$json->datos->INTEGRANTE_ID}} </li>
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
                                            $pagadoTxt = $pagado == "0" ? 'NO PAGADO' : ($pagado == "1" ? 'PAGADO' : 'SIN INFORMACIÓN');
                                        @endphp

                                        <div
                                            class="card mb-3 shadow-sm border-{{ $pagado == "1" ? 'success' : ($pagado == "0" ? 'danger' : 'secondary') }}">
                                            <div class="card-body">
                                                <h5 class="card-title">Emisión #{{ $num }}</h5>

                                                @if (!empty($em['FORMA_ENTREGA_APOYO']))
                                                    <p class="mb-1"><strong>Forma de pago:</strong> {{ $em['FORMA_ENTREGA_APOYO'] }}
                                                    </p>
                                                @endif

                                                @if (!empty($em['INSTITUCION_LIQUIDADORA']))
                                                    <p class="mb-1"><strong>Institución:</strong>
                                                        {{ $em['INSTITUCION_LIQUIDADORA'] }}</p>
                                                @endif

                                                <p class="mb-1">
                                                    <strong>Pago efectuado:</strong>
                                                    <span
                                                        class="badge bg-{{ $pagado == "1" ? 'success' : ($pagado == "0" ? 'danger' : 'secondary') }}">
                                                        {{ $pagadoTxt }}
                                                    </span>
                                                </p>

                                                @if (!empty($em['FECHA_PAGO']))
                                                    <p class="mb-1"><strong>Fecha de Pago:</strong> {{ $em['FECHA_PAGO'] }}</p>
                                                @endif

                                                @if (!empty($em['ESTATUS_PAGO']))
                                                    <p class="mb-1"><strong>Estatus del Pago:</strong> {{ $em['ESTATUS_PAGO'] }}</p>
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

            {{-- <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#divBancarizacion" aria-expanded="false" aria-controls="divBancarizacion">
                        <i class="fa-solid fa-credit-card me-3"></i> Bancarización
                    </button>
                </h2>
                <div id="divBancarizacion" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div class="list-group">
                            @foreach ($json->datos->BANCARIZACION as $item)
                            @foreach ($item as $clave => $valor)
                            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3"
                                aria-current="true">
                                <img src="https://github.com/twbs.png" alt="" width="32" height="32"
                                    class="rounded-circle flex-shrink-0">
                                <div class="d-flex gap-2 w-100 justify-content-between">
                                    <div>
                                        <p class="mb-0">
                                            <i class="fas fa-check-circle me-1 text-success"></i>
                                            <!-- Ícono de ejemplo -->
                                            <strong>{{ $clave }}:</strong> {{ $valor }}
                                        </p>
                                    </div>
                                    <small class="opacity-50 text-nowrap">now</small>
                                </div>
                            </a>
                            @endforeach
                            @endforeach
                        </div>


                    </div>
                </div>
            </div> --}}


        </div>
    </div>



    {{-- {{json_encode($json)}} --}}
</div>