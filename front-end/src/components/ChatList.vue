<template>
  <div class="chat-list">
    <div class="search-bar">
      <input type="text" placeholder="Search..." v-model="searchTerm" />
    </div>
    <div
      v-for="chat in filteredChats"
      :key="chat.id"
      class="chat-item"
      @click="$emit('select-chat', chat)"
    >
      <img :src="chat.image" alt="Profile" class="profile-pic" />
      <span>{{ chat.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const chats = ref([
  { id: 1, name: "Contact 1", image: "/images/profile1.png" },
  { id: 2, name: "Contact 2", image: "/images/profile2.png" },
  { id: 3, name: "Contact 3", image: "/images/profile3.png" },
  { id: 4, name: "Group 1", image: "/images/group1.png" },
  { id: 5, name: "Contact 4", image: "/images/profile4.png" },
]);

const searchTerm = ref("");

const filteredChats = computed(() => {
  return chats.value.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>

<style scoped>
.chat-list {
  width: 30%;
  background-color: #ffffff;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}
.search-bar {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
}
.chat-item:hover {
  background-color: #f7f7f7;
}
.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}
</style>