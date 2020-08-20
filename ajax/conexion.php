<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "escuela";

// Create connection
$conn = @ mysqli_connect($servername, $username, $password, $database);

// Check connection
if (!$conn) {
    die("No se puede establecer la conexión con la base de datos: " . mysqli_connect_error());
   
}
if (@mysqli_connect_errno()) {
        die("La Conexión falló: ".mysqli_connect_errno()." : ". mysqli_connect_error());
    }

?>