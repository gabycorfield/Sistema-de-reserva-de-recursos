<!--panel recursos-->
<!-- Mostrar recursos -->

<div id="panelRecursos" class="panel panel-primary overflow-auto">
  <div class="panel-heading">
    Panel RECURSOS
    <button id="btnAddRecursos" class="btn btn btn-default" onclick="addRecursos()">Agregar</button>
    <button type="button" class="close" aria-hidden="true" onclick="$('#panelRecursos').css('display','none')">&times;</button>
  </div>
  <div class="panel-body">
    <div id="listRecursos" >
        <!-- /filtros -->
        <div class="col-sm-12">
            <div class="col-sm-3">
              <select id="filtroCat" class="form-control"></select>
            </div>

            <div class="col-sm-3">
              <div class="input-group">
                <input type="text" id="buscarRec" name="" placeholder="Buscar recurso..." class="form-control">
                <span class="input-group-btn">
                  <button class="btn btn-default" id="btnBuscarRec" type="button">Buscar</button>
                </span>
              </div>
            </div>
            
        </div> <!-- /filtros -->
        <div id="contentRecursos" class="col-lg-12 table-responsive"></div>
    </div>
  </div>  
</div>






<!-- modal add/update recursos -->

<div class=" container col-md-12">
  <div id="recursosModal" class="modal " tabindex="-1" role="dialog" data-backdrop="static" >
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Recursos</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>

        <div class="modal-body"> 
          <form id="recursosForm" action="" method="post" class="form-horizontal" role="form">
              <p class="err form-control-static" id="errRec"></p>
              <div class="form-group ">
                <label class="form-label col-sm-2">*Categoria:</label> 
                <div class="col-sm-4">
                  <select class="form-control " id="selectCategoria" name="categoria"></select>
                </div>
                <label class="form-label col-sm-2">*Recurso:</label>
                <div class="col-sm-4">
                  <input class="form-control" type="text" id="recurso" maxlength="50" name="recurso" required />
                </div>
              </div>
              <div>
                <div class="form-group">
                  <label class="form-label col-sm-2" for="descRecurso">Descripci&oacute;n:</label>
                  <div class="col-sm-4">
                   <textarea class="form-control" name="descripcion" id="descRecurso"></textarea>
                  </div>
                  <label class="form-label col-sm-2" for="cantRecurso">*Cantidad:</label>
                  <div class="col-sm-3">
                    <input class="form-control" type="number" name="cantidad" id="cantRecurso" min="0" required>
                  </div>
                </div>
                
              </div>
              <div class="form-group">  
                <input type="hidden" name="id_recurso" value="" id="idRecurso">
                <input type="hidden" name="accion_recurso" value="" id="accionRecurso"> </div>
                <div class="col-sm-10">
                  <p class="mesg form-control-static">* dato requerido</p>
                </div>
              </div>
          
              <div class="modal-footer ">
                <div class="col-sm-offset-2 col-sm-10">
                  <input type="submit"  class="btn btn-primary" id="submitRecurso" value="Guardar" name="submit_recurso" />  
                  <input type="button" class="btn btn-default" id="cancelarSubmitRec" value="Cancelar" name="botoncito"data-dismiss="modal"/> 
                </div>
              </div>
           </form>
        </div>
      </div> 
    </div>
  </div>
</div>


<!-- modal ver recursos -->

<div class=" container col-md-12">
  <div id="verRecModal" class="modal " tabindex="-1" role="dialog" data-backdrop="static" >
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <div id="datosRecursos"> </div>
        </div>
        <div class="modal-body"> 
          <h5 class="text-center">Reservas Vigentes</h5>
          <div>       
            <!--tabs-->
              <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#tablaResRecursos" aria-controls="tablaResRecursos" role="tab" data-toggle="tab">Listado</a></li>
                <li role="presentation"><a href="#visualResRecursos" aria-controls="visualResRecursos" role="tab" data-toggle="tab">Calendario</a></li>
              </ul>
              <div class="tab-content">
                <div id="tablaResRecursos" role="tabpanel" class="tab-pane active col-lg-10"></div>
                <div id="visualResRecursos" role="tabpanel" class="tab-pane col-lg-10"></div>       
              </div>
              <!--end tabs-->
          </div>
        </div>
        <div class="modal-footer">  </div>
      </div> 
    </div>
  </div>
</div>
