
<?php  // CRUD tabla PERSONAS


  include "conexion.php";include "../varios.php";
  if(isset($_POST['accion_usuario'] )&& $_POST['accion_usuario']){ //accion_categ toma los valores mostrar,agregar, eliminar y editar
        $accion = $_POST['accion_usuario'];
       
       
        //muestra el listado de recursos
        if ( $accion === "mostrar"){  
          $orden = $_POST['orden'];
          if(isset($_POST['buscarUser'])){ $buscarUser=$_POST['buscarUser'];}else{$buscarUser="";}

          if(isset($_POST['filtroUser'] )&& $_POST['filtroUser']){

              $filtroUser = $_POST['filtroUser'];

              $sql = "SELECT id_user, id_persona, user, permiso, personas.apellido AS ap, personas.nombre AS nbre FROM reservas_permisos LEFT JOIN personas ON reservas_permisos.id_persona = personas.id  WHERE permiso = '$filtroUser' AND ((user LIKE '$buscarUser' '%' OR personas.apellido LIKE '$buscarUser' '%') OR (personas.nombre LIKE '$buscarUser' '%'))  ORDER BY ".$orden;
          }else{
              $sql = "SELECT id_user, id_persona, user, permiso, personas.apellido AS ap, personas.nombre AS nbre FROM reservas_permisos LEFT JOIN personas ON reservas_permisos.id_persona = personas.id WHERE (user LIKE '$buscarUser' '%' OR personas.apellido LIKE '$buscarUser' '%') OR (personas.nombre LIKE '$buscarUser' '%')  ORDER BY ".$orden;
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

        //agrega un nuevo registro 
        if ($accion === 'agregar') {
            $persona = test_input($_POST['persona']);$permiso = test_input($_POST['permiso']);
            $usuario = test_input($_POST['usuario']);$password = test_input($_POST['password']); 
            if($persona !== "" && $permiso!== "" && $usuario!== "" && $password!== ""){
                if($conn){
                    $query = "INSERT INTO reservas_permisos (id_persona, user, pass, permiso)
                    VALUES ('$persona', trim('$usuario'),md5('$password'), '$permiso')"; 
                   
                    if (mysqli_query($conn, $query)) {
                        echo "El registro ha sido creado. ";
                        $result = mysqli_query($conn, "SELECT personas.email FROM reservas_permisos LEFT JOIN personas ON personas.id = reservas_permisos.id_persona WHERE reservas_permisos.user = '$usuario'");
                        
                          $num_row = mysqli_num_rows($result);  
                          if ($num_row <> 1){
                           
                            echo "Ocurrio un error..............";
                          }
                          else{
                            $to=mysqli_fetch_assoc($result);
                            $subject = "Datos de ingreso al sistema- SISESCU";
                            $message = "Se han generado USUARIO y CLAVE para su ingreso en el sistema, esta última debe ser cambiada a la brevedad. Usuario: ".$usuario.". Su clave provisoria es: ".$password;
                            $header = "SISESCU - Datos de ingreso al sistema ";
 
                            if(mail($to['email'], $subject, $message,$header)){
                             echo "Fue enviado un mensaje a ".$to['email']." , con el usuario y una clave provisoria para ingresar.";
                            }
                            else{
                             echo "Error al enviar mail de confirmación, comuníquese con el administrador de la aplicación";
                            }
                          }
                    } else {
                      $error_detalle = "";
                      if(mysqli_errno($conn)==1062){$error_detalle = "Ese nombre de usuario ya existe";}
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
            $id = test_input($_POST['id_usuario']);   

             if($conn){
                  $query = " UPDATE  reservas_permisos SET permiso = 4 WHERE id_user = '$id' ";  
                  if (mysqli_query($conn, $query)) {
                    echo "El usuario ha sido anulado";
                  } else {
                    $error_detalle ="";
                   // if(mysqli_errno($conn) == 1451){$error_detalle ="El registro está vinculado a otra tabla";}
                    echo "Error: el registro no pudo anularse ";
                  }

            }else{
             echo " Ha ocurrido un error con la conexión a la base de datos";
             }
             mysqli_close($conn);
        }

        //actualiza los datos de un registro determinado- sólo nombre de usuario, permiso 
        if ($accion === 'editar'){ 
            $permiso = test_input($_POST['permiso']);
            $usuario = test_input($_POST['usuario']);
            $id = test_input($_POST['id_usuario']); 
            if(trim($permiso) !== "" && trim($usuario)!== "" && trim($id)!== "")
              {
                if($conn){
                    $query = " UPDATE reservas_permisos SET  permiso = '$permiso', user = '$usuario' WHERE id_user= '$id' ";  
                    if (mysqli_query($conn, $query)) {
                       echo "El registro se actualizó satisfactoriamente";
                    } else {
                      $error_detalle = "";
                      if(mysqli_errno($conn)==1062){$error_detalle = "Dato duplicado";}  
                      echo "Error: el registro no pudo modificarse (" .  $error_detalle.")";
                    }
                    
                }else{
                 echo " Ha ocurrido un error con la conexión a la base de datos";
                }
            }else{
                echo "No se puede ingresar una cadena vacia";
            }
            mysqli_close($conn);
        }

        //establece nueva clave solamente si esta está vacía 
        if ($accion === 'recuperar'){ 
            $password = (test_input($_POST['password']));
            $pass=md5($password);
            $usuario = test_input($_POST['usuario']);
            $data= array();
            if(trim($password) !== "" && trim($usuario)!== "" ){
                if($conn){
                    $query = "UPDATE reservas_permisos SET pass='$pass', blanqueado= 1 WHERE user='$usuario' ";
                    if(mysqli_query($conn, $query)){
                      if(mysqli_affected_rows($conn)==0){
                        $data['status'] = 'err';
                        $data['resp']= "Error al recuperar contraseña";
                      }
                      else{ 
                        $result = mysqli_query($conn, "SELECT personas.email FROM reservas_permisos LEFT JOIN personas ON personas.id = reservas_permisos.id_persona WHERE reservas_permisos.user = '$usuario'");
                        
                          $num_row = mysqli_num_rows($result);  
                          if ($num_row <> 1){
                            $data['status'] = 'err';
                            $data['resp']= "Ocurrio un error..............";
                          }
                          else{
                            $to=mysqli_fetch_assoc($result);
                            $subject = "Restablecer contraseña- SISESCU";
                            $message = "Se ha generado una nueva clave para su ingreso en el sistema, cámbiela a la brevedad. Usuario: ".$usuario.". Su clave provisoria es: ".$password;
                            $header = "SISESCU - Reestablecimiento de clave ";
 
                            if(mail($to['email'], $subject, $message,$header)){
                              $data['status'] = 'ok';
                              $data['resp']= "Fue enviado un mensaje a la casilla de correo electr&#243;nico indicada, con las instrucciones para emplear la clave";
                            }
                            else{
                              $data['status'] = 'err';
                              $data['resp']= "Error al intentar reestablecer la clave, comuníquese con el administrador de la aplicación";
                            }
                          }
                      }
                    }
                    else{
                      $data['status'] = 'err';
                      $data['resp']= "Ha ocurrido un error. ";}
                }else{
                  $data['status'] = 'err';
                  $data['resp']= " Ha ocurrido un error con la conexión a la base de datos";
                }
            }else{
                $data['status'] = 'err';
                $data['resp']= "No se puede ingresar una cadena vacia";
            }
            echo json_encode($data);
            mysqli_close($conn);
        }

   /*      //blanquea clave de usuario
        if ($accion === 'blanquear'){ 
            $id = test_input($_POST['id_usuario']); 
            if(trim($id)!== "")
              {
                if($conn){
                    $query = " UPDATE reservas_permisos SET  pass = md5('') WHERE id_user= '$id' ";  
                    if (mysqli_query($conn, $query)) {
                       echo "La contraseña se blanqueó satisfactoriamente";
                    } else {
                      
                      echo "Error: la contraseña no se pudo blanquear ";
                    }
                    
                }else{
                 echo " ha ocurrido un error con la conexión a la base de datos";
                }
            }else{
                echo "el usuario no existe";
            }
            mysqli_close($conn);
        }
*/
        //cambio nombre de usuario y contraseña
        if ($accion === 'cambiar'){
            $password =  md5(test_input($_POST['password']));
            $usuario = test_input($_POST['usuario']);
           
            if(trim($password) !== "" && trim($usuario)!== "")
              {
                if($conn){
                    $query = " UPDATE reservas_permisos SET  pass = '$password', blanqueado=0 WHERE id_user= '$usuario' ";  
                    if (mysqli_query($conn, $query)) {
                       echo "El registro se actualizó satisfactoriamente";
                    } else {
                      $error_detalle = "";
                      echo "Error: el registro no pudo modificarse (" .  $error_detalle.")";
                    }
                    
                }else{
                 echo " ha ocurrido un error con la conexión a la base de datos";
                }
            }else{
                echo "No se puede ingresar una cadena vacia usuario";
            }
            mysqli_close($conn);
        }


    }else{
        echo "Algo salió mal...";
    }   


?>  