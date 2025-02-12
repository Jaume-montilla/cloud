import { WebSocketServer } from 'ws';
import { connect, getMessages, getContacts } from './mongo_chats.mjs';
import url from 'url';

export default function webS() {
	const wss = new WebSocketServer({ port: 8080, host: 'localhost' });

	const clients = new Set();
	console.log(wss);

	wss.on('connection', (ws, req) => {
		console.log("Nuevo cliente conectado");

		const parameters = url.parse(req.url, true);
		ws.uid = parameters.query.myCustomID;

		clients.add(ws);

		getContacts().then((x) => {
			ws.send(JSON.stringify(x));
		});

		ws.on('message', async (data) => {
			console.log(`Recibido: ${data}`);

			const message = JSON.parse(data);
			console.log(message);

			if (message.action === "getMessages") {
				const chatMessages = await getMessages(message.sender, message.receiver);
				ws.send(JSON.stringify(chatMessages));
			} else {
				await connect(message.message.sender, message.message.receiver, message.message.content);

				if (ws.readyState === WebSocket.OPEN) {
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

