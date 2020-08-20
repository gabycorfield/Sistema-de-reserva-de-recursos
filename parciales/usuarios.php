<!--panel Usuarios-->
<!-- Mostrar categorias -->

<div id="panelUsuarios" class="panel panel-primary overflow-auto">
	<div class="panel-heading">
		Panel USUARIOS
		<button id="btnAddUsuarios" class="btn btn btn-default" onclick="addUsuarios()">Agregar</button>
		<button type="button" class="close" aria-hidden="true" onclick="$('#panelUsuarios').css('display','none')">&times;</button>
  </div>
	<div class="panel-body">
		<div id="listUsuarios">
      <!-- /filtros -->
        <div class="col-sm-12">
            <div class="col-sm-3">
              <select id="filtroUser" class="form-control">
                <option value="">Todos</option>
                <option value="1">Admin</option>
                <option value="2">Autorizado</option>
                <option value="3">Invitado</option>
                <option value="4">No autorizado</option>
              </select>
            </div>

            <div class="col-sm-5">
              <div class="input-group">
                <input type="text" id="buscarUser" name="" placeholder="Usuario, apellido o nombre..." class="form-control">
                <span class="input-group-btn">
                  <button class="btn btn-default" id="btnBuscarUser" type="button">Buscar</button>
                </span>
              </div>
            </div>    
        </div> <!-- /filtros -->
		    <div id="contentUsuarios" class="col-lg-10 table-responsive"></div>
		</div>
	</div>	
</div>





<!--modal add/update  Usuarios-->

<div class=" container col-md-12">
  <div id="usuariosModal" class="modal" tabindex="-1" role="dialog" data-backdrop="static" >
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Usuarios</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>

        <div class="modal-body">  
          <form id="usuariosForm" action="" method="post" class="form-horizontal" role="form">
              <p class="err form-control-static" id="errUser"></p>
              <div class="form-group ">
                <label class="form-label col-sm-4">*Apellido y Nombre:</label> 
                <div class="col-sm-8">
                  <select class="form-control col-sm-8" id="selectPersona" name="persona" required></select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label col-sm-4">*Permiso:</label>
                <div class="col-sm-8">
                  <select class="form-control col-sm-8" id="permisoReserva" name="permiso" required>
                    <option disabled selected value="">Selecciona una opci&oacute;n</option>
                    <option value="1">Admin</option>
                    <option value="2">Autorizado</option>
                    <option value="3">Invitado</option>
                    <option value="4">No autorizado</option>
                  </select>
                </div>
              </div>
              <div class="form-group ">
                <label class="form-label col-sm-4">*Usuario:</label> 
                <div class="col-sm-8">
                  <input type="text" name="usuario" id="usuario" maxlength="20" required class="form-control col-sm-8">
                </div>
              </div>
              <div class="form-group">
                <input type="hidden" name="id_usuario" value="" id="idUsuario">
                <input type="hidden" name="accion_usuario" value="" id="accionUsuario"> 
                <div class="col-sm-10">
                  <p class="mesg form-control-static">* dato requerido</p>
                </div>
              </div>
              <div class="modal-footer ">
                <div class="col-sm-offset-2 col-sm-10">
                  <input type="submit"  class="btn btn-primary" id="submitUsuario" value="Guardar" name="submit_usuario" />  
                  <input type="button"  class="btn btn-default" id="cancelarSubmitUser" value="Cancelar" name=""data-dismiss="modal"/> 
                </div>
              </div>
          </form>
        </div>
      </div>
    </div> 
  </div>
</div>
