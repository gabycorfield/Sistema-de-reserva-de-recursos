<!--panel Usuarios-->
<!-- Mostrar categorias -->

<div id="panelPersonas" class="panel panel-primary overflow-auto">
	<div class="panel-heading">
		Panel PERSONAS
		<button id="btnAddPersonas" class="btn btn btn-default" onclick="addPersonas()">Agregar</button>
		<button type="button" class="close" aria-hidden="true" onclick="$('#panelPersonas').css('display','none')">&times;</button></div>
	<div class="panel-body">
		<div id="listPersonas">
        <!-- Buscador -->
        <div class="col-sm-12">
            <div class="col-sm-6">
              <div class="input-group">
                <input type="text" id="buscarPers" name="" placeholder="Apellido o nombre ..." class="form-control">
                <span class="input-group-btn">
                  <button class="btn btn-default" id="btnBuscarPers" type="button">Buscar</button>
                </span>
              </div>
            </div>
        </div><!-- /buscador -->
		    <div id="contentPersonas" class="col-lg-12 table-responsive"></div>
		</div>
	</div>	
</div>






<!-- Agregar/editar personas -->

<div class=" container col-md-12">
    <div id="personasModal" class="modal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Personas</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="err" id="err_persona"></div>
            <form id="personasForm" action="" method="post" class="form-horizontal" role="form">  
              <div class="form-group ">
                            
                <label class="col-sm-2 text-right">* DNI:</label>  
                <div class="col-sm-5">
                  <input  class=" form-control " maxlength="8" type="text" id="documento" name="dni" required="" autofocus="" /> 
                </div>                
                <input type="hidden" name="id_persona" value="" id="idPersona"> 
                <input type="hidden" name="accion_persona" value="" id="accionPersona"> 
            </div>
              <div class="form-group">
                <label class="form-label col-sm-2 text-right">* Apellido:</label>  
                <div class="col-sm-10">
                  <input class="col-sm-10 form-control" maxlength="30" type="text" id="apellido" name="apellido" required="" />
                </div>
              </div>  
              <div class="form-group">
                <label class="form-label col-sm-2 text-right">* Nombre:</label>  
                <div class="col-sm-10">
                  <input class="col-sm-10 form-control"  maxlength="50" type="text" id="nombre" name="nombre" required="" />
                </div>
              </div>  
              <div class="form-group">
                <label class="form-label col-sm-2 text-right">* email:</label>  
                <div class="col-sm-10">
                  <input class="col-sm-10 form-control" maxlength="320" type="email" id="email" name="email"  />
                </div>
              </div>  
              <div class="form-group">
                <label class="form-label col-sm-2 text-right">Direcci&oacute;n:</label>  
                <div class="col-sm-10">
                  <input class="col-sm-10 form-control" maxlength="50" type="text" id="direccion" name="direccion"  />
                </div>
              </div>  
              <div class="form-group">
                <label class="form-label col-sm-2 text-right">Tel&eacute;fono:</label>  
                <div class="col-sm-10">
                  <input class="col-sm-10 form-control" maxlength="20" type="text" id="telefono" name="telefono" />
                </div>
              </div>  
		        
        		<label>* Datos obligatorios</label><br/> 
         		<div class="modal-footer">
	            <input type="submit" id="enviar_pers" value="Guardar" class="btn btn-primary" name="submit_pers" />  
	            <input type="button" id="cancelarAddPers"class="btn btn-default" value="Cancelar" name="botoncito"data-dismiss="modal"/>  </div>
    		  </form>  
          </div>
         
      </div>
    </div>
</div>
