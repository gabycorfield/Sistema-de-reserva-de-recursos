

//**********************************************funciones de login********************************************************************
//chequea si el usuario y pass ingresados son correctos
function chequearLogin(e){
		$.ajax({
			method: "POST",
			url: "ajax/login.php",
			data:{accion_login:'ingresar',usuar :$("#usuar").val(),password:$("#password").val()},	
			beforeSend:function(){$("#add_err_log").html("Chequeando...").removeClass('bg-success text-success').addClass('bg-danger text-danger');},
			success:function(data){ 
				try{
				var datos = $.parseJSON(data);
					if(datos.status==='ok'){ 
						$("#add_err_log").html('Bienvenido').removeClass('bg-danger text-danger').addClass('bg-success text-success')
						.show(200).delay(2500).hide(200, function(){
															$("#loginModal").modal('hide');
															//cargarUsuario(datos.resp[0]);
														}
						);//alert("usuario "+datos.resp);
						$("#id_hidden").val(datos.resp);						
					}else{
						$("#add_err_log").html('Usuario y/o Contraseña incorrectos').removeClass('bg-success text-success')
						.addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ; 	
						$("#usuar").focus();
					$("#submitLogin").attr('disabled',false);
					};
				}catch(err){$("#add_err_log").html("error").removeClass('bg-success text-success').addClass('bg-danger text-danger ').show(200).delay(2500).hide(200) ;
							$("#submitLogin").attr('disabled',false);	
			}
			},
			error:function(){$("#add_err_log").html('Se ha producido un error al intentar ingresar').removeClass('bg-success text-success ').addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
							$("#submitLogin").attr('disabled',false);
						}	
		});
			
		
	e.preventDefault();
}

function cargarUsuario(usuario){
	$.ajax({
			method: "POST",
			url: "ajax/login.php",
			data:{accion_login:'obtener',usuar :usuario},
			success:function(data){ 
				try{
				var datos = $.parseJSON(data);
					if(datos.status=='ok'){
					usuarioActual = new Usuario(datos.resp[0],datos.resp[1], datos.resp[2],datos.resp[3], datos.resp[4], datos.resp[5], datos.resp[6]);
					actualizarPerfil(usuarioActual);
					}else{
						$("#add_err_log").html('Usuario y/o Contraseña incorrectos').removeClass('bg-success text success').
						addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ; 	
						$("#usuar").focus();
					};
				}catch(err){
					$("#add_err_log").html(data).removeClass('bg-success text-success').addClass('bg-danger text-danger')
					.show(200).delay(2500).hide(200) ;}
			},
			error:function(){
				$("#add_err_log").html('Se ha producido un error al intentar ingresar').removeClass('bg-success text-success')
				.addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;}	
		});
			
		
	

}
//chequea si el usuario y pass ingresados son correctos

function changePass(e){
	var datos = {accion_usuario :'cambiar', usuario:usuarioActual.id, password:$("#password").val()};
		$.ajax({
			method: "POST",
			url: "ajax/CRUDUsuario.php",
			data:datos,
			success:function(data){ 
					console.log("data "+data);
					$("#add_err_log").html(data).removeClass('bg-danger text-danger').addClass('bg-success text-success')
					.show(200).delay(2500).hide(300, function(){
														$("#loginModal").modal('hide');
													});	
					},
			error:function(){
						$("#add_err_log").html('Error al cambiar la contrase&#241;a').removeClass('bg-success text-success')
						.addClass('bg-danger text-danger').show(200).delay(2500).hide(200);
						$("#submitLogin").attr('disabled',false);
					}	
		});
			
		
	e.preventDefault();
}
//***********************************Funciones ABM y selects de CATEGORIAS*******************************************************************************************
//carga tabla categorias
function cargarTablaCategorias(){

	$.ajax({
		url: "ajax/CRUDCategoria.php",
		data:{accion_categ:'mostrar',sentido:$("#contentCateg").data('sentido'), buscarCat:$("#buscarCat").val()},
		method: 'POST',
		beforeSend:function(){$("#contentCateg").html("<div><image src='image/cargando.gif'></div>");},
		success:function(data){ 
			try{
				data = $.parseJSON(data);
				
				var elem = "<table class='table table-hover'><thead> <tr class='bg-primary'><th><button value='ASC' class='btn-primary'>Categor&iacute;a</button></th></tr></thead><tbody>";
				$.each(data, function(i,val){
					elem+="<tr data-id="+val.id+"><td>"+val.categoria+"</td><td  class='text-center oculto'><a class='delete-cat opciones' ><span class='glyphicon glyphicon-trash'></span></a></td><td  class='text-center oculto'><a class='edit-cat opciones'  ><span class='glyphicon glyphicon-pencil '></span></a></td></tr>";
				});
				elem+="</tbody></table>";
				$("#contentCateg").html(elem);
			}catch(err){
				$("#contentCateg").html(data);
			}
		},
		error:function(data){$("#contentCateg").html("Ha ocurrido un error...");console.log("error" +data.status);}});
		
}

//agrega categoria
function fnSubmitCategorias(datos){
	$.ajax({
		method: "POST",
		url: "ajax/CRUDCategoria.php",
		data:datos,
		beforeSend:function(){  $("#categoriasModal,#msgModal").modal('toggle');
								$("#msgModal .procesando, #btnMsgOk").toggle();},
		success:function(data){
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			cargarTablaCategorias();
		},
		error:function(jqXHR, textStatus, errorThrown){
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(("Ha ocurrido un error.. "+jqXHR.status))
		}, fail:function(jqXHR, textStatus, errorThrown ){ $("#msgModal .procesando").hide();
		$("#msgModal #msgText h3").html(jqXHR.status);}
	});
}

//elimina categoria
function fnEliminarCat(ind){
	if(confirm("¿Está seguro que desea eliminar este registro?")){
	$.ajax({
		url: "ajax/CRUDCategoria.php",
		data:{accion_categ:'eliminar', id_categ:ind},
		beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
		method: 'POST',
		success:function(data){ 
			cargarTablaCategorias();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		},
		error:function(data){
			cargarTablaCategorias();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			console.log("error" +data.status);}
	});
	}
}

//carga las categorias en la lista indicada
function cargarSelectCategorias(lista,seleccion){//alert(" cargarselectcat2 "+ind);
	$.ajax({
		url: "ajax/CRUDCategoria.php",
		data:{accion_categ:'mostrar',sentido:"ASC"},
		method: 'POST',
		success:function(data){ 
			var elem = "<option selected value=''>Categor&iacute;as</option>";
			try{
				data = $.parseJSON(data);	
				$.each(data, function(i,val){
					elem+="<option value="+val.id+">"+val.categoria+"</option>";
				});
				
				$(lista).html(elem);
				$(lista+" option:contains("+seleccion+")").attr("selected",true);
				if(typeof Number(seleccion)=='number'){
					$(lista+" option[value="+seleccion+"]").attr("selected",true);
				}
			}catch(err){
				$(lista).html(err);

			}
		},
		error:function(data){$(lista).html("Ha ocurrido un error...");console.log("error" +data.status);}});
		
}

/////////////////////////////////////??????????????'''''''''''????????????????????????????
function cargarfiltroCategorias(){
	$.ajax({
		url: "ajax/CRUDCategoria.php",
		data:{accion_categ:'mostrar', sentido:'ASC'},
		method: 'POST',
		success:function(data){ 
			try{
				data = $.parseJSON(data);
				
				var elem = "<option  selected value=''>Todas las categor&iacute;as</option>";
				$.each(data, function(i,val){
					elem+="<option value="+val.id+">"+val.categoria+"</option>";
				});
				
				$("#filtroCat").html(elem);
				
			}catch(err){
				$("#filtroCat").html(data);
			}
		},
		error:function(data){$("#filtroCat").html("Ha ocurrido un error...");console.log("error" +data.status);}});
		
}
//**********************************Funciones ABM y select de RECURSOS ***************************************************************************
//carga la tabla RECURSOS
function cargarTablaRecursos(){

	var ord = $("#contentRecursos").data('orden')+" "+$("#contentRecursos").data('sentido');
	if($("#contentRecursos").data('orden')=='categoria'){ord+=', recurso ASC';}
var dat={accion_recurso:'mostrar', orden:ord, filtroCat:$("#filtroCat").val(), buscarRec:$("#buscarRec").val()};
	$.ajax({
		url: "ajax/CRUDRecurso.php",
		data:dat,
		method: 'POST',
		beforeSend:function(){$("#contentRecursos").html("<div><image src='image/cargando.gif'></div>");},
		success:function(data){ 
			try{
				data = $.parseJSON(data);
				
				var elem = "<table class='table table-hover'> <thead><tr class='bg-primary'><th><button value='recurso' class='btn-primary'>Recurso</button></th><th><button value='categoria' class='btn-primary'>Categor&iacute;a</button></th><th>Descripci&oacute;n</th><th class='text-center'>Cantidad</th><th class='text-center'>Ver</th></tr></thead><tbody>";
				$.each(data, function(i,val){
					//console.log(val.id + "-");
					elem+="<tr data-id="+val.id+"></td><td>"+val.recurso+"</td><td>"+val.categoria+"</td><td>"+val.descripcion+"</td><td class='text-center'>"+val.cantidad+"</td><td class='text-center'><a class='ver-rec'  ><span class='glyphicon glyphicon-eye-open '></span></a></td><td class='text-center oculto'><a class='edit-rec'  ><span class='glyphicon glyphicon-pencil '></span></a></td><td class='text-center oculto'><a class='delete-rec' ><span class='glyphicon glyphicon-trash'></span></a></td></tr>";
				});
				elem+="</tbody></table>";
				$("#contentRecursos").html(elem);
			}catch(err){
				$("#contentRecursos").html(data);
			}
		},
		error:function(data){$("#contentRecursos").html("Ha ocurrido un error...");console.log("error" +data.status);},
		fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});

}


//agrega recurso
function fnSubmitRecursos(datos){
	$.ajax({
		method: "POST",
		url: "ajax/CRUDRecurso.php",
		data:datos,
		beforeSend:function(){  $("#recursosModal, #msgModal").modal('toggle');
								$("#msgModal .procesando, #btnMsgOk").toggle();},
		success:function(data){//alert(datos);
			cargarTablaRecursos();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		},
		error:function(data){
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		}
	});
}

//carga datos de un recurso seleccionado, y sus reservas vigentes
function fnVerRecursos(ind){
	$("#datosRecursos").html("<div class='table-responsive  text-center '><table class='container-fluid  table table-condensed table-bordered '>"
		+"<tbody ><div ><tr class='bg-primary'><th class='text-center'>Recurso</th><th class='text-center'>Categor&iacute;a</th>"
		+"<th class='text-center'>Cantidad</th><th class='text-center'>Descripci&oacute;n</th></tr><tr class=''><td>"
		+$("#contentRecursos table tr:eq("+ind+") td:eq(0)").html()+"</td><td>"+$("#contentRecursos table tr:eq("+ind+") td:eq(1)").html()
		+"</td><td >"+$("#contentRecursos table tr:eq("+ind+") td:eq(3)").html()+"</td><td >"+$("#contentRecursos table tr:eq("+ind+") td:eq(2)").html()
		+"</td></tr></div></tbody></table></div>");
	
	var hoy=new Date();
	$.ajax({
		url: "ajax/CRUDDetalle.php",
		data:{accion_detalle:'filtroRecurso',recurso:$("#contentRecursos table tr:eq("+ind+")").data('id'),
			 fecha:fechaISO(hoy)},
		method: 'POST',
		beforeSend:function(){$("#tablaResRecursos").html("<div><image src='image/cargando.gif'></div>");},
		success:function(data){ 
			console.log(data);
			try{
				data = $.parseJSON(data);

				var elem = "<table class='table table-hover'> <tr><th><button value='inicio'>Desde</button></th><th><button value='final'>Hasta</button></th><th><button value='Apellido'>Cantidad</button></th></tr><tbody>";
				$.each(data, function(i,val){					
					elem+="<tr><td>"+val.inicio+"</td><td>"+val.final+"</td><td class='text-center'>"+val.cantidad+"</td>";										
				});
				elem+="</tbody></table>";
				$("#tablaResRecursos").html(elem);
				$("#visualResRecursos").html(calendarioRecurso(data));
			}catch(err){
				$("#tablaResRecursos").html(data);
				$("#visualResRecursos").html(data);
			}
		},
		error:function(data){$("#tablaResRecursos").html("Ha ocurrido un error...");console.log("error" +data.status);},
		fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});

	$("#verRecModal").modal('show');

}

function calendarioRecurso(data){
	var aux,i,arr=[];
	for (i=0; i < data.length; i++){
		arr.push({inicio:strToDate([data[i].inicio.slice(0, 2),data[i].inicio.slice(3, 5)-1,data[i].inicio.slice(6, 10),data[i].inicio.slice(11, 13),data[i].inicio.slice(15, 17)]),
					final:strToDate([data[i].final.slice(0, 2),data[i].final.slice(3, 5)-1,data[i].final.slice(6, 10),data[i].final.slice(11, 13),data[i].final.slice(15, 17)]),
					cantidad:data[i].cantidad});
	}

	var d=new Date(arr[0].inicio); d.setHours(7,0,0,0);//strToDate([data[0].inicio.slice(0, 2),data[0].inicio.slice(3, 5)-1,data[0].inicio.slice(6, 10),7,0]);
	var d2= new Date(d);
	for( i = 0; i < arr.length;i++)
	{//console.log(" array: "+arr[i]);
		aux = new Date(arr[i].final); aux.setHours(23,0,0,0);//strToDate([data[i].final.slice(0, 2),data[i].final.slice(3, 5)-1,data[i].final.slice(6, 10),23,0]);
		if(aux > d2){d2=new Date(aux);}
	}
	
	var elem=cargarPrueba(new Date(),d2,arr);
	return elem;
}

//elimina recurso
function fnEliminarRec(ind){
	if(confirm("¿Está seguro que desea eliminar este registro?")){
		$.ajax({
			url: "ajax/CRUDRecurso.php",
			data:{accion_recurso:'eliminar', id_recurso:ind},
			beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
			method: 'POST',
			success:function(data){ 
				cargarTablaRecursos();
				$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			},
			error:function(data){
				$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
				cargarTablaRecursos();
				console.log("error" +data.status);}
		});
	}
}

//carga los recursos de una categoria determinada en la lista indicada
function cargarSelectRecursos(cat,lista,seleccion){
	$.ajax({
		url: "ajax/CRUDRecurso.php",

		data:{accion_recurso:'filtrar', filtro:cat},
		method: 'POST',
		success:function(data){ 
			var elem = "<option value='' selected disabled>recurso</option>";
			try{
				data = $.parseJSON(data);
						
				$.each(data, function(i,val){
					elem+="<option  data-cant='"+val.cantidad+"' value="+val.id+">"+val.nbre_recurso+"</option>";
				});
				//alert(elem);
				$(lista).html(elem);
				$(lista+" option:contains("+seleccion+")").attr("selected",true);
				if(typeof Number(seleccion)=='number'){$(lista+" option[value="+seleccion+"]").attr("selected",true);}
			}catch(err){
				$(lista).html(err);
				//$(".rowReserva:nth-child("+ind+") .rowRecurso").html(data);
			}
		},
		error:function(data){$(lista).html("Ha ocurrido un error...");console.log("error" +data.status);}});
		
}
//*************************************Funciones ABM y selects USUARIOS ***************************************************************
//carga la tabla de Usuarios
function cargarTablaUsuarios(){
	var ord = $("#contentUsuarios").data('orden')+" "+$("#contentUsuarios").data('sentido'); 
	if($("#contentUsuarios").data('orden')=='ap'){ord+=', nbre ASC';}

	$.ajax({
		url: "ajax/CRUDUsuario.php",
		data:{accion_usuario:'mostrar',orden:ord, buscarUser:$("#buscarUser").val(), filtroUser:$("#filtroUser").val()},
		method: 'POST',
		beforeSend:function(){$("#contentUsuario").html("<div><image src='image/cargando.gif'></div>");},
		success:function(data){
			try{
				data = $.parseJSON(data);
				var elem = "<table class='table table-hover table-bordered'><thead> <tr class='bg-primary'><th>"+
				"<button value='ap' class='btn btn-primary'>Nombre</button></th><th><button value='user' class='btn btn-primary'>"+
				"Usuario</button></th><th><button value='permiso' class='btn btn-primary'>Permiso</button></th></tr></thead><tbody>";
				$.each(data, function(i,val){
					elem+="<tr data-id="+val.id_user+" data-persona="+val.id_persona+"><td>"+val.ap+", "+val.nbre+"</td><td>"+val.user+
					"</td><td style='display:none'>"+val.permiso+"</td><td >"+obtValorPermiso(val.permiso)+
					"</td><td class='text-center oculto'><a class='edit-user'><span class='glyphicon glyphicon-pencil'></span></a></td>"+
					"<td class='text-center oculto'><a class='clear-pass'><span class='glyphicon glyphicon-refresh '></span></a></td>"+
					"<td class='text-center oculto'><a class='delete-user'><span class='glyphicon glyphicon-remove'></span></a ></td></tr>";
				}); 
				elem+="</tbody></table>";
				$("#contentUsuarios").html(elem);

			
			}catch(err){
				$("#contentUsuarios").html(data);
			}
		},
		error:function(data){$("#contentUsuarios").html("Ha ocurrido un error...");console.log("error" +data.status);
	}});

	

}
//agrega usuario
function fnSubmitUsuarios(datos){
	$.ajax({
		method: "POST",
		url: "ajax/CRUDUsuario.php",
		data:datos,
		beforeSend:function(){  $("#usuariosModal, #msgModal").modal('toggle');
								$("#msgModal .procesando, #btnMsgOk").toggle();},
		success:function(data){//alert(datos);
			cargarTablaUsuarios();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		},
		error:function(data){
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		}
	});
}

//anula usuario
function fnEliminarUser(ind){//NO ELIMINA - SOLO ANULA 
	if(confirm("¿Está seguro que desea anular este usuario?")){
	$.ajax({
		url: "ajax/CRUDUsuario.php",
		data:{accion_usuario:'eliminar', id_usuario:ind},
		beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
		method: 'POST',
		success:function(data){ 
			cargarTablaUsuarios();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		},
		error:function(data){
			cargarTablaUsuarios();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			console.log("error" +data.status);}
	});
	}
}

//blanquea la clave del usuario indicado
function fnBlanquearUser(usuario){
	if(confirm("¿Está seguro que desea blanquear la clave de este usuario?")){
	$.ajax({
		url: "ajax/CRUDUsuario.php",
		data:{accion_usuario:'recuperar', usuario:usuario, password:rndPass()},
		beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
		method: 'POST',
		success:function(data){ 
			try{
				data = $.parseJSON(data);
				cargarTablaUsuarios();
				$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data.resp);
			}catch(e){
				$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(e.status);
			}
		},
		error:function(data){
			cargarTablaUsuarios();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			console.log("error" +data.status);}
	});
	}
}


//genera clave provisoria y la envia al usuario
function recuperarClave(usuario){
	$.ajax({
		url: "ajax/CRUDUsuario.php",
		data:{accion_usuario:'recuperar', usuario:usuario, password:rndPass()},
		method: 'POST',
		beforeSend:function(){$("#add_err_recuperar").html("Procesando...").removeClass('bg-success text-success').addClass('bg-danger text-danger');},
		success:function(data){ 
		$("#submitRecuperar").attr('disabled',true);
			try{
				data = $.parseJSON(data);
				if(data.status='ok'){
					$("#add_err_recuperar").html(data.resp).removeClass('bg-danger text-danger').addClass('bg-success text-success')
					.show(200).delay(2500).hide(200, ocultarRecuperar) ;
				}
				else{
					$("#add_err_recuperar").html(data.resp).removeClass('bg-success text-success').addClass('bg-danger text-danger')
					.show(200).delay(2500).hide(200,ocultarRecuperar) ;
				}
			}catch(err){console.log("error 0: "+err);
				$("#add_err_recuperar").html("Error al recuperar la clave").removeClass('bg-success text-success')
				.addClass('bg-danger text-danger').show(200).delay(2500).hide(200,ocultarRecuperar) ;
			}
		},
		error:function(data){console.log("error 1: "+data);$("#add_err_recuperar").html("Error al recuperar la clave").removeClass('bg-success text-success')
		.addClass('bg-danger text-danger').show(200).delay(2500).hide(200,ocultarRecuperar) ;}
		
	});
}
//***********************************Funciones ABM y selects de PERSONAS *************************************************************
//carga la tabla personas
function cargarTablaPersonas(){
	var ord = $("#contentPersonas").data('orden')+" "+$("#contentPersonas").data('sentido');
	if($("#contentPersonas").data('orden')=='apellido'){ord+=', nombre ASC';
	}else{
		ord+=', nombre ASC';
	} 
	$.ajax({
		url: "ajax/CRUDPersona.php",
		data:{accion_persona:'mostrar', orden:ord, buscarPers:$("#buscarPers").val()},
		method: 'POST',
		beforeSend:function(){$("#contentPersonas").html("<div><image src='image/cargando.gif'></div>");},
		success:function(data){ 
			try{
				data = $.parseJSON(data);
				
				var elem = "<table class='table table-hover'><thead> <tr class='bg-primary'><th><button value='apellido' class='btn-primary'>"+
				"Apellido</button></th><th><button value='nombre' class='btn-primary'>Nombre</button></th><th>E-mail</th><th class='text-center"+
				" oculto'>Direcci&oacute;n</th><th class='text-center oculto'>Tel&eacute;fono</th><th class='text-center oculto'>DNI</th>"+
				"<th class='mas'>+</th></tr></thead><tbody>";
				$.each(data, function(i,val){
					console.log(val.id + "-");
					elem+="<tr data-id="+val.id+"><td>"+val.apellido+"</td><td>"+val.nombre+"</td><td>"+val.email+"</td><td class='text-center oculto'>"+
					val.direccion+"</td><td class='text-center oculto'>"+val.telefono+"</td><td class='text-center oculto'>"+val.dni+
					"</td><td class='text-center oculto'><a class='edit-pers'><span class='glyphicon glyphicon-pencil'></span></a></td><td class='text-center oculto'><a class='delete-pers' ><span class='glyphicon glyphicon-trash'></span></a></td></tr>";
				});
				elem+="</tbody></table>";
				$("#contentPersonas").html(elem);
			}catch(err){
				$("#contentPersonas").html(data);
			}
		},
		error:function(data){$("#contentRecursos").html("Ha ocurrido un error...");console.log("error" +data.status);},
		fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});

}
//agrega persona
function fnSubmitPersonas(datos){
	$.ajax({
		method: "POST",
		url: "ajax/CRUDPersona.php",
		data:datos,
		beforeSend:function(){  $("#personasModal, #msgModal").modal('toggle');
								$("#msgModal .procesando, #btnMsgOk").toggle();},
		success:function(data){//alert(datos);
			cargarTablaPersonas();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		},
		error:function(data){
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		}
	});
}

//elimina personas
function fnEliminarPersona(ind){ 
	if(confirm("¿Está seguro que desea eliminar esta persona?")){
	$.ajax({
		url: "ajax/CRUDPersona.php",
		data:{accion_persona:'eliminar', id_persona:ind},
		beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
		method: 'POST',
		success:function(data){ 
			cargarTablaPersonas();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		},
		error:function(data){
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			cargarTablaPersonas();
			console.log("error" +data.status);}
	});
	}
}

//carga listado de personas en SELECT #selectPersona de usuariosModal y pasando parametro selección, tb se selecciona dicho valor
function cargarSelectPersonas(lista,seleccion){
if (!seleccion){}
	$.ajax({
		url: "ajax/CRUDPersona.php",
		data:{accion_persona:'mostrar', orden:'apellido ASC, nombre ASC'},
		method: 'POST',
		success:function(data){ //console.log(data);
			try{//alert(data);alert("selecccion de persona "+seleccion);
				data = $.parseJSON(data);
				var elem = "<option disabled selected>Selecciona una opci&oacute;n</option>";
				$.each(data, function(i,val){
					elem+="<option value="+val.id+">"+val.apellido+", "+val.nombre+"</option>";
				});
				$(lista).html(elem);
				$(lista +" option[value="+seleccion+"]").prop('selected',true);
			}catch(err){
				$(lista).html(data);
			}
		},
		error:function(data){$(lista).html("Ha ocurrido un error...");console.log("error" +data.status);}});
		
}

//************************************************ Funciones de RESERVAS **********************************************************************
//carga tabla reservas
function cargarTablaReservas(){
	var ord = $("#contentReservas").data('orden')+" "+$("#contentReservas").data('sentido');
	if($("#contentReservas").data('orden')=='Apellido'){ord+=', Nombre ASC';}
	
	$.ajax({
		url: "ajax/CRUDReservas.php",
		data:{accion_reserva:'mostrar',f1:fechaISO(convFecha($("#filtro1R").val(),'00:00')),
				f2:fechaISO(convFecha($("#filtro2R").val(),'23:59')),txt:$("#filtrotxtR").val(), orden:ord},
		method: 'POST',
		beforeSend:function(){$("#contentReservas").html("<div><image src='image/cargando.gif'></div>");},
		success:function(data){ 
			//console.log(data);
			try{
				data = $.parseJSON(data);
				var elem = "<table class='table table-hover'><thead> <tr class='fijarTop bg-primary'><th>"+
				"<button value='inicio' class='btn-primary'>Desde</button></th><th><button value='final' class='btn-primary'>"+
				"Hasta</button></th><th><button value='Apellido' class='btn-primary'>Responsable</button></th>"+
				"<th>Recursos</th><th>Ver</th></thead><tbody>";
				$.each(data, function(i,val){	
					elem+="<tr data-id="+val.id_persona+" data-resp="+val.responsable+" data-reserva="+val.id+"><td>"+val.Desde+
					"</td><td>"+val.Hasta+"</td><td class='bg-alert '>"+val.Apellido+", "+val.Nombre+"</td><td style='display:none'>"+
					val.descripcion+"</td>";

					if (val.detalle.length == 1) {
						elem+="<td>"+val.detalle[0].recurso+" ("+val.detalle[0].cantidad+")</td>";
					}else{
						if(val.detalle.length == 0){
							elem+="<td>Ninguno</td>";
						}else{
							elem+="<td>Varios</td>";	
						}
					}
					elem+="<td style='display:none'>"+JSON.stringify(val.detalle)+"</td>";
					elem+="<td class='text-center'><a class='ver-reserva'><span class='glyphicon glyphicon-eye-open'></span></a>"+
					"</td><td class='text-center oculto'><a class='delete-reserva' ><span class='glyphicon glyphicon-trash'></span>"+
					"</a></td><td class='text-center oculto'><a class='edit-reserva'><span class='glyphicon glyphicon-pencil '></span></a></td></tr>";
				});

				elem+="</tbody></table>";

				$("#contentReservas").html(elem);
				$("#misReservas").html(elem);
				$("#misReservas table tbody tr").each(function(){
					if($(this).data('resp')!= usuarioActual.persona){$(this).css('display','none');}
				});

			}catch(err){
				$("#contentReservas").html(data);$("#misReservas").html(data);
			}
		},
		error:function(data){$("#contentReservas").html("Ha ocurrido un error...");console.log("error" +data.status);},
		fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});
}

//agrega nueva reserva
function fnSubmitReserva(datos){
	$.ajax({
		method: "POST",
		url: "ajax/CRUDReservas.php",
		data:datos,
		beforeSend:function(){  $("#reservasModal, #msgModal").modal('toggle');
								$("#msgModal .procesando, #btnMsgOk").toggle();},
		success:function(data){
			$("#btnReservar").attr('disabled',true);
			if($.isNumeric(data)){//si me devuelve un numero entonces se llevo a cabo la reserva(devuelve el id)
				fnSubmitDetalle({accion_detalle:'agregar',datos:datos.detalle_reserva, reserva:data});
			}else{
				cargarTablaReservas();//cargarPruebas();
				$("#msgModal .procesando, #btnMsgOk").toggle();
				$("#msgModal #msgText h3").html("Ha ocurrido un error al ingresar la reserva");

			};

		},
		error:function(data){
			$("#errPersona").html(("Ha ocurrido un error.. "+data));
		}
	});
}
//actualizar solamente los datos de reserva
function fnUpdateReserva(datos,reservaId,arrCambiar,arrBorrar,arrAgregar){
	arrMensaje=[];
	var contAcciones=0;
	$("#reservasModal, #msgModal").modal('toggle');
	$("#msgModal .procesando, #btnMsgOk").toggle();

	
	if(datos!={}){
		contAcciones++;
	}

	if(arguments.length>1){
		if(arrCambiar.length>0){
			contAcciones++;
		}
		if(arrBorrar.length>0){
			contAcciones++;
		}
		if(arrAgregar.length>0){
			contAcciones++;
		}
		if(arrCambiar.length>0){
			fnUpdateDetalle(contAcciones,{accion_detalle:'editar',reserva:reservaId,datos:arrCambiar});
		}
		if(arrBorrar.length>0){
			fnUpdateDetalle(contAcciones,{accion_detalle:'eliminar',reserva:reservaId,datos:arrBorrar});
		}
		if(arrAgregar.length>0){
			fnUpdateDetalle(contAcciones,{accion_detalle:'agregar',reserva:reservaId,datos:arrAgregar});
		}
	}
	if(datos!={}){
		fnUpdateDatos(contAcciones,datos);
	}
	
};


//actualiza, borra o agrega detalleReserva y datos
function fnUpdateDatos(cant,datos){
	if(datos!={}){
		$.ajax({
			method: "POST",
			url: "ajax/CRUDReservas.php",
			data:datos,  
			success:function(data){
				$("#btnReservar").attr('disabled',true);
				//console.log(data);
				arrMensaje.push(data+'</br>');
				
			},
			error:function(data){
				console.log("Ha ocurrido un error.. "+data+'</br>');
				arrMensaje.push("Ha ocurrido un error.. "+data+'</br>');
			},
			complete:function(){
				mostrarMensaje(cant);
			}
		});
	}
	
}

function mostrarMensaje(cant){
	if(arrMensaje.length==cant){
		cargarTablaReservas();
		$("#btnReservar").attr('disabled',true);
		$("#msgModal .procesando, #btnMsgOk").toggle();
		$("#msgModal #msgText h3").html(arrMensaje);
	}
}
function fnUpdateDetalle(cant,datos){
	var accion='';
	switch(datos.accion_detalle){
		case 'eliminar': accion='eliminaron';break;
		case 'editar':accion='actualizaron';break;
		case 'agregar':accion='agregaron';break;
		default: accion='';break;
	}
	
	if(datos!= {}){
		return $.ajax({
			method: "POST",
			url: "ajax/CRUDDetalle.php",
			data:datos,
			success:function(data){
				try{
					data = $.parseJSON(data);var cont=0;
					$.each(data, function(i,val,a){if(val=="ok"){cont++};});
				
				arrMensaje.push("Se "+accion+" "+cont+"/"+data.length+" recursos.<br>");
			}catch(err){
				arrMensaje.push("Ocurri&oacute; un error al "+accion+". "+err);
			}

			},
			error:function(data){
				//$("#errPersona").html(("Ha ocurrido un error.. "+data));
				console.log("Ha ocurrido un error.. "+data+'</br>');
				arrMensaje.push(data);
			},
			complete:function(){
				mostrarMensaje(cant);
			}
		});
	}
	
}

//agrega el detalle de la reserva
function fnSubmitDetalle(datos){
	$.ajax({
		method: "POST",
		url: "ajax/CRUDDetalle.php",
		data:datos,
		success:function(data){
			try{data = $.parseJSON(data);var cont=0;
				$.each(data, function(i,val,a){if(val=="ok"){cont++};});
				//if(cont == data.length){}
				$("#msgModal .procesando, #btnMsgOk").toggle();
				$("#msgModal #msgText h3").html("Se reservaron "+cont+"/"+data.length+" recursos.");
				cargarTablaReservas();
			}catch(err){$("#msgModal .procesando, #btnMsgOk").toggle();
				$("#msgModal #msgText h3").html("Ocurri&oacute; un error al reservar recursos. "+err);
			}

		},
		error:function(data){
			$("#msgModal .procesando, #btnMsgOk").toggle();
			$("#msgModal #msgText h3").html("Ocurrió un error. "+data);
		}
	});
}

//elimina reserva
function fnEliminarReserva(ind){ 
	if(confirm("¿Está seguro que desea anular esta reserva?")){
	$.ajax({
		url: "ajax/CRUDReservas.php",
		data:{accion_reserva:'eliminar', id_reserva:ind},
		beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
		method: 'POST',
		success:function(data){ 
			cargarTablaReservas();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
		},
		error:function(data){
			cargarTablaReservas();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			console.log("error" +data.status);}
	});
	}
}

//carga la cantidad disponible de cada recurso seleccionado en el proceso de reserva
function cargarCantRecurso(rec,ind,seleccion,reserva){
	//alert("esta es la fecha que mando "+fechaISO(convFecha($("#fInicioReserva").val(),$("#hora1").val())));
	var max=null;
	var total = parseInt($(".rowReserva:nth-child("+ind+") .rowRecurso option[value="+rec+"]").data('cant'));
	$.ajax({
		url: "ajax/CRUDDetalle.php",
		data:{accion_detalle:'filtrarRecursoFechas',filtro:rec,fecha1:fechaISO(convFecha($("#fInicioReserva").val(),$("#hora1").val())),fecha2:fechaISO(convFecha($("#fFinalReserva").val(),$("#hora2").val()))},
		method: 'POST',
		success:function(data){//console.log(data);
			try{
				data = $.parseJSON(data);//data contiene las reservas de este recurso vigentes entre f1 y f2	
				var cont;
				var f1=convFecha($("#fInicioReserva").val(),$("#hora1").val()).getTime();
				var f2 =convFecha($("#fFinalReserva").val(),$("#hora2").val()).getTime();
				for(var ff = f1+10;ff < f2; ff+=1000*60*30){
					cont=0;
					$.each(data, function(i,val){
						var a=new Date(val.inicio).getTime();
						var b=new Date(val.final).getTime();						
						if(a<=ff && ff<= b && reserva!=val.reserva){
							cont+=parseInt(val.cantidad);}
					});

					if(max==null){
						max=parseInt(cont);
					}else{
						if(cont>max){
							max=parseInt(cont);}
					}
				}			
		//console.log("max: "+max);
			}catch(err){
				$(".rowReserva:nth-child("+ind+") .rowMax").html("/".concat(total));
				$(".rowReserva:nth-child("+ind+") .rowCantidad").attr('max',Number(total)).val(seleccion);

			}
			if(max==null){max=0;}
			$(".rowReserva:nth-child("+ind+") .rowMax ").html("/".concat(total-max));
			$(".rowReserva:nth-child("+ind+") .rowCantidad").attr('max',Number(total)-max).val(seleccion);
			if($(".rowReserva:nth-child("+ind+") .rowCantidad").val()==0 || 
			 Number($(".rowReserva:nth-child("+ind+") .rowCantidad").val())> Number($(".rowReserva:nth-child("+ind+") .rowMax ").html().slice(1)))
			{
				$(".rowReserva:nth-child("+ind+")").addClass('bg-danger').removeClass('bg-success');
			}
		},
		error:function(data){$(".rowReserva:nth-child("+ind+") .rowMax").html("Error...");
				console.log("error cantidad recurso" +data.status);}
		
		})
		
		
}


//************************************************Funciones de configuración*******************************

//carga tabla de fechas deshabilitadas(feriados)
function cargarFechasDeshabilitadas(){
	$.ajax({
		url: "ajax/CRUDConfiguracion.php",
		data:{accion_fechas:'mostrar'},
		method: 'POST',
		success:function(data){ 
		try{
				data = $.parseJSON(data);
				fechasDeshabilitadas = data; cargarTablaFechasNR();$("#fechaNR").datepicker("refresh" ).val(null);
			}catch(err){console.log("error...no hay fechas deshabilitadas");}
			
		},
		error:function(data){console.log("error" +data.status);},
		fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});
}


//agrega feriado
function agregarFechasDeshabilitadas(){
	if(!$("#fechaNR").val()){
		$("#err_deshabilitar").html("Debe seleccionar una fecha").addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
	}else{if(!$("#fechaDesc").val()){$("#err_deshabilitar").html("debe ingresar una descripci&oacute;n").addClass('bg-danger text-danger').show(200).delay(2500).hide(200) ;
		  $("#fechaDesc").focus();
		}else{
		$.ajax({
			url: "ajax/CRUDFechasDeshabilitadas.php",
			data:{accion_fechas:'agregar', fecha:fechaISO(convFecha($("#fechaNR").val(),'00:00')), descripcion:$("#fechaDesc").val()},
			method: 'POST',
			success:function(data){ 
				console.log("resultado de agregar fechas: "+ data);
				$("#fechaNR").val("");
				fechasDeshabilitadas=cargarFechasDeshabilitadas();
				//cargarTablaFechasNR();
				$("#fechaDesc").val("");$("#fechaDesc").val(null);
			},
			error:function(data){console.log("error" +data.status);},
			fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});
	
	}
	}

}

//carga los horarios de configuración
function cargarHorariosReserva(){
	var resultado =[];
	$.ajax({
		url: "ajax/CRUDConfiguracion.php",
		data:{accion_conf:'mostrar'},
		method: 'POST',
		success:function(data){ 
		try{
				data = $.parseJSON(data);
				horarios = data; 
				$("#primeraH").val(data[0].minReserva);
				$("#ultimaH").val(data[0].maxReserva);
				$("#anticipoR").val(data[0].diasAnticipacion);
				$("#amplitudR").val(data[0].diasAmplitud);
			}catch(err){console.log("error...no hay datos cargados");}
		return resultado;
			
		},
		error:function(data){console.log("error" +data.status);},
		fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});
	
	return resultado;
}

//guarda datos de horarios de configuración
function fnGuardarConf(cambiar,valor){
	var datos;
	switch(cambiar){
		case 1:datos={accion_conf:'cambiar1', hora:valor};break;
		case 2:datos={accion_conf:'cambiar2', hora:valor};break;
		case 3:datos={accion_conf:'cambiar3', dias:valor};break;
		case 4:datos={accion_conf:'cambiar4', dias:valor};break;
	}
	$.ajax({
			url: "ajax/CRUDConfiguracion.php",
			data:datos,
			method: 'POST',
			beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
			success:function(data){ 
				console.log("resultado de agregar fechas: "+ data);
				$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
				
			},
			error:function(data){$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);},
			fail:function(jqXHR, textStatus, errorThrown){$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(textStatus);}});
	
	
};

//eliminar fecha deshabilitada(feriado)
function fnEliminarFecha(ind){ 
	if(confirm("¿Está seguro que desea eliminar esta fecha?")){
	$.ajax({
		url: "ajax/CRUDFechasDeshabilitadas.php",
		data:{accion_fechas:'eliminar', id:ind},
		beforeSend:function(){
						$("#msgModal").modal('toggle');
						$("#msgModal .procesando, #btnMsgOk").toggle();},
		method: 'POST',
		success:function(data){ 
			cargarFechasDeshabilitadas();
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);			
		},
		error:function(data){
			$("#msgModal .procesando, #btnMsgOk").toggle();$("#msgModal #msgText h3").html(data);
			cargarTablaPersonas();
			console.log("error" +data.status);}
	});
	}
}

//agrega reservas para los recursos deshabilitando horarios en los que no está disponible el mismo
function fnReservaSistema(user,f1,f2,rec,cant,desc,detalle){
	var d,o;
	var reservas=[];
	var ff=convFecha(f1,'00:00').getTime();
	var ff2=convFecha(f2,'00:00').getTime();
	$.each(detalle,function(i,val){
		for(var i=ff; i <= ff2; i=i+1000*60*60*24){
			d = new Date(i);
			if(d.getDay() == val.dia){
				o=d.toLocaleString().split(' ');
				reservas.push({f1:fechaISO(convFecha(o[0],val.h1)),f2:fechaISO(convFecha(o[0],val.h2))});
			}
		}
	});
		$.ajax({
			url: "ajax/CRUDReservas.php",
			data:{accion_reserva:'reservaMasiva', fechas:JSON.stringify(reservas), id:user, descripcion:'SISTEMA-'+desc},
			method: 'POST',
			success:function(data1){ console.log("es success "+ data1);
				try{		 
					 $.ajax({
						url: "ajax/CRUDDetalle.php",
						data:{accion_detalle:'reservaMasiva', reservas:data1, recurso:rec,cantidad:cant},
						method: 'POST',
						success:function(data){ console.log("es success el detalle"+data);
							try{
								 var data = $.parseJSON(data);console.log(data);
								 
							}catch(e){console.log(e.textStatus);}
						},
						error:function(data){console.log("error" +data.status);},
						fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});

				}catch(e){}
			},
			error:function(data){console.log("error" +data.status);},
			fail:function(jqXHR, textStatus, errorThrown){console.log(textStatus)}});
	
}





