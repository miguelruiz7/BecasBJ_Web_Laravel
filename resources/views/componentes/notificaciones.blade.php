@if (session('error') || session('success'))
    <div id="contenedorNotificaciones" class="position-fixed bottom-0 end-0 p-3 w-100 z-3" style="text-align: -webkit-center;">
        <div id="notificaciones" class="toast align-items-center 
            @if(session('error')) 
                text-bg-danger 
            @elseif(session('success')) 
                text-bg-success 
            @endif
            border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div>
                <div class="toast-body text-center">
                    <div id="text-center mensaje">
                        <i class="fa-solid 
                            @if(session('error')) 
                                fa-circle-exclamation 
                            @elseif(session('success')) 
                                fa-circle-check 
                            @endif
                            mr-2"></i>
                        @if(session('error'))
                            {{ session('error') }}
                        @elseif(session('success'))
                            {{ session('success') }}
                        @endif
                    </div>
                </div>
               {{--  <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button> --}}
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
       
                // Mostrar el toast con animación
                $('#notificaciones').fadeIn(300).delay(3000).fadeOut(300);
    
                // Opcional: Limpiar el contenido del toast después de que desaparezca
                setTimeout(function() {
                    $('#notificaciones').html('');
                    $('#contenedorNotificaciones').html('');

                }, 3600); // Un poco más que el tiempo de fadeOut para asegurar que se limpia después

        });
    </script>
    

@endif


    <!-- Notificaciones -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3 w-100 ">
        <button class="btn" data-bs-dismiss="toast" aria-label="Close">
            <div id="toast_alert" class="toast align-items-center bg-dark" role="alert" aria-live="assertive"
                aria-atomic="true">
                <div>
                    <div class="toast-body text-light"><i class="fa-solid fa-circle-dot"></i>
                        <div id="mensaje"></div>
                    </div>
                 
                </div>
            </div>
        </button>
    </div>




{{--  
    <div class="position-fixed bottom-0 end-0 p-3 w-100 z-3" style="text-align: -webkit-center, z-index 9999 !important;">
        <div id="notificaciones" class="toast align-items-center  border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div>
                <div id="toast_alert" class="toast-body text-center">
                    <div id="text-center mensaje">
                        <i class="fa-solid  fa-circle-exclamation   mr-2"></i>
                        <div id="mensaje"></div>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div> --}}





