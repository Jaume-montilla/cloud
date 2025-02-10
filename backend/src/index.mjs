import http from "http";
import { saveUser, checkUser } from "./mongo_connection.mjs";
import startFtpServer from "./ftp.mjs";
import kill from "kill-port";
import net from 'net';  // Importar el módulo net usando 'import'

// Función para verificar si el puerto está libre
function isPortFree(port) {
	return new Promise((resolve, reject) => {
		const server = net.createServer()
			.once('error', (err) => {
				if (err.code === 'EADDRINUSE') {
					reject(new Error('Puerto en uso'));
				}
			})
			.once('listening', () => {
				server.close();
				resolve();
			})
			.listen(port);
	});
}

const httpServer = http.createServer(async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "POST" && req.url === "/") {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const parsedData = JSON.parse(body);
				const { name, password, accion } = parsedData;

				if (accion === "create") {
					saveUser(name, password)
						.then((result) => {
							console.log(result);
							res.writeHead(200, { "Content-Type": "application/json" });
							res.end(
								JSON.stringify({ message: "Usuario creado exitosamente" })
							);
						})
						.catch((err) => {
							console.error("Error al guardar el usuario:", err);
							res.writeHead(500, { "Content-Type": "application/json" });
							res.end(
								JSON.stringify({ message: "Error interno del servidor" })
							);
						});
				} else if (accion === "check") {
					checkUser(name, password)
						.then(async (result) => {
							console.log(result);

							if (result === "Inicio de sesión exitoso") {
								try {
									// Liberar el puerto 9876 si está ocupado
									await kill(9876);
									console.log("Puerto 9876 liberado");

									// Esperar a que el puerto esté libre
									await isPortFree(9876);
									console.log("El puerto 9876 está libre.");

									// Iniciar el servidor FTP después de liberar el puerto
									setTimeout(() => {
										startFtpServer(name);
										res.writeHead(200, { "Content-Type": "application/json" });
										res.end(JSON.stringify({ message: "Conexión FTP exitosa" }));
									}, 1000);
								} catch (error) {
									console.error("Error al liberar el puerto o iniciar el servidor FTP:", error);
									res.writeHead(500, { "Content-Type": "application/json" });
									res.end(JSON.stringify({ message: "Error al liberar el puerto o iniciar el servidor FTP" }));
								}
							} else {
								res.writeHead(400, { "Content-Type": "application/json" });
								res.end(JSON.stringify({ message: "Usuario o contraseña incorrectos" }));
							}
						})
						.catch((err) => {
							console.error("Error al verificar el usuario:", err);
							res.writeHead(500, { "Content-Type": "application/json" });
							res.end(
								JSON.stringify({ message: "Error interno del servidor" })
							);
						});
				} else {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "Acción no válida" }));
				}
			} catch (err) {
				console.error("Error al parsear JSON:", err);
				res.writeHead(400, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "JSON inválido" }));
			}
		});
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ message: "Ruta no encontrada" }));
	}
});

httpServer.listen(3000, "127.0.0.1", () => {
	console.log("Servidor HTTP escuchando en el puerto 3000");
});

