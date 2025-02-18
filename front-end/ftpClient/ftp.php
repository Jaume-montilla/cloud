<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$ftp_host = "backend";  
$ftp_user = $_GET['user'];
$ftp_pass = "";
$ftp_port = (int)$_GET['port'];
$action = $_GET['action'];

$ftp_conn = ftp_connect($ftp_host, $ftp_port) or die(json_encode(["success" => false, "message" => "Unable to connect to FTP server on port $ftp_port."]));

function connect($user, $pass, $port) {
    $conn = ftp_connect($GLOBALS["ftp_host"], $port);
    if (!$conn) {
        die(json_encode(["success" => false, "message" => "Unable to connect to FTP server on port $port."]));
    }
    ftp_login($conn, $user, $pass);
    return $conn;
}

switch ($action) {
    case 'log':
        $ftp_conn = connect($ftp_user, $ftp_pass, $ftp_port);
        echo json_encode(["success" => true, "message" => "Connected successfully."]);
        break;
    
    case 'list':
        $folder = $_GET['folder'] ?? '.';
        $ftp_conn = connect($ftp_user, $ftp_pass, $ftp_port);
        $files = ftp_nlist($ftp_conn, $folder);
        ftp_close($ftp_conn);
        echo json_encode(["success" => true, "files" => $files]);
        break;

    case 'upload':
        $file = $_FILES['file'] ?? null;
        if ($file && $file['tmp_name']) {
            $ftp_conn = connect($ftp_user, $ftp_pass, $ftp_port);
            $upload = ftp_put($ftp_conn, $file['name'], $file['tmp_name'], FTP_BINARY);
            ftp_close($ftp_conn);
            echo json_encode(["success" => $upload, "message" => $upload ? "File uploaded successfully." : "File upload failed."]);
        } else {
            echo json_encode(["success" => false, "message" => "No file uploaded."]);
        }
        break;

    case 'delete':
        $post_data = json_decode(file_get_contents("php://input"), true);
        $file = $post_data['file'] ?? null;
        if ($file) {
            $ftp_conn = connect($ftp_user, $ftp_pass, $ftp_port);
            $delete = ftp_delete($ftp_conn, $file);
            ftp_close($ftp_conn);
            echo json_encode(["success" => $delete, "message" => $delete ? "File deleted successfully." : "File deletion failed."]);
        } else {
            echo json_encode(["success" => false, "message" => "No file specified for deletion."]);
        }
        break;

    case 'read':
        $post_data = json_decode(file_get_contents("php://input"), true);
        $file = $post_data['file'] ?? null;
        if ($file) {
            $ftp_conn = connect($ftp_user, $ftp_pass, $ftp_port);
            $temp_file = tempnam(sys_get_temp_dir(), 'ftp_');
            if (ftp_get($ftp_conn, $temp_file, $file, FTP_BINARY)) {
                $file_content = file_get_contents($temp_file);
                unlink($temp_file);
                ftp_close($ftp_conn);
                echo json_encode(["success" => true, "content" => $file_content]);
            } else {
                ftp_close($ftp_conn);
                echo json_encode(["success" => false, "message" => "Failed to retrieve the file content."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "No file specified for reading."]);
        }
        break;

    case 'update':
        $post_data = json_decode(file_get_contents("php://input"), true);
        $file = $post_data['file'] ?? null;
        $content = $post_data['content'] ?? null;
        if ($file && $content) {
            $temp_file = tempnam(sys_get_temp_dir(), 'ftp_');
            file_put_contents($temp_file, $content);
            $ftp_conn = connect($ftp_user, $ftp_pass, $ftp_port);
            $upload = ftp_put($ftp_conn, $file, $temp_file, FTP_BINARY);
            unlink($temp_file);
            ftp_close($ftp_conn);
            echo json_encode(["success" => $upload, "message" => $upload ? "File updated successfully." : "File update failed."]);
        } else {
            echo json_encode(["success" => false, "message" => "No file or content provided."]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid action."]);
        break;
}
?>
