// import net from "net";
// import { saveUser, checkUser } from "./mongo_connection.mjs";

// const server = net.createServer((socket) => {
//   console.log("Client connected.");
//   let requestData = "";
//   let bodyData = "";
//   socket.on("data", (data) => {
//     requestData += data.toString();
//     const headerEnd = requestData.indexOf("\r\n\r\n");
//     if (headerEnd !== -1) {
//       bodyData = requestData.slice(headerEnd + 4);

//       try {
//         const parsedData = JSON.parse(bodyData);
//         const { name, password, email, accion } = parsedData;

//         console.log(accion);
//         if (accion == "create") {
//           saveUser(name, password, email).then((x) => {
//             console.log(x);
//           });
//         } else if (accion == "check") {
//           console.log("checkeando");
//           checkUser(name, password).then((x) => {
//             console.log(x);
//           });
//         }
//         console.log(`Name: ${name}, Password: ${password}, Email: ${email}`);
//         const resp =
//           "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n" +
//           JSON.stringify({ message: "Inicio de sesión exitoso" });
//         socket.write(resp);
//       } catch (err) {
//         console.error("Error al parsear JSON:", err);
//       }
//       socket.end();
//     }
//   });
//   socket.on("end", () => {
//     console.log("Client disconnected.");
//   });
// });
// server.listen(3000, "127.0.0.1", () => {
//   console.log("Server started and listening on port 3000");
// });

import http from "http";
import { saveUser, checkUser } from "./mongo_connection.mjs";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
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
            .then((result) => {
              console.log(result);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: result }));
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

server.listen(3000, "127.0.0.1", () => {
  console.log("Servidor HTTP escuchando en el puerto 3000");
});
