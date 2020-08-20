<!--panel recursos-->
<!-- Mostrar recursos -->

<div id="panelConfiguracion" class="panel panel-primary overflow-auto">
  <div class="panel-heading">
    Panel CONFIGURACI&#211;N    
    <button type="button" class="close" aria-hidden="true" onclick="$('#panelConfiguracion').css('display','none')">&times;</button>
  </div>
  <div class="panel-body">
    <div>

      <!-- Nav tabs -->
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#noReservable" aria-controls="home" role="tab" data-toggle="tab">Deshabilitar Fechas </a></li>
        <li role="presentation"><a href="#horarios" aria-controls="horarios" role="tab" data-toggle="tab">Horarios y fechas</a></li>
        <li role="presentation"><a href="#sistema" aria-controls="messages" role="tab" data-toggle="tab">Reservas del sistema</a></li>
        <li role="presentation"><a href="#info" aria-controls="settings" role="tab" data-toggle="tab">Informaci&oacute;n</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">

        <!-- /configuracion de fechas no reservables -->
        <div role="tabpanel" class="tab-pane active" id="noReservable">
          <div class="col-sm-12"> 
              <div class="err" id="err_deshabilitar"></div>
              <div class="col-sm-6">
                <div id="tablaNR"></div>
              </div>
              <div class="col-sm-6">
                <div >
                  <table class="table table-condensed "><th class="text-center bg-primary " >Agregar Fecha</th></table>
                  <div id="fechaNR" value="" ></div>
                  <div class="input-group">
                    <input type="text" name="" placeholder="Descripci&oacute;n" id="fechaDesc" class="form-control">
                    <span class="input-group-btn">  
                      <button id="btnAddNR" class="btn btn-primary"><span class='glyphicon glyphicon-ok'></span></button>
                    </span>
                  </div>
                </div>
              </div>
          </div>
            
        </div>           
        
        <!--Conf horarios y fechas Tab-->
        <div role="tabpanel" class="tab-pane" id="horarios">
          <div class="col-md-12 text-center">
            <h5>Horarios de reserva</h5>
          </div>
          <div class="err" id="err_confHorario"></div>
          <div class="col-md-6">
            <div class="input-group col-md-4">
              <span class="input-group-addon" id="priH">Primera hora reservable</span>
              <input type="time" class="form-control" aria-describedby="priH" disabled="disabled" id="primeraH">
              <span class="input-group-btn">  
                <button id="btnEditPrimeraH" class="btn btn-primary"><span class='glyphicon glyphicon-pencil'></span></button>
              </span>
              <span class="input-group-btn">  
                <button id="btnOkPrimeraH" class="btn btn-primary oculto" ><span class='glyphicon glyphicon-ok'></span></button>
              </span>
            </div>
          </div>
          <br>
          <div class="col-md-6">
            <div class="input-group col-md-4 ">
              <span class="input-group-addon" id="ultH">&#218;ltima hora reservable</span>
              <input type="time" class="form-control" aria-describedby="ultH" disabled="disabled" id="ultimaH">
              <span class="input-group-btn">  
                <button id="btnEditUltimaH" class="btn btn-primary"><span class='glyphicon glyphicon-pencil'></span></button>
              </span>
              <span class="input-group-btn">  
                <button id="btnOkUltimaH" class="btn btn-primary oculto"><span class='glyphicon glyphicon-ok'></span></button>
              </span>
            </div>
          </div>
          <br>
          <div class="col-md-12 text-center">
            <h5>Anticipo y amplitud de reservas</h5>
          </div>
          <div class="col-md-6">
            <div class="input-group ">
              <span class="input-group-addon" id="antR">D&iacute;as de Anticipaci&oacute;n</span>
              <input type="number" class="form-control" aria-describedby="antR" disabled="disabled" id="anticipoR" min="7" max="365">
              <span class="input-group-btn">  
                <button id="btnEditAnticipoR" class="btn btn-primary"><span class='glyphicon glyphicon-pencil'></span></button>
              </span>
              <span class="input-group-btn">  
                <button id="btnOkAnticipoR" class="btn btn-primary oculto" ><span class='glyphicon glyphicon-ok'></span></button>
              </span>
            </div>
          </div>
          <br>
          <div class="col-md-6">
            <div class="input-group ">
              <span class="input-group-addon" id="ampR">D&iacute;as de amplitud(max)</span>
              <input type="number" class="form-control" aria-describedby="ampR" disabled="disabled" id="amplitudR" min="1" >
              <span class="input-group-btn">  
                <button id="btnEditAmplitudR" class="btn btn-primary"><span class='glyphicon glyphicon-pencil'></span></button>
              </span>
              <span class="input-group-btn">  
                <button id="btnOkAmplitudR" class="btn btn-primary oculto" ><span class='glyphicon glyphicon-ok'></span></button>
              </span>
            </div>
          </div>
        </div>

        <!--Reservas de Sistema Tab-->
        <div role="tabpanel" class="tab-pane" id="sistema">
          <div class="col-md-12 "> 
              <div class="err" id="err_sistemaMult"></div>
              <div class="col-md-6 col-sm-12">
                <div id="tablaSistema"></div>
              </div>

              <div class="col-md-6 col-sm-12 ">
                <div>
                  <table class="table table-condensed row"><tr><th class="text-center bg-primary" >Agregar Fechas</th></tr></table>
                  <div class="col-md-12 form-group">
                    <div class="col-sm-6"><input id="fSistema1" type="text" name="" readonly="readonly" placeholder="dd/mm/aa" class="form-control"></div>
                    <div class="col-sm-6"><input id="fSistema2" type="text" name="" readonly="readonly" placeholder="dd/mm/aa" class="form-control"></div>
                  </div>
                  <br>
                  <div class="col-md-12 form-group">
                    <div class=" col-sm-4"><select id="categoriaSistema" class="form-control"></select></div>
                    <div class=" col-sm-5"><select id="recursoSistema" class="form-control"></select></div>
                    <div class="col-sm-3"><input type="number" id="cantSistema" class="form-control " min="0" maxlength="4"></div> 
                  </div>
                  <br>
                  <div class="form-group col-md-12">
                    <div class="input-group ">
                      <span class="input-group-addon " id="addonSistema">Sistema:</span>
                      <input type="text" name="" placeholder="Descripci&oacute;n" id="sistemaDesc" class="form-control " aria-describedby="addonSistema" maxlength="42">
                    </div>
                  </div>
                  <br>
                  <div id="reservaMultipleRow" class="col-md-12"></div>
                  <div class="col-md-12 row text-center">
                    <button class="btn btn-primary "  id="btnReservaMultiple" type="button">Reservar horarios</button>
                  </div>
                  
                </div>
              </div>
          </div>
        </div>

        <!--Informacion del Sistema Tab-->
        <div role="tabpanel" class="tab-pane" id="info">
          <div>
            <ul>
              <li>El tiempo m&iacute;nimo de reserva es 30 minutos.</li>
              <li>Permisos de usuario:
                <ul>
                  <li>ADMIN: tiene acceso a Recursos, Categor&iacute;as, Usuarios, Personas, Configuraci&oacute;n y Reservas. Puede modificar todo, incluso reservas de otros.</li>
                  <li>AUTORIZADO: tiene acceso a Recursos(sin modificarlos) y a Reservas (puede crear nuevas reservas y modificar las propias).</li>
                  <li>INVITADO: Puede ver Recursos y Reservas pero no puede modificarlos.</li>
                  <li>NO AUTORIZADO: No puede ver nada en sistema.</li>
                </ul>
              </li>
              <li>Las claves de acceso son proporcionadas por e-mail a los usuarios, a medida que se los crea. De igual modo cuando la clave es blanqueada.</li>
              <li>En configuraci&oacute;n se pueden modificar el primer y &uacute;ltimo horario de reserva. Tambi&eacute;n se pueden deshabilitar los d&iacute;as no laborables (los fines de semana están deshabilitados por defecto)</li>
              <li>En la sección Usuarios, aparte de crear y modificar usuarios, tambi&eacute;n se puede blanquear la clave de ingreso, enviando una clave provisoria al email del usuario, y se puede ANULAR al usuario, cambiando su permiso a NO AUTORIZADO.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    
  </div>  
</div>






<!-- modal add/update recursos <button id="" class="btn btn btn-default" onclick="addRecursos()">Agregar</button>

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
                <div class="col-sm-10">
                  <select class="form-control col-sm-10" id="selectCategoria" name="categoria"></select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label col-sm-2">*Recurso:</label>
                <div class="col-sm-10">
                  <input class="form-control" type="text" id="recurso" name="recurso" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label col-sm-2">Descripci&oacute;n:</label>
                <div class="col-sm-10">
                 <textarea class="form-control" name="descripcion" id="descRecurso"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label col-sm-2">*Cantidad:</label>
                <div class="col-sm-10">
                  <input class="form-control" type="number" name="cantidad" id="cantRecurso" min="0" required>
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
-->

<!-- modal ver recursos 

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
          <div>       -->
            <!--tabs
              <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#tablaResRecursos" aria-controls="tablaResRecursos" role="tab" data-toggle="tab">Listado</a></li>
                <li role="presentation"><a href="#visualResRecursos" aria-controls="visualResRecursos" role="tab" data-toggle="tab">Calendario</a></li>
              </ul>
              <div class="tab-content">
                <div id="tablaResRecursos" role="tabpanel" class="tab-pane active col-lg-10"></div>
                <div id="visualResRecursos" role="tabpanel" class="tab-pane col-lg-10"></div>       
              </div>-->
              <!--end tabs
          </div>
        </div>
        <div class="modal-footer"></div>
      </div> 
    </div>
  </div>
</div>
-->