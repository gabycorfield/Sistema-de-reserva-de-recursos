
<?php
/*listado de categorias */

include "conexion.php";
$sql = "SELECT id, nbre_categoria as categoria FROM categoria ORDER BY categoria";
$result = mysqli_query($conn, $sql);
$array = array();
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $array[] = $row;
    }
    echo json_encode($array);
} else {
    echo "No hay resultados";
}

mysqli_close($conn);
?>