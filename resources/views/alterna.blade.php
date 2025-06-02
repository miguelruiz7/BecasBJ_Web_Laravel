
<!DOCTYPE html>
<html lang="es">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Consulta Beneficiario - Programa de Becas Benito Juárez</title>
 	<meta name="description" content="Consulta tu estatus como beneficiario de los programas de becas Benito Juárez. Accede a información actualizada sobre pagos y requisitos.">
    <meta name="keywords" content="becas Benito Juárez, consulta beneficiarios, estatus becas, información becas, calendario de pagos">
 	<meta name="robots" content="noindex, nofollow, noarchive"> <!-- Meta tag para robots -->

	<!-- CSS -->
	<link href="https://buscador.becasbenitojuarez.gob.mx/consulta/img/favicon.ico" rel="shortcut icon">
	<link href="https://buscador.becasbenitojuarez.gob.mx/consulta/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
	<link href="https://buscador.becasbenitojuarez.gob.mx/consulta/css/guia-estilos.css" rel="stylesheet">
	<link href="https://buscador.becasbenitojuarez.gob.mx/consulta/css/main.css" rel="stylesheet">
	<link href="https://buscador.becasbenitojuarez.gob.mx/consulta/css/style.css" rel="stylesheet">
	<link data-turbolinks-track="true" href="https://framework-gb.cdn.gob.mx/gm/accesibilidad/css/gobmx-accesibilidad.min.css" media="all" rel="stylesheet"/>


	<!--Sweet Alert-->
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
	<!--Recaptcha API Google-->
	
	<script src="https://js.hcaptcha.com/1/api.js" async defer></script>
</head>

<body style="overflow-x:hidden"><!-- BEGIN WAYBACK TOOLBAR INSERT -->
	<!-- Header -->
	<header class="header">
	<h1 hidden>Consulta de Beneficiarios</h1>
		<nav class="navbar navbar-expand-lg navbar-fixed-top navbar-primary p-0 m-auto navbar-dark">

			<a class="navbar-brand m-0 px-3" href="#">
				<div class="logo_navbar"></div>
			</a>

			<button class="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
				<span class="sr-only">Interruptor de Navegación</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav ml-auto">					
					<li class="nav-item">
						<a href="https://www.gob.mx/tramites/" target="_blank" title="Trámites">Trámites </a>
					</li>
					<li class="nav-item">
						<a href="https://www.gob.mx/gobierno/" target="_blank" title="Gobierno">Gobierno</a>
					</li>
					<li class="nav-item">
						<a href="https://www.gob.mx/busqueda"><span class="sr-only">Búsqueda</span><i class="fas fa-search"></i></a>
					</li>
					<li class="nav-item">

						<img src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/usuario.svg" id="login">
					</li>
				</ul>

			</div>
		</nav>
	</header>

	<!--letter-->
	<div aria-hidden="true" class="hidden-xs font-changer internal print" tabindex="-1">
		<button class="inc-font font-modifier">Aa+</button>
		<button class="dec-font font-modifier">Aa-</button>
	</div>

	<!-- accesibilidad-->
	<div id="accessibility" class="" title="Menu Accesibilidad">
		<nav class="menu-container">
			<a href="#" class="menu-btn">
				<i class="icon fas fa-universal-access fa-2x" aria-hidden="true"></i>
			</a>
			<li class="menu-slide">
				<ul class="accesibility">
					<li class="escala icon-box BlackAndWhite icon-box-active">
						<input type="checkbox" id="escala" name="escala">
						<i class="fas fa-adjust fa-2x icons col-md-2" aria-hidden="true"></i>
						<span>Cambiar escala de grises</span>
					</li>
					<li class="lector icon-box">
						<input type="checkbox" id="lector" name="lector">
						<i class="fas fa-assistive-listening-systems fa-2x icons col-md-2" aria-hidden="true"></i>
						<span class="col-md-8">Usar un lector de pantalla</span>
					</li>
					<li class="cursor icon-box cCursor">
						<input type="checkbox" id="cursor" name="cursor">
						<i class="fas fa-mouse-pointer fa-2x icons col-md-2" aria-hidden="true"></i>
						<span class="col-md-8">Cambiar tamaño de cursor</span>
					</li>
					<li class="contraste icon-box">
						<input type="checkbox" id="contraste" name="contraste">
						<i class="fas fa-palette InvertContrast fa-2x icons col-md-2" aria-hidden="true"></i>
						<span class="col-md-8">Cambiar el contraste de color</span>
					</li>
					<li class="icon-box mask activeMask">
						<input type="checkbox" id="mask" name="mask"><i class="fas fa-grip-lines fa-2x fa-2x icons col-md-2" aria-hidden="true"></i>
						<span class="col-md-8">Mascara de lectura</span>
					</li>
					<li class="icon-box guia activeLineRead">
						<input type="checkbox" id="guia" name="guia">
						<i class="fas fa-underline  fa-2x icons col-md-2" aria-hidden="true"></i>
						<span class="col-md-8">Guia de Lectura</span>
					</li>
					<li class="icon-box dislexia">
						<input type="checkbox" id="dislexia" name="dislexia">
						<i class="fas fa-italic fa-2x icons col-md-2" aria-hidden="true"></i>
						<span class="col-md-8">Cambio de tipografia dislexia</span>
					</li>
					<li class="icon-box spacing_v">
						<input type="checkbox" id="spacing_v" name="spacing_v">
						<i class="fas fa-text-height icons col-md-2 fa-2x" aria-hidden="true"></i>
						<span class="col-md-6">Espaciado vertical</span>
						<div class="col-md-12">
							<div id="progressAccess">
								<div class="s1 stepping"></div>
								<div class="s2 stepping"></div>
								<div class="s3 stepping"></div>
							</div>
						</div>
					</li>
					<li class="icon-box spacing_h">
						<input type="checkbox" id="spacing_h" name="spacing_h">
						<i class="fas fa-text-width icons col-md-2 fa-2x " aria-hidden="true"></i>
						<span class="col-md-6">Espaciado Horizontal</span>
						<div class="col-md-12">
							<div id="progressAccess">
								<div class="sh1 stepping horizon"></div>
								<div class="sh2 stepping horizon"></div>
								<div class="sh3 stepping horizon"></div>
							</div>
						</div>
					</li>
					<li class="icon-box icon-box-active ">
						<div class="col-md-3 icon-box-simple pull-left dec-font icon-box-active">
							<i class="fas fa-text-size "></i>
							<i class="fas fa-minus "></i>
						</div> &nbsp; &nbsp;
						<div class="col-md-3 icon-box-simple pull-left inc-font icon-box-active ">
							<i class="fas fa-text-size "></i>
							<i class="fas fa-plus"></i>
						</div>
						<span class="col-md-8">Cambiar tamaño</span>
					</li>
					<li class="icon-box resaltar">
						<input type="checkbox" id="resaltar" name="resaltar">
						<i class="fas fa-highlighter fa-2x icons col-md-2" aria-hidden="true"></i>
						<span class="col-md-8">Resaltar Enlaces</span>
					</li>
				</ul>
			</li>
		</nav>
	</div>

	<!--inicia carrusel-->
	
	<div class="page">
		<div class="slider-container">
			<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
				<ol class="carousel-indicators">
					<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
					<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
					<li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
					<li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
				
				</ol>
				<div class="carousel-inner">
				<div class="carousel-item active">
					<img class="d-block w-100" src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/portada_proporcional.png" alt="First slide">
					</div>
					<div class="carousel-item">
						<a href="#" target="_blank"><img class="d-block w-100" src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/DECS_BannersActualizados.jpg" alt="Second slide"></a>
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/banner_sustitucion_agosto_2024.jpg" alt="Third slide">
					</div>
					<div class="carousel-item">
						<a href="https://cn.becasbenitojuarez.gob.mx/contraloria-web/" target="_blank"><img class="d-block w-100" src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/banner_contraloria.jpg" alt="Fourth slide"></a>
					</div>
				</div>
				<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span>
					<span class="sr-only">Previous</span>
				</a>
				<a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="sr-only">Next</span>
				</a>
			</div>
		</div>
	
		<!--termina carrusel-->
		<div class="container contenedor-informacion">
			<div class="row">
				<nav aria-label="breadcrumb">
					<ol class="breadcrumb">
						<li class="breadcrumb-item"><a href="https://buscador.becasbenitojuarez.gob.mx/" target="_blank">Inicio</a></li>
						<li class="breadcrumb-item active" aria-current="page">Consulta de beneficiarios</li>
					</ol>
				</nav>
			</div>
			<div class="row">
				<div class="col-md-3">

				</div>
				<!--Separador-->
				<div class="col-md-6">
					<div class="cajaUno">
						<span class="padron"><b style="font-size: 22px;">¿Eres beneficiario(a) de algunos de nuestros
								*programas de becas?</b><br>Consulta tu información</span><br>
						<form id="formulario" class="pt-2" onsubmit="return false;">
							<!--Primero debemos de incluir el filtro-->
							<!--<div class="row">
								<div class="col-md-12">
									<span class="padron"><b style="font-size: 22px;"><img src="img/iconosV4/1.svg"> Selecciona tu nivel educativo</img></b></span><br>
								</div>
								<div class="col-md-3 contenedorInfo basica" id="boxBasica" style="cursor: pointer">
									<div class="box">
										<span class="checkTitle">BÁSICA</span>
									</div>
									<div class="boxCheck">
										<input hidden type="checkbox" id="basica" value="BASICA" name="PROGRAMA">
									</div>
								</div>

								<div class="col-md-3 contenedorInfo mediaBox" id="boxBUEEMS" style="cursor: pointer">
									<div class="box">
										<span class="checkTitle">MEDIA</span>
									</div>
									<div class="boxCheck">
										<input hidden type="checkbox" id="media" value="BUEEMS" name="PROGRAMA">
									</div>
								</div>

								<div class="col-md-3 contenedorInfo superior" id="boxJEF" style="cursor: pointer">
									<div class="box">
										<span class="checkTitle">SUPERIOR</span>
									</div>
									<div class="boxCheck">
										<input hidden type="checkbox" id="superior" value="JEF" name="PROGRAMA">
									</div>
								</div>
							</div>
							<br>-->
							<!--Despues la casilla del curp-->
							<div class="row">
								<div class="col-md-12">
									<span class="padron"><b style="font-size: 22px;"><!--<img src="img/iconosV4/2.svg">-->Escribe tu
											CURP<!--</img>--></b></span><br>
									<span class="form-text-curp">¿No conoces tu CURP? <a href="https://www.gob.mx/curp/" target="_blank">Consulta tu CURP aquí.</a></span>
								</div>
								<div class="input-group mb-3">
									<div class="input-group-prepend">
										<span class="input-group-text"><i class="fas fa-search"></i></span>
									</div>
									<input type="text" maxlength="18" id="text" class="form-control" placeholder="CURP (18 caracteres alfanúmericos)" aria-label="CURP" aria-describedby="basic-addon2" name="CURP" id="CURP" style="text-transform: uppercase">
									<div class="input-group-append">
										<button class="btn button-primary" id="buscar" type="button">Buscar</button>
									</div>
								</div>
								
								<div class="col-md-13" style="margin: auto!important;">

								
							</div>
						</form>
					</div>
				</div>
				<div class="col-md-3">
				</div>
			</div>
			<br>
			<div class="row">
				<div class="col-md-1">
				</div>
				<div class="col-md-10 buscador">
					<div id="resultado">
					</div>
				</div>
				<div class="col-md-1">
				</div>
				<span id="msg"></span>
			</div>
			<br>
			<br>
			<div class="row linea">
				<div class="col-md-12">
					<br>
					<div class="row">
						<div class="col-12" style="display: inline; text-align: center;">
							<span class="text-green" style="font-size: 12px;">
								*Este Programa es público, ajeno a cualquier partido político. Queda prohibido el uso
								para fines distintos a los establecidos en el programa.
							</span>
						</div>
					</div>
					<br>
					<div class="row" style="text-align: justify;">
						<div class="col-md-5">
							<span class="text-green"><b>Última actualización</b></span><br>
							<span class="text-green">Las actualizaciones se realizan periódicamente con base
								en el calendario de pagos vigente. Consulta el calendario oficial <a href="https://www.gob.mx/becasbenitojuarez/documentos/calendario-de-pagos-de-los-programas-de-becas-para-el-bienestar-benito-juarez-2024?state=published" target="_blank">aquí</a>
							</span> <br> <br>
							<span class="text-green">
								¿Te gustaría convertirte en Representante de Contraloría Social y participar
								en actividades para vigilar la correcta aplicación de los recursos públicos asignados a
								nuestros programas de becas? <br>
								¡Alza la mano, participa y transforma!<br>
								Da click
								<a href="https://www.gob.mx/becasbenitojuarez/articulos/que-es-la-contraloria-social-234537" target="_blank">aquí</a>
							</span> <br><br>
						</div>
						<div class="col-md-1"></div>
						<div class="col-md-5">
							<br><span class="text-green">
								¿Tienes alguna duda con la información de tu estatus? Marca al teléfono 55 11 62 03 00
								para recibir orientación.
							</span>
							<br>
							<br>
							<div class="row">
								<div class="col-md-4" style="padding-bottom: 8px;">
									<a href="https://www.facebook.com/BecasBenito/" target="_blank"><img src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/facebook.svg"><span class="text-green">
											Facebook</span></a>
								</div>
								<div class="col-md-4" style="padding-bottom: 8px;">
									<a href="https://twitter.com/BecasBenito" target="_blank"><img src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/twitter.svg"><span class="text-green"> Twitter</span></a>
								</div>
								<div class="col-md-4" style="padding-bottom: 8px;">
									<a href="https://instagram.com/becasbenitojuarezoficial" target="_blank"><img src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/instagram.svg"><span class="text-green">
											Instagram</span></a>
								</div>
								<div class="col-md-4" style="padding-bottom: 8px;">
									<a href="https://www.tiktok.com/@becasbenitojuarez" target="_blank"><img src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/tiktok.svg"><span class="text-green"> TikTok</span></a>
								</div>
								<div class="col-md-4" style="padding-bottom: 8px;">
									<a href="https://www.youtube.com/becasbenitojuarezoficial" target="_blank"><img src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/youtube.svg"><span class="text-green"> Youtube</span></a>
								</div>
							</div>
							<br>
							<div class="row">
								<div class="col-md-3">
									<a href="https://cn.becasbenitojuarez.gob.mx/contraloria-web/" target="_blank"><img style="width: 50px; height: 50px" src="https://buscador.becasbenitojuarez.gob.mx/consulta/img/iconosV4/contraloria.png"></a>
								</div>
							</div>
							<br>
							<div class="row">

								<div class="col-md-12" style="text-align: start">
									<span class="text-green">
										Consulta el Aviso de Privacidad <a href="https://cn.becasbenitojuarez.gob.mx/swb/work/gobmx/Proteccion_de_Datos_Personales/DGGPTIC/SIMPLIFICADO_Buscador_de_Estatus.pdf" target="_blank">aquí</a>
									</span>
									<br>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br>
		</div>

		<!--footer-->
		<footer>
			<div class="row">
				<div class="col-md-11">

				</div>
				<div class="col-md-1">
					<p aligne="right" class="division">Versión 12.3.0</p>
				</div>
			</div>
			<div class="contenedor-padding">
				<div class="row">
					<div class="col-sm-3 col-lg-3">
						<img src="https://framework-gb.cdn.gob.mx/gobmx/img/logo_blanco.svg" href="/" alt="logo gobierno de méxico" class="logo_footer imgBW">
					</div>
					<div class="col-sm-3 col-lg-3">
						<h5 class="mb-3">Enlaces</h5>
						<ul>
							<li>
								<a href="https://participa.gob.mx/" target="_blank" rel="noopener" title="Enlace abre en ventana nueva">Participa</a>
							</li>
							<li>
								<a href="https://www.gob.mx/publicaciones" target="_blank" rel="noopener" title="Enlace abre en ventana nueva">Publicaciones Oficiales</a>
							</li>
							<li>
								<a href="http://www.ordenjuridico.gob.mx/" target="_blank" rel="noopener" title="Enlace abre en ventana nueva">Marco Jurídico</a>
							</li>
							<li>
								<a href="https://consultapublicamx.inai.org.mx/vut-web/" target="_blank" rel="noopener" title="Enlace abre en ventana nueva">Plataforma Nacional de Transparencia</a>
							</li>
							<li>
								<a href="https://alertadores.funcionpublica.gob.mx/" target="_blank" rel="noopener" title="Enlace abre en ventana nueva">Alerta</a>
							</li>
							<li>
								<a href="https://sidec.funcionpublica.gob.mx/" target="_blank" rel="noopener" title="Enlace abre en ventana nueva">Denuncia</a>
							</li>
						</ul>
					</div>
					<div class="col-sm-3 col-lg-3">
						<h5 aligne="left" class="division">¿Qué es gob.mx?</h5>
						<p>Es el portal único de trámites, información y participación ciudadana.
							<a href="https://www.gob.mx/que-es-gobmx">
								Leer más
							</a>
						</p>
						<ul class="list-unstyled">
							<li>
								<a href="https://datos.gob.mx/">Portal de datos abiertos</a>
							</li>
							<li>
								<a href="https://www.gob.mx/accesibilidad">Declaración de accesibilidad</a>
							</li>
							<li>
								<a href="https://www.gob.mx/privacidadintegral">Aviso de privacidad integral</a>
							</li>
							<li>
								<a href="https://www.gob.mx/privacidadsimplificado">Aviso de privacidad simplificado</a>
							</li>
							<li>
								<a href="https://www.gob.mx/terminos">Términos y condiciones</a>
							</li>
							<li>
								<a href="https://www.gob.mx/terminos#medidas-seguridad-informacion">Política de
									seguridad</a>
							</li>
							<li>
								<a href="https://www.gob.mx/sitemap">Mapa del sitio</a>
							</li>
						</ul>
					</div>
					<div class="col-sm-3 col-lg-3">
						<h6 aligne="left" class="division"></h6>
						<h6>
							<a href="https://www.gob.mx/tramites/ficha/presentacion-de-quejas-y-denuncias-en-la-sfp/SFP54">
								Denuncia contra servidores públicos
							</a>
						</h6>
						<br>
						<h5 id="redes">Síguenos en:</h5>
						<ul id="social" class="list-inline">
							<li class="list-inline-item">
								<a href="https://www.facebook.com/gobmexico/" target="_blank" red="Facebook" title="Enlace a facebook abre en una nueva ventana" class="sendEstFooterRs share-info">
									<img alt="Facebook" src="https://web.archive.orghttps://framework-gb.cdn.gob.mx/landing/img/facebook.png" class="imgBW">
								</a>
							</li>
							<li class="list-inline-item">
								<a href="https://twitter.com/GobiernoMX" target="_blank" red="Twitter" title="Enlace a twitter abre en una nueva ventana" class="sendEstFooterRs share-info">
									<img alt="Twitter" src="https://web.archive.orghttps://framework-gb.cdn.gob.mx/landing/img/twitter.png" class="imgBW">
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="container-fluid footer-pleca">
				<div class="row">
					<div class="column">
						<br><br><br>
					</div>
				</div>
			</div>
		</footer>

		<!-- JS -->
		<script src="https://buscador.becasbenitojuarez.gob.mx/consulta/js/jquery-3.4.js"></script>
		<script>
			$(function () {
				$('[data-toggle="tooltip"]').tooltip({
					boundary: 'window',
					template:
						'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
				});
			});
		</script>
		
		<script src="https://buscador.becasbenitojuarez.gob.mx/consulta/bootstrap/dist/js/bootstrap.min.js"></script>
		{{-- <script type="text/javascript" src="https://buscador.becasbenitojuarez.gob.mx/consulta/js/busqueda.js"></script> --}}
        <script type="text/javascript" src="js/busqueda.js"></script>
		<script src="https://framework-gb.cdn.gob.mx/gm/accesibilidad/js/gobmx-accesibilidad.min.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js"></script>

</body>

</html>
<!--<script type="text/javascript">
	Swal.fire({
		allowOutsideClick: false,
		background: '#10312B',
		//imageUrl: 'img/iconosV4/citas_popup.jpg',
		html: '<div><img src="img/iconosV4/banner_cinco.jpg" width = "500px" height = "400px" class = "iconos"></img></div>',
		width: 600,
		confirmButtonColor: '#691C32',
		confirmButtonText: 'Cerrar',
	})
</script>-->
<!--
     FILE ARCHIVED ON 08:21:39 Feb 11, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 23:04:30 Jun 01, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
-->
<!--
playback timings (ms):
  captures_list: 0.621
  exclusion.robots: 0.036
  exclusion.robots.policy: 0.021
  esindex: 0.01
  cdx.remote: 6.507
  LoadShardBlock: 407.768 (3)
  PetaboxLoader3.datanode: 100.813 (5)
  PetaboxLoader3.resolve: 581.387 (3)
  load_resource: 331.848 (2)
-->