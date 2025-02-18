import { WebSocketServer } from 'ws';
import { getMessages, getContacts, saveMessage, connectToMongo } from './mongo_connection.mjs';
import url from 'url';

export default function webS() {
	connectToMongo();

	const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });

	const clients = new Set();
	console.log(wss);

	wss.on('connection', (ws, req) => {
		console.log("Nuevo cliente conectado");

		const parameters = url.parse(req.url, true);
		ws.uid = parameters.query.myCustomID;

		clients.add(ws);

		getContacts().then((contacts) => {
			ws.send(JSON.stringify(contacts));
		}).catch((err) => {
			console.error("Error al obtener contactos:", err);
			ws.send(JSON.stringify({ error: "Error al obtener contactos" }));
		});

		ws.on('message', async (data) => {
			console.log(`Recibido: ${data}`);

			const message = JSON.parse(data);
			console.log(message);

			if (message.action === "getMessages") {
				const chatMessages = await getMessages(message.sender, message.receiver);
				ws.send(JSON.stringify(chatMessages));
			} else {
				try {
					await saveMessage(message.message.sender, message.message.receiver, message.message.message);
				} catch (err) {
					console.error("Error al guardar el mensaje:", err);
					ws.send(JSON.stringify({ error: "Error al guardar el mensaje" }));
				}
				if (ws.readyState === ws.OPEN) {
					ws.send(data);
				}
			}
		});

		ws.on('close', () => {
			clients.delete(ws);
			console.log("Cliente desconectado");
		});
	});

	console.log('El servidor WebSocket está ejecutándose en el puerto 8080');
}
