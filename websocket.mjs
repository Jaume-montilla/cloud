import { WebSocketServer } from 'ws';
import { getMessages, getContacts, saveMessage, connectToMongo } from './mongo_connection.mjs';
import url from 'url';

export default function webS() {
	connectToMongo();

	const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });

	const clients = new Map(); // Using Map instead of Set to store client info with their IDs

	wss.on('connection', (ws, req) => {
		console.log("Nuevo cliente conectado");

		const parameters = url.parse(req.url, true);
		ws.uid = parameters.query.myCustomID;

		if (!clients.has(ws.uid)) {
			clients.set(ws.uid, new Set());
		}
		clients.get(ws.uid).add(ws);

		getContacts().then((contacts) => {
			ws.send(JSON.stringify(contacts));
		}).catch((err) => {
			console.error("Error al obtener contactos:", err);
			ws.send(JSON.stringify({ error: "Error al obtener contactos" }));
		});

		ws.on('message', async (data) => {
			console.log(`Recibido: ${data}`);

			try {
				const message = JSON.parse(data);
				console.log(message);

				// Handle typing notifications
				if (message.action === "typing") {
					const { sender, receiver, isTyping } = message;

					// Forward typing notification to the receiver if they're online
					if (clients.has(receiver)) {
						clients.get(receiver).forEach(receiverClient => {
							if (receiverClient.readyState === WebSocket.OPEN) {
								receiverClient.send(JSON.stringify({
									action: "typing",
									sender: sender,
									isTyping: isTyping
								}));
							}
						});
					}
				}
				// Handle message retrieval
				else if (message.action === "getMessages") {
					const chatMessages = await getMessages(message.sender, message.receiver);
					ws.send(JSON.stringify(chatMessages));
				}
				// Handle new messages
				else if (message.message) {
					try {
						await saveMessage(message.message.sender, message.message.receiver, message.message.message);

						// Send message to receiver if they're online
						if (clients.has(message.message.receiver)) {
							clients.get(message.message.receiver).forEach(receiverClient => {
								if (receiverClient.readyState === WebSocket.OPEN) {
									receiverClient.send(data);
								}
							});
						}

						// Confirm message was sent to sender
						if (clients.has(message.message.sender)) {
							clients.get(message.message.sender).forEach(senderClient => {
								if (senderClient.readyState === WebSocket.OPEN) {
									senderClient.send(data);
								}
							});
						}
					} catch (err) {
						console.error("Error al guardar el mensaje:", err);
						ws.send(JSON.stringify({ error: "Error al guardar el mensaje" }));
					}
				}
			} catch (err) {
				console.error("Error processing message:", err);
			}
		});

		ws.on('close', () => {
			if (clients.has(ws.uid)) {
				clients.get(ws.uid).delete(ws);
				if (clients.get(ws.uid).size === 0) {
					clients.delete(ws.uid);
				}
			}
			console.log(`Cliente desconectado: ${ws.uid}`);
		});
	});

	console.log('El servidor WebSocket está ejecutándose en el puerto 8080');
}