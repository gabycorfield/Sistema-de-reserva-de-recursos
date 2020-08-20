<!--  calendario reservas principal -->
<div id='panelReservas' class="panel panel-primary ">
    <div class="panel-heading">
        Panel RESERVAS
        <button id="add_reservas" class="btn btn btn-default" onclick="addReservas()">Agregar</button>
        <button type="button" class="close" aria-hidden="true" onclick="$('#panelReservas').css('display','none')">&times;</button>
    </div>
    <div class="panel-body">
        <div>
            <div id="mostrarReservas" class="col-md-12">
                <div class="col-sm-12 form-inline">
                  <input type="text" id="filtrotxtR" name="" placeholder="apellido, nbre, descr..." class="col-sm-2 form-control">
                  <div class="col-sm-5 form-group row"><label >Vigente entre </label><input type="text" id="filtro1R" readonly="readonly"  size="8" class="form-control" >
                  <label >y</label><input type="text" id="filtro2R" readonly="readonly" size="8" class="form-control" ></div>
                  <div class="col-sm-2"><button class="form-control" id="btnBuscarReservas">Filtrar</button></div>
                </div>  

                <div>
                    <!-- Tab list -->
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation" ><a href="#contentReservas" aria-controls="contentReservas" role="tab" data-toggle="tab">General</a></li>
                        <li role="presentation" class="active"><a href="#misReservas" aria-controls="misReservas" role="tab" data-toggle="tab">Mis reservas</a></li>                         
                    </ul>
                    <!-- Tab panes -->
                    <div class="tab-content">
                      <div role="tabpanel" class="tab-pane  col-lg-12 table-responsive " id="contentReservas" ></div>
                      <div role="tabpanel" class="tab-pane active col-lg-12 table-responsive" id="misReservas">Mis reservas</div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>  
</div> 


<!-- modal- formulario para cargar reservas -->
<div class="modal" id="reservasModal" tabindex="-1" role="dialog" aria-labelledby="reservando" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="reservando">Reserva</h4>
                <button class="btn btn-primary oculto" id="btnEditFechas">Modificar fechas</button>
                <button class="btn btn-primary oculto" id="btnEditRec">Modificar Recursos</button>
            </div>
            <div class="modal-body">
                <form id="reservaForm" class="form-horizontal" role="form">
                    <div id="headReserva">
                        <div class="form-group">
                            <label class="col-sm-12 ">Reservado por: <span class="form-control-static" id="nbreReservador"></span></label>
                        </div>    
                        <div class="form-group">
                            <label class="col-sm-2 ">Responsable:</label>
                            <div class="col-sm-10">
                              <select class="form-control " name="respons" id="respons" ></select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 ">Descripci&oacute;n:</label>
                            <div class="col-sm-10">
                              <input class="form-control " name="desc_reserva" id="descReserva" type="text" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-6">
                                <label class="col-sm-12">Desde:</label>
                                <div class="col-sm-6"><input class="form-control col-sm-5" type="text" id="fInicioReserva" name="finicio_reserva"  readonly="readonly"required placeholder="dd/mm/aa" autocomplete="off"></div> 
                                <div class="col-sm-6"><input class= "form-control col-sm-5" type="time" name="hora1" id="hora1"min="07:00" max="23:59" value="07:00" required placeholder="hh:mm"></div>
                            </div>
                            <div class="col-sm-6">
                                <label class="col-sm-12">Hasta:</label>
                                <div class="col-sm-6">
                                    <input class="form-control" readonly="readonly" type="text" id="fFinalReserva" name="ffinal_reserva" required placeholder="dd-mm-aa" autocomplete="off">
                                </div>
                                <div class="col-sm-6">
                                    <input class="form-control" type="time" name="hora2" value="07:00" id="hora2" min="07:00" max="23:59" required>
                                </div>
                            </div>
                        </div>
                        <div class="err" id="err_reserva"></div>
                        <div class="form-group ">
                            <div class="col-sm-4"></div>
                            <div class="col-sm-4"><button type="submit" class="btn btn-primary col-sm-12" id="btnReservaOk">Confirmar fecha y hora</button> </div>
                            <div class="col-sm-4"></div>
                             
                        </div>
                        <input type="hidden" name="id_reserva" id="idReserva">
                        <input type="hidden" name="id_persona" value="" id="idPersonaReserva"> 
                        <input type="hidden" name="accion_reserva" value="" id="accionReserva">  
                    </div>
                </form>    
                    <div id="rowsReserva" class="col-sm-12 form-group overflow-auto">
                          
                    </div>
                
                
 <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnReservar" onclick="">Reservar</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            </div>
            </div>
           
        </div>
    </div>
</div>


<!-- modal- formulario para cargar reservas -->
<div class="modal" id="verReservasModal" tabindex="-1" role="dialog" aria-labelledby="verReserva" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" >Reserva</h4>
            </div>
            <div class="modal-body">
                <div class="col-md-6" id="reservaData">scsc</div>  
                <div class="col-md-6" id="reservaDetalle">fvv</div>  
                
            </div>    
            <div class="modal-footer">
               
            </div>
        </div>
    </div>
</div>
