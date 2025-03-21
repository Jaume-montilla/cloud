import http from "http";
import { saveUser, checkUser } from "./mongo_connection.mjs";
import startFtpServer from "./ftp.mjs";
import detectPort from "detect-port";
import webS from "./websocket.mjs";

webS()

const httpServer = http.createServer((req, res) => {
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
				const { name, password, email, accion } = parsedData;

				if (accion === "create") {
					saveUser(name, password, email)
						.then((result) => {
							console.log(result);
							res.writeHead(200, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ message: "Usuario creado exitosamente" }));
						})
						.catch((err) => {
							console.error("Error al guardar el usuario:", err);
							res.writeHead(500, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ message: "Error interno del servidor" }));
						});
				} else if (accion === "check") {
					checkUser(name, password)
						.then(async (result) => {
							console.log(result);
							const [allow, uid] = result.split(";");
							if (allow === "Inicio de sesión exitoso") {
								let ftpPort;
								do {
									ftpPort = await detectPort();
								} while (!ftpPort);
								console.log(ftpPort);
								res.writeHead(200, { "Content-Type": "application/json" });
								res.end(JSON.stringify({ message: "Funciona;" + ftpPort + ";" + uid }));
								startFtpServer(name, ftpPort);
							} else {
								res.writeHead(400, { "Content-Type": "application/json" });
								res.end(JSON.stringify({ message: "Usuario o contraseña incorrectos" }));
							}
						})
						.catch((err) => {
							console.error("Error al verificar el usuario:", err);
							res.writeHead(500, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ message: "Error interno del servidor" }));
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

