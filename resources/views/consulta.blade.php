@php
    use Carbon\Carbon;
@endphp


<!doctype html>
<html lang="es" data-bs-theme="light">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Buscador NO OFICIAL de estatus o becas de Benito Juarez, Rita Cetina, Etc">

    <!-- Open Graph (para Facebook, WhatsApp, Discord, etc) -->
    <meta property="og:title" content="Buscador de Becas Benito Juárez - NO OFICIAL">
    <meta property="og:description" content="Buscador NO OFICIAL de estatus o becas de Benito Juarez, Rita Cetina, Etc">
    <meta property="og:image" content="{{ asset('img/icons/tarjeta_bienestar_2.png') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Buscador de Becas Benito Juárez - NO OFICIAL">
    <meta name="twitter:description"
        content="Buscador NO OFICIAL de estatus o becas de Benito Juarez, Rita Cetina, Etc">
    <meta name="twitter:image" content="{{ asset('img/icons/tarjeta_bienestar_2.png') }}">
    <meta name="twitter:url" content="{{ url()->current() }}">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Buscador de Becas Benito Juarez (v2.0) | Consulta</title>

    <link href="{{ asset('bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('fontawesome/css/fontawesome.css') }}" rel="stylesheet">
    <link href="{{ asset('fontawesome/css/brands.css') }}" rel="stylesheet">
    <link href="{{ asset('fontawesome/css/solid.css') }}" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}?v={{ env('VERSION') }}" rel="stylesheet">

    <script src="{{ asset('jquery/jquery-3.7.1.min.js') }}"></script>
    <script src="{{ asset('bootstrap/dist/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('js/app.js') }}?v={{ env('VERSION') }}"></script>

    <style>
        html,
        body {
            height: 100%;
        }

        .form-signin {
            max-width: 500px;
            padding: 1rem;
        }

        .form-signin .form-floating:focus-within {
            z-index: 2;
        }

        .form-signin input[type="email"] {
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }

        .form-signin input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    </style>

</head>




<body id="fdAzul" class="d-flex align-items-center py-4 ">

    @include('componentes.notificaciones')

    <main class="form-signin w-100 m-auto">
        @include('componentes.notificaciones')

        <img src="{{ asset('img/banner1.jpg')}}" class="card-img-top img-fluid d-block mx-auto m-3" style="width: 100%;"
            alt="...">
        {{-- <h3 class="text-center">Consulta</h3> --}}
        <p class="display-6 text-center">Consulta</p>
        <div class="card">
            <div class="card-header">
                Este sitio web <strong>NO ES OFICIAL</strong> y <strong>NO SUPLANTA</strong> al buscador de estatus
                oficial.

                <p><strong class="text-danger">NOTA:</strong> Por restricciones de baneo se limita a <strong> 2</strong>
                    consultas por día, asi que usa sabiamente</p>
            </div>
            <div class="card-body">
                <form id="consultar">


                    <div class="mb-3 ">
                        <p for="basic-url" class="form-label texto">CURP</p>

                        <div class="input-group  rounded-3">
                            <span class="input-group-text" id="basic-addon3"><i id="iconFormularios"
                                    class="fa-solid fa-address-card"></i></span>
                            <input class="form-control" name="txtCURP" id="txtCURP" type="text"
                                pattern="^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$"
                                title="Formato CURP inválido. Ejemplo: GODE561231HDFABC09" maxlength="18"
                                minlength="18">

                        </div>

                        @include('componentes.validacion', ['campo' => 'txtCURP'])

                    </div>



                    <div class="mb-3 text-center">
                        <div class="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                            <div class="h-captcha" data-sitekey="{{ env('HCAPTCHA_SITEKEY') }}"></div>
                            <button type="button" class="btn btn-link p-0 m-0 border-0" onclick="recargarCaptcha()"
                                title="Recargar captcha">
                                <i class="fas fa-sync-alt fa-lg"></i>
                            </button>
                        </div>

                        @error('h-captcha-response')
                            <div class="form-text text-danger text-center mt-2">{{ $message }}</div>
                        @enderror

                        @include('componentes.validacion', ['campo' => 'h-captcha-response'])
                    </div>



                    @csrf

                    <div class="mb-3 ">
                        <button onclick="cargarClases()" id="btnEnviar" class="btn text-light w-100 py-2" type="button">
                            <i class="fa-solid fa-magnifying-glass"></i> Consultar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="mt-4" id="detallesBecario">
            {{-- container --}}
        </div>


        <div id="spinner-overlay" style="display: none;">
            <div class="spinner"></div>
        </div>


        @include('componentes.pie')

    </main>

    <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
</body>

</html>