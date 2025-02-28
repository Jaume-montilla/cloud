<template>
  <div v-if="selectedChat" class="chat-window">
    <div class="chat-header">
      <img src="../assets/default.webp" alt="Profile" class="profile-pic" />
      <span>{{ selectedChat.name }}</span>
    </div>
    <div v-for="message in localMessages" :key="message._id" 
         :class="['message', message.sender === userId ? 'sent' : 'received']">
      <p>{{ message.message }}</p>
      <span class="timestamp">{{ message.timestamp }}</span>
    </div>
    <div class="chat-input">
      <button class="attach-button" @click="toggleMenu">+</button>
      <div v-if="showMenu" class="menu-options">
        <button @click="sendFile">Send files</button>
        <button @click="sendImage">Send photos</button>
      </div>
      <input type="text" v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
      <button class="send-button" @click="sendMessage">Send</button>
    </div>
  </div>

  <div v-else class="chat-empty-state">
    <p>Select a conversation to start chatting</p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";

const props = defineProps({
  selectedChat: Object,
  messages: Array,
  connection: Object,
});

const userId = ref(getCookie("uid"));  
const localMessages = ref([]);
const newMessage = ref("");
const showMenu = ref(false);

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
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

const emit = defineEmits(["send-message"]);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const message = {
      _id: now.getTime(),
      sender: userId.value,
      receiver: props.selectedChat.id,
      message: newMessage.value.trim(),
      timestamp,
    };

    emit("send-message", message);
    newMessage.value = "";
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    const container = document.getElementById("messagesContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

// Observa cuando cambia el chat seleccionado
watch(() => props.selectedChat, async (newChat) => {
  if (newChat) {
    localMessages.value = [];
    if (props.messages && props.messages[newChat.id]) {
      localMessages.value = props.messages[newChat.id];
    }

    if (props.connection && props.connection.readyState === WebSocket.OPEN) {
      const request = {
        action: "getMessages",
        sender: userId.value,
        receiver: newChat.id
      };
      props.connection.send(JSON.stringify(request));
    }
  }
});

watch(() => props.connection, async (newConnection) => {
  if (newConnection) {
    newConnection.onmessage = async (message) => {
      let data;
      if (message.data instanceof Blob) {
        const text = await message.data.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Error parsing message:', e);
          return;
        }
      } else {
        try {
          data = JSON.parse(message.data);
        } catch (e) {
          console.error('Error parsing message:', e);
          return;
        }
      }

      if (Array.isArray(data)) {
        const filteredMessages = data.filter(msg => 
          (msg.sender === userId.value && msg.receiver === props.selectedChat.id) ||
          (msg.receiver === userId.value && msg.sender === props.selectedChat.id)
        );

        const newMessages = filteredMessages.filter((msg, index, self) =>
          index === self.findIndex((m) => m._id === msg._id)
        );

        localMessages.value = [...localMessages.value, ...newMessages];
        scrollToBottom();
      }
    };
  }
});

watch(() => props.messages, (newMessages) => {
  if (newMessages) {
    localMessages.value = newMessages.filter(msg => 
      (msg.sender === userId.value && msg.receiver === props.selectedChat.id) ||
      (msg.receiver === userId.value && msg.sender === props.selectedChat.id)
    );
    scrollToBottom();
  }
});

onMounted(() => {
  scrollToBottom();
});
</script>



<style scoped>
.message-sender {
  text-align: right;
  background-color: #f0f0f0;
}

.message-receiver {
  text-align: left;
  background-color: #e0e0e0;
}

.messages-container {
  max-height: 400px;
  overflow-y: scroll;
}

.send-message {
  display: flex;
  justify-content: space-between;
}

.send-message input {
  width: 80%;
}
</style>
/*

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #e9e9e9;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
}

.chat-header .profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  margin-bottom: 10px;
  word-wrap: break-word;
}

.message.received {
  background-color: #ffffff;
  align-self: flex-start;
  color: black;
}

.message.sent {
  background-color: #dcf8c6;
  align-self: flex-end;
  color: black;
}

.timestamp {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
  display: block;
  margin-top: 5px;
  text-align: right;
}

.chat-input {
  padding: 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #ccc;
	width: 70vw;
	position: fixed;
	bottom: 0;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chat-input button {
  padding: 8px 15px;
  border: none;
  background-color: #007bff;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-input button:hover {
  background-color: #0056b3;
}

.attach-button {
  padding: 8px;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.attach-button:hover {
  background-color: #0056b3;
}

.menu-options {
  position: absolute;
  bottom: 50px;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 10;
}

.menu-options button {
  padding: 8px;
  font-size: 0.9rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.menu-options button:hover {
  background-color: #0056b3;
}

.chat-empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 18px;
  color: #888;
  text-align: center;
  background-color: #e9e9e9;
}
</style>
*/
