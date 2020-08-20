<?php  //CRUD tabla detallereserva-db escuela
    include "conexion.php";
    include "../varios.php";

    if(isset($_POST['accion_detalle'] )&& $_POST['accion_detalle']){ //accion_detalle toma distintos valores según lo que va a hacer
        $accion = $_POST['accion_detalle'];
       
        //muestra el listado de recursos reservados de una reserva en particular
        if ( $accion === "mostrar"){ 
            $reserva = $_POST['id_reserva'];
            $sql = "SELECT detallereserva.id_recurso, recursos.nbre_recurso AS recurso, detallereserva.cantidad AS cantidad FROM detallereserva LEFT JOIN recursos ON detallereserva.id_recurso = recursos.id WHERE detallereserva.id_reserva = '$reserva'";
            $result = mysqli_query($conn, $sql);
            $array = array();
            if (mysqli_num_rows($result) > 0) {
               // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                 $array[] = $row;
                }
               echo json_encode($array);
            } elseif(mysqli_num_rows($result) == 0){
              echo "No hay datos de Recursos reservados cargados en la base de datos";
            }
            mysqli_close($conn);
        }
/*
        if ( $accion === "filtrar"){ 
            $filtro = $_POST['filtro'];
            $sql = "SELECT recursos.id, id_categoria,categoria.nbre_categoria AS categoria, nbre_recurso, descripcion, cantidad  FROM recursos LEFT JOIN categoria ON recursos.id_categoria = categoria.id  WHERE recursos.id_categoria = '$filtro' ORDER BY nbre_recurso ";
            $result = mysqli_query($conn, $sql);
            $array = array();
            if (mysqli_num_rows($result) > 0) {
               // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                 $array[] = $row;
                }
               echo json_encode($array);
            } elseif(mysqli_num_rows($result) == 0){
              echo "No hay datos de Recursos cargados en la base de datos";
            }
            mysqli_close($conn);
        }
*/

        if ( $accion === "chequear"){ 
            $filtro = $_POST['filtro'];
            $f1 = $_POST['f1'];
            $f2 = $_POST['f2'];
            $sql = "SELECT  cantidad  FROM recursos WHERE recursos.id = '$filtro'";//obtengo la cantidad total de un recurso en particular
            $result = mysqli_query($conn, $sql);
            
            if (mysqli_num_rows($result) !== 1) {
              echo "hola ".$filtro." No hay datos de Recursos cargados en la base de datos";
            } else{//si está el recurso tengo que obtener la cantidad reservada entre las 2 fechas dadas
                while($row = mysqli_fetch_assoc($result)) {
                  $array[] = $row;
                }
                $total = $array[0]['cantidad'];//obtengo la cant total del recurso

              $sql = "SELECT  detallereserva.inicio, detallereserva.final, cantidad  FROM detallereserva LEFT JOIN reservas ON detallereserva. id_reserva = reservas.id WHERE detallereserva.id_recurso = '$filtro' AND reservas.inicio BETWEEN '$f1' AND '$f2'";
              $result = mysqli_query($conn, $sql);
             
              $min = null;//ver como calcular  el minimo disponible
              $array=[];
            if (mysqli_num_rows($result) > 0) {
               // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                 $array[] = $row;
                }
                $ff = $f1;
               while ($ff < $f2) {
                  foreach($array as $x => $x_value) {
                    echo "Key=" . $x . ", Value=" . $x_value;
                    echo "<br>";
                  }
               }
                echo $min;
               
            }else{
              echo $total;
            }
          }
            mysqli_close($conn);
        }

       
        //agrega un nuevo registro 
        if ($accion === 'agregar') {
            $detalle = $_POST['datos'];
            $reserva = test_input($_POST['reserva']);
            $resp=array();
            if (is_array($detalle)){
              $arrlength = count($detalle);
              for($x = 0; $x < $arrlength; $x++) { 
                $recurso = test_input($detalle[$x]['recurso']);
                $cantidad = test_input($detalle[$x]['cantidad']);   
                if(trim($reserva) !== "" && trim($recurso)!== "" && trim($cantidad)!== ""){
                    if($conn){
                        $query = "INSERT INTO detallereserva (id_reserva, id_recurso, cantidad)
                        VALUES ('$reserva','$recurso', '$cantidad')"; 

                        if (mysqli_query($conn, $query)) {
                            $resp[]="ok";
                        }else{
                          $resp[]=mysqli_error($conn);
                        }
                     }else{
                        $resp[]="Faltan Datos";
                     }        
                }  
              }echo json_encode($resp);
              mysqli_close($conn);
            }else{
             echo "No se agregaron datos";
            }
        }

        if ($accion === 'reservaMasiva') {echo "Estoy en reserva masiva de detalle";
            $reservas = json_decode($_POST['reservas'],true);
            $recurso = ($_POST['recurso']);
            $cantidad = ($_POST['cantidad']);
            $resp=array();
            var_dump($recurso);
            var_dump($cantidad);
            var_dump($reservas);
            if (is_array($reservas)){echo "reservas es array";
              $arrlength = count($reservas);
              for($x = 0; $x < $arrlength; $x++) { 
                $Nreserva = $reservas[$x];
                if(trim($Nreserva) !== "" && trim($recurso)!== "" && trim($cantidad)!== ""){
                    if($conn){
                        $query = "INSERT INTO detallereserva (id_reserva, id_recurso, cantidad)
                        VALUES ('$Nreserva','$recurso', '$cantidad')"; 

                        if (mysqli_query($conn, $query)) {
                            $resp[]="ok";
                        }else{
                          $resp[]=mysqli_error($conn);
                        }
                     }else{
                        $resp[]="Faltan Datos";
                     }        
                }  
              }echo json_encode($resp);
              mysqli_close($conn);
            }else{
             echo "error al ingresar datos";
            }
        }


  //filtrar por recurso con fecha vigente
        if ($accion === 'filtroRecurso') {
            $recurso = $_POST['recurso'];
            $fecha = $_POST['fecha'];
        
            if($conn){
                $sql = "SELECT  DATE_FORMAT(reservas.inicio, '%d/%m/%Y %H:%i') AS inicio, DATE_FORMAT(reservas.final, '%d/%m/%Y %H:%i') AS final, cantidad FROM detallereserva LEFT JOIN  reservas ON reservas.id = detallereserva.id_reserva WHERE id_recurso = '$recurso' AND reservas.final >= '$fecha'ORDER  BY reservas.inicio ASC"; 
                $result = mysqli_query($conn, $sql);
                $array = array(); 
                if (mysqli_num_rows($result) > 0) {
               // output data of each row
                  while($row = mysqli_fetch_assoc($result)) {
                     $array[] = $row; 
                    }
                    echo json_encode($array);
                } elseif(mysqli_num_rows($result) == 0){
                    echo "No hay reservas vigentes";
                }
                
                mysqli_close($conn);
            }
        
   
    }  

    //filtrar si un recurso determinado está reservado entre 2 fechas
        if ($accion === 'filtrarRecursoFechas') {
            $recurso = $_POST['filtro'];
            $fecha1 = $_POST['fecha1'];
            $fecha2 = $_POST['fecha2'];
            $array = array();
            if($conn){
                $sql = "SELECT  reservas.inicio AS inicio, reservas.final AS final, cantidad,reservas.id AS reserva FROM detallereserva LEFT JOIN  reservas ON reservas.id = detallereserva.id_reserva WHERE id_recurso = '$recurso' AND ('$fecha1' BETWEEN reservas.inicio AND reservas.final || '$fecha2' BETWEEN reservas.inicio AND reservas.final || reservas.inicio BETWEEN '$fecha1' AND '$fecha2')   ORDER  BY reservas.inicio ASC"; 
                $result = mysqli_query($conn, $sql);
                 
                if (mysqli_num_rows($result) > 0) {
               // output data of each row
                  while($row = mysqli_fetch_assoc($result)) {
                     $array[] = $row; 
                    }
                  echo json_encode($array);
                } else{echo "vacio";}
                
                mysqli_close($conn);
            }else{echo "sin conexion";}
        
   
    }  

    if ($accion === 'eliminar') {
            $detalle = $_POST['datos'];
            $reserva = test_input($_POST['reserva']);
            $resp=array();
            if (is_array($detalle)){
              $arrlength = count($detalle);
              for($x = 0; $x < $arrlength; $x++) { 
                $recurso = test_input($detalle[$x]);   
                if(trim($reserva) !== "" && trim($recurso)!== ""){
                    if($conn){
                        $query = "DELETE FROM detallereserva WHERE id_reserva='$reserva' AND id_recurso='$recurso' ";

                        if (mysqli_query($conn, $query)) {
                            $resp[]="ok";
                        }else{
                          $resp[]=mysqli_error($conn);
                        }
                     }else{
                        $resp[]="Faltan Datos";
                     }        
                }  
              }echo json_encode($resp);
              mysqli_close($conn);
            }else{
             echo "error al ingresar datos";
            }
        }

        if ($accion === 'editar') {
            $detalle = $_POST['datos'];
            $reserva = test_input($_POST['reserva']);
            $resp=array();
            if (is_array($detalle)){
              $arrlength = count($detalle);
              for($x = 0; $x < $arrlength; $x++) { 
                $recurso = test_input($detalle[$x]['recurso']);
                $cantidad = test_input($detalle[$x]['cantidad']);   
                if(trim($reserva) !== "" && trim($recurso)!== "" && trim($cantidad)!== ""){
                    if($conn){
                        $query = "UPDATE detallereserva SET cantidad='$cantidad' WHERE 
                        id_reserva='$reserva' AND id_recurso='$recurso'"; 

                        if (mysqli_query($conn, $query)) {
                            $resp[]="ok";
                        }else{
                          $resp[]=mysqli_error($conn);
                        }
                     }else{
                        $resp[]="Faltan Datos";
                     }        
                }  
              }echo json_encode($resp);
              mysqli_close($conn);
            }else{
             echo "error al ingresar datos";
            }
        }
/*
        //elimina el registro indicado por el id
        if ($accion === 'eliminar'){
            $id = test_input($_POST['id_recurso']);   

             if($conn){
                  $query = " DELETE FROM recursos WHERE id = '$id' ";  
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
        if ($accion === 'editar'){ 
            $categoria = test_input($_POST['categoria']);
            $recurso = test_input($_POST['recurso']);
            $descripcion = test_input($_POST['descripcion']);
            $cantidad = test_input($_POST['cantidad']);  
            $id = test_input($_POST['id_recurso']); 
            if(trim($categoria) !== "" && trim($recurso)!== "" && trim($cantidad)!== "")
              {
                if($conn){
                    $query = " UPDATE recursos SET  id_categoria = '$categoria', nbre_recurso = '$recurso', descripcion = '$descripcion', cantidad = '$cantidad' WHERE id = '$id' ";  
                    if (mysqli_query($conn, $query)) {
                       echo "El registro se actualizó satisfactoriamente";
                    } else {
                       echo "Error: el registro no pudo actualizarse (" . $query . "<br>" . mysqli_error($conn).")";
                    }
                    
                }else{
                 echo " ha ocurrido un error con la conexión a la base de datos";
                }
            }else{
                echo "No se puede ingresar una cadena vacia";
            }
            mysqli_close($conn);
        }

         if ( $accion === "chequear"){ 
            $filtro = $_POST['filtro'];
            $f1 = $_POST['f1'];
            $f2 = $_POST['f2'];
            $sql = "SELECT  reservas.inicio AS inicio, reservas.final AS final, detallereserva.cantidad AS cantidad FROM detallereserva LEFT JOIN reservas ON detallereserva.id_reserva = reservas.id WHERE id_recurso = '$filtro' AND inicio >= f1 AND final <= f2";
            $result = mysqli_query($conn, $sql);
            $array = array();
            if (mysqli_num_rows($result) > 0) {
               // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                 $array[] = $row;
                }
               echo json_encode($array);
            } elseif(mysqli_num_rows($result) == 0){
              echo "hola ".$filtro." No hay datos de Recursos cargados en la base de datos";
            }
            mysqli_close($conn);
        }
*/
    }else{
        echo "Algo salió mal...";
    } 

?>  