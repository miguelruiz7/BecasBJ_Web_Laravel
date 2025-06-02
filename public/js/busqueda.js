$(document).ready(function () {
	function validar_beneficiario(beneficiario) {
		var mensaje = true;
		var patt = /[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
		var test = patt.test(beneficiario.toUpperCase());

		if (beneficiario.trim().length == 0) {
			mensaje = "La CURP es requerida, no debe contener caracteres especiales ni espacios";
		} else if (test == false) {
			//if(beneficiario.trim().length == 18){
			mensaje = "CURP inválida";
			//}
		}

		return mensaje;
	}
	$("input[name='CURP']").on("keyup change", function () {
		$("#msg").text("");
		$("#resultado").html("");

		var beneficiario = $(this).val();

		if (beneficiario.length == 18) {
			var mensaje = validar_beneficiario(beneficiario);

			if (mensaje == true) {
				$("#buscar").attr("disabled", false);

			} else {
				$("#buscar").attr("disabled", true);
				$("#msg").text(mensaje);
			}
		} else {
			$("#buscar").attr("disabled", true);
			$("#msg").text("CURP inválida");
		}

	});
	$("input[name='CURP']").on("keypress", function (e) {
		$("#msg").text("");
		$("#resultado").html("");

		var beneficiario = $(this).val();
		if (beneficiario.length == 18) {
			var mensaje = validar_beneficiario(beneficiario);

			if (mensaje == true) {
				$("#buscar").attr("disabled", false);
				if (e.which == 13) {
					buscar_beneficiario();
				}
			} else {
				$("#buscar").attr("disabled", true);
				$("#msg").text(mensaje);
			}
		} else {
			$("#buscar").attr("disabled", true);
			$("#msg").text("CURP inválida");
		}

	});

	$("#login").on("click", function (e) {
		var habilitar = $("#h-captcha").is(':visible');
		if (habilitar == true) {
			Swal.fire({
				allowOutsideClick: false,
				html: '<span class = "normal">Ingresa tu usuario</span><br>' +
					'<input id="swal-input1" class="swal2-input"><br>' +
					'<span class = "normal">Ingresa tu contraseña</span><br>' +
					'<input id="swal-input2" class="swal2-input" type = "password">',
				width: 500,
				confirmButtonColor: '#10312B',
				confirmButtonText: 'Siguiente'
			}).then((result) => {
				if (result.isConfirmed) {
					let user = $('#swal-input1').val();
					let pass = $('#swal-input2').val();
					$.ajax({
						type: "POST",
						url: "https://buscador.becasbenitojuarez.gob.mx/consulta/metodos/usuarios.php",
						data: {
							user: user,
							pass: pass,
						},
						dataType: "json",
						crossDomain: true,
						success: function (data) {
							if (data.VALIDADO == "1") {
								$("#h-captcha").hide();
								Swal.fire({
									text: 'Bienvenido',
									confirmButtonColor: '#10312B',
									confirmButtonText: 'Continuar'
								});
							} else {
								Swal.fire({
									text: 'Usuario o contraseña no validos',
									confirmButtonColor: '#691C32',
									confirmButtonText: 'Salir'
								});
							}
						}
					});
				}
			})
		} else {
			Swal.fire({
				allowOutsideClick: false,
				text: '¿Desea cerrar la sesión?',
				width: 500,
				confirmButtonColor: '#691C32',
				confirmButtonText: 'Cerrar',
				showDenyButton: true,
				denyButtonText: 'Continuar',
				denyButtonColor: '#10312B',
			}).then((result) => {
				if (result.isConfirmed) {
					$("#h-captcha").show();
				}
			})
		}
	});

	function buscar_beneficiario() {
		var habilitar = $("#h-captcha").is(':visible');
		var formulario = $("#formulario").serialize();
		formulario = formulario;
		var sub_formulario = formulario.substring(0, 23);
		var sub_formulario2 = formulario.substring(24, formulario.length);
		sub_formulario = sub_formulario.toUpperCase();
		formulario = sub_formulario + '&' + sub_formulario2 + '&habilitar=' + habilitar;	
		$("#buscar").attr("disabled", true);
		$("#text").attr("disabled", true);
		$.ajax({
			type: "POST",
			url: "https://buscador.becasbenitojuarez.gob.mx/consulta/metodos/wrapper.php",
			data: formulario,
			data: formulario,
			dataType: "json",
			crossDomain: true,
			success: function (data) {
				//Habilitar timer 
				setTimeout(() => { $("#buscar").attr("disabled", false); }, "5000");
				setTimeout(() => { $("#text").attr("disabled", false); }, "5000");
				if (habilitar == true) {
					//captcha.reset();
				}
				if (data.status == 200) {
					var now = new Date();
					var hours = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
					var year = now.getFullYear();
					var status = data.datos.SITUACION_INSCRIPCION_ACTUAL;
					if (status == "ACTIVA" || status == "EN REVISION" || status == "CAMBIO TITULAR" || status == "VERIFICACION RENAPO" || status == "BAJA") {
						//Direccion de adscripcion
						let sucursalOrigen = data.datos.SUCURSAL_ADSCRIPCION;
						let direccionOrigen = data.datos.DIRECCION_ADSCRIPCION;
						//Variables globales 
						var periodos = data.datos.PERIODOS_2023;
						//Primero periodo 2023
						var emision2023 = data.datos.EMISION_2023;
						var modalidadFebrero2023 = data.datos.FORMA_ENTREGA_APOYO_2023;
						var liquidadoraFebrero2023 = data.datos.INSTITUCION_LIQUIDADORA_2023;
						var pagadoFeb2023 = data.datos.PAGADO_2023;
						if (emision2023 == null || emision2023 == undefined || emision2023 == "") {
							emision2023 = "0";
						}
						if (pagadoFeb2023 == "" && emision2023 == "1") {
							pagadoFeb2023 = "0";
						}
						//Grupo Familiar
						var grupo = data.datos.DATOS_FAMILIA;
						var banco = data.datos.BANCARIZACION;
						//Fecha del sistema y conversion
						var fechaSistema = new Date();
						var convfSistema = Date.parse(fechaSistema);
						//SePARAR DATOS
						var liquidadoraFebrero = separarLiquidadora(data.datos.LIQUIDADORA_FEB);
						var liquidadoraJunio = separarLiquidadora(data.datos.LIQUIDADORA_JUN);
						var liquidadoraSeptiembre2022 = separarLiquidadora(data.datos.LIQUIDADORA_SEPOCT_2022);
						//Se mandan a traer los indices de los array
						//Variables Febrero
						var sub_LiquidadoraFebrero = liquidadoraFebrero[0];
						var sub_ModalidadFebrero = liquidadoraFebrero[1];
						//Variables Junio
						var sub_LiquidadoraJunio = liquidadoraJunio[0];
						var sub_ModalidadJunio = liquidadoraJunio[1];
						//Variables Septiembre2022
						var sub_LiquidadoraSeptiembre2022 = liquidadoraSeptiembre2022[0];
						var sub_ModalidadSeptiembre2022 = liquidadoraSeptiembre2022[1];
						//Programa
						var programaActual = siglas(data.datos.PROGRAMA)
						//Variable pendiente para el buzon de mensajes
						let pendiente = 0;
						let formulario1 = 0;
						let formulario2 = 0;
						//let formulario3 = 0;
						let formulario4 = 0;
						//let formulario5 = 0;
						let formulario9 = 0;
						let formulario10 = 0;
						//
						let activacion = bajas(data.datos.SITUACION_ENTREGA_FEB, data.datos.SITUACION_ENTREGA_JUN, data.datos.SITUACION_ENTREGA_SEPOCT_2022, data.datos.EMISION_2023, data.datos.EMISION_2023E2, data.datos.EMISION_23EMISION3, data.datos.PERIODO_INCORPORACION, data.datos.ESTADO_ID);
						let emUno = activacion[0];
						let emDos = activacion[1];
						let emTres = activacion[2];
						let emCuatro = activacion[3];
						let emCinco = activacion[4];
						let emSeis = activacion[5];
						let popup = 0;
						//Universos
						let universosArray = universos(data.datos.UNIVERSOS_FORMA_ATENCION);
						//Fin de las variables globales
						var contenido =
							'<div class="card card-resultado">' +
							'<div class="card-body">' +
							//
							'<div class="row">' +
							'<div class = "col-md-12" style="display: flex; align-items: center; flex-direction: column;">' +
							'<div class = "row" style="align-items: center;">' +
							'<img src="img/iconosV4/' + imagen(data.datos.PROGRAMA) + '" class = "logoResponsive">';
						if (data.datos.CONTRALORIA == "1") {
							contenido = contenido +
								'<br><br>' +
								'<img src="img/iconosV4/contraloria.png" class = "logoContraloria">';
						}
						if (data.datos.ESTADO_ID == "12" && data.datos.OTIS == "1") {
							contenido = contenido +
								'<br><br>' +
								'<img src="img/otis.png" class = "logoOtis">';
						}
						contenido = contenido +
							'</div>' +
							'</div>' +
							'</div>' +
							'<br>' +
							//Resultados del padron
							'<div class="row">';
						if (status == "CAMBIO TITULAR") {
							pendiente = pendiente + 1;
							contenido = contenido +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/alert.svg">' +
								'</div>' +
								'<div class="col-9 resultado-text">' +
								'<div class="row">' +
								'<div><span class = "texto interlineadoReduce">Tu estatus es <span class="textoPendiente textoActRep title-heading"> Pendiente actualización de representante de familia </span></span><a href="#becas"><img alt="Mail Icon" class="mail-icon" src = "img/iconosV4/mail.png" data-toggle="tooltip" data-placement="right" title = "Revisa tu buzón de mensajes" style = "width:2em; height:2em;"></img></a><br>' +
								'<span class = "info">Fecha de consulta: ' + now.toLocaleDateString() + '</span><br>' +
								'<span class = "info">Hora de consulta: ' + hours + ' hrs</span><br>' +
								'<span class = "info">Programa Vigente: <b>' + programaActual + '</b></span>' +
								'</div>' +
								'</div>' +
								'</div>';
						}else if (status == "VERIFICACION RENAPO") {
							pendiente = pendiente + 1;
							contenido = contenido +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/alert.svg">' +
								'</div>' +
								'<div class="col-9 resultado-text">' +
								'<div class="row">' +
								'<div><span class = "texto interlineadoReduce">Tu estatus es <span class="textoPendiente textoActRep title-heading"> Pendiente de validar tu CURP con RENAPO</span></span><a href="#becas"><img alt="Mail Icon" class="mail-icon" src = "img/iconosV4/mail.png" data-toggle="tooltip" data-placement="right" title = "Revisa tu buzón de mensajes" style = "width:2em; height:2em;"></img></a><br>' +
								'<span class = "info">Fecha de consulta: ' + now.toLocaleDateString() + '</span><br>' +
								'<span class = "info">Hora de consulta: ' + hours + ' hrs</span><br>' +
								'<span class = "info">Programa Vigente: <b>' + programaActual + '</b></span>' +
								'</div>' +
								'</div>' +
								'</div>';
						}else if (status == "EN REVISION") {
						pendiente = pendiente + 1;
						contenido = contenido +
							'<div class="col-3 icon text-center">' +
							'<img src="img/iconosV4/alert.svg">' +
							'</div>' +
							'<div class="col-9 resultado-text">' +
							'<div class="row">' +
							'<div><span class = "texto">Tu estatus es <span class="textoPendiente title-heading">' + status + ' </span></span><img src = "img/iconosV4/interrogacion.svg" data-toggle="tooltip" data-placement="right" title = "Revisa tu buzón de mensajes" ><br>' +
							'<span class = "info">Fecha de consulta: ' + now.toLocaleDateString() + '</span><br>' +
							'<span class = "info">Hora de consulta: ' + hours + ' hrs</span><br>' +
							'<span class = "info">Programa Vigente: <b>' + programaActual + '</b></span>' +
							'</div>' +
							'</div>' +
							'</div>';
						} else {
							contenido = contenido +
								'<div class="col-3 icon text-center">';
							if (status == "ACTIVA") {
								contenido = contenido +
									'<img src="img/check.svg">' +
									'</div>' +
									'<div class="col-9 resultado-text">' +
									'<div class="row">' +
									'<div><span class = "texto mail-icon-container">Tu estatus es <span class="textoTitulo title-heading">' + status + ' </span></span>';

								if (comparauniverso(universosArray, "1", "igual") == "1" || comparauniverso(universosArray, "8", "igual") == "1" ||
									(comparauniverso(universosArray, "11", "igual") == "1") || (comparauniverso(universosArray, "13", "igual") == "1")
									|| (comparauniverso(universosArray, "15", "igual") == "1") || (comparauniverso(universosArray, "16", "igual") == "1")) {
									contenido = contenido + '<a href="#becas"><img alt="Mail Icon" class="mail-icon" src = "img/iconosV4/mail.png" data-toggle="tooltip" data-placement="right" title = "Revisa tu buzón de mensajes" style = "width:30px; height:30px;"></img></a>';
								}

								contenido = contenido +
									'<br>';
							} else {
								contenido = contenido +
									'<img src="img/iconosV4/x-estatus-baja.svg" class="icon-resultado">' +
									'</div>' +
									'<div class="col-9 resultado-text">' +
									'<div class="row">' +
									'<div><span class = "texto">Tu estatus es <span class="textoBaja title-heading">' + status + ' </span></span>';
								if (comparauniverso(universosArray, "1", "igual") == "1" || comparauniverso(universosArray, "8", "igual") == "1" ||
									(comparauniverso(universosArray, "11", "igual") == "1") || (comparauniverso(universosArray, "13", "igual") == "1")) {
									contenido = contenido + '<a href="#becas"><img src = "img/iconosV4/mensaje.svg" data-toggle="tooltip" data-placement="right" title = "Revisa tu buzón de mensajes" style = "width:30px; height:30px;"></img></a>';
								}
								contenido = contenido +
									'<br>';
							}
							contenido = contenido +
								'<span class = "info">Fecha de consulta: ' + now.toLocaleDateString() + '</span><br>' +
								'<span class = "info">Hora de consulta: ' + hours + ' hrs</span><br>' +
								'<span class = "info">Programa Vigente: <b>' + programaActual + '</b></span><br>';
							if (data.datos.PERIODO_INCORPORACION != null && data.datos.PERIODO_INCORPORACION != "" && data.datos.PERIODO_INCORPORACION != undefined) {
								contenido = contenido +
									'<span class = "info">Fecha de incorporación al padrón: <b>' + data.datos.PERIODO_INCORPORACION + '</b></span><br>';
							}
							//Integrante ID
							if (data.datos.INTEGRANTE_ID != "" && data.datos.INTEGRANTE_ID != undefined && data.datos.INTEGRANTE_ID != null) {
								contenido = contenido +
									'<span class = "info">Identificador del becario: <b>' + data.datos.INTEGRANTE_ID + '</b></span>';
								//Fin tutor
							}
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//Modelado inscripcion

						//Fin
						contenido = contenido +
							'</div>' +
							'<div class="row">' +
							'<div class="col-12 resultado-line">' +
							'<div class="row">' +
							'<div class="col-3 icon text-center">' +
							'<img src="img/iconosV4/becario.svg">' +
							'</div>' +
							'<div class="col-9 resultado-text">' +
							'<details>';
						if (data.datos.PROGRAMA == "BASICA") {
							contenido = contenido +
								'<summary><span class = "becario"><b>Información de la o el becario de referencia</b></span></summary>';
						} else {
							contenido = contenido +
								'<summary><span class = "becario"><b>Información de la o el becario</b></span></summary>';
						}
						contenido = contenido +
							'<br>' +
							'<div class="row">' +
							'<span class = "info">CURP: <b>' + data.datos.CURP + '</b></span>' +
							'</div>';
						//Inicio tutor
						if (data.datos.PROGRAMA == "BASICA" && data.datos.CURP_TUTOR != "" && data.datos.CURP_TUTOR != undefined && data.datos.CURP_TUTOR != null) {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">Representante de la familia: <b>' + data.datos.CURP_TUTOR + '</b></span>' +
								'</div>';
							//Fin tutor
						}
						//FAMILIA en caso de basica
						if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null) {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">Identificador de la familia: <b>' + data.datos.FAMILIA + '</b></span>' +
								'</div>';
							//Fin tutor
						}
						//Fin 
						if (data.datos.CCT != null && data.datos.CCT != "" && data.datos.CCT != undefined) {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">CCT: <b>' + data.datos.CCT + '</b></span>' +
								'</div>';
						}
						if (data.datos.PROGRAMA == 'BASICA') {
							contenido = contenido +
								'<br>' +
								'<div class = "row">' +
								'<details>' +
								'<summary><span class = "info detalles becario">Grupo Familiar</span></summary>' +
								'<br>';
							for (var datos in grupo) {
								var cct = grupo[datos].CCT;
								var curpInt = grupo[datos].CURP;
								var tipo_persona = grupo[datos].TIPO_PERSONA;
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "info">CURP Integrante: <b>' + curpInt + '</b></span><br>';
								if (cct != null && cct != "") {
									contenido = contenido +
										'<span class = "info">CCT: <b>' + cct + '</b></span><br>';
								}
								if (tipo_persona != null && tipo_persona != "") {
									contenido = contenido +
										'<span class = "info">Tipo de Persona: <b>' + tipoconversion(tipo_persona) + '</b></span><br>';
								}
								contenido = contenido +
									'</div>' +
									'<br>';
							}
							contenido = contenido +
								'</details>' +
								'</div>';
							//Fin 
						}
						//CLAVE SARE
						if ((data.datos.NOMBRE_SARE != null && data.datos.NOMBRE_SARE != "") && (data.datos.DIRECCION_SARE != null && data.datos.DIRECCION_SARE != "")) {
							contenido = contenido +
								'<br><div class="row">' +
								'<details>' +
								'<summary><span class = "info detalles becario">Oficina de becas que te corresponde</span></summary><br>' +
								'<span class = "info">SARE de adscripción: <b>' + data.datos.NOMBRE_SARE + '</b></span><br>' +
								'<span class = "info">Dirección SARE de adscripción: <b>' + data.datos.DIRECCION_SARE + '</b></span>' +
								'</details>' +
								'</div>';
						}
						//Fin
						contenido = contenido +
							'</div>' +
							'</details>' +
							'</div>' +
							'</div>' +
							'</div>';
						//Apartado nuevo de las becas 
						var arregloBancarizacion = data.datos.BANCARIZACION;
						var medioPendiente = "";
						var formalizacion = "";
						var estrategia_DGOVAC = "";
						var no_pendiente = 1;
						//Inicia modulo de bancarizacion 
						if (data.datos.PROGRAMA == "BUEEMS" && data.datos.BANCARIZACION_RECHAZADA == "1") {
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/tarjeta_bienestar_2.png">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Bancarización</span><br>' +
								'</div>' +
								'</div>' +
								'<div class = "row">' +
								'<span class = "mostrar normal" onClick = "mostrarBeca()" id = "spanBeca">Ocultar \u25B6</span>' +
								'<div id = "beca" style="display: block; text-align: justify" class = "col-12">' +
								'<br>';
							//
							contenido = contenido +
								/*'<div class = "row">' +
								'<div class = "col-3">' +
								'</div>' +
								'<div class = "col-9" style = "display: flex; align-items: center; justify-content: start;">' +
								'<a href = "https://www.youtube.com/watch?v=xKKz5i8Of7M" target = "_blank"><div class = "contenedor_Estrategia" style = "background-color: #9952BF;"><span class = "etiqueta_Estrategia"><b>Agenda una cita para recibir tu beca</b></span></div></a>' +
								'</div></div><br><br>' +*/
								'<span class = "bold" style = "color: #611232;">Bancarización en proceso  </span>' +
								'<img src="img/relojito.svg" style = "width: 30px;">' +
								'<br>' +
								'<br>' +
								'<span class = "normal">' +
								'Estimado/a beneficiaria/o de las Becas para el Bienestar Benito Juárez.<br><br>' +
								'A partir de junio de 2024 mantente al pendiente de este apartado para saber cuándo, dónde y a qué hora acudir por tu medio de pago. <br><br>' +
								'Recuerda llevar tu documentación completa y, si eres menor de edad, ir acompañado/a de tu madre, padre, representante de familia (abuela, abuelo, hermana o hermano mayores de edad), tutora o tutor.' +
								/*'<span class = "normal">Debido a la normatividad, tu tarjeta estará esperando hasta que seas mayor de 15 años. Por ahora recibirás tu beca a través de una Orden de Pago para cobro en ventanilla del Banco del Bienestar, para ello debes agendar una cita en nuestro <a href = "https://citas.becasbenitojuarez.gob.mx/index" target = "_blank">Sistema de Citas</a> y elegir el trámite “Entrega de ODP para cobro en ventanilla”.<br><br>' +
								'Revisa <a href = "https://www.gob.mx/becasbenitojuarez/documentos/documentacion-orden-de-pago-menor-a-18-anos?state=published" target = "_blank">aquí</a> la documentación que debes presentar.<br><br>' +
								'No olvides que debes asistir con tu mamá, papá, abuela, abuelo, hermana o hermano mayores de edad, tutora o tutor.<br><br>' +
								'<b>Recuerda que es muy importante que acudas a tu cita, de lo contrario, deberás reagendarla y no podrás hacerlo hasta pasados 30 días.</b><br><br>' +
								'Mantente al pendiente de la sección “Becas Emitidas” para conocer el periodo de pago de tus próximas becas y agendar tu cita.<br><br>' +
								'¡Juntas y juntos transformamos! ' +*/
								'</span>';
							//
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						} else if ((comparauniverso(universosArray, "3", "igual") == "1" /*Se evalua en 1 por que quiere decir que una accion si es 3*/)) {
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/tarjeta_bienestar_2.png">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Bancarización</span><br>' +
								'</div>' +
								'</div>' +
								'<div class = "row">' +
								'<span class = "mostrar normal" onClick = "mostrarBeca()" id = "spanBeca">Ocultar \u25B6</span>' +
								'<div id = "beca" style="display: block; text-align: justify" class = "col-12">' +
								'<br>';
							//
							contenido = contenido +
								/*'<div class = "row">' +
								'<div class = "col-3">' +
								'</div>' +
								'<div class = "col-9" style = "display: flex; align-items: center; justify-content: start;">' +
								'<a href = "https://www.youtube.com/watch?v=xKKz5i8Of7M" target = "_blank"><div class = "contenedor_Estrategia" style = "background-color: #9952BF;"><span class = "etiqueta_Estrategia"><b>Agenda una cita para recibir tu beca</b></span></div></a>' +
								'</div></div><br><br>' +*/
								'<span class = "bold" style = "color: #611232;">Bancarización rechazada  </span>' +
								'<img src="img/rechazada.svg" style = "width: 30px;">' +
								'<br>' +
								'<br>' +
								'<span class = "normal">' +
								'Estimado/a beneficiaria/o de las Becas para el Bienestar Benito Juárez.<br><br>' +
								'A partir de junio de 2024 mantente al pendiente de este apartado para saber cuándo, dónde y a qué hora acudir por tu medio de pago. <br><br>' +
								'Recuerda llevar tu documentación completa y, si eres menor de edad, ir acompañado/a de tu madre, padre, representante de familia (abuela, abuelo, hermana o hermano mayores de edad), tutora o tutor.' +
								/*'<span class = "normal">Realizamos el depósito de tu beca a tu cuenta del Banco del Bienestar, pero fue rechazado. Por ahora recibirás tu beca a través de una Orden de Pago para cobro en ventanilla del Banco del Bienestar, para ello debes agendar una cita en nuestro <a href = "https://citas.becasbenitojuarez.gob.mx/index" target = "_blank">Sistema de Citas</a> y elegir el trámite “Entrega de ODP para cobro en ventanilla”.<br><br>' +
								'Si eres mayor de edad, revisa <a href = "https://www.gob.mx/becasbenitojuarez/documentos/documentacion-orden-de-pago-mayor-a-18-anos?state=published" target = "_blank">aquí</a> la documentación que debes presentar.<br><br>' +
								'Si eres menor de edad, revisa <a href = "https://www.gob.mx/becasbenitojuarez/documentos/documentacion-orden-de-pago-menor-a-18-anos?state=published" target = "_blank">aquí</a> la documentación que debes presentar y no olvides que debes asistir con tu mamá, papá, abuela, abuelo, hermana o hermano mayores de edad, tutora o tutor.<br><br>' +
								'<b>Recuerda que es muy importante que acudas a tu cita, de lo contrario, deberás reagendarla y no podrás hacerlo hasta pasados 30 días.</b><br><br>' +*/
								'</span>';
							//
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';

						} else if ((arregloBancarizacion.length != 0 || (arregloBancarizacion.length == 0 && data.datos.PROCESO_BANCARIZACION == 1) || data.datos.PERIODO_INCORPORACION == 'SEP-2023') && (comparauniverso(universosArray, "2", "diferente") == "1")) {
							if(arregloBancarizacion.length == 0){
								no_pendiente = 0;
							}
							contenido = contenido +
								'<div class="row" id="bancarizacion_modulo">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/tarjeta_bienestar_2.png">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Bancarización</span><br>' +
								'</div>' +
								'</div>' +
								'<div class = "row">' +
								'<span class = "mostrar normal" onClick = "mostrarBeca()" id = "spanBeca">Ocultar \u25B6</span>' +
								'<div id = "beca" style="display: block; text-align: justify" class = "col-12">' +
								'<br>';
							if (arregloBancarizacion == "PENDIENTE" || (arregloBancarizacion.length == 0 && data.datos.PROCESO_BANCARIZACION == 1) || (data.datos.PERIODO_INCORPORACION == 'SEP-2023' && arregloBancarizacion.length == 0)) {
								contenido = contenido +
									'<div class = "row">' +
									//Parte de arriba que controla los Items
									'<div class = "contenedorUno">' +
									'<div class = "row">' +
									//Item 1
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/check_relleno.svg" class = "contenedorItem">' +
									'</div>' +
									//Item 2
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/iconosV4/alert.svg" class = "contenedorItem">' +
									'</div>' +
									//Item 3
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/iconosV4/alert.svg" class = "contenedorItem">' +
									'</div>' +
									'</div>' +
									'</div>' +
									//Este solo controla la linea divisoria, por eso va vacio 
									'<div class = "contenedorDos">' +
									'<div class = "row">' +
									//Texto Item 1
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">Tarjeta en proceso de asignación</span>' + //Todos aquellos que sabemos que su modalidad de pago va a pasar a ser banco del bienestar
									'</div>' +
									//Texto Item 2
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">Asignación de cita para la entrega de tu tarjeta</span>' +
									'</div>' +
									//Texto Item 3
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">La tarjeta esta lista para recibir tu beca</span>' +
									'</div>' +
									'</div>' +
									'</div>' +
									//Fin modulo timeline */
									'</div>';
								contenido = contenido +
									'<div class = "row">' +
									'<div class = "col-12">' +
									'<span class = "normal">' +
									'Estimada familia beneficiaria <br><br>A partir de junio de 2024 podrás consultar la información de entrega de tu tarjeta del Banco del Bienestar en la que depositaremos tus becas.<br><br>¡Revisa constantemente este apartado! Aquí te diremos cómo, cuándo y dónde recogerla.<br><br>Una vez que te asignemos una fecha de entrega, asiste puntualmente y no olvides presentar toda la documentación necesaria.<br><br>' +
									'Cuando tengas tu tarjeta consulta la sección de Becas Emitidas para saber cuándo recibirás el depósito de tu Beca Benito Juárez de Educación Básica<br><br>¡Juntas y juntos transformamos tu beca!';
								//'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito Juárez. <br><br>¡Felicidades! Ahora recibirás tu beca en una tarjeta del Banco del Bienestar.<br><br>Revisa constantemente este apartado para conocer el día, hora y lugar a donde deberás acudir para recogerla.<br><br>';
								/*if (arregloBancarizacion == "PENDIENTE") {
									formulario1 = formulario1 + 1;
									contenido = contenido +
										'Si por algún motivo, tu tarjeta no puede ser entregada, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase “Acudí a la cita en donde me entregarían mi tarjeta del Banco del Bienestar pero no me atendieron”.<br>';
								}
								//Formulario 2
								if (arregloBancarizacion == "PENDIENTE") {
									formulario2 = formulario2 + 1;
									contenido = contenido +
										'Si han pasado 45 días desde que la recibiste y aún no tienes el depósito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase “Ya pasaron 45 días o más desde que tengo mi tarjeta y aún no recibo el depósito de mi beca”.';
								}
								//*/

								contenido = contenido +
									//'Estamos trabajando para atenderte lo más pronto posible.<br><br>¡Tú y tu familia nos inspiran a #BecarParaTransformar!' +
									'</span>' +
									'</div>' +
									'</div>';
								popup = popup + 1;

							} else {
								for (var datos in banco) {
									var ac = banco[datos].AC
									medioPendiente = banco[datos].DESC_EST_FORMZ_UPD;
									vigencia = banco[datos].DESC_VIG_FORMZ_UPD;
									estrategia_DGOVAC = banco[datos].TIPO_ESTRATEGIA_DGOVAC;
									formalizacion = banco[datos].FECHA_FORMALIZACION;
									var sucursal = banco[datos].SUCURSAL;
									var direccionSucursal = banco[datos].DIRECCION_SUCURSAL;
									var fechaHora = banco[datos].FECHA_HORA;
									var remesa = banco[datos].NUMERO_REMESA;
									if (medioPendiente == "MEDIO PENDIENTE DE ENTREGAR" && (estrategia_DGOVAC == "SUCURSAL")) {
										var inFecha = fechaHora.indexOf(",");
										var lonFechaBanco = fechaHora.length;
										var fecha = fechaHora.substring(0, inFecha);
										var hora = fechaHora.substring(inFecha + 1, lonFechaBanco);
									}
									if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO" && banco[datos].FECHA_PROGRAMADA != undefined) {
										var programada = banco[datos].FECHA_PROGRAMADA;
										var inFecha = fechaHora.indexOf(",");
										var lonFechaBanco = fechaHora.length;
										var fecha = fechaHora.substring(0, inFecha);
										var hora = fechaHora.substring(inFecha + 1, lonFechaBanco);
									}
									if (medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") {
										no_pendiente = 0;
									}
								}
								contenido = contenido +
									'<div class = "row">' +
									'<div class = "col-3">' +
									'</div>' +
									'<div class = "col-9" style = "display: flex; align-items: center; justify-content: start;">';
								/*if ((estrategia_DGOVAC != null && estrategia_DGOVAC != "" && estrategia_DGOVAC != undefined)) {
									if (estrategia_DGOVAC == "ESCUELA POR ESCUELA" && data.datos.PROGRAMA == "BUEEMS") {
										contenido = contenido +
											'<a href = "https://www.gob.mx/becasbenitojuarez/es/articulos/entrega-de-tarjetas-para-beneficiarias-y-beneficiarios-de-la-beca-de-educacion-media-superior-en-sede-alterna?idiom=es" target = "_blank"><div class = "contenedor_Estrategia" style = "background-color: #611232;"><span class = "etiqueta_Estrategia"><b>Recibirás tu tarjeta a través de la estrategia EscuelaxEscuela</b></span></div></a>';
									} else if ((estrategia_DGOVAC == "SUCURSAL" || estrategia_DGOVAC == "SUCURSAL EXTENSION") && data.datos.PROGRAMA == "BUEEMS") {
										contenido = contenido +
											'<div class = "contenedor_Estrategia" style = "background-color: #CEF46C;"><span class = "etiqueta_Estrategia" style = "color: black;"><b>Recibirás tu tarjeta en una sucursal del Banco del Bienestar</b></span></div>';
									} else if (estrategia_DGOVAC == "SEDE OPERATIVA TEMPORAL") {
										contenido = contenido +
											'<div class = "contenedor_Estrategia" style = "background-color: #EF3770;"><span class = "etiqueta_Estrategia" style = "color: white;"><b>Recibirás tu tarjeta en una Sede Alterna</b></span></div>';
									}
								}*/

								contenido = contenido +
									'</div>' +
									'</div>' +
									'<div class = "row">' +
									//Parte de arriba que controla los Items
									'<div class = "contenedorUno">' +
									'<div class = "row">' +
									//Item 1
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/check_relleno.svg" class = "contenedorItem">' +
									'</div>' +
									//Item 2
									'<div class = "col-4 contenedorTimeline">';
								if ((fecha == "" || fecha == undefined) && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") {
									if (estrategia_DGOVAC == "ESCUELA POR ESCUELA" || estrategia_DGOVAC == "SEDE OPERATIVA TEMPORAL") {
										contenido = contenido +
											'<img src="img/check_relleno.svg" class = "contenedorItem">';
									} else {
										contenido = contenido +
											'<img src="img/iconosV4/alert.svg" class = "contenedorItem">';
									}
								} else if (((fecha != "" && fecha != undefined) && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") || (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO")) {
									contenido = contenido +
										'<img src="img/check_relleno.svg" class = "contenedorItem">';
								}
								contenido = contenido +
									'</div>' +
									//Item 3
									'<div class = "col-4 contenedorTimeline">';
								if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" class = "contenedorItem">';
								} else {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" class = "contenedorItem">';
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									//Este solo controla la linea divisoria, por eso va vacio 
									'<div class = "contenedorDos">' +
									'<div class = "row">' +
									//Texto Item 1
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">Tarjeta en proceso de asignación</span>' + //Todos aquellos que sabemos que su modalidad de pago va a pasar a ser banco del bienestar
									'</div>' +
									//Texto Item 2
									'<div class = "col-4 contenedorTimelineTexto">';
								if (fecha == "" && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") {
									if (estrategia_DGOVAC == "ESCUELA POR ESCUELA" || estrategia_DGOVAC == "SEDE OPERATIVA TEMPORAL") {
										contenido = contenido +
											'<span class = "normal">Tarjeta en tránsito, revisa periódicamente la programación de entregas</span>';
									} else {
										contenido = contenido +
											'<span class = "normal">Asignación de cita para la entrega de tu tarjeta</span>';
									}
								} else if ((fecha != "" && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") || (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO")) {
									if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO") {
										contenido = contenido +
											'<span class = "normal">Ya recogiste tu tarjeta</span>';
									} else {
										if (estrategia_DGOVAC == "ESCUELA POR ESCUELA" || estrategia_DGOVAC == "SEDE OPERATIVA TEMPORAL") {
											contenido = contenido +
												'<span class = "normal">Tarjeta en tránsito, revisa periódicamente la programación de entregas</span>';
										} else {
											contenido = contenido +
												'<span class = "normal">Tu cita para recoger tu tarjeta, ha sido asignada</span>';
										}
									}
								}
								contenido = contenido +
									'</div>' +
									//Texto Item 3
									'<div class = "col-4 contenedorTimelineTexto">';
								if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO" && pagadoFeb2023 == "1") {
									contenido = contenido +
										'<span class = "normal">La tarjeta esta lista para recibir tu beca</span>';
								} else {
									contenido = contenido +
										'<span class = "normal">La tarjeta esta lista para recibir tu beca</span>';
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									//Fin modulo timeline */
									'</div>';

								//Fin timeline
								//Formularios 2 y 4 cuando exista ExE de nuevo
								if (estrategia_DGOVAC == "SEDE OPERATIVA TEMPORAL" && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") {
									var enlace = "";
									if (data.datos.PROGRAMA == "BASICA") {

										enlace = "https://www.gob.mx/becasbenitojuarez/articulos/entrega-de-tarjetas-para-familias-beneficiarias-de-la-beca-benito-juarez-de-educacion-basica-en-sede-alterna";
									} else if (data.datos.PROGRAMA == "BUEEMS") {
										formulario4 = formulario4+1;
										enlace = "https://www.gob.mx/becasbenitojuarez/articulos/entrega-de-tarjetas-para-beneficiarias-y-beneficiarios-de-la-beca-de-educacion-media-superior-en-sede-alterna";
									} else if (data.datos.PROGRAMA == "JEF") {
										enlace = "https://www.gob.mx/becasbenitojuarez/articulos/entrega-de-tarjetas-para-beneficiarias-y-beneficiarios-de-la-beca-para-el-bienestar-benito-juarez-de-educacion-superior-en-sede-alterna";
									}
									formulario2 = formulario2 + 1;
									//Cuando se tengan datos 
									contenido = contenido +
										'<div class = "row">' +
										'<div class = "col-12">' +
										'<span class = "bold" style = "color: #611232;">Bancarización en proceso  </span>' +
										'<img src="img/iconosV4/alert.svg" style = "width: 30px;">' +
										'<br><br>' +
										'<span class = "normal">';
									//'Becaria, becario o familia beneficiaria<br><br>¡Felicidades! Muy pronto te entregaremos la tarjeta del Banco del Bienestar en la que depositaremos tu Beca Benito Juárez.<br><br>Recuerda que en estos meses no se entregarán tarjetas en las sucursales del banco, por lo que recibirás tu tarjeta en una Sede Alterna, es decir, un espacio público de fácil acceso y cercano a tu plantel. Para ello debes estar pendiente de la programación semanal';
									/*if (enlace != "") {
										contenido = contenido +
											' en la siguiente <a href = "' + enlace + '" target = "_blank">liga</a>.<br><br>';
									} else {
										contenido = contenido +
											'.<br><br>';
									}*/
									contenido = contenido +
										/*'Es muy importante que acudas a recoger tu tarjeta en el día y hora que te corresponde, de lo contrario, la entrega se reprogramará hasta el segundo semestre del año.<br><br>' +
										'Consulta <a href = "https://www.gob.mx/becasbenitojuarez/articulos/enterate-si-recibiras-tu-beca-en-una-tarjeta-para-el-bienestar" target = "_blank">aquí</a> los documentos que deberás presentar.<br><br>' +
										'Una vez que hayas recibido tu tarjeta podrás consultar la fecha de tu próximo pago en la sección “Becas Emitidas”.<br><br>' + */
										'Estimada/o beneficiaria/o de las Becas para el Bienestar Benito Juárez. <br><br>' +
										'Si aún no tienes tu tarjeta del Banco del Bienestar, ¡no te preocupes, tu beca está segura! <br><br> A partir de junio de 2024 mantente al pendiente de este apartado para saber cuándo, dónde y a qué hora acudir por tu tarjeta.<br><br>' +
										'Recuerda llevar tu documentación completa y, si eres menor de edad, ve acompañado/a de tu madre, padre, representante de familia (abuela, abuelo, hermana o hermano mayores de edad), tutora o tutor.<br><br>' +
										'¡Juntas y juntos transformamos!' +
										'</span>' +
										'</div>' +
										'</div>';
								} else {
									if (((fecha != "" && fecha != undefined) && (hora != "" && hora != undefined) && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") && estrategia_DGOVAC != "EN REVISION") {
										formulario1 = formulario1 + 1;
										formulario2 = formulario2 + 1;
										popup = popup + 1;
										contenido = contenido +
											'<div class = "row">' +
											'<div class = "col-12">' +
											'<span class = "bold" style = "color: #611232;">Bancarización en proceso  </span>' +
											'<img src="img/iconosV4/alert.svg" style = "width: 30px;">' +
											'<br><br>' +
											'<span class = "normal">';
										//Rezagado -> 13, no rezagado -> 12
										if ((comparauniverso(universosArray, "13", "igual") == "1")) {
											contenido = contenido +
												`Estimada becaria, becario o familia de los Programas de Becas para el Bienestar Benito Juárez<br><br><b></b>¡Tu tarjeta del Banco del Bienestar está esperándote!<br><br> 
											Te hemos buscado desde hace varios meses para entregarte tu tarjeta y no lo hemos logrado.<br>¡Esta es tu oportunidad para recogerla!<br>Acude a tu cita en una sucursal del Banco del Bienestar:<br><br>
											<b>Sede/Sucursal: </b>${sucursal}<br>
											<b>Dirección: </b>${direccionSucursal}<br>
											<b>Fecha: </b>${fecha}<br>
											<b>Hora: </b>${hora}<br>
											<b>Remesa: </b>${remesa}<br>`;
											//Documentos 
											//Para saber si es menor o mayor de edad
											let nacimiento = data.datos.FECHA_NACIMIENTO_BECARIO;
											//Fecha de nacimiento en milisegundos
											let nacimiento_milisegundos = formularioTiempo(nacimiento);
											//Fecha al dia de hoy en milisegundos
											var hoy = new Date();
											var local = hoy.toLocaleDateString();
											var habilitaDocumentos = formularioTiempo(local);
											//18 años en milisegundos
											let años_milisegundos = 567648000000;
											//Diferencia en milisegundos de la cita con la fecha de nacimiento
											let residuo_milisegundos = habilitaDocumentos - nacimiento_milisegundos;
											//Si el residuo es igual o menor a 18 años
											if ((residuo_milisegundos < años_milisegundos)) {
												//Doc Menor
												contenido = contenido + `<b>Documentación: </b><a href = 'https://www.gob.mx/cms/uploads/attachment/file/917918/SucursalMenor.pdf'>bit.ly/CNBBBJ_Tarjeta15a17</a><br><br>`;
											} else {
												//Doc Mayor
												contenido = contenido + `<b>Documentación: </b><a href = 'https://www.gob.mx/cms/uploads/attachment/file/917917/SucursalMayor.pdf'>bit.ly/CNBBBJ_TarjetaMayor18</a><br><br>`;
											}
											contenido = contenido +
												`Es <b>MUY IMPORTANTE</b> que verifiques el día, la hora y la sucursal a la que debes asistir para recoger tu tarjeta, de lo contrario, no
											podrás cobrar tu Beca Benito Juárez.<br><br>
											Si tienes algún problema con la entrega, ve a la sección de <b>Ventanilla Virtual de Atención Ciudadana</b> y llena el formulario que más
											se asemeje a tu situación.<br><br>
											Una vez que tengas tu tarjeta, consulta en la sección Becas Emitidas los meses que corresponden a tu pago. <br><br>
											¡No tardes!`;
										} else if ((comparauniverso(universosArray, "11", "igual") == "1") && data.datos.PROGRAMA == 'BASICA') {
											contenido = contenido +
												`Estimada familia beneficiaria <b>¡Les damos la bienvenida a la Beca para el Bienestar Benito Juárez de Educación Básica!</b><br><br> 
												Ahora que ya forman parte del programa, considera la siguiente información:<br>
												<ul>
												<li style="list-style-type: none;">- La beca se otorga <b>por familia</b> sin importar la cantidad de hijas, hijos o menores que la conformen</li>
												<li style="list-style-type: none;">- Tu familia recibirá <b>920 pesos mensuales</b> mediante una tarjeta del Banco del Bienestar</li>
												<li style="list-style-type: none;">- Tu familia recibirá un máximo de <b>10 emisiones por ciclo escolar</b>, dependiendo del reporte de inscripción escolar</li>
												</ul><br>
												¡Acude a la cita en una sucursal para recoger tu tarjeta del Banco del Bienestar!<br><br>
												Es <b>MUY IMPORTANTE</b> que verifiques el día, la hora, la sucursal y los documentos que debes llevar, de lo contrario, no podrás cobrar
												tu Beca Benito Juárez.<br><br>
												<b>Sede/Sucursal: </b>${sucursal}<br>
												<b>Dirección: </b>${direccionSucursal}<br>
												<b>Fecha: </b>${fecha}<br>
												<b>Hora: </b>${hora}<br>
												<b>Remesa: </b>${remesa}<br>
												<b>Documentos: </b><a href = 'https://www.gob.mx/cms/uploads/attachment/file/917917/SucursalMayor.pdf'>bit.ly/CNBBBJ_TarjetaMayor18</a><br> <br>
												Si tienes algún problema con la entrega, ve a la sección de <b>Ventanilla Virtual de Atención Ciudadana</b> y llena el formulario que más
												se asemeje a tu situación.<br><br>
												Una vez que tengas tu tarjeta, consulta en la sección Becas Emitidas los meses que corresponden a tu pago. <br><br>
												¡No tardes!`;
										} else if ((comparauniverso(universosArray, "12", "igual") == "1")) {
											contenido = contenido +
												'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito Juárez<br><br>' +
												'¡Felicidades! La tarjeta del Banco del Bienestar en la que recibirás tus próximas becas está lista para que la recojas en:<br><br>' +
												'<b>Sede/Sucursal:</b> ' + sucursal + ' <b>Dirección: </b>' + direccionSucursal +
												'<br><br><b>Fecha:</b> ' + fecha +
												'<br><br><b>Hora:</b> ' + hora +
												'<br><br><b>Remesa:</b> ' + remesa +
												'<br><br><b>Documentación: </b>' +
												'<br><br>' +
												'Si eres mayor de edad, revisa la documentación en <a href = "https://www.gob.mx/cms/uploads/attachment/file/917917/SucursalMayor.pdf" target = "_blank">bit.ly/CNBBBJ_TarjetaMayor18</a><br><br>' +
												'Si eres menor de edad, revisa la documentación en <a href = "https://www.gob.mx/cms/uploads/attachment/file/917918/SucursalMenor.pdf" target = "_blank">bit.ly/CNBBBJ_Tarjeta15a17</a><br><br>';
										} else {
											contenido = contenido +
												'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito Juárez<br><br>' +
												'¡Felicidades! La tarjeta del Banco del Bienestar en la que recibirás tus próximas becas está lista para que la recojas en:<br><br>' +
												'<b>Sede/Sucursal:</b> ' + sucursal + ' <b>Dirección: </b>' + direccionSucursal +
												'<br><br><b>Fecha:</b> ' + fecha +
												'<br><br><b>Hora:</b> ' + hora +
												'<br><br><b>Remesa:</b> ' + remesa +
												'<br><br><b>Documentación: </b>' +
												'<br><br>' +
												'Si eres mayor de edad, revisa la documentación en <a href = "https://www.gob.mx/cms/uploads/attachment/file/917917/SucursalMayor.pdf" target = "_blank">bit.ly/CNBBBJ_TarjetaMayor18</a><br><br>' +
												'Si eres menor de edad, revisa la documentación en <a href = "https://www.gob.mx/cms/uploads/attachment/file/917918/SucursalMenor.pdf" target = "_blank">bit.ly/CNBBBJ_Tarjeta15a17</a><br><br>';
										}
										contenido = contenido +
											'</span>' +
											'</div>' +
											'</div>';
									} else if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO") {
										if (ac == 2) {
											contenido = contenido + `
											<span class = "bold" style = "color: #611232;">Bancarización exitosa. Activación pendiente  </span><img src="img/iconosV4/alert.svg" style = "width: 30px;"><br><br>
											Ahora que ya tienes tu tarjeta del Banco del Bienestar, lo primero que debes hacer es <b>¡CAMBIAR TU NIP!<br><br>
											Acude el ${programada} a la sucursal del Banco del Bienestar ubicada en ${direccionSucursal}, en el horario sugerido de ${hora} horas</b><br><br>
											Una vez que lo hagas se activará la próxima dispersión de tu Beca Benito Juárez.<br><br>¿Cuál es mi NIP?<br><br>
											Tu <b>NIP original</b> es el número de 4 dígitos que están impresos en el sobre donde recibiste tu tarjeta del banco, es <b>NECESARIO que lo CAMBIES por uno NUEVO</b>, para evitar que otras personas tengan acceso a tu Beca Benito Juárez.<br><br>
											<b>¿Cómo lo cambio?</b><br><br>Acude a las ventanillas del Banco del Bienestar en la sucursal y fecha designados, necesitarás tu tarjeta y una identificación oficial. La persona en ventanilla que te atenderá:<br><br>
											<ul>
											<li><b>Digitará tu número de tarjeta y verificará tu nombre completo</b></li>
											<li>Te pedirá <b>digitar tu NUEVO NIP</b>, recuerda que son solo <b>4 dígitos</b> que solamente tú debes conocer. No permitas que nadie te proporcione o sugiera un NIP.</li>
											<li>Una vez confirmados, el sistema emitirá un <b>comprobante</b> con tu <b>nombre</b> y los últimos <b>4 dígitos de tu tarjeta</b></li>
											<li>Te entregarán un <b>comprobante que deberás firmar, ¡guárdalo muy bien!</b></li>
											</ul><br><br>
											<b>¡Listo!</b><br><br>
											Recuerda: <b>las dispersiones pendientes de tu beca, no se activarán hasta que hayas cambiado tu NIP.</b>
											`;
										} else {
											if (pagadoFeb2023 == "1" && data.datos.PAGADO_2023E2 == "1") {
												contenido = contenido +
													'<div class = "row">' +
													'<div class = "col-12">' +
													'<span class = "bold" style = "color: #611232;">Bancarización exitosa  </span>' +
													'<img src="img/check_relleno.svg" style = "width: 30px;">' +
													'<br>' +
													'<span class = "bold" style = "color: #611232;">Tarjeta del Banco del Bienestar: </span><span class = "normal">Ya cuentas con tarjeta y cuenta bancaria del Banco del Bienestar</span><br>' +
													'<span class = "bold" style = "color: #611232;">Fecha de entrega de tu tarjeta del Banco del Bienestar: </span><span class = "normal">' + formalizacion + '</span><br>';
												//Sucursales de adscripcion 
												if (sucursalOrigen != "" && direccionOrigen != "") {
													contenido = contenido +
														'<span class = "bold" style = "color: #611232;">Sucursal de adscripción del Banco del Bienestar: </span><span class = "normal">' + sucursalOrigen + '</span><br>' +
														'<span class = "bold" style = "color: #611232;">Dirección de sucursal: </span><span class = "normal">' + direccionOrigen + '</span><br>';
												}
												contenido = contenido +
													'<br>' +
													'<span class = "normal">' +
													'Tu proceso de bancarización ha concluido exitosamente. Conoce el estatus y la fecha de depósito de tus próximas becas en la sección Becas Emitidas.<br><br>Descarga la App Banco del Bienestar Móvil para Android o IOS y consulta tu saldo y movimientos. <br><br>' +
													'En caso de robo o extravío de tu tarjeta, llama al 800 900 2000.<br><br>Si deseas reportar un cargo no reconocido, comunícate a la misma línea y selecciona la opción 2 para quejas y aclaraciones.<br><br>' +
													'Recuerda que NUNCA te llamaremos para solicitar información como tu NIP (número de seguridad) o número de tarjeta, jamás compartas tus datos bancarios. ¡No caigas en fraudes!<br><br>' +
													'¡Juntas y juntos transformamos tu beca!' +
													'</span>' +
													'</div>' +
													'</div>';

											} else {
												formulario1 = formulario1 + 1;
												formulario2 = formulario2 + 1;
												contenido = contenido +
													'<div class = "row">' +
													'<div class = "col-12">' +
													'<span class = "bold" style = "color: #611232;">Bancarización exitosa  </span>' +
													'<img src="img/check_relleno.svg" style = "width: 30px;">' +
													'<br>';
												//Sucursales de adscripcion 
												if (sucursalOrigen != "" && direccionOrigen != "") {
													contenido = contenido +
														'<span class = "bold" style = "color: #611232;">Sucursal de adscripción del Banco del Bienestar: </span><span class = "normal">' + sucursalOrigen + '</span><br>' +
														'<span class = "bold" style = "color: #611232;">Dirección de sucursal: </span><span class = "normal">' + direccionOrigen + '</span><br><br>';
												}
												contenido = contenido +
													'<span class = "normal">' +
													'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito Juárez<br><br>' +
													'¿Recibiste tu tarjeta del Banco del Bienestar este '+ year +' o en años anteriores?<br><br>';
												/*Formulario Uno */
												/*contenido = contenido +
													'Si por algún motivo, tu tarjeta no puede ser entregada, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase “Acudí a la cita en donde me entregarían mi tarjeta del Banco del Bienestar pero no me atendieron”.<br>';
												/* */
												//
												contenido = contenido +
													'Si han pasado 45 días desde que la recibiste y aún no tienes el depósito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase “Ya pasaron 45 días o más desde que tengo mi tarjeta y aún no recibo el depósito de mi beca”. <br><br>' +
													'¡Nosotros nos pondremos en contacto contigo para brindarte una solución!<br><br>' +
													'Tú nos inspiras a #BecarParaTransformar' +
													'</span>' +
													'</div>' +
													'</div>';
											}

										}
									} else if (/*(*/medioPendiente == "MEDIO PENDIENTE DE ENTREGAR" /*&& (fecha == "" || fecha == undefined) && (hora == "" || hora == undefined)) || estrategia_DGOVAC == "EN REVISION"*/) {
										formulario1 = formulario1 + 1;
										formulario2 = formulario2 + 1;
										contenido = contenido +
											'<div class = "row">' +
											'<div class = "col-12">' +
											'<span class = "normal">' +
											/*'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito Juárez <br><br>' +
											'¡Felicidades! Ahora recibirás tu beca en una tarjeta del Banco del Bienestar.<br><br>' +
											'Revisa constantemente este apartado para conocer el día, hora y lugar a donde deberás acudir para recogerla.<br><br>' +*/
											'Estimada/o beneficiaria/o de las Becas para el Bienestar Benito Juárez. <br><br>' +
											'Si aún no tienes tu tarjeta del Banco del Bienestar, ¡no te preocupes, tu beca está segura! <br><br> A partir de junio de 2024 mantente al pendiente de este apartado para saber cuándo, dónde y a qué hora acudir por tu tarjeta.<br><br>' +
											'Recuerda llevar tu documentación completa y, si eres menor de edad, ve acompañado/a de tu madre, padre, representante de familia (abuela, abuelo, hermana o hermano mayores de edad), tutora o tutor.<br><br>' ;
											//'Si por algún motivo, tu tarjeta no puede ser entregada, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase “Acudí a la cita en donde me entregarían mi tarjeta del Banco del Bienestar pero no me atendieron”.<br><br>';
										/* Formulario 2*/
										/*contenido = contenido +
											'Si han pasado 45 días desde que la recibiste y aún no tienes el depósito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase “Ya pasaron 45 días o más desde que tengo mi tarjeta y aún no recibo el depósito de mi beca”.<br><br>';
										/*Fin  */
										contenido = contenido +
											'Estamos trabajando para asignarte una cita lo más pronto posible.<br><br>' +
											'¡Tú y tu familia nos inspiran a #BecarParaTransformar!' +
											'</span>' +
											'</div>' +
											'</div>';
									}
								}
							}
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						} else if (data.datos.PERIODO_INCORPORACION == 'SEP-2023' || data.datos.PERIODO_INCORPORACION == 'ENE-2024') {
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/tarjeta_bienestar_2.png">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Bancarización</span><br>' +
								'</div>' +
								'</div>' +
								'<div class = "row">' +
								'<span class = "mostrar normal" onClick = "mostrarBeca()" id = "spanBeca">Ocultar \u25B6</span>' +
								'<div id = "beca" style="display: block; text-align: justify" class = "col-12">' +
								'<br>' +
								'<div class = "row">' +
								//Parte de arriba que controla los Items
								'<div class = "contenedorUno">' +
								'<div class = "row">' +
								//Item 1
								'<div class = "col-4 contenedorTimeline">' +
								'<img src="img/check_relleno.svg" class = "contenedorItem">' +
								'</div>' +
								//Item 2
								'<div class = "col-4 contenedorTimeline">' +
								'<img src="img/iconosV4/alert.svg" class = "contenedorItem">' +
								'</div>' +
								//Item 3
								'<div class = "col-4 contenedorTimeline">' +
								'<img src="img/iconosV4/alert.svg" class = "contenedorItem">' +
								'</div>' +
								'</div>' +
								'</div>' +
								//Este solo controla la linea divisoria, por eso va vacio 
								'<div class = "contenedorDos">' +
								'<div class = "row">' +
								//Texto Item 1
								'<div class = "col-4 contenedorTimelineTexto">' +
								'<span class = "normal">Tarjeta en proceso de asignación</span>' + //Todos aquellos que sabemos que su modalidad de pago va a pasar a ser banco del bienestar
								'</div>' +
								//Texto Item 2
								'<div class = "col-4 contenedorTimelineTexto">' +
								'<span class = "normal">Asignación de cita para la entrega de tu tarjeta</span>' +
								'</div>' +
								//Texto Item 3
								'<div class = "col-4 contenedorTimelineTexto">' +
								'<span class = "normal">La tarjeta esta lista para recibir tu beca</span>' +
								'</div>' +
								'</div>' +
								'</div>' +
								//Fin modulo timeline */
								'</div>';
							contenido = contenido +
								'<div class = "row">' +
								'<div class = "col-12">' +
								'<span class = "normal">' +
								'Estimada familia beneficiaria <br><br>A partir de junio de 2024 podrás consultar la información de entrega de tu tarjeta del Banco del Bienestar en la que depositaremos tus becas.<br><br>¡Revisa constantemente este apartado! Aquí te diremos cómo, cuándo y dónde recogerla.<br><br>Una vez que te asignemos una fecha de entrega, asiste puntualmente y no olvides presentar toda la documentación necesaria.<br><br>' +
								'Cuando tengas tu tarjeta consulta la sección de Becas Emitidas para saber cuándo recibirás el depósito de tu Beca Benito Juárez de Educación Básica<br><br>¡Juntas y juntos transformamos tu beca!';
							contenido = contenido +
								'</span>' +
								'</div>' +
								'</div>';
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//Termina Aqui -------------------------------------
						//Becas Emitidas 
						//Inicia Aqui Modulo Becas Emitidas// -----------------------------
						if (((data.datos.SITUACION_ENTREGA_SEPOCT_2022 != null && data.datos.SITUACION_ENTREGA_SEPOCT_2022 != "") || (data.datos.SITUACION_ENTREGA_JUN != null && data.datos.SITUACION_ENTREGA_JUN != "") ||
							(data.datos.SITUACION_ENTREGA_FEB != null && data.datos.SITUACION_ENTREGA_FEB != "")) || (emision2023 == "1" || data.datos.EMISION_2023E2 == "1" || data.datos.EMISION_23EMISION3 == "1")
							|| (data.datos.EMISION_24EMISION1 == "1") || (data.datos.EMISION_25EMISION1 == "1")|| (data.datos.EMISION_25EMISION2 == "1")) {
							contenido = contenido +
								'<div class="row" id="becas">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/Becas-emitidas.svg">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Becas emitidas </span>';
							/*var total_pagos = data.datos.TOTAL_PAGOS;
							if ((data.datos.PROGRAMA == "BUEEMS" || data.datos.PROGRAMA == "JEF") && (data.datos.TOTAL_PAGOS != "" && data.datos.TOTAL_PAGOS != null && data.datos.TOTAL_PAGOS != undefined)) {
								if (data.datos.PROGRAMA == 'BUEEMS') {
									if (total_pagos > 30) {
										total_pagos = 40;
									}
									contenido = contenido +
										'<br>' +
										'<span class = "normal">Total de pagos: ' + total_pagos + '/30</span>';
								} else {
									var pagoJEF = 45;
									if ((comparauniverso(universosArray, "5", "igual") == "1")) {
										pagoJEF = 55;
									}
									if (total_pagos > 45 && comparauniverso(universosArray, "5", "diferente") == "1") {
										total_pagos = 45;
									}
									contenido = contenido +
										'<br>' +
										'<span class = "normal">Total de pagos: ' + total_pagos + '/' + pagoJEF + '</span>';
								}
							}*/
							contenido = contenido +
							'<br>' +
							'<span class = "normal">Total de pagos: ' +data.datos.TOTAL_PAGOS+'/'+ data.datos.MAXIMO_PAGOS + '</span>';
							contenido = contenido +
								'</div>' +
								'</div>' +
								'<div class = "row barra">' +
								'<br>';
							//Validacion de los modulos
							contenido = contenido +
								'<div class = "col-12" style = "display: flex; align-items: center; justify-content: center;">';
							if ((data.datos.SITUACION_ENTREGA_SEPOCT_2022 != null && data.datos.SITUACION_ENTREGA_SEPOCT_2022 != "") || (data.datos.SITUACION_ENTREGA_JUN != null && data.datos.SITUACION_ENTREGA_JUN != "") ||
								(data.datos.SITUACION_ENTREGA_FEB != null && data.datos.SITUACION_ENTREGA_FEB != "") || ((emUno == 1 || emDos == 1 || emTres == 1)) && data.datos.PROGRAMA != "BASICA") {
								contenido = contenido +
									'<div class = "separadorPago contenedorFecha" onClick = "pagos2022()" style="cursor: pointer" id = "div2022">' +
									'<span id = "2022">2022</span>' +
									'</div>';
							}
							if ((emision2023 == "1" || data.datos.EMISION_2023E2 == "1" || data.datos.EMISION_23EMISION3 == "1") || ((emCuatro == 1 || emCinco == 1 || emSeis == 1) && data.datos.PROGRAMA != "BASICA")) {
								contenido = contenido +
									'<div class = "separadorPago contenedorFecha" onClick = "pagos2023()" style="cursor: pointer" id = "div2023">' +
									'<span id = "2023">2023</span>' +
									'</div>';
							}
							if (data.datos.EMISION_24EMISION1 == "1") {
								contenido = contenido +
									'<div class = "separadorPago contenedorFecha" onClick = "pagos2024()" style="cursor: pointer" id = "div2024">' +
									'<span id = "2024">2024</span>' +
									'</div>';
							}
							if ((data.datos.EMISION_25EMISION1 == "1"  )) {
								
								contenido = contenido +
									'<div class = "separadorPago contenedorFecha" onClick = "pagos2025()" style="cursor: pointer" id = "div2025">' +
									'<span id = "2025">2025</span>' +
									'</div>';
							}
							
							contenido = contenido +
								'</div>' +
								'</div>';
							contenido = contenido +
								'<div class = "row barra">';
							//Periodo 2022--------------------------------------------------------------------------------------------
							contenido = contenido +
								'<div class = "col-12" style = "display: none" id = "pagos2022">';
							//Inicia periodo febrero mayo
							liquidadora = data.datos.LIQUIDADORA_FEB;
							if (liquidadora != null && liquidadora != "" && liquidadora != undefined) {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "febrero2022()" id = "spanSuperior" style="cursor: pointer">Primera Emisión \u25B6</span>' +
									'<div id = "verFebrero2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<span class = "bold">Programa: </span><span class = "normal">' + programaActual + '</span><br>';
								//Nuevo modulo para la liquidadora
								contenido = contenido +
									'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraFebrero + '</span><br>';
								if (data.datos.PROGRAMA == "BASICA") {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">ENERO, FEBRERO, MARZO Y ABRIL</span><br>';
								} else {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">FEBRERO, MARZO, ABRIL Y MAYO</span><br>';
								}
								contenido = contenido +
									'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadFebrero + '</span><br>' +
									'<span class = "bold">Estatus del pago: </span><span class = "normal">' + data.datos.SITUACION_ENTREGA_FEB + '</span><br>';
								if (data.datos.FECHA_PAGO_FEB != null && data.datos.FECHA_PAGO_FEB != "" && data.datos.FECHA_PAGO_FEB != undefined) {
									contenido = contenido +
										'<span class = "bold">Fecha de pago: </span><span class = "normal">' + data.datos.FECHA_PAGO_FEB + '</span>';

								}
								//Fin Liquidadora
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							} else if (emUno == 1 && data.datos.PROGRAMA != "BASICA") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "febrero2022()" id = "spanSuperior" style="cursor: pointer">Primera Emisión \u25B6</span>' +
									'<div id = "verFebrero2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>' +
									'<span class = "normal">Tu CURP no estuvo activa en el padrón de personas beneficiarias durante esta emisión</span><br>';
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';

							}
							//Fin periodo febrero mayo
							//Inicio periodo junio julio
							liquidadora = data.datos.LIQUIDADORA_JUN;
							if (liquidadora != null && liquidadora != "" && liquidadora != undefined) {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "junio2022()" id = "spanSuperior" style="cursor: pointer">Segunda Emisión \u25B6</span>' +
									'<div id = "verJunio2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<span class = "bold">Programa: </span><span class = "normal">' + programaActual + '</span><br>';
								//Nuevo modulo para la liquidadora
								contenido = contenido +
									'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraJunio + '</span><br>';
								if (data.datos.PROGRAMA == "BASICA") {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">MAYO Y JUNIO</span><br>';

								} else {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">JUNIO Y JULIO</span><br>';
								}
								contenido = contenido +
									'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadJunio + '</span><br>' +
									'<span class = "bold">Estatus del pago: </span><span class = "normal">' + data.datos.SITUACION_ENTREGA_JUN + '</span><br>';
								if (data.datos.FECHA_PAGO_JUN != null && data.datos.FECHA_PAGO_JUN != "" && data.datos.FECHA_PAGO_JUN != undefined) {
									contenido = contenido +
										'<span class = "bold">Fecha de pago: </span><span class = "normal">' + data.datos.FECHA_PAGO_JUN + '</span>';

								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							} else if (emDos == 1 && data.datos.PROGRAMA != "BASICA") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "junio2022()" id = "spanSuperior" style="cursor: pointer">Segunda Emisión \u25B6</span>' +
									'<div id = "verJunio2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>' +
									'<span class = "normal">Tu CURP no estuvo activa en el padrón de personas beneficiarias durante esta emisión</span><br>';
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//------NUEVO PERIODO DE SEPTIEMBRE-OCTUBRE------------------------------------------------------------------------------------------------------
							liquidadora = data.datos.LIQUIDADORA_SEPOCT_2022;
							if (liquidadora != null && liquidadora != "" && liquidadora != undefined) {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "septiembre2022()" id = "spanSuperior" style="cursor: pointer">Tercera Emisión \u25B6</span>' +
									'<div id = "verSeptiembre2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<span class = "bold">Programa: </span><span class = "normal">' + programaActual + '</span><br>';
								//Nuevo modulo para la liquidadora
								if (sub_LiquidadoraSeptiembre2022 == "BANCO AZTECA" && (data.datos.ESTADO_ID == "5" || data.datos.ESTADO_ID == "7" || data.datos.ESTADO_ID == "15" || data.datos.ESTADO_ID == "17" || data.datos.ESTADO_ID == "18") && sub_ModalidadSeptiembre2022 == "AVISO DE COBRO/ORDEN DE PAGO") {
									contenido = contenido +
										'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraSeptiembre2022 + '*</span><br>' +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">SEPTIEMBRE, OCTUBRE, NOVIEMBRE Y DICIEMBRE</span><br>' +
										'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadSeptiembre2022 + '</span><br>';
								} else {
									contenido = contenido +
										'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraSeptiembre2022 + '</span><br>' +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">SEPTIEMBRE, OCTUBRE, NOVIEMBRE Y DICIEMBRE</span><br>' +
										'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadSeptiembre2022 + '</span><br>';
								}
								contenido = contenido +
									'<span class = "bold">Estatus del pago: </span><span class = "normal">' + data.datos.SITUACION_ENTREGA_SEPOCT_2022 + '</span><br>';
								if (data.datos.FECHA_PAGO_SEPOCT_2022 != null && data.datos.FECHA_PAGO_SEPOCT_2022 != "" && data.datos.FECHA_PAGO_SEPOCT_2022 != undefined) {
									contenido = contenido +
										'<span class = "bold">Fecha de pago: </span><span class = "normal">' + data.datos.FECHA_PAGO_SEPOCT_2022 + '</span>';

								}
								contenido = contenido +
									'</div>' +
									'</div>' + //Se agrego un div para 2023
									'</div>';
							}
							else if (emTres == 1 && data.datos.PROGRAMA != "BASICA") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "septiembre2022()" id = "spanSuperior" style="cursor: pointer">Tercera Emisión \u25B6</span>' +
									'<div id = "verSeptiembre2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>' +
									'<span class = "normal">Tu CURP no estuvo activa en el padrón de personas beneficiarias durante esta emisión</span><br>';
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>';
							}
							//PRIMERA EMISION DEL 2023
							contenido = contenido +
								'</div>' +
								'<div class = "col-12" style = "display: none" id = "pagos2023">';
							if (emision2023 == "1") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "febrero2023()" id = "spanSuperior" style="cursor: pointer">Primera Emisión \u25B6</span>' +
									'<div id = "verSeptiembre" style="display: none">' +
									'<div class="timeline-item">';
								if (pagadoFeb2023 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if (pagadoFeb2023 == "0" && (data.datos.ESTATUS_PAGO_2023 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if (pagadoFeb2023 == "0" && (data.datos.ESTATUS_PAGO_2023 == "NO PAGADA" || data.datos.ESTATUS_PAGO_2023 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + modalidadFebrero2023 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + liquidadoraFebrero2023 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_2023 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_2023 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023 != "DEPOSITO RECHAZADO") {
									if (modalidadFebrero2023 == "DEPOSITO EN CUENTA") {
										if (pagadoFeb2023 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">' + data.datos.FECHA_PAGO_2023 + '</span></span><br>';
										} else if (pagadoFeb2023 == "0") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">PENDIENTE</span></span><br>';
										}
									} else {
										if (pagadoFeb2023 != "1") {
											contenido = contenido +
												'<span class = "bold">Fecha y lugar programado para la entrega: <span class = "normal"></span></span><br>';
										}
									}
								}
								contenido = contenido +
									'<span class = "bold">Periodos: <span class = "normal">' + periodo(periodos) + '</span></span><br>';
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							} else if (emCuatro == 1 && data.datos.PROGRAMA != "BASICA") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "febrero2023()" id = "spanSuperior" style="cursor: pointer">Primera Emisión \u25B6</span>' +
									'<div id = "verSeptiembre" style="display: none">' +
									'<div class="timeline-item">' +
									'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>' +
									'<span class = "normal">Tu CURP no estuvo activa en el padrón de personas beneficiarias durante esta emisión</span><br>';
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//SEGUNDA EMISION DEL 2023
							if (data.datos.EMISION_2023E2 == "1") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "mayo2023()" id = "spanSuperior" style="cursor: pointer">Segunda Emisión \u25B6</span>' +
									'<div id = "verMayo" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_2023E2 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_2023E2 == "0" || data.datos.PAGADO_2023E2 == "") && (data.datos.ESTATUS_PAGO_2023E2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023E2 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_2023E2 == "0" || data.datos.PAGADO_2023E2 == "") && (data.datos.ESTATUS_PAGO_2023E2 == "NO PAGADA" || data.datos.ESTATUS_PAGO_2023E2 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_2023E2 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_2023E2 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_2023E2 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_2023E2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023E2 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_2023E2 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_2023E2 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">' + data.datos.FECHA_PAGO_2023E2 + '</span></span><br>';
										} else if ((data.datos.PAGADO_2023E2 == "0" || data.datos.PAGADO_2023E2 == "") && (data.datos.FECHA_PAGO_2023E2 != "" && data.datos.FECHA_PAGO_2023E2 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">Recibiras tu pago a partir del ' + data.datos.FECHA_PAGO_2023E2 + '</span></span><br>';
										} else {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">PENDIENTE</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE2(data.datos.PERIODOS_2023E2) + '</span></span><br>';
									} else {
										//
										if ((data.datos.PAGADO_2023E2 != "1") &&
											(data.datos.FECHA_PROGRAMADA_SOT_2023E2 != "" && data.datos.FECHA_PROGRAMADA_SOT_2023E2 != null) && (data.datos.DIR_PROGRAMADA_SOT_2023E2 != "" && data.datos.DIR_PROGRAMADA_SOT_2023E2 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<span class = "bold">Fecha y lugar programado para la entrega: <span class = "normal">' + data.datos.FECHA_PROGRAMADA_SOT_2023E2 + ' ' + data.datos.DIR_PROGRAMADA_SOT_2023E2 + '</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE2(data.datos.PERIODOS_2023E2) + '</span></span><br>';
										if ((data.datos.FECHA_PROGRAMADA_SOT_2023E2 != "" && data.datos.FECHA_PROGRAMADA_SOT_2023E2 != null) && (data.datos.DIR_PROGRAMADA_SOT_2023E2 != "" && data.datos.DIR_PROGRAMADA_SOT_2023E2 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<br><span class = "piePagina">Esta información se actualiza cada 24 horas y el lugar y/o fecha podrían variar por situaciones extraordinarias. Por favor ingresa <a href="https://www.gob.mx/becasbenitojuarez/articulos/segundo-pago-de-becas-benito-juarez-2023" target="_blank">aquí</a> para corroborar la programación estatal y/o consulta directamente en tu plantel.</span><br>';
										}
									}
								}
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							} else if (emCinco == 1 && data.datos.PROGRAMA != "BASICA") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "mayo2023()" id = "spanSuperior" style="cursor: pointer">Segunda Emisión \u25B6</span>' +
									'<div id = "verMayo" style="display: none">' +
									'<div class="timeline-item">' +
									'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>' +
									'<span class = "normal">Tu CURP no estuvo activa en el padrón de personas beneficiarias durante esta emisión</span><br>';
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//FIN
							//TERCERA EMISION DEL 2023
							if (data.datos.EMISION_23EMISION3 == "1") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "septiembre2023()" id = "spanSuperior" style="cursor: pointer">Tercera Emisión \u25B6</span>' +
									'<div id = "verSeptiembre2023" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_23EMISION3 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_23EMISION3 == "0" || data.datos.PAGADO_23EMISION3 == "") && (data.datos.ESTATUS_PAGO_23EMISION3 != "NO PAGADA" && data.datos.ESTATUS_PAGO_23EMISION3 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_23EMISION3 == "0" || data.datos.PAGADO_23EMISION3 == "") && (data.datos.ESTATUS_PAGO_23EMISION3 == "NO PAGADA" || data.datos.ESTATUS_PAGO_23EMISION3 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_23EMI3 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_23EMISION3 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_23EMISION3 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_23EMISION3 != "NO PAGADA" && data.datos.ESTATUS_PAGO_23EMISION3 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_23EMI3 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_23EMISION3 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">' + data.datos.FECHA_PAGO_23EMISION3 + '</span></span><br>';
										} else if ((data.datos.PAGADO_23EMISION3 == "0" || data.datos.PAGADO_23EMISION3 == "") && (data.datos.FECHA_PAGO_23EMISION3 != "" && data.datos.FECHA_PAGO_23EMISION3 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">Recibiras tu pago a partir del ' + data.datos.FECHA_PAGO_23EMISION3 + '</span></span><br>';
										} else {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">PENDIENTE</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE3(data.datos.PERIODOS_23EMISION3) + '</span></span><br>';
									} else {
										//
										if ((data.datos.PAGADO_23EMISION3 != "1") &&
											(data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != "" && data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != null) && (data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != "" && data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<span class = "bold">Fecha y lugar programado para la entrega: <span class = "normal">' + data.datos.FECHA_PROGRAMADA_SOT_23EMI3 + ' ' + data.datos.DIR_PROGRAMADA_SOT_23EMISION3 + '</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE3(data.datos.PERIODOS_23EMISION3) + '</span></span><br>';
										if ((data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != "" && data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != null) && (data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != "" && data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<br><span class = "piePagina">Esta información se actualiza cada 24 horas y el lugar y/o fecha podrían variar por situaciones extraordinarias. Por favor ingresa <a href="https://www.gob.mx/becasbenitojuarez/articulos/segundo-pago-de-becas-benito-juarez-2023" target="_blank">aquí</a> para corroborar la programación estatal y/o consulta directamente en tu plantel.</span><br>';
										}
									}
								}
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							} else if (emSeis == 1 && data.datos.PROGRAMA != "BASICA") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "septiembre2023()" id = "spanSuperior" style="cursor: pointer">Tercera Emisión \u25B6</span>' +
									'<div id = "verSeptiembre2023" style="display: none">' +
									'<div class="timeline-item">' +
									'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>' +
									'<span class = "normal">Tu CURP no estuvo activa en el padrón de personas beneficiarias durante esta emisión</span><br>';
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//Primera emision 2024
							if (data.datos.EMISION_24EMISION1 == "1") {
								contenido = contenido +
									'</div>' +
									'<div class = "col-12" style = "display: none" id = "pagos2024">' +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "enero2024()" id = "spanSuperior" style="cursor: pointer">Primera Emisión \u25B6</span>' +
									'<div id = "verEnero2024" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_24EMISION1 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_24EMISION1 == "0" || data.datos.PAGADO_24EMISION1 == "") && (data.datos.ESTATUS_PAGO_24EMISION1 != "NO PAGADA" && data.datos.ESTATUS_PAGO_24EMISION1 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_24EMISION1 == "0" || data.datos.PAGADO_24EMISION1 == "") && (data.datos.ESTATUS_PAGO_24EMISION1 == "NO PAGADA" || data.datos.ESTATUS_PAGO_24EMISION1 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_24EMI1 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_24EMI1 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_24EMISION1 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_24EMISION1 != "NO PAGADA" && data.datos.ESTATUS_PAGO_24EMISION1 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_24EMI1 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_24EMISION1 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">' + data.datos.FECHA_PAGO_24EMISION1 + '</span></span><br>';
										} else if ((data.datos.PAGADO_24EMISION1 == "0" || data.datos.PAGADO_24EMISION1 == "") && (data.datos.FECHA_PAGO_24EMISION1 != "" && data.datos.FECHA_PAGO_24EMISION1 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">Recibiras tu pago a partir del ' + data.datos.FECHA_PAGO_24EMISION1 + '</span></span><br>';
										}
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_24EMISION1=="-1" || (data.datos.PERIODOS_24EMISION1+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2024</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12024(data.datos.PERIODOS_24EMISION1) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12024(data.datos.PERIODOS_24EMISION1) + '</span></span><br>';
										}
									} else {
										//
										if ((data.datos.PAGADO_24EMISION1 != "1") &&
											(data.datos.FECHA_PROGRAMADA_SOT_24EMI1 != "" && data.datos.FECHA_PROGRAMADA_SOT_24EMI1 != null) && (data.datos.DIR_PROGRAMADA_SOT_24EMISION1 != "" && data.datos.DIR_PROGRAMADA_SOT_24EMISION1 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<span class = "bold">Fecha y lugar programado para la entrega: <span class = "normal">' + data.datos.FECHA_PROGRAMADA_SOT_24EMI1 + ' ' + data.datos.DIR_PROGRAMADA_SOT_24EMISION1 + '</span></span><br>';
										}
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_24EMISION1=="-1" || (data.datos.PERIODOS_24EMISION1+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2024</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12024(data.datos.PERIODOS_24EMISION1) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12024(data.datos.PERIODOS_24EMISION1) + '</span></span><br>';
										}										
										if ((data.datos.FECHA_PROGRAMADA_SOT_24EMI1 != "" && data.datos.FECHA_PROGRAMADA_SOT_24EMI1 != null) && (data.datos.DIR_PROGRAMADA_SOT_24EMISION1 != "" && data.datos.DIR_PROGRAMADA_SOT_24EMISION1 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<br><span class = "piePagina">Esta información se actualiza cada 24 horas y el lugar y/o fecha podrían variar por situaciones extraordinarias. Por favor ingresa <a href="https://www.gob.mx/becasbenitojuarez/articulos/segundo-pago-de-becas-benito-juarez-2023" target="_blank">aquí</a> para corroborar la programación estatal y/o consulta directamente en tu plantel.</span><br>';
										}
									}
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}

							//Segunda emision 2024
							if (data.datos.EMISION_24EMISION2 == "1") {
								contenido = contenido +									
									'<div class = "separador">' +
									'<span class = "bold" onClick = "dicembre2024()" id = "spanSuperior" style="cursor: pointer">Segunda Emisión \u25B6</span>' +
									'<div id = "verDiciembre2024" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_24EMISION2 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_24EMISION2 == "0" || data.datos.PAGADO_24EMISION2 == "") && (data.datos.ESTATUS_PAGO_24EMISION2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_24EMISION2 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_24EMISION2 == "0" || data.datos.PAGADO_24EMISION2 == "") && (data.datos.ESTATUS_PAGO_24EMISION2 == "NO PAGADA" || data.datos.ESTATUS_PAGO_24EMISION2 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_24EMI2 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_24EMI2 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_24EMISION2 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_24EMISION2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_24EMISION2 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_24EMI2 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_24EMISION2 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">' + data.datos.FECHA_PAGO_24EMISION2 + '</span></span><br>';
										} else if ((data.datos.PAGADO_24EMISION2 == "0" || data.datos.PAGADO_24EMISION2 == "") && (data.datos.FECHA_PAGO_24EMISION2 != "" && data.datos.FECHA_PAGO_24EMISION2 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">Recibiras tu pago a partir del ' + data.datos.FECHA_PAGO_24EMISION2 + '</span></span><br>';
										}
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_24EMISION2=="-1" || (data.datos.PERIODOS_24EMISION2+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2024</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22024(data.datos.PERIODOS_24EMISION2) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22024(data.datos.PERIODOS_24EMISION2) + '</span></span><br>';
										}
									} else {
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_24EMISION2=="-1" || (data.datos.PERIODOS_24EMISION2+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2024</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22024(data.datos.PERIODOS_24EMISION2) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22024(data.datos.PERIODOS_24EMISION2) + '</span></span><br>';
										}
									}
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}


							
							//INICIA 1ERA EMISION 2025
							
							//Primera emision 2025
							if (data.datos.EMISION_25EMISION1 == "1") {
								contenido = contenido +		
								'</div>' +
									'<div class = "col-12" style = "display: none" id = "pagos2025">' +							
									'<div class = "separador">' +
									'<span class = "bold" onClick = "enero2025()" id = "spanSuperior" style="cursor: pointer">Primera Emisión \u25B6</span>' +
									'<div id = "verEnero2025" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_25EMISION1 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_25EMISION1 == "0" || data.datos.PAGADO_25EMISION1 == "") && (data.datos.ESTATUS_PAGO_25EMISION1 != "NO PAGADA" && data.datos.ESTATUS_PAGO_25EMISION1 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_25EMISION1 == "0" || data.datos.PAGADO_25EMISION1 == "") && (data.datos.ESTATUS_PAGO_25EMISION1 == "NO PAGADA" || data.datos.ESTATUS_PAGO_25EMISION1 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_25EMI1 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_25EMI1 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_25EMISION1 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_25EMISION1 != "NO PAGADA" && data.datos.ESTATUS_PAGO_25EMISION1 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_25EMI1 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_25EMISION1 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">' + data.datos.FECHA_PAGO_25EMISION1 + '</span></span><br>';
										} else if ((data.datos.PAGADO_25EMISION1 == "0" || data.datos.PAGADO_25EMISION1 == "") && (data.datos.FECHA_PAGO_25EMISION1 != "" && data.datos.FECHA_PAGO_25EMISION1 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">Recibirás tu pago a partir del ' + data.datos.FECHA_PAGO_25EMISION1 + '</span></span><br>';
										}
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_25EMISION1=="-1" || (data.datos.PERIODOS_25EMISION1+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2025</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12025(data.datos.PERIODOS_25EMISION1) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12025(data.datos.PERIODOS_25EMISION1) + '</span></span><br>';
										}
									} else {
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_25EMISION1=="-1" || (data.datos.PERIODOS_25EMISION1+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2024</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12025(data.datos.PERIODOS_25EMISION1) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE12025(data.datos.PERIODOS_25EMISION1) + '</span></span><br>';
										}
									}
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//TERMINA EMISION 1 DE 2025


							//INICIA 2DA EMISION 2025

							//Segunda emision 2025
							if (data.datos.EMISION_25EMISION2 == "1") {
								contenido = contenido +									
									'<div class = "separador">' +
									'<span class = "bold" onClick = "abril2025()" id = "spanSuperior" style="cursor: pointer">Segunda Emisión \u25B6</span>' +
									'<div id = "verAbril2025" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_25EMISION2 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_25EMISION2 == "0" || data.datos.PAGADO_25EMISION2 == "") && (data.datos.ESTATUS_PAGO_25EMISION2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_25EMISION2 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_25EMISION2 == "0" || data.datos.PAGADO_25EMISION2 == "") && (data.datos.ESTATUS_PAGO_25EMISION2 == "NO PAGADA" || data.datos.ESTATUS_PAGO_25EMISION2 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_25EMI2 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_25EMI2 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_25EMISION2 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_25EMISION2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_25EMISION2 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_25EMI2 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_25EMISION2 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">' + data.datos.FECHA_PAGO_25EMISION2 + '</span></span><br>';
										} else if ((data.datos.PAGADO_25EMISION2 == "0" || data.datos.PAGADO_25EMISION2 == "") && (data.datos.FECHA_PAGO_25EMISION2 != "" && data.datos.FECHA_PAGO_25EMISION2 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depósito: <span class = "normal">Recibiras tu pago a partir del ' + data.datos.FECHA_PAGO_25EMISION2 + '</span></span><br>';
										}
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_25EMISION2=="-1" || (data.datos.PERIODOS_25EMISION2+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2024</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22025(data.datos.PERIODOS_25EMISION2) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22025(data.datos.PERIODOS_25EMISION2) + '</span></span><br>';
										}
									} else {
										if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null && (data.datos.PERIODOS_25EMISION2=="-1" || (data.datos.PERIODOS_25EMISION2+0)==-1)){
											if(data.datos.FAMILIA=="12471994" ||(data.datos.FAMILIA+0)==12471994){
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal"> MAYO 2019 a JUNIO 2024</span></span><br>';
											}else{
												contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22025(data.datos.PERIODOS_25EMISION2) + '</span></span><br>';
											}
										}else{
											contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE22025(data.datos.PERIODOS_25EMISION2) + '</span></span><br>';
										}
									}
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							
							// TERMINA 2DA EMISION 2025//
							//FIN
							contenido = contenido +
								'</div>' + //Div cierra style
								'</div>' + //
								'</div>' +
								'</div>'; //Div que cierra al row
							//} 
							}
						//Fin apartado emisiones pendientes
						//Apartado del historial de solicitudes						
						if (data.HISTORIAL_CITAS.length > 0 || data.HISTORIAL_FORMULARIOS.length > 0 || (data.datos.CAMBIO_TUTOR != "" && data.datos.PROGRAMA == "BASICA") || data.datos.ATENCION_TELEFONO.length > 0 || (no_pendiente == 0 && data.datos.CONTADOR_CITAS_SUCURSAL.length > 1)) {
							var citas_elements = data.HISTORIAL_CITAS;
							var forms_elements = data.HISTORIAL_FORMULARIOS;
							var tutor_elements = data.datos.CAMBIO_TUTOR;
							var telefono_elements = data.datos.ATENCION_TELEFONO;
							//Bandera de control de los formularios 
							var bienestar = 0;
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/solicitudes.svg">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Historial de Atención</span><br>' +
								'</div>' +
								'</div>' +
								'<div class = "row">' +
								'<span class = "mostrar normal" onClick = "mostrarHistorial()" id = "spanHistorial">Ver \u25B6</span>' +
								'<div id = "historial" style="display: none; text-align: justify" class = "col-12">' +
								'<br>' +
								'<br>';
							//Historial de citas
							if (data.HISTORIAL_CITAS.length > 0) {
								contenido = contenido +
									'<details>' +
									'<summary><span class = "normal detalles">Atención presencial</summary></span>' +
									'<div class = "contenedorPadreHistorial">';
								citas_elements.forEach(element => {
									contenido = contenido +
										'<div class = "row" style="display: flex; align-items: start; justify-content: center;">' +
										'<div class = "col-md-10">' +
										'<div class = "contenedorHistorial">' +
										'<details>' +
										'<summary><span class = "normal">' + element.tituloServicio + ' <br>' + element.horarioAtencionCita + '</summary></span>' +
										'<br>' +
										'<span class = "normal">SARE: ' + element.nombreSare + '<br>';
									if (element.modificaRegistro != 0 && element.modificaRegistro != "" && element.modificaRegistro != null) {
										contenido = contenido +
											'CUPO del operador: ' + element.modificaRegistro + '<br>';
									}
									contenido = contenido +
										'<br>Estatus: ' + element.estatusDescribe + '<br>' +
										'Folio: ' + element.folioCita + '<br>' +
										'</span>' +
										'</details>' +
										'</div>' +
										'</div>' +
										'</div>';
								});
								contenido = contenido +
									'</div>' +
									'</details>';
							}
							if (data.HISTORIAL_FORMULARIOS.length > 0) {
								contenido = contenido +
									'<details>' +
									'<summary><span class = "normal detalles">Ventanilla Virtual de Atención Ciudadana</summary></span>' +
									'<div class = "contenedorPadreHistorial">';
								forms_elements.forEach(element => {
									contenido = contenido +
										'<div class = "row" style="display: flex; align-items: start; justify-content: center;">' +
										'<div class = "col-md-10">' +
										'<div class = "contenedorHistorial">' +
										'<details>' +
										'<summary><span class = "normal">Formulario: ' + element.FORMULARIO + '</summary></span>' +
										'<br>' +
										'<span class = "normal">Fecha: ' + element.FECHA_CAPTURA + '<br>' +
										'Estatus: Recibido<br>' +
										'</span>' +
										'</details>' +
										'</div>' +
										'</div>' +
										'</div>';
										//Validacion para el historial de formularios
										if(element.FORMULARIO == "FUI A LA CITA PARA RECIBIR MI TARJETA, PERO NO ME ATENDIERON"){
											bienestar++;
										}
								});
								contenido = contenido +
									'</div>' +
									'</details>';
							}
							//Cambio tutor
							if (data.datos.PROGRAMA == "BASICA") {
								if (data.datos.CAMBIO_TUTOR.length > 0) {
									contenido = contenido +
										`<details>` +
										`<summary><span class = "normal detalles">Cambio de Representante de Familia</summary></span>` +
										`<div class = "contenedorPadreHistorial">`;
									tutor_elements.forEach(element => {
										contenido = contenido +
											'<div class = "row" style="display: flex; align-items: start; justify-content: center;">' +
											'<div class = "col-md-10">' +
											'<div class = "contenedorHistorial">' +
											`<details>` +
											`<summary><span class = "normal">Solicitud de cambio</summary></span>` +
											`<br>` +
											`<span class = "normal">Fecha: ${element.FECHA_CAMBIO}<br><br>` +
											`Estatus de la solicitud: ${element.ESTATUS_SOLICITUD}<br>`;
										if (element.CURP_ANTERIOR_TUTOR == null || element.CURP_ANTERIOR_TUTOR == "") {
											contenido = contenido +
												`CURP del anterior Representante de Familia: NO REGISTRADO<br>`;
										} else {
											contenido = contenido +
												`CURP del anterior Representante de Familia: ${element.CURP_ANTERIOR_TUTOR}<br>`;
										}
										contenido = contenido +
											`CURP del nuevo Representante de Familia: ${element.CURP_NUEVO_TUTOR}<br><br>` +
											`Folio ficha de atención: ${element.FOLIO_SOLICITUD}<br>` +
											`</span>` +
											`</details>` +
											`</div>` +
											'</div>' +
											`</div>`;
									});
									contenido = contenido +
										'</div>' +
										'</details>';
								}
							}

							if (data.datos.ATENCION_TELEFONO.length > 0) {
								contenido = contenido +
									`<details>` +
									`<summary><span class = "normal detalles">Atención telefónica</summary></span>` +
									`<div class = "contenedorPadreHistorial">`;
								telefono_elements.forEach(element => {
									contenido = contenido +
										'<div class = "row" style="display: flex; align-items: start; justify-content: center;">' +
										'<div class = "col-md-10">' +
										'<div class = "contenedorHistorial">' +
										`<details>` +
										`<summary><span class = "normal">Atención</summary></span>` +
										`<br>` +
										`<span class = "normal">Fecha de atención: ${element.FECHA_SOLICITUD}<br>`;
									if (element.CUPO_PERSONAL != 0) {
										contenido = contenido +
											`<span class = "normal">Identificador del operador tecnico: ${element.CUPO_PERSONAL}<br>`;
									}
									contenido = contenido +
										`Estatus de la solicitud: ${element.ESTATUS_SOLICITUD}<br>` +
										`Folio de la solicitud: ${element.FOLIO_SOLICITUD}<br>` +
										`</span>` +
										`</details>` +
										`</div>` +
										'</div>' +
										`</div>`;
								});
								contenido = contenido +
									'</div>' +
									'</details>';
							}
							//Formulario sin responder y pendiente de entrega
							if (bienestar == 0 && no_pendiente == 0 && data.datos.CONTADOR_CITAS_SUCURSAL.length > 1) {
								var citas_contador = data.datos.CONTADOR_CITAS_SUCURSAL;
								contenido = contenido +
									`<details>` +
									`<summary><span class = "normal detalles">Programación de entrega de tarjeta del Banco del Bienestar</summary></span>` +
									`<div class = "contenedorPadreHistorial">`;
									citas_contador.forEach(element => {
									contenido = contenido +
										'<div class = "row" style="display: flex; align-items: start; justify-content: center;">' +
										'<div class = "col-md-10">' +
										'<div class = "contenedorHistorial">' +
										`<details>` +
										`<summary><span class = "normal">Cita en sucursal para entrega de tarjeta </summary></span>` +
										`<br>` +
										`<span class = "normal">` +
										`Fecha y hora: ${element.HORARIO} <br>` +
										`Sucursal: ${element.SUCURSAL} <br>` +
										'Estatus: No asistió<br>' +
										`</span>` +
										`</details>` +
										`</div>` +
										'</div>' +
										`</div>`;
								});
								contenido = contenido +
									'</div>' +
									'</details>';
							}


							//Historial de formularios
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//Fin historial 
						//Apartado de causal y fundamentacion en caso de bajas 
						if (status == "BAJA") {
							//Modulo Fundamentacion
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/script.svg">' +
								'</div>' +
								'<div class="col-9 resultado-text">';
							if (data.datos.ETIQUETA_BAJA != "" && data.datos.ETIQUETA_BAJA != null) {
								contenido = contenido +
									'<div class="row">' +
									//Nuevo
									'<div class = "contenedor_Baja"><span class = "etiqueta_Baja"><b>' + data.datos.ETIQUETA_BAJA + '</b></span></div>' +
									'</div>' +
									'<br>';
							}
							if (data.datos.EJERCICIO_FISCAL_BAJA != "" && data.datos.EJERCICIO_FISCAL_BAJA != null && data.datos.EJERCICIO_FISCAL_BAJA != "S/E") {
								contenido = contenido +
									'<div class = "row">' +
									'<span class = "normal">Ejercicio Fiscal de la Baja: <b>' + data.datos.EJERCICIO_FISCAL_BAJA + '</b></span>' +
									'</div>' +
									'<br>';
							}
							if (data.datos.EXPLICACION_MOTIVO_BAJA != "" && data.datos.EXPLICACION_MOTIVO_BAJA != null) {
								contenido = contenido +
									'<div class = "row">' +
									'<span class = "normal">Motivo de baja: <b>' + data.datos.EXPLICACION_MOTIVO_BAJA + '</b></span>' +
									'</div>' +
									'<br>';
							}
							contenido = contenido +
								'<div class = "row">' +
								'<span class = "normal">Fundamentación: <b>' + data.datos.FUNDAMENTACION + '</b></span>' +
								'</div>' +
								//Fin
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
							//Fin modulo fundamentacion 
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/email.svg">' +
								'</div>' +
								'<div class="col-9 resultado-text">' +
								'<div class="row">' +
								'<span class = "normal">¿Quieres hacer una aclaración?</span>' +
								'</div>' +
								'<div class="row pt-2">' +
								'<span class = "normal">Marca desde cualquier parte del país a Atención Ciudadana de la Coordinación Nacional al número 55 1162 0300, en un horario de atención de lunes a viernes de 08:00 a 22:00 horas y sábado de 9:00 a 14:00 horas (hora del centro de México)</span>' +
								'</div>' +
								'<div class="row pt-2">' +
								'<span class = "normal">Consulta las Reglas de Operación de los Programas de la Coordinación Nacionalde Becas Benito Juárez</span>' +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//
						//Apartado del buzon de mensajes 
						if (status == "CAMBIO TITULAR") {
							//Mensaje unico para aquellas familias en situación de cambio de representante de familia.
							contenido = contenido + buzonHeader();
							let mensaje_Contador = 0;
							mensaje_Contador = mensaje_Contador + 1;
							contenido = contenido +
								'<details>' +
								'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + ': <b>Pendientes actualización de representante de familia</b></span></summary>';
							contenido = contenido +
								'<span class = "normal">' +
								'Debes completar el cambio de representante de familia. Cualquier cambio en tu estatus se reflejará en la próxima emisión de apoyos. En caso de que tengas becas pendientes, esta información se actualizará automáticamente.</br><b>¡Mantente al pendiente!</b>' +
								'</span>';
							contenido = contenido +
								'</details>';
							contenido = contenido + buzonPie();							
						}
						else if (status == "VERIFICACION RENAPO") {
							//Mensaje unico para aquellas familias que requieren validar su CURP
							contenido = contenido + buzonHeader();
							let mensaje_Contador = 0;
							mensaje_Contador = mensaje_Contador + 1;
							contenido = contenido +
								'<details>' +
								'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + ': <b>Pendiente de validar tu CURP con RENAPO</b></span></summary>';
							contenido = contenido +
								'<span class = "normal">' +
								'Debes acudir a RENAPO para verificar que tu CURP esté certificada por el Registro Civil. Cualquier cambio en tu estatus se reflejará en la próxima emisión de apoyos. En caso de que tengas becas pendientes, esta información se actualizará automáticamente.</br><b>¡Mantente al pendiente!</b>' +
								'</span>';
							contenido = contenido +
								'</details>';
							contenido = contenido + buzonPie();							
						}
						else 
						if (/*(data.datos.OTIS == "1" && data.datos.OTIS_MENSAJE != "") ||*/ comparauniverso(universosArray, "1", "igual") == "1" || comparauniverso(universosArray, "8", "igual") == "1" ||
							(comparauniverso(universosArray, "11", "igual") == "1") || (comparauniverso(universosArray, "13", "igual") == "1") || (comparauniverso(universosArray, "15", "igual") == "1") || (comparauniverso(universosArray, "16", "igual") == "1")) {
							contenido = contenido + buzonHeader();
							let mensaje_Contador = 0;
							//Nuevos
							if ((comparauniverso(universosArray, "11", "igual") == "1") && data.datos.PROGRAMA == 'BASICA') {
								mensaje_Contador = mensaje_Contador + 1;
								contenido = contenido +
									'<details>' +
									'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + '</span></summary>';
								contenido = contenido +
									'<span class = "normal">' +
									'<b>¡Felicidades</b>, ya formas parte de la <b>Beca para el Bienestar Benito Juárez de Educación Básica</b>!<br>Revisa la sección <a href = "#bancarizacion_modulo" class = "info detalles mensajes">Bancarización</a><b>, ¡tenemos información MUY importante para ti!</b> ' +
									'</span>';
								contenido = contenido +
									'</details>';
							}
							//Rezagos
							if ((comparauniverso(universosArray, "13", "igual") == "1")) {
								mensaje_Contador = mensaje_Contador + 1;
								contenido = contenido +
									'<details>' +
									'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + '</span></summary>';
								contenido = contenido +
									'<span class = "normal">' +
									'<b>¡Te estamos buscando!</b><br><br>Revisa la sección <a href = "#bancarizacion_modulo" class = "info detalles mensajes">Bancarización</a><b>, ¡tenemos información MUY importante sobre tu tarjeta!</b>' +
									'</span>';
								contenido = contenido +
									'</details>';
							}
							/*if (data.datos.OTIS == "1") {
								mensaje_Contador = mensaje_Contador + 1;
								contenido = contenido +
									'<details>' +
									'<summary><span class = "info detalles">Mensaje ' + mensaje_Contador + '</span></summary>';
								if (data.datos.PROGRAMA == "BASICA") {
									contenido = contenido +
										'<span class = "normal">' +
										'¡Tu beca está lista! <br><br> Tu familia ha sido incorporada al programa en el marco del Plan General de Reconstrucción y Apoyo a la Población Afectada en Acapulco de Juárez y Coyuca de Benítez por el huracán “Otis”. <br><br>' +
										'Debido a la contingencia, tu familia recibirá la primera emisión de la beca, correspondiente a septiembre, octubre, noviembre y diciembre ($3,500 en total), a través de una Orden de Pago para cobro en ventanilla del Banco del Bienestar y posteriormente te entregaremos tu tarjeta. <br><br> Preséntate de 9:00 am a 15:00 pm en:<br><br>' +
										'Sede: ' + data.datos.SEDE_OPERATIVA_TEMPORAL_OTIS + '<br>Fecha de atención: ' + data.datos.FECHA_ATENCION_OTIS + '<br><br>' +
										'Consulta <a href = "https://www.gob.mx/becasbenitojuarez/es/articulos/acciones-del-plan-general-de-reconstruccion-y-apoyo-a-la-poblacion-afectada-en-acapulco-y-coyuca-de-benitez-por-el-huracan-otis" target = "_blank">aquí</a> la documentación que necesitas para recibirla<br><br>' +
										'No te preocupes si te falta algún documento, preséntate el día asignado al menos con una identificación oficial. ' +
										'</span>';
								} else if (data.datos.PROGRAMA == "JEF" || data.datos.PROGRAMA == "BUEEMS") {
									contenido = contenido +
										'<span class = "normal">' +
										'¡Tu beca está lista! <br><br> Debido a la contingencia y en el marco del Plan General de Reconstrucción y Apoyo a la Población Afectada en Acapulco de Juárez y Coyuca de Benítez por el huracán “Otis”, recibirás la primera emisión de tu beca, correspondiente a septiembre, octubre, noviembre y diciembre, a través de una Orden de Pago para cobro en ventanilla del Banco del Bienestar y posteriormente te entregaremos tu tarjeta. <br><br>' +
										'Preséntate de 9:00 am a 15:00 pm en:<br><br> Sede: ' + data.datos.SEDE_OPERATIVA_TEMPORAL_OTIS + '<br>Fecha de atención: ' + data.datos.FECHA_ATENCION_OTIS + '<br><br>' +
										'Consulta <a href = "https://www.gob.mx/becasbenitojuarez/es/articulos/acciones-del-plan-general-de-reconstruccion-y-apoyo-a-la-poblacion-afectada-en-acapulco-y-coyuca-de-benitez-por-el-huracan-otis" target = "_blank">aquí</a> la documentación que necesitas para recibirla<br><br>' +
										'No te preocupes si te falta algún documento, preséntate el día asignado al menos con una identificación. Si eres menor de edad, asiste con tu mamá, papá, tutora, tutor, abuela, abuelo, hermana o hermano mayores de edad y su identificación oficial. ' +
										'</span>';
								}
								contenido = contenido +
									'</details>';
							}*/
							if (comparauniverso(universosArray, "1", "igual") == "1") {
								mensaje_Contador = mensaje_Contador + 1;
								contenido = contenido +
									'<details>' +
									'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + '</span></summary>';
								formulario10 = formulario10 + 1;
								contenido = contenido +
									'<span class = "normal">' +
									'Para cobrar tus becas pendientes, debes completar tu documentación.<br>Ingresa a la <b>Ventanilla Virtual</b> ubicada al final de esta sección, da clic en el formulario <b>“Quiero completar mi documentación para cobrar mis becas pendientes”</b>, registra tus datos y pronto nos pondremos en contacto contigo. <b>¡Mantente al pendiente de tu correo electrónico!</b>' +
									'</span>';
								contenido = contenido +
									'</details>';
							}
							if (comparauniverso(universosArray, "8", "igual") == "1") {
								mensaje_Contador = mensaje_Contador + 1;
								contenido = contenido +
									'<details>' +
									'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + '</span></summary>';
								formulario10 = formulario10 + 1;
								contenido = contenido +
									'<span class = "normal">' +
									'Tu familia ya no forma parte del Programa de Becas para el Bienestar Benito Juárez de Educación Básica, debido a que no se encontró una inscripción en escuela prioritaria o susceptible del ciclo escolar vigente de las y los estudiantes registrados.<br><br>' +
									'En septiembre de 2024 comenzarán los ciclos de incorporación a la Beca Benito Juárez de Educación Básica. <br>Mantente al pendiente de la convocatoria en nuestras redes sociales verificadas y página web.' +
									'</span>';
								contenido = contenido +
									'</details>';
							}

							if (comparauniverso(universosArray, "15", "igual") == "1") {
								mensaje_Contador = mensaje_Contador + 1;
								contenido = contenido +
									'<details>' +
									'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + ': ¡Muchas felicidades!</span></summary>';
								formulario10 = formulario10 + 1;
								contenido = contenido +
									'<span class = "normal">' +
									'El registro a la Beca “Rita Cetina” se realizó con éxito. <br><br>Mantente al pendiente de la información que publiquemos para conocer el siguiente paso.<br><br> ' +									
									'</span>';
								contenido = contenido +
									'</details>';
							}

							if (comparauniverso(universosArray, "16", "igual") == "1") {
								mensaje_Contador = mensaje_Contador + 1;
								contenido = contenido +
									'<details>' +
									'<summary><span class = "info detalles mensajes">Mensaje ' + mensaje_Contador + ': ¡Urgente!</span></summary>';
								formulario10 = formulario10 + 1;
								contenido = contenido +
									'<span class = "normal">' +
									'Detectamos que todavía no realizas el registro a la Beca “Rita Cetina” para estudiantes de secundaria. <br><br>Hazlo antes del miércoles 18 de diciembre en la página: <br><a href=\'https://www.becaritacetina.gob.mx/\' target=\'_blank\'>becaritacetina.gob.mx</a><br><br>¡No pierdas la oportunidad de tener la beca!' +																		
									'</span>';
								contenido = contenido +
									'</details>';
							}
							contenido = contenido + buzonPie();
						}
						//Para los formularios 6,7 y 8, las reglas se validaran al final
						/*
						CRITERIOS (CON BASE AL OFICIO ENVIADO)
						Criterios formulario 6 -> BASICA, ACTIVO 
						Criterios formulario 7 -> BASICA O BUEEMS Y ACTIVO
						Criterios formulario 8 -> BASICA, BUEEMS O JEF, MENORES DE EDAD Y ACTIVOS 
						 */
						let formulario6 = 0;
						let formulario7 = 0;
						let formulario8 = 0;
						//Formulario 6
						if (data.datos.PROGRAMA == "BASICA" && data.datos.SITUACION_INSCRIPCION_ACTUAL == "ACTIVA") {
							formulario6 = formulario6 + 1;
						}
						//Formulario 7
						if ((data.datos.PROGRAMA == "BASICA" || data.datos.PROGRAMA == "BUEEMS") && data.datos.SITUACION_INSCRIPCION_ACTUAL == "ACTIVA") {
							formulario7 = formulario7 + 1;
						}
						//Formulario 8
						//Para saber si es menor o mayor de edad
						let nacimiento = data.datos.FECHA_NACIMIENTO_BECARIO;
						//Fecha de nacimiento en milisegundos
						let nacimiento_milisegundos = formularioTiempo(nacimiento);
						//Fecha al dia de hoy en milisegundos
						var hoy = new Date();
						var local = hoy.toLocaleDateString();
						var habilitaFormulario = formularioTiempo(local);
						//18 años en milisegundos
						let años_milisegundos = 567648000000;
						//Diferencia en milisegundos de la cita con la fecha de nacimiento
						let residuo_milisegundos = habilitaFormulario - nacimiento_milisegundos;
						//Si el residuo es igual o menor a 18 años
						if ((residuo_milisegundos < años_milisegundos) && data.datos.SITUACION_INSCRIPCION_ACTUAL == "ACTIVA") {
							formulario8 = formulario8 + 1;
						}
						//Formulario para los universos de atencion del nuevo formulario 
						let form11 = 0;
						if (comparauniverso(universosArray, "7", "igual") == "1") {
							form11 = form11 + 1;
						}
						//El form 12 es para todos
						let form12 = 1;
						//Formulario participa y transforma (DGIT/0989/2024)
						let form13 = 1;
						if (formulario1 > 0 || formulario2 > 0 || formulario4 > 0 || formulario6 > 0 || formulario7 > 0 || formulario8 > 0 || formulario9 > 0 || formulario10 > 0 /*|| form11 > 0*/ || form12 > 0 || form13 > 0) {
							$.ajax({
								type: "POST",
								url: "https://buscador.becasbenitojuarez.gob.mx/consulta/metodos/procesadorFormularios.php",
								data: {
									formulario1: formulario1,
									formulario2: formulario2,
									//formulario3: formulario3,
									formulario4: formulario4,
									//formulario5: formulario5,
									formulario6: formulario6,
									formulario7: formulario7,
									formulario8: formulario8,
									formulario9: formulario9,
									formulario10: formulario10,
									//formulario11: form11,
									formulario12: form12,
									formulario13: form13,
								},
								dataType: "json",
								crossDomain: true,
								success: function (control) {
									let contenido = "";
									//console.log(control.CONTROLER);
									contenido = contenido +
										'<div class="row">' +
										'<div class="col-12 resultado-line">' +
										'<div class="row">' +
										'<div class="col-3 icon text-center">' +
										'<img src="img/iconosV4/atencion.svg">' +
										'</div>' +
										'<div class = "col-9 resultado-text">' +
										'<span class = "info">Entra a la <a href="https://buscador.becasbenitojuarez.gob.mx/consulta/formulario/tablero.php?tab=' + data.CODE + '&key=' + data.KEY + '&control=' + control.CONTROLER + '" target = "_blank">Ventanilla Virtual</a> de Atención Ciudadana y ponte en contacto con nosotros</span><br>' +
										//'<span class = "info">Entra a la <a href="http://172.23.11.239/buscadorbeneficiario-cambio-titular-06112024/formulario/tablero.php?tab=' + data.CODE + '&key=' + data.KEY + '&control=' + control.CONTROLER + '" target = "_blank">Ventanilla Virtual</a> de Atención Ciudadana y ponte en contacto con nosotros</span><br>' +
										'</div>' +
										'</div>' +
										'<div class = "row barra">' +
										'<div>' +
										'<br>' +
										'</div>' +
										'</div>' +
										'</div>';
									$("#formularios").html(contenido);
								}
							});
							contenido = contenido +
								'<div id="formularios"></div>';
						}
						contenido = contenido +
							'</div>' +
							'</div>' +
							'</div>';
						//Termina Aqui -------------------------------------

						/*if (popup > 0) {
							popupBancarizacion();
						}*/
						$("#resultado").html(contenido);
					} else if (data.status == 200 && data.datos.MENSAJE == "FAVOR DE INGRESAR EL CURP DEL BENEFICIARIO") {
						bootbox.dialog({
							centerVertical: true,
							message: "Favor de ingresar el CURP del beneficiario.",
							closeButton: true
						});
					}
				} else if (data.status == 422) {

					var error = data.message;
					var mensaje = "";
					for (var i in error) {
						var error_msg = error[i];
						mensaje = mensaje + error_msg + "<br>";

					}
					bootbox.dialog({
						centerVertical: true,
						message: mensaje,
						closeButton: true
					});

				} else if (data.status == 424) {
					bootbox.dialog({
						centerVertical: true,
						message: "DEBES DE RESOLVER EL CAPTCHA.",
						closeButton: true
					});

				} else if (data.status == 423) {
					bootbox.dialog({
						centerVertical: true,
						message: "El captcha no se resolvió de manera correcta.",
						closeButton: true
					});

				} else {
					bootbox.dialog({
						centerVertical: true,
						message: "¡Ocurrió un error al buscar el beneficiario!",
						closeButton: true
					});

				}
			},
			error: function (data) {
				console.log('Error:', data);
				//Habilitar timer 
				setTimeout(() => { $("#buscar").attr("disabled", false); }, "5000");
				setTimeout(() => { $("#text").attr("disabled", false); }, "5000");
				bootbox.dialog({
					centerVertical: true,
					message: "¡Ocurrió un error al buscar el beneficiario!",
					closeButton: true
				});
			},
			complete: function () {
				setTimeout(function () {
					$("#preloader").fadeOut(500);
				}, 200);
			}
		});
	}
	$("#buscar").on("click", function () {
		buscar_beneficiario();
	});
	$('[data-toggle="tooltip"]').tooltip();

});
//Muestra el apartado de bancarizacion
function mostrarBeca() {
	//Cerrar el div de la timeline y el div del buzon
	var divBecas = document.getElementById("becas");
	var divTarjeta = document.getElementById("tarjeta");
	if (divBecas != null) {
		if (divBecas.style.display === "block") {
			divBecas.style.display = "none";
			document.getElementById("spanBecas").textContent = "Ver \u25B6";
		}
	}
	if (divTarjeta != null) {
		if (divTarjeta.style.display === "block") {
			divTarjeta.style.display = "none";
			document.getElementById("spanTarjeta").textContent = "Ver \u25B6";
		}
	}
	//Abrir el otro div
	var divEmisiones = document.getElementById("beca");
	if (divEmisiones.style.display === "none") {
		divEmisiones.style.display = "block";
		document.getElementById("spanBeca").textContent = "Ocultar \u25BC";
	} else {
		divEmisiones.style.display = "none";
		document.getElementById("spanBeca").textContent = "Ver \u25B6";
	}
}
//Para mostrar Banco Azteca
//Abrir el otro div
function mostrarAzteca() {
	var divAzteca = document.getElementById("azteca");
	if (divAzteca.style.display === "none") {
		divAzteca.style.display = "block";
		document.getElementById("spanAzteca").textContent = "Ocultar \u25BC";
	} else {
		divAzteca.style.display = "none";
		document.getElementById("spanAzteca").textContent = "Ver \u25B6";
	}
}
//Fin 
//Para mostrar buzon
function mostrar() {
	//Cerrar el div de la timeline y el div de emisiones
	var divBecas = document.getElementById("becas");
	var divEmisiones = document.getElementById("emisiones");
	if (divBecas != null) {
		if (divBecas.style.display === "block") {
			divBecas.style.display = "none";
			document.getElementById("spanBecas").textContent = "Ver \u25B6";
		}
	}
	if (divEmisiones != null) {
		if (divEmisiones.style.display === "block") {
			divEmisiones.style.display = "none";
			document.getElementById("spanEmisiones").textContent = "Ver \u25B6";
		}
	}
	//Abrir el otro div
	var divTarjeta = document.getElementById("tarjeta");
	if (divTarjeta.style.display === "none") {
		divTarjeta.style.display = "block";
		document.getElementById("spanTarjeta").textContent = "Ocultar \u25BC";
	} else {
		divTarjeta.style.display = "none";
		document.getElementById("spanTarjeta").textContent = "Ver \u25B6";
	}

}
//Mostrar Historial 
function mostrarHistorial() {
	//Abrir el otro div
	var historial = document.getElementById("historial");
	if (historial.style.display === "none") {
		historial.style.display = "block";
		document.getElementById("spanHistorial").textContent = "Ocultar \u25BC";
	} else {
		historial.style.display = "none";
		document.getElementById("spanHistorial").textContent = "Ver \u25B6";
	}

}
//Elementos del buzon
function mensajeUno() {
	var divUno = document.getElementById("Uno");
	if (divUno.style.display === "block") {
		divUno.style.display = "none";
	} else if (divUno.style.display === "none") {
		divUno.style.display = "block";
	}
}

function mensajeDos() {
	var divDos = document.getElementById("Dos");
	if (divDos.style.display === "block") {
		divDos.style.display = "none";
	} else if (divDos.style.display === "none") {
		divDos.style.display = "block";
	}
}

function mensajeTres() {
	var divTres = document.getElementById("Tres");
	if (divTres.style.display === "block") {
		divTres.style.display = "none";
	} else if (divTres.style.display === "none") {
		divTres.style.display = "block";
	}
}

function mensajesContador(mensajes) {
	var mensajes = mensajes;
	var arrayContador = [["0", "0"], ["Uno", "1"], ["Dos", "2"], ["Tres", "3"], ["Cuatro", "4"], ["Cinco", "5"], ["Seis", "6"], ["Siete", "7"], ["Ocho", "8"],
	["Nueve", "9"]];
	var i = 0;
	do {
		var numero = arrayContador[i][1];
		var numeroEscrito = arrayContador[i][0];
		i = i + 1;
	} while (numero != mensajes);
	return numeroEscrito;
}
//Funciones para la version 5

function septiembre2023() {
	var divSeptiembre = document.getElementById("verSeptiembre2023");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function mayo2023() {
	var divMayo = document.getElementById("verMayo");
	if (divMayo.style.display === "block") {
		divMayo.style.display = "none";
	} else if (divMayo.style.display === "none") {
		divMayo.style.display = "block";
	}
}

function febrero2023() {
	var divSeptiembre = document.getElementById("verSeptiembre");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function febrero2022() {
	var divSeptiembre = document.getElementById("verFebrero2022");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function junio2022() {
	var divSeptiembre = document.getElementById("verJunio2022");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function septiembre2022() {
	var divSeptiembre = document.getElementById("verSeptiembre2022");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function enero2024() {
	var divEnero2024 = document.getElementById("verEnero2024");
	if (divEnero2024.style.display === "block") {
		divEnero2024.style.display = "none";
	} else if (divEnero2024.style.display === "none") {
		divEnero2024.style.display = "block";
	}
}
function dicembre2024() {
	var divDiciembre2024 = document.getElementById("verDiciembre2024");
	if (divDiciembre2024.style.display === "block") {
		divDiciembre2024.style.display = "none";
	} else if (divDiciembre2024.style.display === "none") {
		divDiciembre2024.style.display = "block";
	}
}

function enero2025() {
	var divEnero2025 = document.getElementById("verEnero2025");
	if (divEnero2025.style.display === "block") {
		divEnero2025.style.display = "none";
	} else if (divEnero2025.style.display === "none") {
		divEnero2025.style.display = "block";
	}
}

function abril2025() {
	var divAbril2025 = document.getElementById("verAbril2025");
	if (divAbril2025.style.display === "block") {
		divAbril2025.style.display = "none";
	} else if (divAbril2025.style.display === "none") {
		divAbril2025.style.display = "block";
	}
}
function pagos2022() {
	//Cerrar el div 2023
	var div2023 = document.getElementById("pagos2023");
	var div2024 = document.getElementById("pagos2024");
	var div2025 = document.getElementById("pagos2025");
	if (div2023 != null) {
		if (div2023.style.display === "block") {
			div2023.style.display = "none";
			$('#2023').css({ 'color': '#000000' });
			$('#div2023').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2024 != null) {
		if (div2024.style.display === "block") {
			div2024.style.display = "none";
			$('#2024').css({ 'color': '#000000' });
			$('#div2024').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2025 != null) {
		if (div2025.style.display === "block") {
			div2025.style.display = "none";
			$('#2025').css({ 'color': '#000000' });
			$('#div2025').css({ 'background-color': '#FFFFFF' });
		}
	}
	//Si no esta abierto
	var div2022 = document.getElementById("pagos2022");
	if (div2022.style.display === "none") {
		div2022.style.display = "block";
		//Cambiar color
		$('#2022').css({ 'color': '#FFFFFF' });
		$('#div2022').css({ 'background-color': '#611232' });
	} else {
		div2022.style.display = "none";
		$('#2022').css({ 'color': '#000000' });
		$('#div2022').css({ 'background-color': '#FFFFFF' });
	}

}
function pagos2023() {
	//Cerrar div de pagos 2022
	//Cerrar el div de la timeline y el div del buzon
	var div2022 = document.getElementById("pagos2022");
	var div2024 = document.getElementById("pagos2024");
	var div2025 = document.getElementById("pagos2025");
	if (div2022 != null) {
		if (div2022.style.display === "block") {
			div2022.style.display = "none";
			$('#2022').css({ 'color': '#000000' });
			$('#div2022').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2024 != null) {
		if (div2024.style.display === "block") {
			div2024.style.display = "none";
			$('#2024').css({ 'color': '#000000' });
			$('#div2024').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2025 != null) {
		if (div2025.style.display === "block") {
			div2025.style.display = "none";
			$('#2025').css({ 'color': '#000000' });
			$('#div2025').css({ 'background-color': '#FFFFFF' });
		}
	}
	//Abrir el correspondiente div
	var div2023 = document.getElementById("pagos2023");
	if (div2023.style.display === "none") {
		div2023.style.display = "block";
		//Cambiar color
		$('#2023').css({ 'color': '#FFFFFF' });
		$('#div2023').css({ 'background-color': '#611232' });
	} else {
		div2023.style.display = "none";
		$('#2023').css({ 'color': '#000000' });
		$('#div2023').css({ 'background-color': '#FFFFFF' });
	}
}

function pagos2024() {
	//Cerrar div de pagos 2022
	//Cerrar el div de la timeline y el div del buzon
	var div2022 = document.getElementById("pagos2022");
	var div2023 = document.getElementById("pagos2023");
	var div2025 = document.getElementById("pagos2025");
	if (div2022 != null) {
		if (div2022.style.display === "block") {
			div2022.style.display = "none";
			$('#2022').css({ 'color': '#000000' });
			$('#div2022').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2023 != null) {
		if (div2023.style.display === "block") {
			div2023.style.display = "none";
			$('#2023').css({ 'color': '#000000' });
			$('#div2023').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2025 != null) {
		if (div2025.style.display === "block") {
			div2025.style.display = "none";
			$('#2025').css({ 'color': '#000000' });
			$('#div2025').css({ 'background-color': '#FFFFFF' });
		}
	}
	//Abrir el correspondiente div
	var div2024 = document.getElementById("pagos2024");
	if (div2024.style.display === "none") {
		div2024.style.display = "block";
		//Cambiar color
		$('#2024').css({ 'color': '#FFFFFF' });
		$('#div2024').css({ 'background-color': '#611232' });
	} else {
		div2024.style.display = "none";
		$('#2024').css({ 'color': '#000000' });
		$('#div2024').css({ 'background-color': '#FFFFFF' });
	}
}

function pagos2025() {
	//Cerrar div de pagos 
	//Cerrar el div de la timeline y el div del buzon
	var div2022 = document.getElementById("pagos2022");
	var div2023 = document.getElementById("pagos2023");
	var div2024 = document.getElementById("pagos2024");
	if (div2022 != null) {
		if (div2022.style.display === "block") {
			div2022.style.display = "none";
			$('#2022').css({ 'color': '#000000' });
			$('#div2022').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2023 != null) {
		if (div2023.style.display === "block") {
			div2023.style.display = "none";
			$('#2023').css({ 'color': '#000000' });
			$('#div2023').css({ 'background-color': '#FFFFFF' });
		}
	}
	if (div2024 != null) {
		if (div2024.style.display === "block") {
			div2024.style.display = "none";
			$('#2024').css({ 'color': '#000000' });
			$('#div2024').css({ 'background-color': '#FFFFFF' });
		}
	}
	//Abrir el correspondiente div

	var div2025 = document.getElementById("pagos2025");
	if (div2025.style.display === "none") {
		div2025.style.display = "block";
		//Cambiar color
		$('#2025').css({ 'color': '#FFFFFF' });
		$('#div2025').css({ 'background-color': '#611232' });
	} else {
		div2025.style.display = "none";
		$('#2025').css({ 'color': '#000000' });
		$('#div2025').css({ 'background-color': '#FFFFFF' });
	}
}
//Grupo familar
function mostrarGrupo() {
	var divFamilia = document.getElementById("familia");
	if (divFamilia != null) {
		if (divFamilia.style.display === "block") {
			document.getElementById("Familia").textContent = "Ver \u25B6";
			divFamilia.style.display = "none";
		} else if (divFamilia.style.display === "none") {
			document.getElementById("Familia").textContent = "Ocultar \u25BC";
			divFamilia.style.display = "block";
		}
	}
}
//Documentacion bancarizacion. 
function mostrarDocumentos() {
	var divDocumentos = document.getElementById("documentos");
	if (divDocumentos != null) {
		if (divDocumentos.style.display === "block") {
			document.getElementById("Documentos").textContent = "Ver \u25B6";
			divDocumentos.style.display = "none";
		} else if (divDocumentos.style.display === "none") {
			document.getElementById("Documentos").textContent = "Ocultar \u25BC";
			divDocumentos.style.display = "block";
		}
	}
}

//Funcion formulario tiempo 
function formularioTiempo(fechaB) {
	let fecha = fechaB;
	//Separar la cadena 
	let inDia = fecha.indexOf("/");
	let dia = fecha.substring(0, inDia);
	let mes = fecha.substring(3, 5);
	let longitudPeriodo = fecha.length;
	let anio = fecha.substring(longitudPeriodo - 4, longitudPeriodo);
	var fechaAPI = anio + ", " + mes + ", " + dia;
	var convfecha = new Date(fechaAPI);
	convfecha.toLocaleDateString();
	var milifecha = Date.parse(convfecha);
	return milifecha;
}

function siglas(siglas) {
	let programaSiglas = siglas;
	let programaActual = "";
	switch (programaSiglas) {
		case 'BASICA':
			programaActual = "Becas de Educación Básica para el Bienestar Benito Juárez";
			break;
		case 'BUEEMS':
			programaActual = "Beca Universal para el Bienestar Benito Juárez de Educación Media Superior (BUEEMS)";
			break;
		case 'JEF':
			programaActual = "Beca para el Bienestar Benito Juárez de Educación Superior (JEF)";
			break;
	}
	return programaActual;
}


function separarLiquidadora(separar) {
	let liquidadora = separar;
	let resultados = [];
	if (liquidadora != "" && liquidadora != null && liquidadora != undefined) {
		let caracteres = liquidadora.indexOf("-");
		let mod = liquidadora.lenght;
		if (caracteres > 0) {
			var sub_Liquidadora = liquidadora.substring(0, caracteres).trim();
			var sub_Modalidad = liquidadora.substring(caracteres + 1, mod).trim();
			resultados.push(sub_Liquidadora);
			resultados.push(sub_Modalidad);
		}
	} else {
		var sub_Liquidadora = "";
		var sub_Modalidad = "";
		resultados.push(sub_Liquidadora);
		resultados.push(sub_Modalidad);
	}
	return resultados;
}

function tipoconversion(tipo_persona) {
	var tipo_persona = tipo_persona;
	switch (tipo_persona) {
		case '1':
			var texto = "Becario/a"
			return texto
		case '2':
			var texto = "Representante de la familia"
			return texto
		case '3':
			var texto = "Otro"
			return texto
	}
}

function imagen(programa) {
	let imagenPrograma = programa;
	switch (imagenPrograma) {
		case 'BASICA':
			imagenPrograma = "iconoBasica.JPG";
			return imagenPrograma;
		case 'BUEEMS':
			imagenPrograma = "iconoBUEEMS.JPG";
			return imagenPrograma;
		case 'JEF':
			imagenPrograma = "iconoJEF.JPG";
			return imagenPrograma;
	}
}

function periodo(periodo) {
	let periodo_id = periodo;
	let texto = "";
	switch (periodo_id) {
		case "2":
			texto = "ENERO Y FEBRERO";
			return texto;
		case "3":
			texto = "ENERO, FEBRERO Y MARZO";
			return texto;
		case "4":
			texto = "ENERO, FEBRERO, MARZO Y ABRIL";
			return texto;
		case "5":
			texto = "ENERO, FEBRERO, MARZO, ABRIL Y MAYO";
			return texto;
		case "6":
			texto = "ENERO, FEBRERO, MARZO, ABRIL, MAYO Y JUNIO";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function periodoE2(periodo) {
	let periodo_id = periodo;
	let texto = "";
	switch (periodo_id) {
		case "1":
			texto = "MARZO";
			return texto;
		case "2":
			texto = "MARZO Y ABRIL";
			return texto;
		case "3":
			texto = "MARZO, ABRIL Y MAYO";
			return texto;
		case "4":
			texto = "MARZO, ABRIL, MAYO Y JUNIO";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function periodoE3(periodos) {
	let periodo_id = periodos;
	let texto = "";
	switch (periodo_id) {
		case "1":
			texto = "SEPTIEMBRE";
			return texto;
		case "2":
			texto = "SEPTIEMBRE Y OCTUBRE";
			return texto;
		case "3":
			texto = "SEPTIEMBRE, OCTUBRE Y NOVIEMBRE";
			return texto;
		case "4":
			texto = "SEPTIEMBRE, OCTUBRE, NOVIEMBRE Y DICIEMBRE";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function periodoE12024(periodos) {
	let periodo_id = periodos;
	let texto = "";
	switch (periodo_id) {
		case "-1":
			texto = "MAYO 2019 a JUNIO 2024";
			return texto;
		case "1":
			texto = "ENERO";
			return texto;
		case "2":
			texto = "ENERO Y FEBRERO";
			return texto;
		case "3":
			texto = "ENERO, FEBRERO Y MARZO";
			return texto;
		case "4":
			texto = "ENERO, FEBRERO, MARZO Y ABRIL";
			return texto;
		case "5":
			texto = "ENERO, FEBRERO, MARZO, ABRIL Y MAYO";
			return texto;
		case "6":
			texto = "ENERO, FEBRERO, MARZO, ABRIL, MAYO Y JUNIO";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function periodoE22024(periodos) {
	let periodo_id = periodos;
	let texto = "";
	switch (periodo_id) {
		case "1":
			texto = "SEPTIEMBRE";
			return texto;
		case "2":
			texto = "SEPTIEMBRE Y OCTUBRE";
			return texto;
		case "3":
			texto = "SEPTIEMBRE, OCTUBRE Y NOVIEMBRE";
			return texto;
		case "4":
			texto = "SEPTIEMBRE, OCTUBRE, NOVIEMBRE Y DICIEMBRE";
			return texto;		
		default:
			texto = ""
			return texto;
	}
}

function periodoE12025(periodos) {
	let periodo_id = periodos;
	let texto = "";
	switch (periodo_id) {
		case "-1":
			texto = "MAYO 2019 a JUNIO 2024";
			return texto;
		case "1":
			texto = "ENERO";
			return texto;
		case "2":
			texto = "ENERO Y FEBRERO";
			return texto;
		case "3":
			texto = "ENERO, FEBRERO Y MARZO";
			return texto;
		case "4":
			texto = "ENERO, FEBRERO, MARZO Y ABRIL";
			return texto;
		case "5":
			texto = "ENERO, FEBRERO, MARZO, ABRIL Y MAYO";
			return texto;
		case "6":
			texto = "ENERO, FEBRERO, MARZO, ABRIL, MAYO Y JUNIO";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function periodoE22025(periodos) {
	let periodo_id = periodos;
	let texto = "";
	switch (periodo_id) {
		case "1":
			texto = "MARZO";
			return texto;
		case "2":
			texto = "MARZO Y ABRIL";
			return texto;
		case "3":
			texto = "MARZO, ABRIL Y MAYO";
			return texto;
		case "4":
			texto = "MARZO, ABRIL, MAYO Y JUNIO";
			return texto;		
		default:
			texto = ""
			return texto;
	}
}

function buzonHeader() {
	let texto = '';
	texto = '<div class="row">' +
		'<div class="col-12 resultado-line">' +
		'<div class="row">' +
		'<div class="col-3 icon text-center">' +
		'<img src="img/iconosV4/buzon-mensajes.svg">' +
		'</div>' +
		'<div class = "col-9 resultado-text">' +
		'<span class = "info">Buzón de mensajes</span><br>' +
		'</div>' +
		'</div>' +
		'<div class = "row barra">' +
		'<span class = "mostrar normal" onClick = "mostrar()" id = "spanTarjeta">Ver \u25B6</span>' +
		'<div id = "tarjeta" style="display: none">' +
		'<br>';
	return texto;
}
function buzonPie() {
	let texto = '';
	texto = '</div>' +
		'</div>' +
		'</div>';
	return texto;
}
function bajas(enero2022, junio2022, septiembre2022, enero2023, junio2023, diciembre2023, periodo, estado) {
	let arrayBanderas = [];
	let uno2022 = enero2022;
	let dos2022 = junio2022;
	let tres2022 = septiembre2022;
	let uno2023 = enero2023;
	let dos2023 = junio2023;
	let tres2023 = diciembre2023;
	//Para 2022 se comprueba si es diferente de nulo
	if (uno2022 != null && uno2022 != "") {
		uno2022 = 1;
	} else {
		uno2022 = 0;
	}
	if (dos2022 != null && dos2022 != "") {
		dos2022 = 1;
	} else {
		dos2022 = 0;
	}
	if (tres2022 != null && tres2022 != "") {
		tres2022 = 1;
	} else {
		tres2022 = 0;
	}
	//Para 2023 se comprueba si la emision = 1, si no, es 0
	if (uno2023 != 1) {
		uno2023 = 0;
	}
	if (dos2023 != 1) {
		dos2023 = 0;
	}
	if (tres2023 != 1) {
		tres2023 = 0;
	}
	//Se crean banderas, donde por defecto, todas estaran en 0 con el fin de unicamente prender los que se consideren bajas con la siguiente regla
	//Deben de tener una emision antes y una despues
	let banderaUno = 0;
	let banderaDos = 0;
	let banderaTres = 0;
	let banderaCuatro = 0;
	let banderaCinco = 0;
	let banderaSeis = 0;
	let periodo_incorporado = 0;
	//Si el periodo no es nulo
	if (periodo != null && periodo != "") {
		//Se obtiene el mes y el anio 
		let anio = periodo.substring(4, 8);
		let mes = periodo.substring(0, 3);
		//Si el año de incorporacion es 2021, todos por defecto tienen bajas, lo que hara la diferencia con la emision, es que la variable estara definida o no 
		if (anio == "2021" || anio == "2020" || anio == "2019") {
			banderaUno = 1;
			banderaDos = 1;
			banderaTres = 1;
			banderaCuatro = 1;
			banderaCinco = 1;
			banderaSeis = 1;
		} else if (anio == "2022") {
			//Si es 2022, se localiza el mes en el que se incorporo y de ahi el periodo, a partir de ahi se cuentan las bajas 
			if (mes == "ENE" || mes == "FEB" || mes == "MAR" || mes == "ABR") {
				periodo_incorporado = 1;
			} else if (mes == "MAY" || mes == "JUN" || mes == "JUL" || mes == "AGO") {
				periodo_incorporado = 2;

			} else if (mes == "SEP" || mes == "OCT" || mes == "NOV" || mes == "DIC") {
				periodo_incorporado = 3;
			}
			switch (periodo_incorporado) {
				case 1:
					banderaUno = 1;
					banderaDos = 1;
					banderaTres = 1;
					banderaCuatro = 1;
					banderaCinco = 1;
					banderaSeis = 1;
					break;
				case 2:
					banderaUno = 0;
					banderaDos = 1;
					banderaTres = 1;
					banderaCuatro = 1;
					banderaCinco = 1;
					banderaSeis = 1;
					break;
				case 3:
					banderaUno = 0;
					banderaDos = 0;
					banderaTres = 1;
					banderaCuatro = 1;
					banderaCinco = 1;
					banderaSeis = 1;
					break;

			}
		} else if (anio == "2023") {
			//Si es 2023, primero se identifica el estado, ya que el id 15 y 5 solo tuvieron 2 emisiones
			if (estado == "15" || estado == "5") {

			} else {
				//Para 2023, solo se recorre entre las emisiones, ya que no se asegura que el periodo de incorporacion corresponda a la emision como en 2022, 
				//por defecto las 3 primeras son 0, ya que no estan
				banderaUno = 0;
				banderaDos = 0;
				banderaTres = 0;
				//
				if (mes == "ENE" || mes == "FEB") {
					periodo_incorporado = 1;
				} else if (mes == "MAR" || mes == "ABR" || mes == "MAY" || mes == "JUN") {
					periodo_incorporado = 2;

				} else if (mes == "JUL" || mes == "AGO" || mes == "SEP" || mes == "OCT" || mes == "NOV" || mes == "DIC") {
					periodo_incorporado = 3;
				}
				switch (periodo_incorporado) {
					case 1:
						banderaCuatro = 1;
						banderaCinco = 1;
						banderaSeis = 1;
						break;
					case 2:
						banderaCuatro = 0;
						banderaCinco = 1;
						banderaSeis = 1;
						break;
					case 3:
						banderaCuatro = 0;
						banderaCinco = 0;
						banderaSeis = 1;
						break;

				}

			}
		}
	} else {
		//En caso de no contar con el periodo, primero se tiene que encontrar cual es la primera emision registrada
		let limiteIzquierdo = 0;
		if (uno2022 == 1) {
			limiteIzquierdo = 1;
		} else if (dos2022 == 1) {
			limiteIzquierdo = 2;
		} else if (tres2022 == 1) {
			limiteIzquierdo = 3;
		} else if (uno2023 == 1) {
			limiteIzquierdo = 4;
		} else if (dos2023 == 1) {
			limiteIzquierdo = 5;
		} else if (tres2023 == 1) {
			limiteIzquierdo = 6;
		}
		//Una vez encontrado el punto de partida, se pueden ir verificando las emisiones faltantes 
		switch (limiteIzquierdo) {
			case 1:
				//
				banderaUno = 1;
				if (dos2022 == 0) {
					//Se verifica si hay otra emision posterior
					if (tres2022 == 1 || uno2023 == 1 || dos2023 == 1 || tres2023 == 1) {
						//Se prende la bandera y se activa la emision 2
						banderaDos = 1;
						dos2022 = 1;
					}
				}
				if (tres2022 == 0) {
					//Se verifica si hay otra emision posterior
					if (uno2023 == 1 || dos2023 == 1 || tres2023 == 1) {
						//Se prende la bandera y se activa la emision 3
						banderaTres = 1;
						tres2023 = 1;
					}
				}
				if (uno2023 == 0) {
					//Se verifica si hay otra emision posterior
					if (dos2023 == 1 || tres2023 == 1) {
						//Se prende la bandera y se activa la emision 4
						banderaCuatro = 1;
						uno2023 = 1;
					}
				}
				if (dos2023 == 0) {
					//Se verifica si hay otra emision posterior
					if (tres2023 == 1) {
						//Se prende la bandera y se activa la emision 5
						banderaCinco = 1;
						dos2023 = 1;
					}
				}
				if (tres2023 == 0) {
					//Se prende la bandera y se activa la emision 5
					banderaSeis = 1;
					tres2023 = 1;

				}

				break;
			case 2:
				banderaDos = 1;
				if (tres2022 == 0) {
					//Se verifica si hay otra emision posterior
					if (uno2023 == 1 || dos2023 == 1 || tres2023 == 1) {
						//Se prende la bandera y se activa la emision 3
						banderaTres = 1;
						tres2023 = 1;
					}
				}
				if (uno2023 == 0) {
					//Se verifica si hay otra emision posterior
					if (dos2023 == 1 || tres2023 == 1) {
						//Se prende la bandera y se activa la emision 4
						banderaCuatro = 1;
						uno2023 = 1;
					}
				}
				if (dos2023 == 0) {
					//Se verifica si hay otra emision posterior
					if (tres2023 == 1) {
						//Se prende la bandera y se activa la emision 5
						banderaCinco = 1;
						dos2023 = 1;
					}
				}
				if (tres2023 == 0) {
					//Se prende la bandera y se activa la emision 5
					banderaSeis = 1;
					tres2023 = 1;

				}
				break;
			case 3:
				banderaTres = 1;
				if (uno2023 == 0) {
					//Se verifica si hay otra emision posterior
					if (dos2023 == 1 || tres2023 == 1) {
						//Se prende la bandera y se activa la emision 4
						banderaCuatro = 1;
						uno2023 = 1;
					}
				}
				if (dos2023 == 0) {
					//Se verifica si hay otra emision posterior
					if (tres2023 == 1) {
						//Se prende la bandera y se activa la emision 5
						banderaCinco = 1;
						dos2023 = 1;
					}
				}
				if (tres2023 == 0) {
					//Se prende la bandera y se activa la emision 5
					banderaSeis = 1;
					tres2023 = 1;

				}
				break;
			case 4:
				banderaCuatro = 1;
				if (dos2023 == 0) {
					//Se verifica si hay otra emision posterior
					if (tres2023 == 1) {
						//Se prende la bandera y se activa la emision 5
						banderaCinco = 1;
						dos2023 = 1;
					}
				}
				if (tres2023 == 0) {
					//Se prende la bandera y se activa la emision 5
					banderaSeis = 1;
					tres2023 = 1;

				}
				break;
			case 5:
				banderaCinco = 1;
				if (tres2023 == 0) {
					//Se prende la bandera y se activa la emision 5
					banderaSeis = 1;
					tres2023 = 1;

				}
				break;
			case 6:
				banderaSeis = 1;
				break;
		}


	}

	arrayBanderas.push(banderaUno);
	arrayBanderas.push(banderaDos);
	arrayBanderas.push(banderaTres);
	arrayBanderas.push(banderaCuatro);
	arrayBanderas.push(banderaCinco);
	arrayBanderas.push(banderaSeis);
	return arrayBanderas;
}

function popupBancarizacion() {
	Swal.fire({
		allowOutsideClick: false,
		background: '#10312B',
		//imageUrl: 'img/iconosV4/citas_popup.jpg',
		html: '<div><img src="img/iconosV4/banner_cinco.jpg" width="500px" height="400px" class="iconos"></img></div>',
		width: 600,
		confirmButtonColor: '#691C32',
		confirmButtonText: 'Cerrar',
	})
}

function universos(universos_atencion) {
	let universo = universos_atencion;
	if (universo == null) {
		universo = "";
	}
	let arrayUniversos = universo.split(',');
	return arrayUniversos;
}

function comparauniverso(arregloUniverso, valorUniverso, expresion) {
	let arrUniverso = arregloUniverso;
	let valor = valorUniverso;
	let accion = expresion;
	if (accion == "igual") {
		var bandera = 0;
		arrUniverso.forEach((element) => {
			var actual = element;
			if (actual == valor) {
				bandera = bandera + 1;
			}
		});
		return bandera;
	} else if (accion == "diferente") {
		if (arrUniverso == "") {
			var resultado = 1;
			return resultado;
		} else {
			var resultado = 0;
			var bandera = 0;
			arrUniverso.forEach((element) => {
				var actual = element;
				if (actual == valor) {
					bandera = bandera + 1;
				}
			});
			if (bandera == 0) {
				resultado = resultado + 1;
			}
			return resultado;
		}
	}
}
