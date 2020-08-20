

<?php  //CRUD tabla categoria-db escuela
    include "conexion.php";
    include "../varios.php";

    if(isset($_POST['accion_categ'] )&& $_POST['accion_categ']){ //accion_categ toma los valores mostrar,agregar, eliminar y editar
        $accion = $_POST['accion_categ'];
       
        //muestra el listado de categoria
        if ( $accion === "mostrar"){ 
            $sentido = $_POST['sentido'];
            if(isset($_POST['buscarCat'])){ $buscarCat=$_POST['buscarCat'];}else{$buscarCat="";}

            $sql = "SELECT id, nbre_categoria as categoria FROM categoria  WHERE nbre_categoria LIKE '$buscarCat' '%' ORDER BY categoria ".$sentido;
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
            $categoria = test_input($_POST['categ']);
            if(trim($categoria) !== ""){    

                 if($conn){
                      $query = " INSERT INTO categoria (nbre_categoria)VALUES ('$categoria') ";  
                      if (mysqli_query($conn, $query)) {
            	       	echo "El registro se agregó satisfactoriamente";
        		      } else {
                        $error_detalle = "";
                        if(mysqli_errno($conn)==1062){$error_detalle = "Dato duplicado";} 
            	       	echo "Error: el registro no pudo agregarse (" .  $error_detalle.")";
        		      }

                    mysqli_close($conn);
                }else{
                 echo " ha ocurrido un error con la conexión a la base de datos";
                 }
            }else{
                echo "No se puede ingresar una cadena vacia";
            }
            
        }

        //elimina el registro indicado por el id_categ
        if ($accion === 'eliminar'){
            $id = test_input($_POST['id_categ']);   

             if($conn){
                  $query = " DELETE FROM categoria WHERE id = '$id' ";  
                  
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
            $id = test_input($_POST['id_categ']); $cat =test_input($_POST['categ']);
            if(trim($cat)!=="")
              {
                if($conn){
                    $query = " UPDATE categoria SET nbre_categoria = '$cat' WHERE id = '$id' ";  
                    if (mysqli_query($conn, $query)) {
                       echo "El registro se actualizó satisfactoriamente";
                    } else {
                        $error_detalle = "";
                        if(mysqli_errno($conn)==1062){$error_detalle = "Dato duplicado";}
                       echo "Error: el registro no pudo actualizarse (" . $error_detalle.")";
                    }
                    
                }else{
                 echo " ha ocurrido un error con la conexión a la base de datos";
                }
            }else{
                echo "No se puede ingresar una cadena vacia";
            }
            mysqli_close($conn);
        }

         

    }else{
        echo "Algo salió mal...";
    } 

?>  