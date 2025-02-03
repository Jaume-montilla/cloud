
import WebSocket from 'ws';
import { connect } from './mongo_chats.mjs';

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', ws => {
    console.log("Nuevo cliente conectado");
    clients.add(ws);

    ws.on('message', async (data) => {
        console.log(`Recibido: ${data}`);

        const message = JSON.parse(data);
        await connect(message.sender, message.receiver, message.content);

        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

console.log('El servidor WebSocket está ejecutándose en el puerto 8080');