<template>
  <p @click="$router.push({ name: 'id'})" class="go_back">Go to files</p>
  <div class="chat-container">
    <button v-if="selectedChat && isMobile" @click="selectedChat = null" class="back-to-list">
      ⬅
    </button>

    <ChatList @select-chat="selectChat" :class="{ 'hidden-mobile': selectedChat }" />
    <ChatWindow
      :selectedChat="selectedChat"
      :connection="connection"
      :messages="messages[selectedChat?.id] || []"
      @send-message="sendMessage"
      :class="{ 'hidden-mobile': !selectedChat, 'full-screen-chat': selectedChat }"
    />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import ChatList from "@/components/ChatList.vue";
import ChatWindow from "@/components/ChatWindow.vue";

const selectedChat = ref(null);
const messages = ref({});
const connection = ref(null);
const isMobile = ref(window.innerWidth <= 768);

const selectChat = (chat) => {
  selectedChat.value = chat;
  messages.value[chat.id] = messages.value[chat.id] || [];
};

const updateChats = (contacts) => {
  window.dispatchEvent(new CustomEvent('update-contacts', { detail: contacts }));
};

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const sendMessage = (message) => {
  if (selectedChat.value && connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.send(JSON.stringify({ chatId: selectedChat.value.id, message }));
    messages.value[selectedChat.value.id] = messages.value[selectedChat.value.id] || [];
    messages.value[selectedChat.value.id].push({ ...message, sender: getCookie("uid"), receiver: "other" });
  }
};

function connectWebSocket() {
  const name = getCookie("uid");
  connection.value = new WebSocket(`ws://localhost:8080/?myCustomID=${name}`);

  connection.value.onopen = () => console.log("WebSocket Client Connected");
  connection.value.onerror = (error) => console.log("Connection Error: " + error);
  connection.value.onclose = () => console.log("Connection Closed");

  connection.value.onmessage = async (message) => {
    try {
      let parsedData = message.data instanceof Blob ? JSON.parse(await message.data.text()) : JSON.parse(message.data);
      
      if (Array.isArray(parsedData)) {
        messages.value = {};
        if (parsedData.length === 0 || !parsedData[0].message) {
          updateChats(parsedData);
        } else {
          parsedData.forEach((msg) => {
            if (msg.sender && msg.receiver && msg.message) {
              messages.value[msg.receiver] = messages.value[msg.receiver] || [];
              messages.value[msg.receiver].push(msg);
            } else {
              console.error("Mensaje incompleto:", msg);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };
}

onBeforeMount(connectWebSocket);

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768;
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.chat-list {
  width: 30%;
  border-right: 1px solid #ccc;
}

.chat-window {
  width: 70%;
}

@media screen and (max-width: 768px) {
  .chat-input {
    width: 100%;
  }
}

.go_back {
  color: blue;
  cursor: pointer;
  margin-left: 1pc;
}

@media (max-width: 768px) {
  .chat-container {
    display: flex;
    flex-direction: column;
  }

  .chat-list,
  .chat-window {
    width: 100%;
  }

  .hidden-mobile {
    display: none;
  }
  
  .back-to-list {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #555;
  }
 
}
</style>
