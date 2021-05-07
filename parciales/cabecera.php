<?php @session_start(); ?> 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SISESCU</title>
 
    <!-- Bootstrap CSS File  -->
    <link rel="stylesheet" type="text/css" href="bootstrap-3.3.7-dist/css/bootstrap.css"/>
    
  
 
<!-- Bootstrap JS file -->
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="bootstrap-3.3.7-dist/css/bootstrap.min.css" />
<link rel="stylesheet" type="text/css" href="jquery.datetimepicker.min.css">
<link rel="stylesheet" type="text/css" href="jquery-ui-1.12.1.custom/jquery-ui.min.css"/>
<link rel="stylesheet" type="text/css" href="estilo.css"/>

<script src="jquery-3.3.1.js"></script>
<!-- Latest compiled and minified JavaScript -->
<script src="bootstrap-3.3.7-dist/js/bootstrap.min.js"></script> 
<script type="text/javascript" src="js/jquery.datetimepicker.full.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>    
<!--<script type="text/javascript" src="jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>-->
<!-- Custom JS file -->
<script type="text/javascript" src="js/codigoGral.js"></script>
<script type="text/javascript" src="js/codigoAjax.js"></script>
 
</head>
<body>
 <!-- Content Section -->
 <nav class="nav navbar  navbar-default navbar-fixed-top" >
  <div class=" custom container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">Sistema Escuela</a>
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu-collapse" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    
<div class="collapse navbar-collapse" id="menu-collapse">
    <ul  id="perfil" class="nav navbar-nav navbar-right">
      <li><a id = "login_a" href="#"><span class="glyphicon glyphicon-log-in"></span> Ingresar</a></li> 
      <li><a href="#" id="nbre_user" data-toggle="tooltip" data-placement="bottom" title="Usuario actual"><span class="glyphicon glyphicon-user"></span> </a></li>
      <li><a href="#" id="changePass" data-toggle="tooltip" data-placement="bottom" title="Cambiar contraseña"><span class="glyphicon glyphicon-edit"></span></a></li>
      <li><a href="ajax/logout.php" id='logout' data-toggle="tooltip" data-placement="bottom" title="Cerrar sesión"><span class="glyphicon glyphicon-log-out"></span> Salir</a></li>
      <input type="hidden" name="" id="id_hidden" value="<?php if(isset($_SESSION['id_usuario'])){echo $_SESSION['id_usuario'];}else{echo '';} ?>">
     
    </ul>  
    
    <ul class="nav navbar-nav" >
        <li class="menu-link" data-seccion="Reservas" id="linkReservas"><a href="#" >Reservas</a></li>
        <li class="menu-link" data-seccion="Recursos" id="linkRecursos"><a href="#" >Recursos</a></li>
        <li class="dropdown menu-link" data-seccion="dropdown">
          <a class="dropdown-toggle" data-toggle="dropdown" href="#" id='menuAdmin'>ABM Admin
          <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li class="sub-menu" data-seccion="Usuarios"><a href="#"  >Usuarios</a></li>
            <li class="sub-menu" data-seccion="Recursos"><a href="#"  >Recursos</a></li>
            <li class="sub-menu" data-seccion="Categorias"><a href="#" >Categor&iacute;as</a></li>
            <li class="sub-menu" data-seccion="Personas"><a href="#" >Personas</a></li>
            <li class="sub-menu" data-seccion="Configuracion"><a href="#">Configuraci&oacute;n</a></li>
          </ul>
        </li>
      </ul>
    </div>
    
  </div>
</nav>



  
