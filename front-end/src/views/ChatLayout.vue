<template>
  <div class="chat-container">
    <ChatList @select-chat="selectChat" />
    <ChatWindow :selectedChat="selectedChat" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChatList from "@/components/ChatList.vue";
import ChatWindow from "@/components/ChatWindow.vue";

const selectedChat = ref(null);

const selectChat = (chat) => {
  selectedChat.value = chat;
};

let connection;

function connectWebSocket() {
    connection = new WebSocket("ws://localhost:8080");

    connection.onopen = () => {
        console.log("WebSocket Client Connected");
    };

    connection.onerror = (error) => {
        console.log("Connection Error: " + error);
    };

    connection.onclose = () => {
        console.log("Connection Closed");
    };

    connection.onmessage = (message) => {
        if (message.data) {
            const data = JSON.parse(message.data);
            console.log("Received: '" + data.message + "'");
        }
    };
}

window.onload = () => {
      connectWebSocket();
    setTimeout (() => {
      if (connection && connection.readyState === WebSocket.OPEN) {
        connection.send(
            JSON.stringify(
                "hola que tal"
            ),
        );
        console.log("sms mandado :)");
    }    }, 5000);
   
};
</script>     

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.chat-list {
  width: 30%;
  border-right: 1px solid #ccc;
}

.chat-window {
  width: 70%;
}
</style>
