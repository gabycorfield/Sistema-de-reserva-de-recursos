
<?php
/*listado de usuarios registrados */

include "conexion.php";

$sql = "SELECT id_persona, user, permiso, personas.apellido as ap, personas.nombre as nbre FROM rec_permisos LEFT JOIN personas
ON rec_permisos.id_persona = personas.id; ";
$result = mysqli_query($conn, $sql);
$array = array();
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $array[] = $row;
    }
    echo json_encode($array);
} else {
    echo "0 results";
}

mysqli_close($conn);
?>
