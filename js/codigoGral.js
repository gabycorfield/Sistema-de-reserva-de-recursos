var fecha, reservaObj, fechasDeshabilitadas=[], arrMensaje=[];
let usuarioActual=null;
let config;
function Reserva (id,id_persona,inicio,final,descripcion,reserva){
	this.creador = id;
	this.persona = id_persona;
	this.fechaInicio = inicio;
	this.fechaFinal = final;
	this.descripcion = descripcion;
	this.nroReserva = reserva;
	this.detalle = [];

	//agregar un item al detalle de reservas
	this.addDet=function(det){
		this.detalle.push(det);
	}
	//remueve un item del detalle de reservas
	this.removeDet = function(i){
		this.detalle.splice(i,1);
	}
	//devuelve un listado de los codigos de recurso reservados
	this.listaRec = function(){
		var a =[];
		this.detalle.forEach(function(val){ a.push(val.recurso);});
		return a;
	}
	//reemplaza un item en particular del detalle, por otro dado
	this.reemplazoDet = function(det, i){
		this.detalle.splice(i,1,det);
	}
	//devuelve un item del detalle, en particular
	this.obtDetalle =function(i){
		return this.detalle[i];
	}
	//devuelve un array con todos los items del detalle
	this.detalleCompleto = function(){
		return this.detalle;
	}
};

function DetalleReserva (categoria, recurso, cant){
	this.categoria = categoria;
	this.recurso = recurso;
	this.cantidad = cant;
}
function Usuario (id, persona, user, permiso, blanqueado, apellido, nombre){
	this.id = id;
	this.persona = persona,
	this.user = user;
	this.permiso = permiso;
	this.blanqueado = blanqueado;
	this.apellido = apellido;
	this.nombre = nombre;
}
function Config (){
	this.primeraHora="07:00";
	this.ultimaHora="22:00";
	this.diasAnticipo=30;
	this.diasAmplitud=30;
	this.diasAnulados=[];
}


//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************

$(document).ready(function(){
	cargarConfiguracion();
	
	//oculto el menú
	bloquearMenus();

	//al cargar la pagina, si hay alguien logueado, cargo los datos del mismo
	if($("#id_hidden").val()){
		cargarUsuario($("#id_hidden").val());
	}

	//actualizo en pantalla los datos del usuario logueado, si es que hay alguno
	actualizarPerfil(usuarioActual);

	//al cerrar ventana de login/cambio pass, vuelvo a cargar datos de usuario
	$("#loginModal").on('hidden.bs.modal', function () {
   		cargarUsuario($("#id_hidden").val());
 	});
 	
//--------------------------------------manejo del login----------------------------------------------------------------
	
	//muestra pantalla de login al cliquear en la opción "ingresar" en la barra de navegación
	$("#login_a").click(function(){
		resetForm('logForm');
		$("#btnNewPass").show();
		$("#add_err_log").html('');
		$("#accionLogin").prop('value','ingresar');
		$("#loginModal .modal-title").html("Ingreso");
		$("#submitLogin").val('Ingresar').attr('disabled',false);
		$("#loginModal").modal('show');
		$("#usuar").focus();
	});

	//click en el botón ingresar de la pantalla de login
	$("#submitLogin").click(function(e){
		$(this).attr('disabled',true);
		$("#add_err_log").html('') ;
		if(!$("#usuar").val() || !$("#password").val()){//si estan vacíos usuario y contraseña pongo mensaje de error
			$("#add_err_log").html('Los datos son obligatorios').addClass('bg-danger').show(200).delay(2500).hide(200) ;
			$("#usuar").focus();
			$(this).attr('disabled',false);
		}else{//sino, voy a chequear credenciales o cambiar pass, según corresponda
			$("#add_err_log").html('') ;
			if($("#accionLogin").val()=="ingresar"){
				chequearLogin(e);
				$("#usuar").focus();
			}else{
				if($("#accionLogin").val()=="cambiar"){
					changePass(e);	
				}
				else{
					$("#add_err_log").html('Error').addClass('bg-danger').show(200).delay(2500).hide(200) ;}
			}	
		}
	});
	
	//muestra la contraseña al pasar sobre el botón
	$("#verPass").hover(function(){	$("#password").attr('type','text');},function(){$("#password").attr('type','password');}
	);
	
	//muestra pantalla de cambiar contraseña al cliquear en la opción correspondiente en la barra de navegación
	$("#changePass").click(function(){
		$('#accionLogin').prop('value','cambiar');
		$("#usuar").val(usuarioActual.user).attr('disabled', true);
		$("#password").val('');
		$("#submitLogin").val('Cambiar').attr('disabled',false);;
		$("#loginModal .modal-title").html("Cambiar contraseña");
		$("#loginModal .modal-footer a").hide();
		$("#loginModal").modal('show');
		$("#password").focus();
		}
	);

	//Al presionar "Recuperar contraseña" oculto login y abro ventana de recuperación de clave
	$("#btnNewPass").click(function(e){
		$('#loginModal').modal('hide');
		$("#add_err_recuperar").html('') ;
		$("#recUsuario").val('');
		$("#submitRecuperar").attr('disabled',false);
		$('#recuperarPassModal').modal('show');
		$("#recUsuario").focus();
	});

	//al presionar enviar en recuperar contraseña, ejecuto recuperarClave
	$("#submitRecuperar").click(function(e){
		$(this).attr('disabled',true);
		$("#add_err_recuperar").html('') ;
		if(!$("#recUsuario").val() ){//si esta vacío usuario pongo mensaje de error
			$("#add_err_recuperar").html('Ingrese su usuario').addClass('bg-danger').show(200).delay(2500).hide(200) ;
			$("#recUsuario").focus();$(this).attr('disabled',false);
		}else{//sino, voy a chequear credenciales o cambiar pass, según corresponda
			$("#add_err_recuperar").html('') ;
			recuperarClave($("#recUsuario").val());

		}
		e.preventDefault();
	});

	//al desloguearse borro los datos del usuario
	$("#logout").click(function(){usuarioActual=null;});

/******************************************Manejo de filtros de las tablas***************************************************/
////**************************************************************************************************************************
	//cambio los valores para filtrar la tabla Usuarios
	$("#contentUsuarios").data("orden",'ap')
						 .data("sentido",'ASC')
	 					 .on('click',"table th button",function(){
							if($(this).val()==$("#contentUsuarios").data('orden')){
								//si es el mismo campo x el que ordeno, invierto el orden
								if($("#contentUsuarios").data('sentido')=='ASC'){
									$("#contentUsuarios").data('sentido','DESC');}
								else{
									$("#contentUsuarios").data('sentido','ASC')}
							}
							else{//si es distinto, guardo el campo y pongo orden ascendente
								$("#contentUsuarios").data('sentido','ASC').data('orden',$(this).val());
							}
							//recargo la tabla 
							cargarTablaUsuarios();

							});
	//cambio los valores para filtrar la tabla Recursos
	$("#contentRecursos").data("orden",'recurso')
						 .data("sentido",'ASC')
						 .on('click',"table th button",function(){
							if($(this).val()==$("#contentRecursos").data('orden')){
								//si es el mismo campo x el que ordeno, invierto el orden
								if($("#contentRecursos").data('sentido')=='ASC'){
									$("#contentRecursos").data('sentido','DESC');}
								else{
									$("#contentRecursos").data('sentido','ASC')}
							}
							else{//si es distinto, guardo el campo y pongo orden ascendente
								$("#contentRecursos").data('sentido','ASC').data('orden',$(this).val());
							}
							//recargo la tabla 
							cargarTablaRecursos();
							});


	//cambio los valores para filtrar la tabla Categorías
	$("#contentCateg").data("sentido",'ASC')
					  .on('click',"table th button",function(){
							if($("#contentCateg").data('sentido')=='ASC'){
								$("#contentCateg").data('sentido','DESC');}
							else{
								$("#contentCateg").data('sentido','ASC')}
							//recargo la tabla 
							cargarTablaCategorias();
							});

	//cambio los valores para filtrar la tabla Personas
	$("#contentPersonas").data("orden",'apellido')
						 .data("sentido",'ASC')
	 					 .on('click',"table th button",function(){
								if($(this).val()==$("#contentPersonas").data('orden')){
									//si es el mismo campo x el que ordeno, invierto el orden
									if($("#contentPersonas").data('sentido')=='ASC'){
										$("#contentPersonas").data('sentido','DESC');}
									else{
										$("#contentPersonas").data('sentido','ASC')}
								}
								else{//si es distinto, guardo el campo y pongo orden ascendente
									$("#contentPersonas").data('sentido','ASC').data('orden',$(this).val());
								}
								//recargo la tabla 
								cargarTablaPersonas();
							});

	//cambio los valores para filtrar la tabla Reservas
	$("#contentReservas").data("orden",'inicio')
						 .data("sentido",'ASC')
						 .on('click',"table th button",function(){
								if($(this).val()==$("#contentReservas").data('orden')){
									//si es el mismo campo x el que ordeno, invierto el orden
									if($("#contentReservas").data('sentido')=='ASC'){
										$("#contentReservas").data('sentido','DESC');}
									else{
										$("#contentReservas").data('sentido','ASC')}
								}
								else{//si es distinto, guardo el campo y pongo orden ascendente
									$("#contentReservas").data('sentido','ASC').data('orden',$(this).val());
								}
								//recargo la tabla 
								cargarTablaReservas();
								});
/********************************************************************************************************************************/

	$("#btnReservar").click(function(){
		var datos={};
		var arrNuevo=[];
		var arrBorrar=[];
		var arrCambiar=[];
		if(reservaObj){
			if(reservaObj.detalle.length==0 && accionReserva=='agregar'){
					$("#err_reserva").html("No se han reservado recursos").addClass('bg-danger text-danger').show(200).delay(2500)
					.hide(200);
			}else{
				if($("#accionReserva").val()=="agregar"){
						//hacer la comprobación de que no han cambiado los datos desde que se comenzó la reserva
						// en caso de que los recursos ya no estén disponibles
					if(reservaObj.detalle.length != $("#rowsReserva .bg-success").length || $(".rowReserva:last-child .rowCantidad").val()!=0){
						$("#err_reserva").html("Hay items sin confirmar").addClass('bg-danger text-danger').show(200).delay(2500)
						.hide(200);
					}else{
						//acá hay que  llamar al ajax que guarda los datos de la reserva y el detalle
						datos = {accion_reserva:'agregar',id:reservaObj.creador,id_persona:reservaObj.persona,
						 finicio_reserva:fechaISO(reservaObj.fechaInicio), ffinal_reserva: fechaISO(reservaObj.fechaFinal)
						 ,desc_reserva:reservaObj.descripcion, detalle_reserva: reservaObj.detalle};
						fnSubmitReserva(datos);
					}
				}else{
				if(reservaObj.detalle.length != $("#rowsReserva .bg-success").length || ($(".rowReserva:last-child .rowCantidad").val()>0 && $("#rowsReserva .bg-alert").length==1)){
						$("#err_reserva").html("Hay items sin confirmar").addClass('bg-danger text-danger').show(200).delay(2500)
						.hide(200);
					}else{
						//chequear si cambiaron fecha y hora y responsable
						var ini=$("#fInicioReserva").val().concat(" ".concat($("#hora1").val()));
						var fin =$("#fFinalReserva").val().concat(" ".concat($("#hora2").val()));
						datos={};
						if($("#respons").val()!=reservaObj.persona||ini!=reservaObj.fechaInicio||fin!=reservaObj.fechaFinal
							|| $("#descReserva").val().trim()!=reservaObj.descripcion){
							datos={accion_reserva:'actualizar',persona:$("#respons").val(),reserva:$("#idReserva").val(),descr:$("#descReserva").val(),
							f1:fechaISO(reservaObj.fechaInicio),f2:fechaISO(reservaObj.fechaFinal)};
							
						}
						if(JSON.stringify(reservaObj.detalle) !== JSON.stringify(reservaObjOriginal.detalle)){
						//	console.log(reservaObjOriginal);
						//	console.log(reservaObj);
							
							var j=0;
							var resObj=reservaObj.listaRec();
							var resOriginal=reservaObjOriginal.listaRec();
							resOriginal.forEach(function(v,i){
								j=resObj.indexOf(v);
								if(j==-1){
									arrBorrar.push(v);
								}else{
									if(reservaObjOriginal.detalle[i].cantidad != reservaObj.detalle[j].cantidad){
										arrCambiar.push({recurso:v,cantidad:reservaObj.detalle[j].cantidad});
									}
								}
							});
							resObj.forEach(function(v,i){
								j=(resOriginal.indexOf(v));
								if(j==-1){
									arrNuevo.push({recurso:v, cantidad:reservaObj.detalle[i].cantidad});
								}
							});
							

							fnUpdateReserva(datos,$("#idReserva").val(),arrCambiar,arrBorrar,arrNuevo);
						}else{
							fnUpdateReserva(datos);
						}
						
						//console.log(reservaObj.detalle);
						//console.log(reservaObjOriginal.detalle);
					}
				}
			}
		}else{
			if(accionReserva=='agregar'){
				$("#err_reserva").html("No hay reserva en curso").addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
			}else{
				if(reservaObjOriginal.descripcion!= $("#descReserva").val() || reservaObjOriginal.persona != $("#respons").val()){
					//aca hay que actualizar el registro, no los detalles
					datos={accion_reserva:'actualizar',persona:$("#respons").val(),reserva:$("#idReserva").val(),descr:$("#descReserva").val(),
						f1:fechaISO(reservaObjOriginal.fechaInicio),f2:fechaISO(reservaObjOriginal.fechaFinal)};
					fnUpdateReserva(datos);
				}else{ 
					$("#err_reserva").html("No se han realizado cambios").addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
				}
			}
		}
		
	});
	

	$("#msgModal").keypress(function(e){if(e.which == 13){$("#msgModal").modal('hide');}});
	$("#msgModal").on('show.bs.modal', function(){
	   $("#msgModal #msgText h3").html("");
	});

	$("#btnReservaMultiple").click(function(){
		//chequear que este todo completo	
		if(!$("#fSistema1").val()){
			$("#err_sistemaMult").html('Indicar rango de fechas').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
			$("#fSistema1").focus();
			}else{
				if(!$("#fSistema2").val()){
					$("#err_sistemaMult").html('Indicar rango de fechas').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
					$("#fSistema2").focus();
				}else{
					if($("#cantSistema").val()==0){
						$("#err_sistemaMult").html('Indicar recurso y cantidad a reservar').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
						$("#categoriaSistema").focus();	
					}else{
						if(!$("#sistemaDesc").val()){
							$("#err_sistemaMult").html('Indicar descripci&oacute;n').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
							$("#sistemaDesc").focus();
						}else{
							if(($("#reservaMultipleRow .rowMultiple").length==1 && $("#reservaMultipleRow .bg-danger").length==1)||$("#reservaMultipleRow .bg-danger").length>1){
								$("#err_sistemaMult").html('Confirmar d&iacute;as y horarios de reserva').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
								$("#reservaMultipleRow .rowMultiple .bg-danger:nth-child(0)").focus();
							}else{
								var datos=[];
								$("#reservaMultipleRow .rowMultiple ").each(function (i){
									if($(this).hasClass('bg-success')){
									;
									datos.push({dia:$("#reservaMultipleRow .rowMultiple:eq("+i+") select option:selected").val(),
												h1:$("#reservaMultipleRow .rowMultiple:eq("+i+") .multipleH1").val(),
												h2:$("#reservaMultipleRow .rowMultiple:eq("+i+") .multipleH2").val()});
								}
									});console.log(datos)
								fnReservaSistema(usuarioActual.persona,$("#fSistema1").val(),$("#fSistema2").val(),
									$("#recursoSistema").val(), $("#cantSistema").val(),$("#sistemaDesc").val(), datos);
							}
						}
					}
				}
			
		}
	});


	//---------------------------manejo el menu y muestro u oculto las secciones del programa----------------------------
	//**************************************************************************************************************************
	$(".menu-link").click(function(){
		var nombre =this.dataset.seccion; //guardo el valor de mi link para conectarlo a la pantalla correspondiente
		$(".menu-link").removeClass('active');//saco la clase active de todos los links
		$(this).addClass('active');//pongo la clase active al link cliqueado

		if(!$(this).hasClass('dropdown')){	
			$(".panel").hide();//oculto el panel/sección que esté abierto 
			mostrarPanel(nombre); //muestro la sección actual
		}
	});
	$(".sub-menu").click(function(){
		var nombre =this.dataset.seccion; //guardo el valor de mi link para conectarlo a la pantalla correspondiente
		$(".panel").hide();//oculto el panel/sección que esté abierto
		mostrarPanel(nombre);//muestro la sección actual
	});
	
//********************************************** acciones sobre tablas de datos**********************************************

//sobre lista de categorias

	$("#contentCateg").on('click',".edit-cat",function(){
						var ind=$(".edit-cat").index(this)+1;//indice dentro de la tabla + 1 por los titulos
						fnUpdateCategorias(ind);
						})
					  .on('click',".delete-cat",function(){
						var ind=$(".delete-cat").index(this)+1;//indice dentro de la tabla + 1 por los titulos
						fnEliminarCat($("#contentCateg table tr:eq("+ind+")").data('id'));
						})
 					  .on('mouseenter mouseleave',"tr",function(){
						var ind=$("#contentCateg tr").index(this);
      					$("#contentCateg table tr:eq("+ind+") td:eq(1), #contentCateg table tr:eq("+ind+") td:eq(2)")
      					.toggleClass( "oculto" )});

//sobre lista recursos

	$("#contentRecursos").on('click',".edit-rec",function(){
						var ind=$(".edit-rec").index(this)+1;//indice dentro de la tabla + 1 por los titulos
						fnUpdateRecursos(ind);
						})
						 .on('click',".delete-rec",function(){
						var ind=$(".delete-rec").index(this)+1;//indice dentro de la tabla + 1 por los titulos
						fnEliminarRec($("#contentRecursos table tr:eq("+ind+")").data('id'));
						})
						 .on('click',".ver-rec",function(){
						var ind=$(".ver-rec").index(this)+1;//indice dentro de la tabla + 1 por los titulos
						fnVerRecursos(ind);
						})
						 .on('mouseenter mouseleave',"tr",function(){
							if(usuarioActual.permiso == 1){
								var ind=$("#contentRecursos tr").index(this);
      							$("#contentRecursos table tr:eq("+ind+") td:eq(5), #contentRecursos table tr:eq("+ind+") td:eq(6)")
      							.toggleClass( "oculto" );
      						}
      					});
//sobre lista personas

	$("#contentPersonas").on('click',".edit-pers",function(){
							var ind=$(".edit-pers").index(this)+1;//indice dentro de la tabla + 1 por los titulos
							fnUpdatePersona(ind);})
						 .on('click',".delete-pers",function(){
							var ind=$(".delete-pers").index(this)+1;//indice dentro de la tabla + 1 por los titulos
							fnEliminarPersona($("#contentPersonas table tr:eq("+ind+") ").data('id'));})
						 .on('mouseenter mouseleave',"tr",function(){
							var ind=$("#contentPersonas tr").index(this);
	      					$("#contentPersonas table tr:eq("+ind+") td:eq(6), #contentPersonas table tr:eq("+ind+
	      						") td:eq(7)").toggleClass( "oculto" );
	      					})
						 .on('click',".mas", function(){
						 	if($(this).html()=='+'){
						 		$(this).html('-');
						 	}else{
						 		$(this).html('+');
						 	}
						 	$("#contentPersonas table td:nth-child(4), #contentPersonas table td:nth-child(5), #contentPersonas table th:nth-child(5),"+
						 	 "#contentPersonas table th:nth-child(4)").toggleClass( "oculto" );
						 });

//lista usuarios

	$("#contentUsuarios").on('click',".edit-user",function(){
							var ind=$(".edit-user").index(this)+1;//indice dentro de la tabla 
							fnUpdateUsuarios($("#contentUsuarios table tr:eq("+ind+")").data('persona'),
								$("#contentUsuarios table tr:eq("+ind+") td:eq(1)").html(),
								$("#contentUsuarios table tr:eq("+ind+") td:eq(2)").html(),
								$("#contentUsuarios table tr:eq("+ind+")").data('id'));
							})
						.on('click',".delete-user",function(){
							var ind=$(".delete-user").index(this)+1;//indice dentro de la tabla 
							fnEliminarUser($("#contentUsuarios table tr:eq("+ind+") ").data('id'));
							})
						.on('click',".clear-pass",function(){
							var ind=$(".clear-pass").index(this)+1;//indice dentro de la tabla 
							fnBlanquearUser($("#contentUsuarios table tr:eq("+ind+") td:eq(1)").html());
							})
						.on('mouseenter mouseleave',"tr",function(){
							var ind=$("#contentUsuarios tr").index(this);
							if($("#contentUsuarios table tr:eq("+ind+")").data('persona') != usuarioActual.persona){
	      					$("#contentUsuarios table tr:eq("+ind+") td:eq(4), #contentUsuarios table tr:eq("+ind+
	      						") td:eq(5), #contentUsuarios table tr:eq("+ind+") td:eq(6)").toggleClass( "oculto" );	};
	      					});

//listado de reservas
	$("#contentReservas").on('click',".edit-reserva",function(){
							var ind=$("#contentReservas .edit-reserva").index(this)+1;//indice dentro de la tabla + 1 por los titulos
							fnUpdateReservas(ind,"#contentReservas");
							})
						.on('click',".delete-reserva",function(){
							var ind=$("#contentReservas .delete-reserva").index(this)+1;//indice dentro de la tabla + 1 por los titulos
							fnEliminarReserva($("#contentReservas table tr:eq("+ind+")").data('reserva'));
							})
						.on('click',".ver-reserva",function(){
							var ind=$("#contentReservas .ver-reserva").index(this)+1;//indice dentro de la tabla + 1 por los titulos
							fnMostrarReserva(ind,"#contentReservas");
							})
						.on('mouseenter mouseleave',"tr",function(){
							if(usuarioActual.permiso == 1){
								var ind=$("#contentReservas tr").index(this);
		      					$("#contentReservas table tr:eq("+ind+") td:eq(7), #contentReservas table tr:eq("+ind+") td:eq(8)")
		      					.toggleClass("oculto");}				
							});


//listado mis reservas
	$("#misReservas").on('click',".ver-reserva",function(){
						var ind=$("#misReservas .ver-reserva").index(this)+1;//indice dentro de la tabla + 1 por los titulos
						fnMostrarReserva(ind,"#misReservas");
						})
					 .on('mouseenter mouseleave',"tr",function(){
						var ind=$("#misReservas tr").index(this);
      					$("#misReservas table tr:eq("+ind+") td:eq(7),#misReservas table tr:eq("+ind+") td:eq(8)")
      					.toggleClass('oculto');})
					 .on('click',".edit-reserva",function(){
							var ind=$("#misReservas .edit-reserva").index(this)+1;//indice dentro de la tabla + 1 por los titulos
							fnUpdateReservas(ind,"#misReservas");
							})
					 .on('click',".delete-reserva",function(){
							var ind=$("#misReservas .delete-reserva").index(this)+1;//indice dentro de la tabla + 1 por los titulos
							fnEliminarReserva($("#misReservas table tr:eq("+ind+")").data('reserva'));
						});


//listado fechas no reservables
	$("#tablaNR").on('click',".delete-fecha",function(){
						var ind=$(".delete-fecha").index(this)+1;//indice dentro de la tabla + 1 por los titulos
						fnEliminarFecha($("#tablaNR table tr:eq("+ind+") ").data('id'));
						});
//*************************************************envio de datos**************************************************************
///****************************************************************************************************************************	
	$("#categoriasForm").on('submit',function(e){
		e.preventDefault();
		var datos = $("#categoriasForm").serialize(); 
		if($("#categ").val().trim()!==""){
			$("#errCat").html("")
			fnSubmitCategorias(datos);}
		else{
			$("#errCat").html("Faltan datos").removeClass('bg-success text-success').addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
			$("#categ").val('').focus();
		}
	});

	$("#recursosForm").on('submit',function(e){
		e.preventDefault();
		var datos = $("#recursosForm").serialize(); //alert("select "+$("#selectCategoria").val());
		if($("#recurso").val().trim()!=="" && $("#selectCategoria").val()){
			$("#errRec").html("");

			//chequear los demas datos
			fnSubmitRecursos(datos);}
		else{
			$("#errRec").html("Faltan datos").removeClass('bg-success text-success').addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
		}
	});	

	$("#usuariosForm").on('submit',function(e){
		e.preventDefault();
		var datos = $("#usuariosForm").serialize();datos+='&password='+rndPass(); 
		if($("#usuario").val().trim()!=="" && $("#permisoReserva").prop('selectedIndex') !== 0 && $("#selectPersona").prop('selectedIndex')!==0){
			$("#errUser").html("");
			//chequear los demas datos
			fnSubmitUsuarios(datos);}
		else{
			$("#errUser").html("Faltan datos").removeClass('bg-success text-success').addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
		}
	});	

	$("#personasForm").on('submit',function(e){
		var datos = $("#personasForm").serialize();//alert(datos);
		if($("#documento").val().trim()!=="" && $("#apellido").val().trim()!=="" && $("#nombre").val().trim()!=="" && $("#email").val().trim()!==""){
			$("#err_persona").html("");
			//chequear los demas datos
			fnSubmitPersonas(datos);}
		else{console.log("faltan datos............");
			$("#err_persona").html("Faltan datos").removeClass('bg-success text-success').addClass('bg-danger text-danger')
			.show(200).delay(2500).hide(200) ;
		}
		e.preventDefault();
	});	
//****************************************************************************************************************************
	$("#btnReservaOk").click(function(e){
		$("#btnEditFechas, #btnEditRec").prop('disabled',false);
		var fech = new Date(); var fecha = convFecha(fech.toLocaleDateString(), fech.toLocaleTimeString());
		var f1 = convFecha($("#fInicioReserva").val(),$("#hora1").val());//alert("value inicio "+$("#hora1").attr('value'));
		var f2 = convFecha($("#fFinalReserva").val(),$("#hora2").val());//alert("alerta "+ f1+" "+f2+" "+fecha);
		if($("#descReserva").val().trim()==""){$("#err_reserva").html("Debe ingresar una descripción de la reserva").addClass('bg-danger text-danger')
			.show(200).delay(2500).hide(200);
		}else{
			if(!f1 || !f2){
				$("#err_reserva").html("Debe ingresar fechas y horas v&aacute;lidas").addClass('bg-danger text-danger')
			.show(200).delay(2500).hide(200);
			}else{
				if(!$("#fInicioReserva").val() || !$("#fFinalReserva").val()){
					$("#err_reserva").html("Deben definirse fecha y hora v\341lidas de inicio y final.").addClass('bg-danger text-danger')
					.show(200).delay(2500).hide(200);
				}else{
					if(f2.getTime() < f1.getTime()+1000*60*30){
						$("#err_reserva").html("Fecha y hora de inicio deben ser menores que fecha y hora de finalizaci\363n, el tiempo m&iacute;nimo de reserva es de 30 minutos")
						.addClass('bg-danger text-danger').show(200).delay(3000).hide(200) ;
					}else{
						if(fecha.getTime()> f1.getTime() && $("#accionReserva").val()=='agregar'){
							$("#err_reserva").html("La fecha y hora deben ser mayores que fecha y hora actuales. " ).addClass('bg-danger text-danger')
					.show(200).delay(2500).hide(200) ;
						}else{
							$("#idPersonaReserva").prop('value',usuarioActual.persona);
							$("#nbreReservador").html(usuarioActual.apellido+", "+usuarioActual.nombre);
							$("#reservaForm input").attr('disabled',true);
					
							reservaObj = new Reserva($("#idPersonaReserva").val(),$("#respons").val(),f1,f2,$("#descReserva").val(),0);
							//console.log("id: "+ reserva.persona + "inicio: "+reserva.fechaInicio+ "final: "+reserva.fechaFinal+ "detalle: "+reserva.detalle);
							
							$(this).prop('disabled',true);
						
							if($("#accionReserva").val()=='agregar'){//alert("entre al add");
								addReservaRow();
							}else{//alert("entre al update");
								$("#btnEditFechas").prop('disabled',false);
								if(reservaObjOriginal.fechaInicio.getTime() != reservaObj.fechaInicio.getTime() || reservaObjOriginal.fechaFinal.getTime() != reservaObj.fechaFinal.getTime()){
									//alert("cambiaron las fechas "+reservaObjOriginal.fechaInicio+"  "+reservaObj.fechaInicio );
									var rec=reservaObjOriginal.detalleCompleto();
									$.each(rec,function(i,val){console.log("each "+rec+" "+i+" "+val.recurso);var ind=i+1;
										cargarCantRecurso(val.recurso,i+1,val.cantidad,reservaObjOriginal.nroReserva);
									});
								}
									reservaObj.detalle=reservaObjOriginal.detalle.map(function(v){return v});
								
											
							}
							
						}
					}
				}
			}
		}
		e.preventDefault();
	});	


	$("#filtroCat").change(function(){cargarTablaRecursos();});
	$("#btnBuscarRec").click(function(){cargarTablaRecursos();});
	$("#btnBuscarPers").click(function(){cargarTablaPersonas();})
	$("#btnBuscarCat").click(function(){cargarTablaCategorias();});
	$("#btnBuscarUser").click(function(){cargarTablaUsuarios();});
	$("#btnBuscarReservas").click(function(){cargarTablaReservas();});
	$("#filtroUser").change(function(){cargarTablaUsuarios();});


	$("#btnAddNR").click(function(){agregarFechasDeshabilitadas();});

	$("#btnEditPrimeraH").click(function(){
		$(this).toggleClass('oculto');
		$("#btnOkPrimeraH").toggleClass('oculto').attr('disabled',true);
		$("#primeraH").attr('disabled',false).change(function(){$("#btnOkPrimeraH").attr('disabled',false);});	
	});
	$("#btnEditUltimaH").click(function(){
		$(this).toggleClass('oculto');
		$("#btnOkUltimaH").toggleClass('oculto').attr('disabled',true);
		$("#ultimaH").attr('disabled',false).change(function(){$("#btnOkUltimaH").attr('disabled',false);});	
	});
	$("#btnEditAnticipoR").click(function(){
		$(this).toggleClass('oculto');
		$("#btnOkAnticipoR").toggleClass('oculto').attr('disabled',true);
		$("#anticipoR").attr('disabled',false).change(function(){$("#btnOkAnticipoR").attr('disabled',false);});	
	});
	$("#btnEditAmplitudR").click(function(){
		$(this).toggleClass('oculto');
		$("#btnOkAmplitudR").toggleClass('oculto').attr('disabled',true);
		$("#amplitudR").attr('disabled',false).change(function(){$("#btnOkAmplitudR").attr('disabled',false);});	
	});
	$("#btnOkPrimeraH").click(function(){
		if(!$("#primeraH").val()){
			$("#err_confHorario").html("Debe ingresa una hora v&aacute;lida").addClass('bg-danger text-danger')
			.show(200).delay(2500).hide(200) ;
			$("#primeraH").focus();
		}else{
			fnGuardarConf(1,$("#primeraH").val());
			$(this).toggleClass('oculto');$("#btnEditPrimeraH").toggleClass('oculto');$("#primeraH").attr('disabled',true);
		}
	});
	$("#btnOkUltimaH").click(function(){
		if(!$("#ultimaH").val()){
			$("#err_confHorario").html("Debe ingresa una hora v&aacute;lida").addClass('bg-danger text-danger')
			.show(200).delay(2500).hide(200) ;
			$("#ultimaH").focus();
		}else{
			fnGuardarConf(2,$("#ultimaH").val());
			$(this).toggleClass('oculto');$("#btnEditUltimaH").toggleClass('oculto');$("#ultimaH").attr('disabled',true);
		}
	});
	$("#btnOkAnticipoR").click(function(){
		if($("#anticipoR").val()< 7 || $("#anticipoR").val() > 365){
			$("#err_confHorario").html("Debe ingresar entre 7 y 365").addClass('bg-danger text-danger')
			.show(200).delay(2500).hide(200) ;
			$("#anticipoR").focus();
		}else{
			fnGuardarConf(3,$("#anticipoR").val());
			$(this).toggleClass('oculto');$("#btnEditAnticipoR").toggleClass('oculto');$("#anticipoR").attr('disabled',true);
		}
	});
	$("#btnOkAmplitudR").click(function(){
		if($("#amplitudR").val()< 7 || $("#amplitudR").val() > 365){
			$("#err_confHorario").html("error").addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
			$("#amplitudR").focus();
		}else{
			fnGuardarConf(4,$("#amplitudR").val());
			$(this).toggleClass('oculto');$("#btnEditAmplitudR").toggleClass('oculto');$("#amplitudR").attr('disabled',true);
		}
	});
	//**************************************************************************************************************************
	//calendarios

	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: ' Anterior',
		nextText: ' Siguiente',
		currentText: 'Hoy',
		monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
		'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
		'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié;', 'Juv', 'Vie', 'Sáb'],
		dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: '', 
		navigationAsDateFormat: true,
		beforeShowDay: function(t){
							var e=t.getDay();
							if(e==0 || 6==e){
								return [false,''];
							}else{
								var arr=fechasDeshabilitadas.map(function(v,i){return v.fecha});
								if (arr.indexOf($.datepicker.formatDate('dd/mm/yy',t)) != -1){
									return [false,""];
								}else{
									return[true,""];
								}
							}
						}	
	}
	$.datepicker.setDefaults($.datepicker.regional['es']);
	$("#calendario").datepicker();
	$("#fFinalReserva").datepicker({minDate: 0, maxDate: "+0D", defaultDate: +0 });
	$("#fInicioReserva").datepicker({minDate: 0, maxDate: config.diasAnticipo,defaultDate: +0});
	$("#fInicioReserva").change(function(){var i = $(this).datepicker("getDate");
										   var dif=(Math.ceil((i.getTime()-$.now())/1000/60/60/24))+config.diasAmplitud;
										   $("#fFinalReserva").datepicker('option',{minDate:new Date(i),maxDate:dif})});
	$("#filtro2R").datepicker({minDate: 0, defaultDate: +0});
	$("#filtro1R").datepicker({minDate: 0, defaultDate: +0}).change(function(){var i = $(this).datepicker("getDate");$("#filtro2R").datepicker('option','minDate',new Date(i))	});
	
	$("#fechaNR").datepicker({onSelect: function(fecha) { 
                $('#fechaNR').val(fecha);console.log($('#fechaNR').val());
    }});
    $("#fSistema1").datepicker({minDate: 0, defaultDate: +0}).change(function(){var i = $(this).datepicker("getDate");$("#fSistema2").datepicker('option','minDate',new Date(i))	});
    $("#fSistema2").datepicker({minDate: 0, defaultDate: +0});

//********************************************************************************************************************************

	$("#rowsReserva").on('change','.rowCategoria', function(){
		var indice = $(".rowCategoria").index(this)+1;
		$(".rowReserva:nth-child("+indice+") .rowCantidad").attr('max',0).prop('value',0);
		$(".rowReserva:nth-child("+indice+") .rowMax ").html('0');
		if(indice != $(".rowReserva").length){$(".rowReserva:nth-child("+indice+")").addClass('bg-danger').removeClass('bg-success');}
		cargarSelectRecursos($(this).val(),".rowReserva:nth-child("+indice+") .rowRecurso");
		//console.log(reservaObj.detalle);
	});
	
	$("#rowsReserva").on('change','.rowRecurso', function(){//alert($(".rowRecurso option:selected").prop('value'));
		var indice = $(".rowRecurso").index(this)+1;//alert($(this).data('cant'));
		$(".rowReserva:nth-child("+indice+") .rowCantidad").attr('max',0).prop('value',0);
		if(indice != $(".rowReserva").length){$(".rowReserva:nth-child("+indice+")").addClass('bg-danger').removeClass('bg-success');}
		cargarCantRecurso($(this).val(), indice,0);//,$(this).data('cant'));
	});

	$("#rowsReserva").on('click','.addRowReserva', function(){//alert($(".rowRecurso option:selected").prop('value'));
		var indice = $(".addRowReserva").index(this)+1;
		//var recReservados=reservaObj.listaRec();
		var agrego = indice == $(".addRowReserva").length;//console.log($(".addRowReserva").length+" "+indice); alert(reservaObj);
		var indRecExistente = reservaObj.listaRec().indexOf($(".rowReserva:nth-child("+indice+") .rowRecurso").val());
		//console.log("indice "+indRecExistente);
		if($(".rowReserva:nth-child("+indice+") .rowCantidad").val()==0){//chequeo que estén llenos los campos, si la cantidad está, los otros también
			$("#err_reserva").html("Debe indicar el recurso y la cantidad a reservar.").addClass('bg-danger text-danger')
			.show(200).delay(2500).hide(200) ;
		}else{
			if(Number($(".rowReserva:nth-child("+indice+") .rowCantidad").val())>Number($(".rowReserva:nth-child("+indice+") .rowMax").html().slice(1))){
				$("#err_reserva").html("Modifique la cantidad de recursos de acuerdo a la cantidad disponible.").addClass('bg-danger text-danger')
					.show(200).delay(2500).hide(200) ;
			}else{
				var det = new DetalleReserva($(".rowReserva:nth-child("+indice+") .rowCategoria").val(),$(".rowReserva:nth-child("+indice+") .rowRecurso").val(),$(".rowReserva:nth-child("+indice+") .rowCantidad").val());
				//console.log("detalle "+det);
				if(agrego){//si estoy agregando un registro
					if(indRecExistente == -1){
						reservaObj.addDet(det);
						addReservaRow();
						$(".rowReserva:nth-child("+indice+") .removeRowReserva").prop('disabled',false);
						$(".rowReserva:nth-child("+indice+")").removeClass('bg-danger').addClass('bg-success');
					}else{
						$("#err_reserva").html("Ese recurso ya fue reservado, modifique la cantidad del registro previo.").addClass('bg-danger text-danger')
					.show(200).delay(2500).hide(200) ;
						cargarSelectCategorias(".rowReserva:nth-child("+indice+") .rowCategoria");
						$(".rowReserva:nth-child("+indice+") .rowCategoria").trigger('change');
					}
				}else{//si modifico
					console.log("estoy modificando");
					if(indRecExistente == -1 || indRecExistente == indice-1){
						reservaObj.reemplazoDet(det, indRecExistente);
						$(".rowReserva:nth-child("+indice+")").removeClass('bg-danger').addClass('bg-success');
					}
					else{
						$("#err_reserva").html("Ese recurso ya fue reservado, modifique la cantidad del registro previo. Los cambios se deshar\341n.").addClass('bg-danger text-danger')
				.show(200).delay(2500).hide(200) ;
						restaurarRowReserva(indice);
					}
				}
			}
		}		
	});

	$("#rowsReserva").on('click','.removeRowReserva', function(){//alert($(".rowRecurso option:selected").prop('value'));
		var indice = $(".removeRowReserva").index(this)+1;
		if(confirm("¿Está seguro que desea eliminar este recurso de la lista?")){
			reservaObj.removeDet(indice-1);
			$(".rowReserva:nth-child("+indice+")").remove();
		}
	});

	$("#rowsReserva").on('change','.rowCantidad',function() {
		var indice = $(".rowCantidad").index(this)+1;
		if(indice != $(".rowReserva").length){$(".rowReserva:nth-child("+indice+")").addClass('bg-danger').removeClass('bg-success');}
        var max = parseInt($(this).attr('max'));//console.log("max "+$(this).attr('max'));
        var min = parseInt($(this).attr('min'));
          if (parseInt($(this).val()) > max)
          {
              $(this).val(max);
          }
          else if (parseInt($(this).val()) < min)
          {
              $(this).val(min);
          }       
    }); 
    

	$("#btnEditFechas").click(function(){
		$("#headReserva :input , #btnReservar").prop('disabled',false);
		$(this).prop('disabled',true);
		$("#btnEditRec").prop('disabled',true);
		$("#btnReservaOk").removeClass('oculto');
	});

	$("#btnEditRec").click(function(){
		var d,hayDetalle=true;
		$("#rowsReserva :input, #btnReservar").prop("disabled",false);
		$(this).prop('disabled',true);
		$("#btnEditFechas").prop('disabled',true);
		if(!reservaObj){//alert("no hay reservaObj");
			reservaObj=new Reserva($("#idPersonaReserva").val(),$("#respons").val(),convFecha($("#fInicioReserva").val(),
					$("#hora1").val()),convFecha($("#fFinalReserva").val(),$("#hora2").val()),$("#descReserva").val(),
					reservaObjOriginal.nroReserva);
		}
		if(reservaObj.detalle.length==0){
			hayDetalle=false;
		}
			$("#rowsReserva .rowReserva ").each(function(i,e){
				cargarCantRecurso($("#rowsReserva .rowReserva:nth-child("+parseInt(i+1)+") .rowRecurso").val(),i+1,
					$("#rowsReserva .rowReserva:nth-child("+parseInt(i+1)+") .rowCantidad").val(),reservaObjOriginal.nroReserva);	

				if(!hayDetalle){
					d=new DetalleReserva($(".rowReserva:nth-child("+parseInt(i+1)+") .rowCategoria").val(),
										$(".rowReserva:nth-child("+parseInt(i+1)+") .rowRecurso").val(),
										$(".rowReserva:nth-child("+parseInt(i+1)+") .rowCantidad").val());
					reservaObj.addDet(d);
				}
			});

		addReservaRow();

	});


	$("#categoriaSistema").change(function(){
								cargarSelectRecursos($(this).val(),"#recursoSistema");
								$("#cantSistema").prop('max','0').val('0');	
							});
	$("#recursoSistema").change(function(){
								$("#cantSistema").prop('placeholder','max:'+$("#recursoSistema option:selected").data('cant'))
								 .prop('max',$("#recursoSistema option:selected").data('cant'));
	});


	$("#reservaMultipleRow ").on('click','.rowMultiple .addMultiple', function(){
								var ind=$(".rowMultiple .addMultiple").index(this)+1;
								var a = $(".rowMultiple:nth-child("+ind+") .multipleH1").val().split(":");
								var h1=new Date().setHours(a[0], a[1],0);
								a = ($(".rowMultiple:nth-child("+ind+") .multipleH2").val()).split(":");
								var h2=new Date().setHours(a[0], a[1],0);
								
								if(!$(".rowMultiple:nth-child("+ind+") select").val()>0 || !$(".rowMultiple:nth-child("+ind+") .multipleH1").val()
									|| !$(".rowMultiple:nth-child("+ind+") .multipleH2").val()){
										$("#err_sistemaMult").html('Confirmar d&iacute;as y horarios de reserva').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
										$("#reservaMultipleRow .rowMultiple .bg-danger:nth-child(0)").focus();
								}else{
									if(h2<=h1){//alert("mayor");
										$("#err_sistemaMult").html('El inicio de la reserva no puede ser mayor que el final').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
										$("#reservaMultipleRow .rowMultiple .bg-danger:nth-child(0)").focus();
									}else{
										if(h2-h1 < 30*60*1000){
											$("#err_sistemaMult").html('El tiempo m&iacute;nimo de reserva es de 30 minutos').addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
											$("#reservaMultipleRow .rowMultiple .bg-danger:nth-child(0)").focus();
										}else{
											$(".rowMultiple:nth-child("+ind+")").removeClass('bg-danger').addClass('bg-success');
											if(ind==$(".rowMultiple").length){
												addMultipleRow();
												console.log("esta es la diferencia "+$(".rowMultiple:nth-child("+ind+") .multipleH1").val());
											}
										}
									}
								
									
								}
	});
	$("#reservaMultipleRow ").on('click','.rowMultiple .removeMultiple', function(){
								var ind=$(".rowMultiple .removeMultiple").index(this)+1;
								if($("#reservaMultipleRow .rowMultiple .removeMultiple").length==1){
									//alert("queda 1 solo hay que agregar " + ind); 
									$("#reservaMultipleRow .rowMultiple:nth-child("+ind+")").remove();
									addMultipleRow();
								}else{alert("borrar nomas");$("#reservaMultipleRow .rowMultiple:nth-child("+ind+")").remove();}
	});

	$("#reservaMultipleRow ").on('change','.rowMultiple select', function(){
									var ind=$('.rowMultiple select').index(this)+1;
									$("#reservaMultipleRow .rowMultiple:nth-child("+ind+")").removeClass('bg-success').addClass('bg-danger');
								});
	$("#reservaMultipleRow ").on('change','.rowMultiple .multipleH1', function(){
									var ind=$('.rowMultiple .multipleH1').index(this)+1;
									$("#reservaMultipleRow .rowMultiple:nth-child("+ind+")").removeClass('bg-success').addClass('bg-danger');
								});
	$("#reservaMultipleRow ").on('change','.rowMultiple .multipleH2', function(){
									var ind=$('.rowMultiple .multipleH2').index(this)+1;
									$("#reservaMultipleRow .rowMultiple:nth-child("+ind+")").removeClass('bg-success').addClass('bg-danger');
								});

});//fin de $(document).ready()
     


	

//*******************************************************************************************************************************
//*******************************************************  FUNCIONES  ***********************************************************
//*******************************************************************************************************************************

//muestra un panel determinado y carga los datos correspondientes en él 
function mostrarPanel(nombrePanel){
	switch (nombrePanel){
		case 'Categorias': cargarTablaCategorias();break;
		case 'Reservas': cargarTablaReservas();break;
		case 'Usuarios': cargarTablaUsuarios();break;
		case 'Recursos': cargarSelectCategorias("#filtroCat"); cargarTablaRecursos();break;
		case 'Personas': cargarTablaPersonas();break;
		case 'Configuracion':cargarTablaFechasNR();break;
		default: break;
	}
	
	$('#panel'+nombrePanel).show();
}
//**************************************************funciones de formularios*********************************************************

//resetear formulario
function resetForm(formulario){
	document.getElementById(formulario).reset();
}

//ABRO FORMULARIO agregar categorias
function addCategorias(){
	resetForm('categoriasForm');
	$("#errCat").html("");
	$('#accionCateg').attr('value','agregar');
	$('#categoriasModal').modal('show');
	$('#categ').focus();
}


//ABRO FORMULARIO actualizar categorias
function fnUpdateCategorias(ind){
	$("#categ").val($("#contentCateg table tr:eq("+ind+") td:eq(0)").html());
	$("#idCateg").attr('value',$("#contentCateg table tr:eq("+ind+")").data('id'));
	$("#accionCateg").attr('value','editar');
	$("#categoriasModal").modal('show');	
	$('#categ').focus();
}


//ABRO FORMULARIO agregar recursos y lo blanqueo. cargo el select categorias
function addRecursos(){
	resetForm('recursosForm');
	$("#errRec").html("");
	$('#accionRecurso').attr('value','agregar');
	$('#recursosModal').modal('show');
	cargarSelectCategorias("#selectCategoria");
	$('#selectCategoria').focus();
}


//ABRO FORMULARIO actualizar recursos y le cargo los valores del item a actualizar
function fnUpdateRecursos(ind){
	cargarSelectCategorias("#selectCategoria",$("#contentRecursos table tr:eq("+ind+") td:eq(1)").html());
	$("#recurso").val($("#contentRecursos table tr:eq("+ind+") td:eq(0)").html());
	$("#idRecurso").attr('value',$("#contentRecursos table tr:eq("+ind+") ").data('id'));
	$("#cantRecurso").val($("#contentRecursos table tr:eq("+ind+") td:eq(3)").html());
	$("#descRecurso").val($("#contentRecursos table tr:eq("+ind+") td:eq(2)").html());
	$("#accionRecurso").attr('value','editar');	
	$("#recursosModal").modal('show');
	$('#selectCategoria').focus();//$("#selectCategoria option[value=25]").attr("selected",true)
}


//ABRO FORMULARIO agregar recursos y lo blanqueo. cargo el select categorias
function addUsuarios(){
	resetForm('usuariosForm');
	$("#errUser").html("");
	$('#accionUsuario').attr('value','agregar');
	$('#usuariosModal').modal('show');
	cargarSelectPersonas("#selectPersona");
	$("#selectPersona ").attr("disabled",false);
	$('#selectPersona').focus();
}


//ABRO FORMULARIO actualizar recursos y le cargo los valores del item a actualizar
function fnUpdateUsuarios(pers,user,permiso,iduser){
	cargarSelectPersonas('#selectPersona',pers);
	$("#selectPersona ").attr("disabled",true);
	$("#usuario").val(user);
	$("#idUsuario").attr('value',iduser);
	$("#permisoReserva option[value="+permiso+"]").prop("selected",true);
	$("#accionUsuario").attr('value','editar');
	$("#usuariosModal").modal('show');	
	$('#permisoReserva').focus();
}

//ABRO FORMULARIO agregar reservas, lo blanqueo y cargo los valores predeterminados.
function addReservas(){
	resetForm('reservaForm');
	reservaObj="";
	$("#btnReservaOk").removeClass('oculto');$("#btnEditFechas, #btnEditRec").addClass('oculto');
	$("#nbreReservador").html(usuarioActual.apellido+", "+usuarioActual.nombre);
	cargarSelectPersonas('#respons',usuarioActual.persona);
	usuarioActual.permiso==1?$("#respons").prop('disabled',false):$("#respons").prop('disabled',true);
	$("#reservaForm input").prop('disabled',false);
	$("#btnReservaOk, #btnReservar").prop('disabled',false);
	$('#accionReserva').attr('value','agregar');
	$('#rowsReserva').html("");
	$('#reservasModal').modal('show');
	$('#descReserva').focus();
}

//ABRO FORMULARIO actualizar reservas
function fnUpdateReservas(ind,lista){
	reservaObj=null;
	if($(lista +" table tr:eq("+ind+")").data('resp')==$(lista+" table tr:eq("+ind+")").data('id')){
		$("#nbreReservador").html($(lista+" table tr:eq("+ind+") td:eq(2)").html());
	}else{
		$("#nbreReservador").html("ADMIN");
	}
	$("#headReserva :input").prop('disabled',true);
	$("#btnEditFechas, #btnEditRec").removeClass('oculto').prop('disabled',false);;
	$("#btnReservaOk").addClass('oculto');
	cargarSelectPersonas('#respons',$(lista+" table tr:eq("+ind+")").data('resp'));
	$("#descReserva").val($(lista+" table tr:eq("+ind+") td:eq(3)").html());
	$("#fInicioReserva").val($(lista+" table tr:eq("+ind+") td:eq(0)").html().slice(0,10));
	$("#fFinalReserva").val($(lista+" table tr:eq("+ind+") td:eq(1)").html().slice(0,10))
		.datepicker("option", "maxDate", new Date(convFecha($("#fInicioReserva").val(),'00:00:00')
			.getTime()+config.diasAmplitud*1000*60*60*24));
	$("#hora1").val($(lista+" table tr:eq("+ind+") td:eq(0)").html().slice(11,16));
	$("#hora2").val($(lista+" table tr:eq("+ind+") td:eq(1)").html().slice(11),16);
	$("#idReserva").prop('value',$(lista+" table tr:eq("+ind+")").data('reserva'));
	$("#accionReserva").attr('value','editar');
	$("#reservasModal").modal('show');	
	$('#descReserva').focus();
	$("#rowsReserva").html("");
	//guardo los valores de la reserva en un objeto
//alert("valor de inicio "+$("#fInicioReserva").val());
	reservaObjOriginal = new Reserva($(lista+" table tr:eq("+ind+")").data('id'),
					 $(lista+" table tr:eq("+ind+")").data('resp'),
					 convFecha($("#fInicioReserva").val(),$("#hora1").val()),
					 convFecha($("#fFinalReserva").val(),$("#hora2").val()),
					 $("#descReserva").val(),
					 $("#idReserva").val());

	//reservaObj = reservaObjOriginal;			
		var detalleOriginal = $.parseJSON($(lista+" table tr:eq("+ind+") td:eq(5)").html());	
		$.each(detalleOriginal, function(i,val){
			var det = new DetalleReserva(val.cat,val.id_recurso,val.cantidad);
			reservaObjOriginal.addDet(det);
		})	


	////////////////////////////////////////////////////////////////////	
	cargarDetalle($(lista+" table tr:eq("+ind+") td:eq(5)").html());
	//console.log(reservaObj);
	$("#rowsReserva :input").prop("disabled",true);
}

//ABRO FORMULARIO agregar personas y lo blanqueo.
function addPersonas(){
	resetForm('personasForm');
	$("#errPersona").html("");
	$('#accionPersona').attr('value','agregar');
	$('#personasModal').modal('show');
	$('#documento').focus();
}

//ABRO FORMULARIO actualizar personas y le cargo los valores del item a actualizar
function fnUpdatePersona(ind){
	$("#apellido").val($("#contentPersonas table tr:eq("+ind+") td:eq(0)").html());
	$("#nombre").val($("#contentPersonas table tr:eq("+ind+") td:eq(1)").html());
	$("#email").val($("#contentPersonas table tr:eq("+ind+") td:eq(2)").html());
	$("#direccion").val($("#contentPersonas table tr:eq("+ind+") td:eq(3)").html());
	$("#telefono").val($("#contentPersonas table tr:eq("+ind+") td:eq(4)").html());
	$("#documento").val($("#contentPersonas table tr:eq("+ind+") td:eq(5)").html());
	$("#idPersona").attr('value',$("#contentPersonas table tr:eq("+ind+")").data('id'));
	$("#accionPersona").attr('value','editar');
	$("#personasModal").modal('show');	
	$('#documento').focus();
}
//*************************************************** LOGIN-PERMISOS ***************************************************************

//cuando se realiza un login exitoso se muestra el usuario actual, sino se llama la pantalla de login
function actualizarPerfil(usuario){
	if(!$("#id_hidden").val()){
		console.log("parece que no hay usuario registrado ");
		$("#logout, #nbre_user, #changePass").css("display","none");
		$("#login_a").css("display","block");
		$("#submitLogin").show().removeAttr("disabled");
		$("#loginModal .modal-title").html("Ingreso");
		$("#accionLogin").prop('value','ingresar')
		$("#loginModal").modal('show');//muestro el formulario de login al inicio
		$("#usuar").focus();
	}
	else{//el usuario está registrado
		//console.log("el  usuario registrado es "+ usuario.user)
		if(usuario){
			$("#nbre_user span").html(usuario.user);
			$("#logout, #nbre_user, #changePass").css("display","block");
			$("#login_a").css("display","none");
		
		}
		adminPermisos(usuario);
	}
	
}
function bloquearMenus(){
	$("#menuAdmin, #linkRecursos, #linkReservas").hide();
}
function adminPermisos(usuario){//admin-creador-autorizado-invitado
	//1-ADMIN :puede crear, modificar y eliminar todo. 
	//2-AUTORIZADO : puede realizar reservas y modificar las suyas propias
	//3-INVITADO : puede ver reservas y recursos
	//4-NO AUTORIZADO: no puede acceder
	if(usuario!=null){
		if(usuario.blanqueado == 1){
				$("#changePass").trigger("click");
				$("#add_err_log").html('Debe cambiar su contrase&#241;a').removeClass('bg-success text-success')
				.addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
				$("#loginModal").modal('show');
			}else{

		switch (usuarioActual.permiso){
			case '1':$("#menuAdmin, #linkRecursos, #linkReservas").show();
					mostrarPanel("Reservas");
					break;
			case '2':$("#linkRecursos, #linkReservas").show();
					mostrarPanel("Reservas");
					$("#btnAddRecursos").hide();
					break;
			case '3':$("#linkReservas").show();
					$("#add_reservas").hide();
					mostrarPanel("Reservas");
					break;
			default:console.log("default");break;}
		
		//"NO debe cambiar su contraseña."
		};
	}
}

function convFecha(fecha,hora){
	var f = fecha.split("/");
	var h = hora.slice(0,6).split(":");
	
	return  new Date(+f[2],+f[1]-1,+f[0],+h[0],+h[1]);
}
function fechaISO(fecha){//alert("esta es la fecha "+fecha);
	var f =fecha.toLocaleDateString().split("/");
	return f[2].toString()+"-"+f[1].toString()+"-"+f[0].toString()+" "+fecha.toLocaleTimeString();
}

function strToDate(arr){
	//arr=[d,m,a,h,min];
	var d=new Date();
	d.setFullYear(arr[2],arr[1],arr[0]);
	d.setHours(arr[3],arr[4],0,0);
	return d;
}
function addReservaRow(){
	var elem = "<div class='rowReserva bg-danger col-sm-12'><div class='col-sm-3'><select class='form-control rowCategoria'></select></div>"
						+"<div class='col-sm-3' ><select class='form-control rowRecurso'><option disabled selected>recurso</select></div>"
                        +"<div class='col-sm-3 '><input class='form-control rowCantidad' type='number' min= '0' max= '0' name='' value='0' placeholder='cantidad'></div>"
                        +"<div class='col-sm-1  '><span class='form-control-static rowMax ' ></span></div>"
                        +"<div class='col-sm-1' ><button id='' type='button' class='btn btn-default  addRowReserva'><i class='glyphicon glyphicon-ok'></i></button></div>"
                        +"<div class='col-sm-1'><button id='' type='button' class='btn btn-default removeRowReserva' disabled><i class='glyphicon glyphicon-remove'></i></button></div>"
                        +"</div>  "
	$("#rowsReserva").append(elem);
	var ind = $(".rowReserva").length;
	cargarSelectCategorias(".rowReserva:nth-child("+ind+") .rowCategoria");
}

function restaurarRowReserva(indice){//alert("restaurar rowReserva");
	var detalle = reservaObj.obtDetalle(indice-1);
	cargarSelectCategorias(".rowReserva:nth-child("+indice+") .rowCategoria", detalle.categoria);
	cargarSelectRecursos(detalle.categoria, ".rowReserva:nth-child("+indice+") .rowRecurso", detalle.recurso);
	cargarCantRecurso(detalle.recurso,indice,0,reservaObj.nroReserva);
	$(".rowReserva:nth-child("+indice+")").removeClass('bg-danger').addClass('bg-success');
}

function cargarPrueba(f1,f2,data){
	f1.setHours(7,0,0,0);f2.setHours(23,0,0,0);
	var f1= f1.getTime();
	var f2= f2.getTime(); 
	var dif = (f2-f1)/(1000*60*60*24)>7?Math.floor((f2-f1)/(1000*60*60*24)):7; 
	var a=[];
	var dia;
	var elem = "<table class='table table-bordered table-condensed table-hover'><tbody><tr><th scope='row' class='fijar fijarTop bg-primary'>Hora</th>";
	var i;
	for(i=0; i <=dif; i++){
		a.push(new Date(f1));
			switch(a[i].getDay()){
				case 1:dia= "Lun";break;
				case 2:dia= "Mar";break;
				case 3:dia= "Mie";break;
				case 4:dia= "Jue";break;
				case 5:dia= "Vie";break;
				default:dia= " ";break;
			};
			if(a[i].getDay()>0 && a[i].getDay()<6){
				elem+="<td class='bg-primary fijarTop text-center' >"+dia+"<br>"+a[i].toLocaleDateString()+"</td>";
			}else{
				elem+="<td class='bg-danger'> </td>";
			}
		f1 = f1+(1000*60*60*24);
	}
	
	var h,m,hora,min,cont,f;
	elem+="</tr>";
	for(h = 7; h < 24; h++){
		hora = h<10?'0'+h.toString():h.toString();
		for(m = 1; m < 60; m+= 30){
			min = m<10?'0'+m.toString():m.toString();
			
				
				elem+="<tr><th class=' fijar bg-primary'>"+hora+":"+min+"</th>";
				
				for(var j=0; j <=dif; j++){					
					f=a[j];f.setHours(hora,min,0,0);
					cont=0;
					for (i = 0; i < data.length; i++){
						if(data[i].inicio < f && f < data[i].final &&a[j].getDay()>0 && a[j].getDay()<6){
							cont+=parseInt(data[i].cantidad);
						}
					}
					
					if(cont != 0){ 
						elem+="<td class='bg-info text-center' data-toggle='tooltip' data-placement='bottom' title='Disponible: "+eval($('#datosRecursos table td:eq(2)').html()-cont)+"'>"+cont+"</td>";
						
					}else{
						elem+="<td class='bg-danger'></td>";
						
					}
				
				
			
		}
		elem+="</tr>"
		}
	}

	elem+="</tbody></table>";
	return elem;	
}

//Devuelve una clave de 10 caracteres al azar
function rndPass(){
	
	var newpass ='';
	for(var n=0; n < 10;n++){
		switch(Math.floor(Math.random()*3)){
			case 0: newpass += String.fromCharCode(Math.floor(Math.random()*(57-48)+48 )) ;break;
			case 1: newpass += String.fromCharCode(Math.floor(Math.random()*(90-63)+63 )) ;break;
			case 2: newpass += String.fromCharCode(Math.floor(Math.random()*(122-97)+97 )) ;break;
			default:console.log("ups, error al generar pass");break;
		}
	}
	return newpass;
}
function ocultarRecuperar(){
	$("#recuperarPassModal").modal('hide');
}
function obtValorPermiso(valor){

	switch(valor){
		case '1':return'Admin';break;
		case '2':return 'Autorizado';break;
		case '3':return 'Invitado';break;
		case '4':return 'No autorizado';break;
		default:return '';break;
	}

}



function fnMostrarReserva(ind,lista){
	var creador=$(lista+" table tr:eq("+ind+")").data('id');
	
	var elem="<table class='table table-condensed  table-bordered'><tbody>"+
			"<tr><th class='bg-primary'>Creado por</th><td>";

	if(creador == $(lista+" table tr:eq("+ind+")").data('resp')){
		elem+=$(lista+" table tr:eq("+ind+") td:eq(2)").html()+"</td></tr>";}
	else{elem+="ADMIN";}
			 
	
	elem+="</td></tr>"+
			 "<tr><th class='bg-primary'>Responsable</th><td>"+$(lista+" table tr:eq("+ind+") td:eq(2)").html()+"</td></tr>"+
			 "<tr><th class='bg-primary'>Inicio</th><td>"+$(lista+" table tr:eq("+ind+") td:eq(0)").html()+"</td></tr>"+
			 "<tr><th class='bg-primary'>Final</th><td>"+$(lista+" table tr:eq("+ind+") td:eq(1)").html()+"</td></tr>"+
			 "<tr><th class='bg-primary'>Descripci&oacute;n</th><td>"+$(lista+" table tr:eq("+ind+") td:eq(3)").html()+"</td></tr>"+
			 "</tbody></table> ";
	$("#reservaData").html(elem);
	
	var datos=JSON.parse($(lista+" table tr:eq("+ind+") td:eq(5)").html());
	elem="<table class='table table-condensed table table-bordered'><tbody>"+
			 "<tr><th class='bg-primary' colspan='2'>Recursos</th></tr>";
	for(var i=0; i < datos.length;i++){
		elem+="<tr><td>"+datos[i].recurso+"</td><td>"+datos[i].cantidad+"</td></tr>";
	}	 
	elem+="</tbody></table> ";
			 
	$("#reservaDetalle").html(elem);
	$("#verReservasModal").modal('show');
}

function cargarTablaFechasNR(){
	var elem = "<table class='table table-bordered table-condensed'><thead><th colspan='3' class='bg-primary text-center'>Fechas No Reservables</th></thead><tbody>"; 
	if(fechasDeshabilitadas.length==0){
		elem+="<tr><td class='text-center'>Ninguna</td></tr>";
	}else{
		$.each(fechasDeshabilitadas,function(ind, val){
			elem+="<tr  class='text-center' data-id='"+val.id+"'><td>"+val.fecha+"</td><td>"+val.descripcion+"</td>"+
			"<td><a class='delete-fecha'><span class='glyphicon glyphicon-remove'></span></a></td></tr>";
		});
	}
	elem+="</tbody></table>";
	$("#tablaNR").html(elem);
}


function cargarTablaSistema(){
	var elem = "<table class='table table-bordered table-condensed'><thead class='bg-primary'><th class='text-center'>Inicio</th><th class='text-center'>Final</th><th class='text-center'>Inicio</th>Recurso</thead><tbody>"; 
	
	if(fechasDeshabilitadas.length==0){
		elem+="<tr><td class='text-center'>Ninguna</td></tr>";
	}else{
		$.each(fechasDeshabilitadas,function(ind, val){
			elem+="<tr  class='text-center' data-id='"+val.id+"'><td>"+val.fecha+"</td><td>"+val.descripcion+"</td>"+
			"<td><a class='delete-fecha'><span class='glyphicon glyphicon-remove'></span></a></td></tr>";
		});
	}
	elem+="</tbody></table>";

	$("#tablaSistema").html(elem);
}


//////////////////al presionar enter realizar  busquedas directamente
//esto es un ejemplo nada mas y debe estar dentro de $.ready();
$("#clave").keypress(function(e) {
       if(e.which == 13) {
          // Acciones a realizar, por ej: enviar formulario.
          $('#frm').submit();
       }
});
function addMultipleRow(){
	var elem="<div class='rowMultiple col-sm-12  bg-danger'><div class='col-sm-4'><select class='form-control input-sm'>"+
		"<option>Seleccionar</option><option value='1'>Lunes</option><option value='2'>Martes</option><option value='3'>Mi&eacute;rcoles"+
		"</option><option value='4'>Jueves</option><option value='5'>Viernes</option></select></div><div class='col-sm-3'><input "+
		"class='multipleH1 input-sm form-control' type='time'></div><div class='col-sm-3'><input class='multipleH2 input-sm"+
		" form-control ' type='time'></div><div class='input-group-btn '><button class='btn btn-xs addMultiple'  type='button'>"+
		"<span class='glyphicon glyphicon-ok'></span></button><button class='btn btn-xs removeMultiple' type='button'><span "+
		"class='glyphicon glyphicon-minus'></span></button></div></div>";
		$("#reservaMultipleRow").append(elem);
	}

function cargarConfiguracion(){
	config=new Config();
	cargarFechasDeshabilitadas();
	cargarTablaSistema();
	//cargarSelectSistema();
	horariosReserva=cargarHorariosReserva();
	$("#filtro1R, #filtro2R").val(new Date($.now()).toLocaleDateString());
	$("#cantSistema").prop('max','0');
	cargarSelectCategorias("#categoriaSistema");
	addMultipleRow();
}

function cargarDetalle(arrdetalle){
	try{ 
		data = $.parseJSON(arrdetalle);
		$.each(data,function(i,val){
			var det = new DetalleReserva(val.cat, val.id_recurso, val.cantidad);
			//reservaObj.addDet(det);
			addReservaRow();
			var ind = $(".rowReserva").length;
			cargarSelectCategorias(".rowReserva:nth-child("+ind+") .rowCategoria",val.cat);
			cargarSelectRecursos(val.cat,".rowReserva:nth-child("+ind+") .rowRecurso",val.id_recurso);
			$(".rowReserva:nth-child("+ind+") .rowCantidad").val(val.cantidad).attr('max',parseInt(val.cantidad));
		});
		$("#rowsReserva .rowReserva").removeClass('bg-danger').addClass('bg-success');
		//addReservaRow();
	}catch(err){console.log("ERROR: "+err)}
}