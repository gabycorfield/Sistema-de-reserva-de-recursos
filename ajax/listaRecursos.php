
<?php
/*listado de categorias */

include "conexion.php";

$sql = "SELECT id, id_categoria,categoria.nbre_categoria as categoria, nbre_recurso, descripcion, cantidad FROM categorias ORDER BY categoria LEFT JOIN categoria ON recursos.id_categoria = categoria.id ";
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