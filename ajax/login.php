<?php  //chequea si el usuario y contraeña ingresados son correctos
    session_start();  
    include "conexion.php";
    
    if(isset($_POST['accion_login'] )&& $_POST['accion_login']){ //accion_detalle toma distintos valores según lo que va a hacer
        $accion = $_POST['accion_login'];
        

        if (@mysqli_connect_errno()) {
           die("La Conexión falló: ".mysqli_connect_errno()." : ". mysqli_connect_error());
        }

        if($accion === 'ingresar'){
            $username = $_POST['usuar'];  
            $password = md5($_POST['password']);  
            $mysqli=$conn; 
            $data = array(); 
            
            if($mysqli){
                $query = "SELECT * FROM reservas_permisos WHERE user='$username' AND pass='$password'";  
                $result = mysqli_query($mysqli,$query)or die(mysqli_error($mysqli));  
                $num_row = mysqli_num_rows($result);  
                $row=mysqli_fetch_array($result);  
                
                if( $num_row >=1 ) {  
                    $data['status'] = 'ok';
                    $data['resp']= $row['id_user'];
                     
                   // echo 'true';  
                    $_SESSION['id_usuario']=$row['id_user']; 
                   
                }  
                else{  
                    //echo 'false';  
                    $data['status'] = 'err';
                    $data['resp']= [];
                }  
                
                mysqli_close($mysqli);

        }else{
            $data['status'] = 'error';
            die(json_encode($data));

        }
        echo json_encode($data);
        }

        

        if($accion==='obtener'){
            $user = $_POST['usuar'];  
            $mysqli=$conn; 
            $data = array(); 
            
            if($mysqli){
                $query = "SELECT id_user, id_persona, user, permiso, blanqueado, personas.apellido AS apellido, personas.nombre AS nombre FROM reservas_permisos LEFT JOIN personas ON  personas.id= id_persona WHERE id_user='$user'";  
                $result = mysqli_query($mysqli,$query)or die(mysqli_error($mysqli));  
                $num_row = mysqli_num_rows($result);  
                $row=mysqli_fetch_array($result);  
                
                if( $num_row >=1 ) {  
                    $data['status'] = 'ok';
                    $data['resp']= [$row['id_user'],$row['id_persona'],$row['user'],$row['permiso'],$row['blanqueado'], $row['apellido'], $row['nombre']];
                
                }  
                else{  
                    //echo 'false';  
                    $data['status'] = 'err';
                    $data['resp']= [];
                }  
                
                mysqli_close($mysqli);

        }else{
            $data['status'] = 'error';
            die(json_encode($data));

        }
        echo json_encode($data);
        }

    }else{
        echo "Algo salió mal...";
    } 
?>  
      