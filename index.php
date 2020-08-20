<?php include('parciales/cabecera.php') ?>

 <?php include('parciales/usuarios.php') ?> 
 <?php include('parciales/categorias.php') ?> 
 <?php include('parciales/recursos.php') ?> 
 <?php include('parciales/personas.php') ?>
 <?php include('parciales/reservas.php') ?>
 <?php include('parciales/configuracion.php') ?>

<!-- pantalla de login -->
<div class=" container col-md-12">
  <div id="loginModal" class="modal" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">

          <!--modal header-->
          <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>

            <div  class="center-block avatar"> 
              <img src='image/avatar.png' class="img-circle " ></img>
            </div>
            <h4 class="modal-title text-primary">Ingresar</h4>   
          </div>

          <!--modal body -->
          <div class="modal-body">
            <div class="container-fluid ">
            
              <div class="err" id="add_err_log"></div>
              <br>
              <form action="" method="post" class="form-horizontal col-md-8 col-md-offset-2" id="logForm">  
                <div class="row">
                  <div class="input-group input-group-md   center-block">
                    <input class="form-control" type="text" id="usuar" name="usuar" placeholder="Usuario" required autofocus /> 
                  </div></div>
                  <br>
                  <div class="row">
                    <div class="input-group input-group-md  ">
                      <input  type="password" id="password" name="password" class="form-control " required placeholder="Contrase&#241;a" />
                      <span  id="verPass" class="glyphicon glyphicon-eye-open input-group-addon"></span>
                    </div>
                  </div>
                  <br>
                <input type="submit"  class="btn btn-primary center-block" id="submitLogin" value="Ingresar" />  
              </form>  
            </div>
          </div>

          <!--modal footer-->
          <div class="modal-footer ">
            <a href="#" id="btnNewPass" data-toggle="tooltip" data-placement="bottom" title="Recuperar clave" >Recuperar Contrase&#241;a</a>
            <input type="hidden" name="accion_login" id="accionLogin" value="ingresar">
          </div>
          
         
      </div>    
    </div>
  </div>
</div>


<!-- pantalla de recuperar contraseña -->
<div class=" container col-md-12">
  <div id="recuperarPassModal" class="modal" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">

          <!--modal header-->
          <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>

            <div  class="center-block avatar"> 
              <img src='image/avatar.png' class="img-circle " ></img>
            </div>
            <h4 class="modal-title text-primary">Recuperar Contrase&#241;a</h4>   
          </div>

          <!--modal body -->
          <div class="modal-body">
            <div class="container-fluid ">
            
              <div class="err" id="add_err_recuperar"></div>
              <br>
              <form action="" method="post" class="form-horizontal col-md-8 col-md-offset-2" id="recuperarForm">  
                <div class="row">
                  <div class="input-group input-group-md  text-center center-block">
                    <input class="form-control" type="text" id="recUsuario" name="rec_usuario" placeholder="Ingrese su Usuario" required autofocus /> 
                  </div></div>
                  <br>
                  
                <input type="submit"  class="btn btn-primary center-block" id="submitRecuperar" value="Enviar" />  
              </form>  
            </div>
          </div>
      </div>    
    </div>
  </div>
</div>



<!-- // Modal mensajes en pantalla -->
<div class=" container-fluid col-md-12 center-block">
  <div id="msgModal" class="modal " tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content justify-content-center align-items-center ">
          <!--modal body -->
          <div class="modal-body">
            <div class="container-fluid ">
              <div class="procesando text-center" style="display: none"> <img src="image/cargando.gif"></div>
              <div class=" text-center" id="msgText" ><h3></h3></div>                
            </div>
          </div>  
          <!--modal footer-->
          <div class="modal-footer ">
            <div class="row-fluid "> <button id="btnMsgOk" autofocus data-dismiss="modal" class="btn btn-primary btn-responsive center-block" >OK</button></div>
           
          </div>
      </div>    
    </div>
  </div>
</div>

<?php include('parciales/pie.php') ?>