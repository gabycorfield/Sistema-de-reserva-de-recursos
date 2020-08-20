
<?php  //CRUD tabla reservas-db escuela
error_reporting(E_ERROR);
    include "conexion.php";
    include "../varios.php";

    if(isset($_POST['accion_reserva'] )&& $_POST['accion_reserva']){ //accion_categ toma los valores mostrar,agregar, eliminar y editar
        $accion = $_POST['accion_reserva'];
       
        //muestra el listado de recursos
        if ( $accion === "mostrar"){ 
            
            if(isset($_POST['f1'])){$f1=$_POST['f1'];}
            if(isset($_POST['f2'])){$f2=$_POST['f2'];}
            $orden = $_POST['orden'];

            if(isset($_POST['txt'])){ $filtro=$_POST['txt'];}else{$filtro="";}
            
            $sql = "SELECT reservas.id, id_persona, responsable, personas.apellido AS Apellido, personas.nombre AS Nombre,  DATE_FORMAT(inicio, '%d/%m/%Y %H:%i') AS Desde,  DATE_FORMAT(final, '%d/%m/%Y %H:%i')  AS Hasta, reservas.descripcion FROM reservas LEFT JOIN personas ON reservas.responsable = personas.id WHERE ((final BETWEEN '$f1' AND '$f2') OR ('$f2' BETWEEN inicio AND final)) AND (personas.apellido LIKE '$filtro' '%' OR personas.nombre LIKE '%' '$filtro' '%' OR reservas.descripcion LIKE '$filtro' '%') ORDER BY ".$orden;
            $result = mysqli_query($conn, $sql);
            $array = array();
            if (mysqli_num_rows($result) > 0) {
               // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                $a = $row['id'];
                 $sub = "SELECT detallereserva.id_recurso, recursos.nbre_recurso AS recurso, detallereserva.cantidad AS cantidad, recursos.id_categoria AS cat FROM detallereserva LEFT JOIN recursos ON detallereserva.id_recurso = recursos.id WHERE detallereserva.id_reserva = '$a'";
                   $array2 = array();
                   $result2 = mysqli_query($conn, $sub);
                   if (mysqli_num_rows($result2) > 0){
                    while($row2 = mysqli_fetch_assoc($result2)) {
                      $array2[] = $row2;}
                    }
                    $row['detalle'] = $array2;
                    $array[] = $row;
                      
                }
               echo json_encode($array);
            } elseif(mysqli_num_rows($result) == 0){
              echo "No hay datos de Reservas cargados en la base de datos";
            }
            mysqli_close($conn);
        }
        

        //agrega un nuevo registro 
        if ($accion === 'agregar') {
            $creador = test_input($_POST['id']);
            $persona = test_input($_POST['id_persona']);
            $inicio = (test_input($_POST['finicio_reserva']));
            $final = (test_input($_POST['ffinal_reserva']));
            $descrip = (test_input($_POST['desc_reserva']));
            if(trim($persona) !== "" && trim($inicio)!== "" && trim($final)!== ""){
                if($conn){
                    $query = "INSERT INTO reservas (id_persona, responsable, inicio, final, descripcion)
                    VALUES ('$creador', '$persona','$inicio','$final','$descrip')"; 

                    if (mysqli_query($conn, $query)) {
                        $id=mysqli_insert_id($conn);
                        echo $id;
                    } else {
                     echo "Error: el registro no pudo agregarse " . $query . "<br>" . mysqli_error($conn);
                     }
             }else{
                echo "El registro no puede agregarse, faltan datos.";
             }        
            mysqli_close($conn);
            }    
        }

        //agrega un nuevo registro 
        if ($accion === 'reservaMasiva') {
            $persona = test_input($_POST['id']);
            $fechas = json_decode($_POST['fechas'],true);
            $descrip = (test_input($_POST['descripcion']));
            $reservas = array();
            if(trim($persona) !== "" && count($fechas)>0){
                if($conn){
                  $long = count($fechas);
                  for($i=0; $i<$long; $i++){
                    $fecha1=$fechas[$i]['f1'];
                    $fecha2=$fechas[$i]['f2'];
                    $query = "INSERT INTO reservas (id_persona, responsable, inicio, final, descripcion)
                    VALUES ('$persona', '$persona','$fecha1','$fecha2','$descrip')";
                    if (mysqli_query($conn, $query)) {
                        $id=mysqli_insert_id($conn);
                        $reservas[]= $id;
                    }else {
                       echo "Error: el registro no pudo agregarse " . $query . "<br>" . mysqli_error($conn);
                    }
                  }
                }else{echo "sin conexion??";}
             }else{
                echo "El registro no puede agregarse, faltan datos...";
             }        
             echo json_encode($reservas);
            mysqli_close($conn);
                
        }

        //elimina el registro indicado por el id
        if ($accion === 'eliminar'){
            $id = test_input($_POST['id_reserva']);   

             if($conn){
                  $query = " DELETE FROM reservas WHERE id = '$id' ";  
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
        //actualiza los datos de un registro determinado
        if ($accion === 'actualizar'){ 
            $persona = test_input($_POST['persona']);
            $reserva = test_input($_POST['reserva']);
            $descripcion = test_input($_POST['descr']);
            $fecha1 = $_POST['f1'];  
            $fecha2 = $_POST['f2']; 
            if(trim($persona) !== "" && trim($descripcion)!== "" && trim($fecha1)!== "" && trim($fecha2)!== "")
              {
                if($conn){
                    $query = " UPDATE reservas SET  responsable = '$persona', inicio = '$fecha1', final = '$fecha2', descripcion = '$descripcion' WHERE id = '$reserva' ";  
                    if (mysqli_query($conn, $query)) {
                       echo "Se actualizaron los datos de reserva";
                    } else {
                       echo "Error: el registro no pudo actualizarse (" . $query . "<br>" . mysqli_error($conn).")";
                    }
                    
                }else{
                 echo " ha ocurrido un error con la conexión a la base de datos";
                }
            }else{
                echo "Los datos son obligatorios";
            }
            mysqli_close($conn);
        }

         

    }else{
        echo "Algo salió mal...";
    } 

?>  