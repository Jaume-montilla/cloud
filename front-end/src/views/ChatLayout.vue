<template>
  <div class="chat-container">
    <p @click="$router.push({ name: 'file'})">Files</p>
    <ChatList @select-chat="selectChat" />
    <ChatWindow :selectedChat="selectedChat" :connection="connection" :messages="messages[selectedChat?.id] || []" @send-message="sendMessage" />
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import ChatList from "@/components/ChatList.vue";
import ChatWindow from "@/components/ChatWindow.vue";

const selectedChat = ref(null);
const messages = ref({});
const connection = ref(null);

const selectChat = (chat) => {
  selectedChat.value = chat;
};

const updateChats = (contacts) => {
  window.dispatchEvent(new CustomEvent('update-contacts', { detail: contacts }));
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

const sendMessage = (message) => {
  if (selectedChat.value && connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.send(JSON.stringify({ chatId: selectedChat.value.id, message }));
    if (!messages.value[selectedChat.value.id]) {
      messages.value[selectedChat.value.id] = [];
    }
    messages.value[selectedChat.value.id].push({ ...message, sender: getCookie("uid"), receiver: "other"});
    console.log("Mensaje enviado:", message);
  }
};

function connectWebSocket() {
  const name = getCookie("uid"); 
  connection.value = new WebSocket(`ws://localhost:8080/?myCustomID=${name}`); 
  
  connection.value.onopen = () => {
    console.log("WebSocket Client Connected");
  };

  connection.value.onerror = (error) => {
    console.log("Connection Error: " + error);
  };  

  connection.value.onclose = () => {
    console.log("Connection Closed");
  };

connection.value.onmessage = async (message) => {
  try {
    let parsedData;
    
    if (message.data instanceof Blob) {
      const text = await message.data.text();
      parsedData = JSON.parse(text);
    } else {
      parsedData = JSON.parse(message.data);
    }

    if (Array.isArray(parsedData)) {
      console.log("Received:", parsedData);
      
			messages.value = []
			if (!parsedData[0]) {
				
			} else {
      if (!parsedData[0].message) {
        updateChats(parsedData); 
      } else {
        parsedData.forEach((msg) => {
          if (msg.sender && msg.receiver && msg.message) {
            const chatId = msg.receiver;
						if (!messages.value[chatId]) {
              messages.value[chatId] = [];
            }
            messages.value[chatId].push(msg);
						} else {
            console.error("Mensaje incompleto:", msg);
          }
        });
			}}
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

}

onBeforeMount(() => {
  connectWebSocket();
});
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
