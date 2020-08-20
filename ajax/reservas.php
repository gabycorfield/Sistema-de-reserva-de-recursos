<?php  
    include "conexion.php";
error_reporting(E_ALL ^ E_NOTICE);
    $fecha_inicio = $_POST['inicio'];  
   // $fecha_final = final;  
    $mysqli=$conn;  
    

    echo "hola como estas ".$fecha_inicio;
    if($mysqli){
        $query = "SELECT * FROM reservas WHERE inicio>='$fecha_inicio'";  
        $result = mysqli_query($mysqli,$query)or die(mysqli_error($mysqli));  
        $num_row = mysqli_num_rows($result);  
        $row=mysqli_fetch_array($result);  
        
        if( $num_row >=1 ) {  
            echo $result;  
            
        }  
        else{  
            echo 'false';  
        }  

        mysqli_close($conn);
    }
   
?>  
      