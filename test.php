<?php
$db_host = 'localhost';
$db_name = 'prueba_tecnica'; 
$db_user = 'postgres';                
$db_pass = 'sqlchalo';    
$db_port = '5432';

try {
    
    $dsn = "pgsql:host=$db_host;port=$db_port;dbname=$db_name";
    $pdo = new PDO($dsn, $db_user, $db_pass);
    echo "Funciona PostgreSQL";
    
} catch (PDOException $e) {
    
    echo "Error de conexión a la base de datos: " . $e->getMessage();
}
?>