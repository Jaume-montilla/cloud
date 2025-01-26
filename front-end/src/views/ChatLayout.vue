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
