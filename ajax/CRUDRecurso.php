
    
     
  

<?php  //CRUD tabla recursos-db escuela
    include "conexion.php";
    include "../varios.php";

    if(isset($_POST['accion_recurso'] )&& $_POST['accion_recurso']){ //accion_categ toma los valores mostrar,agregar, eliminar y editar
        $accion = $_POST['accion_recurso'];
       
        //muestra el listado de recursos
        if ( $accion === "mostrar"){ 
            $orden = $_POST['orden'];

            if(isset($_POST['buscarRec'])){ $buscarRec=$_POST['buscarRec'];}else{$buscarRec="";}
            
            if(isset($_POST['filtroCat'] )&& $_POST['filtroCat']){
              $filtroCat = $_POST['filtroCat'];
              $sql = "SELECT recursos.id, id_categoria,categoria.nbre_categoria AS categoria, nbre_recurso AS recurso, descripcion, cantidad  FROM recursos LEFT JOIN categoria ON recursos.id_categoria = categoria.id WHERE id_categoria = '$filtroCat' AND nbre_recurso LIKE '$buscarRec' '%' ORDER BY ".$orden;
            
            }else{
              $sql = "SELECT recursos.id, id_categoria,categoria.nbre_categoria AS categoria, nbre_recurso AS recurso, descripcion, cantidad  FROM recursos LEFT JOIN categoria ON recursos.id_categoria = categoria.id WHERE nbre_recurso LIKE '$buscarRec' '%' ORDER BY ".$orden;
            
            }
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
            mysqli_close($conn);
        }

        if ( $accion === "filtrar"){ //filtra por categoria y ordena por nombre de recurso
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
              echo "Sin resultados";
            }
            mysqli_close($conn);
        }



        //agrega un nuevo registro 
        if ($accion === 'agregar') {
            $categoria = test_input($_POST['categoria']);
            $recurso = test_input($_POST['recurso']);
            $descripcion = test_input($_POST['descripcion']);
            $cantidad = test_input($_POST['cantidad']);   
            if($categoria !== "" && $recurso!== "" && $cantidad!== ""){
                if($conn){
                    $query = "INSERT INTO recursos (id_categoria, nbre_recurso, descripcion, cantidad)
                    VALUES ('$categoria','$recurso','$descripcion', '$cantidad')"; 

                    if (mysqli_query($conn, $query)) {
                        echo "El registro ha sido creado";
                    } else {
                      $error_detalle = "";
                        if(mysqli_errno($conn)==1062){$error_detalle = "Ya existe";} 
                      echo "Error: el registro no pudo agregarse (" .  $error_detalle.")";
                     }
             }else{
                echo "El registro no puede agregarse, faltan datos.";
             }        
            mysqli_close($conn);
            }
   
  
            
            
        }

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

    }else{
        echo "Algo salió mal...";
    } 

?>  