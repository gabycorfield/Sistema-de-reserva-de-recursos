<?php  //CRUD tabla detallereserva-db escuela
    include "conexion.php";
    include "../varios.php";

    if(isset($_POST['accion_fechas'] )&& $_POST['accion_fechas']){ //accion_detalle toma distintos valores según lo que va a hacer
        $accion = $_POST['accion_fechas'];
       
        //muestra el listado de fechas no reservables 
        if ( $accion === "mostrar"){ 
            $sql = "SELECT id, date_format(noreservable.fecha,'%d/%m/%Y') AS fecha, descripcion FROM noreservable ORDER BY noreservable.fecha ASC";
            $result = mysqli_query($conn, $sql);
            $array = array();
            if (mysqli_num_rows($result) > 0) {
               // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                 $array[] = $row;
                }
               echo json_encode($array);
            } elseif(mysqli_num_rows($result) == 0){
              echo "No hay fechas deshabilitadas";
            }
            mysqli_close($conn);
        }


       
        //agrega un nuevo registro 
        if ($accion === 'agregar') {
            $fecha = ($_POST['fecha']);
            $descripcion= ($_POST['descripcion']);
                echo $fecha;
              if($conn){
                $query = "INSERT INTO noreservable (fecha, descripcion)VALUES ('$fecha','$descripcion')"; 

                if(mysqli_query($conn, $query)) {
                  echo "El registro ha sido creado";
                }else{ 
                  echo "Error: el registro no pudo agregarse " . $query . "<br>" . mysqli_error($conn);
                }
              }else{
                  echo "El registro no puede agregarse.Error al conectar con la base de datos";
              }                     
              mysqli_close($conn);   
        }


 

        //elimina el registro indicado por el id
        if ($accion === 'eliminar'){
            $id = test_input($_POST['id']);   

             if($conn){
                  $query = " DELETE FROM noreservable WHERE id = '$id' ";  
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
             mysqli_close($conn);
        }

    }else{
        echo "Algo salió mal...";
    } 

?>  