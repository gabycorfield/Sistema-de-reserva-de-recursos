
<?php  //-CRUD tabla PERSONAS-

  include "conexion.php";
  include "../varios.php";

    if(isset($_POST['accion_persona']) && $_POST['accion_persona']){ //accion_persona toma valores mostrar,agregar, eliminar y editar
        $accion = $_POST['accion_persona'];
        //devuelve el listado de categoria en formato JSON
        if ( $accion === "mostrar"){ 
          $orden=$_POST['orden'];
          if(isset($_POST['buscarPers'])){ $buscarPers=$_POST['buscarPers'];}else{$buscarPers="";}
            $sql = "SELECT * FROM personas WHERE apellido LIKE '$buscarPers' '%' OR nombre LIKE '%' '$buscarPers' '%' ORDER BY ".$orden;
            $result = mysqli_query($conn, $sql);
            $array = array();
            if (mysqli_num_rows($result) > 0) {
               // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                 $array[] = $row;
                }
               echo json_encode($array);
            } elseif(mysqli_num_rows($result) == 0){
              echo "Sin resultados";
            }
           
        }


        //agrega un nuevo registro 
        if ($accion === 'agregar'){
            $nombre = $_POST['nombre'];   
            $apellido = $_POST['apellido']; 
            $email = $_POST['email'];
            $telefono = $_POST['telefono']; 
            $direccion = $_POST['direccion'];
            $dni = $_POST['dni'];     
            if(trim($apellido) !== "" && trim($nombre)!== "" && trim($dni)!== ""){
              if($conn){
                    $query = " INSERT INTO personas (nombre, apellido, email, telefono, direccion, dni)VALUES ('$nombre','$apellido', '$email', '$telefono', '$direccion', '$dni') ";  
                    if (mysqli_query($conn, $query)) {
                      echo "El registro se agregó satisfactoriamente";
                    } else {
                      echo "Error: el registro no pudo agregarse (" . $query . "<br>" . mysqli_error($conn).")";
                    }

                  mysqli_close($conn);
              }else{
               echo " ha ocurrido un error con la conexión a la base de datos";
              }
            }else{
              echo " El registro no puede agregarse, faltan datos.";
            }
       
        }


        //elimina el registro indicado por el id_persona
        if ($accion === 'eliminar'){
            $id = $_POST['id_persona'];   

             if($conn){
                  $query = " DELETE FROM personas WHERE id = '$id' ";  
                  if (mysqli_query($conn, $query)) {
                    echo "El registro se eliminó satisfactoriamente";
                  } else {
                    $error_detalle ="";
                    if(mysqli_errno($conn) == 1451){$error_detalle ="El registro está vinculado a otra tabla";}
                    echo "Error: el registro no pudo eliminarse ("  . $error_detalle.")";
                  }

            }else{
             echo " ha ocurrido un error con la conexión a la base de datos";
             }
       
        }

        //actualiza los datos de un registro determinado
        if ($accion === 'editar'){ 
          $id = $_POST['id_persona'];
          $nombre = $_POST['nombre'];   
          $apellido = $_POST['apellido']; 
          $email = $_POST['email'];
          $telefono = $_POST['telefono']; 
          $direccion = $_POST['direccion'];
          $dni = $_POST['dni'];     
             if(trim($apellido) !== "" && trim($nombre)!== "" && trim($dni)!== ""){
               if($conn){
                    $query = " UPDATE personas SET nombre = '$nombre', apellido = '$apellido', email ='$email',direccion = '$direccion', dni = '$dni', telefono = '$telefono' WHERE id = '$id' ";  
                    if (mysqli_query($conn, $query)) {
                      echo "El registro se actualizó satisfactoriamente";
                    } else {
                      echo "Error: el registro no pudo actualizarse (" . $query . "<br>" . mysqli_error($conn).")";
                    }

                  
              }else{
               echo " ha ocurrido un error con la conexión a la base de datos";
               }
             }else{
              echo "El registro no pudo actualizarse, faltan datos.";
             }
            mysqli_close($conn);

        }

         
}else{echo "Algo salió mal...";} 
?>  

