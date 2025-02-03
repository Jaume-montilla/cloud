import WebSocket from 'ws';
import { connect, getMessages } from './mongo_chats.mjs';

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', ws => {
    console.log("Nuevo cliente conectado");
    clients.add(ws);
    getMessages("user", "1").then((x) => {
        console.log(x);
    });

    ws.on('message', async (data) => {
        console.log(`Recibido: ${data}`);

        const message = JSON.parse(data);
        console.log(message);
        await connect(message.message.sender, message.message.receiver, message.message.content);

        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log("Cliente desconectado");
    });
});

console.log('El servidor WebSocket está ejecutándose en el puerto 8080');