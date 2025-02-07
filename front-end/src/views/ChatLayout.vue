<template>
  <div class="chat-container">
  <ChatList @click=connectWebSocket @select-chat="selectChat" />
    <ChatWindow :selectedChat="selectedChat" :connection="connection" :messages="messages[selectedChat?.id] || []" @send-message="sendMessage" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChatList from "@/components/ChatList.vue";
import ChatWindow from "@/components/ChatWindow.vue";

const selectedChat = ref(null);
const messages = ref({});
const connection = ref(null);

const selectChat = (chat) => {
  selectedChat.value = chat;
};

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
var name = ""
onBeforeMount(async () => {
	name = getCookie("username")
})

const sendMessage = (message) => {
  if (selectedChat.value && connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.send(JSON.stringify({ chatId: selectedChat.value.id, message }));
    if (!messages.value[selectedChat.value.id]) {
      messages.value[selectedChat.value.id] = [];
    }
    messages.value[selectedChat.value.id].push({ ...message, sender: "user" , receiver: "other"});
    console.log("Mensaje enviado:", message);
  }
};

function connectWebSocket() {
  if (!selectedChat.value) {
    return;
  }
  // cambiar el mycustomID por el id del usuario logueado y que se pase como prop a todas las paginas que lo use :) okey

  const clientId = String(selectedChat.value.id);
  connection.value = new WebSocket(`ws://localhost:8080/?myCustomID=${name}&connectionID=${clientId}`);

  connection.value.onopen = () => {
    console.log("WebSocket Client Connected");
  };

  connection.value.onerror = (error) => {
    console.log("Connection Error: " + error);
  };  

  connection.value.onclose = () => {
    console.log("Connection Closed");
  };

  // connection.value.onmessage = (message) => {
  //   if (message.data) {
  //     const data = JSON.parse(message.data);
  //     if (!messages.value[data.chatId]) {
  //       messages.value[data.chatId] = [];
  //     }
  //     messages.value[data.chatId].push({ sender: "other", content: data.message });
  //     console.log("Received:", data.message);
  //   }
  // };
}

window.onload = () => {
  connectWebSocket();
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
