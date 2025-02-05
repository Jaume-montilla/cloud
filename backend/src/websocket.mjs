import WebSocket from 'ws';
import { connect, getMessages } from './mongo_chats.mjs';
import url from 'url';

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.getUniqueID = function () {
    return Math.floor(Math.random() * 1000000);
};

wss.on('connection', (ws, req) => {
    console.log("Nuevo cliente conectado");

    const parameters = url.parse(req.url, true);
    ws.uid = parameters.query.myCustomID;
    ws.connected = parameters.query.connectionID;

    clients.add(ws);
    getMessages(ws.uid, ws.connected).then((x) => {
        console.log(x);
        ws.send(JSON.stringify(x));
    });

    ws.on('message', async (data) => {
        console.log(`Recibido: ${data}`);

        const message = JSON.parse(data);
        console.log(message);
        await connect(message.message.sender, message.message.receiver, message.message.content);

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log("Cliente desconectado");
    });
});

console.log('El servidor WebSocket está ejecutándose en el puerto 8080');