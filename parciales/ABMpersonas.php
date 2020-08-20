<!--ABM personas-->
<!-- Mostrar usuarios -->
<div id="mostrarUsuarios">ffgngmgfmgh
    <div id="contenido11" class="col-md-8"></div>
</div>

<!-- Modal - agregar usuario-->
<div class="modal fade" id="add_new_record_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Agregar usuario</h4>
            </div>
            <div class="modal-body">
 			  <form>
                <div class="form-group">
                    <label for="nbre_persona">Nombre</label>*
                    <input type="text" id="nbre" placeholder="nombre" class="form-control"/>
                </div>
 
                <div class="form-group">
                    <label for="ape_persona">Apellido</label>*
                    <input type="text" id="ape" placeholder="Apellido" class="form-control"/>
                </div>
 
                <div class="form-group">
                    <label for="email_persona">Email </label>*
                    <input type="email" id="email1" placeholder="Email" class="form-control"/>
                </div>
 
 				<div class="form-group">
                    <label for="dir_persona">Direcci&oacute;n</label>
                    <input type="text" id="dir_persona" placeholder="Direcci&oacute;n" class="form-control"/>
                </div>
 
                <div class="form-group">
                    <label for="tel_persona">Tel&eacute;fono</label>
                    <input type="text" id="tel_persona" placeholder="Tel&eacute;fono" class="form-control"/>
                </div>
 
                <div class="form-group">
                    <label for="dni_persona">DNI </label>
                    <input type="text" id="dni_persona" placeholder="DNI" class="form-control"/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" >Guardar</button>
            </div>
          </form>
        </div>
    </div>
</div>
<!-- // Modal -->

<!-- Modal - actualizar usuario -->
<div class="modal fade" id="update_user_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Update</h4>
            </div>
            <form>
            <div class="modal-body">
 			  
                <div class="form-group">
                    <label for="update_first_name">First Name</label>
                    <input type="text" id="update_first_" placeholder="First Name" class="form-control"/>
                </div>
 
                <div class="form-group">
                    <label for="update_last_name">Last Name</label>
                    <input type="text" id="update_last_" placeholder="Last Name" class="form-control"/>
                </div>
 
                <div class="form-group">
                    <label for="update_email">Email Address</label>
                    <input type="text" id="update_" placeholder="Email Address" class="form-control"/>
                </div>
 
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary"  >Guardar cambios</button>
                <input type="hidden" id="hidden_user_id">
            </div>
          </form>
        </div>
    </div>
</div>
<!-- // Modal -->