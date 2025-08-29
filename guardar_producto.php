<?php
header('Content-Type: application/json');
$db_host = 'localhost';
$db_name = 'prueba_tecnica'; 
$db_user = 'postgres';                
$db_pass = 'sqlchalo';    
$db_port = '5432';

try {
    
    $dsn = "pgsql:host=$db_host;port=$db_port;dbname=$db_name";
    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit;
}

if(isset($_GET['action'])) {
    $action = $_GET['action'];

    switch ($action) {
        case 'cargar_opciones':
            $response = [];

            $stmt = $pdo->query("SELECT id_bodega, nombre FROM bodegas ORDER BY nombre");
            $response['bodegas'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $pdo->query("SELECT id_moneda, nombre FROM monedas ORDER BY nombre");
            $response['monedas'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($response);
            break;

        case 'cargar_sucursales':
            $bodegaId = $_GET['bodega_id'] ?? null;
            $response = [];
            if ($bodegaId) {
                $stmt = $pdo->prepare("SELECT id_sucursal, nombre FROM sucursales WHERE id_bodega = ? ORDER BY nombre");
                $stmt->execute([$bodegaId]);
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode($response);
            break;
        
        case 'verificar_codigo':
            $codigo = $_GET['codigo'] ?? '';
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM productos WHERE codigo = ?");
            $stmt->execute([$codigo]);
            $count = $stmt->fetchColumn();
            echo json_encode(['exists' => $count > 0]);
            break;
        }        
        
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $codigo = $data['codigo'] ?? '';
    $nombre = $data['nombre'] ?? '';
    $bodega = $data['bodega'] ?? null;
    $sucursal = $data['sucursal'] ?? null;
    $moneda = $data['moneda'] ?? null;
    $precio = $data['precio'] ?? null;
    $descripcion = $data['descripion'] ?? '';
    $materiales = $data['materiales'] ?? [];

    try {
        
        $pdo->beginTransaction();

        
        $stmt = $pdo->prepare("INSERT INTO productos (codigo, nombre, id_bodega, id_sucursal, id_moneda, precio, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$codigo, $nombre, $bodega, $sucursal, $moneda, $precio, $descripcion]);

        
        foreach ($materiales as $idMaterial) {
            $stmt = $pdo->prepare("INSERT INTO producto_material (codigo_producto, id_material) VALUES (?, ?)");
            $stmt->execute([$codigo, $idMaterial]);
        }

       
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Producto guardado con éxito.']);
    } catch (PDOException $e) {
        
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Error al guardar el producto: ' . $e->getMessage()]);
    }
}

?>