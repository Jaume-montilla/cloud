import http from "http";
import { saveUser, checkUser } from "./mongo_connection.mjs";
import startFtpServer from "./ftp.mjs";
import detectPort, { detect } from 'detect-port';

function decectPort() {
	let port = getRandomInt()
	detect(port)
		.then(realPort => {
			if (port == realPort) {
				return true;
			} else {
				return false
			}
		})
		.catch(err => {
			console.log(err);
		});
}

function getRandomInt(max = 10000) {
	return Math.floor(Math.random() * max);
}


const httpServer = http.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "POST" && req.url === "/") {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			try {
				const parsedData = JSON.parse(body);
				const { name, password, email, accion } = parsedData;

				if (accion === "create") {
					saveUser(name, password, email)
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
								decectPort(9876)
								res.writeHead(200, { "Content-Type": "application/json" });
								res.end(JSON.stringify({ message: "Funciona" }));
								let puerto;
								do {
									puerto = await detectPort()
								} while (puerto == false);
								console.log(puerto)
								startFtpServer(name, puerto);
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
