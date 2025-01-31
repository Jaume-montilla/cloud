<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$ftp_host = "127.0.0.1";
$ftp_user = "funcionara";
$ftp_pass = "password";
$ftp_port = 9876;
$action = $_GET['action'] ?? null;

## falta que el user y el pwd se manden con la cookie de sesion


switch ($action) {
    case 'list':
        $ftp_conn = ftp_connect($ftp_host, $ftp_port) or die(json_encode(["success" => false, "message" => "Unable to connect to FTP server."]));
        ftp_login($ftp_conn, $ftp_user, $ftp_pass);

        $files = ftp_nlist($ftp_conn, "."); 
        ftp_close($ftp_conn);

        echo json_encode(["success" => true, "files" => $files]);
        break;

    case 'upload':
        $file = $_FILES['file'] ?? null;
        if ($file && $file['tmp_name']) {
            $ftp_conn = ftp_connect($ftp_host, $ftp_port) or die(json_encode(["success" => false, "message" => "Unable to connect to FTP server."]));
            ftp_login($ftp_conn, $ftp_user, $ftp_pass);

            $upload = ftp_put($ftp_conn, $file['name'], $file['tmp_name'], FTP_BINARY);
            ftp_close($ftp_conn);

            echo json_encode([
                "success" => $upload,
                "message" => $upload ? "File uploaded successfully." : "File upload failed."
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "No file uploaded."]);
        }
        break;
    case 'delete':
        $post_data = json_decode(file_get_contents("php://input"), true);
        $file = $post_data['file'] ?? null;

        if ($file) {
            $ftp_conn = ftp_connect($ftp_host, $ftp_port) or die(json_encode(["success" => false, "message" => "Unable to connect to FTP server."]));
            ftp_login($ftp_conn, $ftp_user, $ftp_pass);

            $delete = ftp_delete($ftp_conn, $file);
            ftp_close($ftp_conn);

            echo json_encode([
                "success" => $delete,
                "message" => $delete ? "File deleted successfully." : "File deletion failed."
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "No file specified for deletion."]);
        }
        break;

		    case 'read':
        $post_data = json_decode(file_get_contents("php://input"), true);
        $file = $post_data['file'] ?? null;

        if ($file) {
            $ftp_conn = ftp_connect($ftp_host, $ftp_port) or die(json_encode(["success" => false, "message" => "Unable to connect to FTP server."]));
            ftp_login($ftp_conn, $ftp_user, $ftp_pass);

            $temp_file = tempnam(sys_get_temp_dir(), 'ftp_');
            if (ftp_get($ftp_conn, $temp_file, $file, FTP_BINARY)) {
                $file_content = file_get_contents($temp_file);
                unlink($temp_file); 
                ftp_close($ftp_conn);

                echo json_encode([
                    "success" => true,
                    "content" => $file_content
                ]);
            } else {
                ftp_close($ftp_conn);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to retrieve the file content."
                ]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "No file specified for reading."]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid action."]);
        break;
}
?>
