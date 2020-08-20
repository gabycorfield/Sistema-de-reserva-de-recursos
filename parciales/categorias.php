<!--panel categorias-->
<!-- Mostrar categorias -->

<div id="panelCategorias" class="panel panel-primary overflow-auto">
	<div class="panel-heading">
		Panel CATEGORIAS
		<button id="btnAddCategorias" class="btn btn btn-default" onclick="addCategorias()">Agregar</button>
		<button type="button" class="close" aria-hidden="true" onclick="$('#panelCategorias').css('display','none')">&times;</button></div>
	<div class="panel-body">
		<div id="listCategorias">
      <!-- Buscador -->
        <div class="col-sm-12">
            <div class="col-sm-6">
              <div class="input-group">
                <input type="text" id="buscarCat" name="" placeholder="categor&#237;a ..." class="form-control">
                <span class="input-group-btn">
                  <button class="btn btn-default" id="btnBuscarCat" type="button">Buscar</button>
                </span>
              </div>
            </div>
        </div><!-- /buscador -->
		    <div id="contentCateg" class="col-lg-10 table-responsive"></div>
		</div>
	</div>	
</div>






<!-- modal add/update categorías -->

<div class=" container col-md-12">
    <div id="categoriasModal" class="modal " tabindex="-1" role="dialog" data-backdrop="static" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Categorias</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="err form-control-static" id="errCat"></p>
            <form id="categoriasForm" action="" method="post" class="form-horizontal">  
		          <div class="form-group modal-body has-feedback">
		            <label class="form-label col-sm-2">*Categoria:</label>  
                 <div class="col-sm-10">
                <input type="text" id="categ" name="categ" required  maxlength="30" class="form-control"></div>
              </div>
              <div class="">
                <input type="hidden" name="id_categ" value="" id="idCateg">
                <input type="hidden" name="accion_categ" value="" id="accionCateg"> </div>
                <p class="form-control-static mesg">* (dato requerido)</p>
		          </div>
          		<label></label><br/> 
           		<div class="modal-footer">
  	            <input type="submit"  class="btn btn-primary" id="submitCateg" value="Guardar" name="submit_cat" />  
  	            <input type="button"  class="btn btn-default" id="cancelarSubmitCat" value="Cancelar" name="botoncito"data-dismiss="modal"/> 
              </div>
    		    </form>  
          </div>
        </div> 
      </div>
    </div>
</div>
