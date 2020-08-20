<?php  
    session_start();  
    
    unset($_SESSION['usuario']); 
    if(session_destroy()) {
    header('Location: ../index.php'); 
  }
    
?>  