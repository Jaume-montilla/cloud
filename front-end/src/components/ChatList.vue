<template>
  <div class="chat-list">
    <h1>Chats</h1>
    <div class="search-bar">
      <input type="text" placeholder="Search..." v-model="searchTerm" />
    </div>
    <div v-for="chat in filteredChats" :key="chat.id" class="chat-item" @click="$emit('select-chat', chat)">
      <img :src="chat.image" alt="Profile" class="profile-pic" />
      <span>{{ chat.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const chats = ref([]);
const searchTerm = ref("");

const filteredChats = computed(() => {
  const filtered = chats.value.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  return filtered;
});

const updateChats = (contacts) => {
	contacts.forEach(contact=> {
		console.log(contact._id, contact.name)
	});
  chats.value = contacts.map(contact => ({
    id: contact._id,
    name: contact.name,
    image: "/images/default.png" 
  }));
	console.log(chats.value)
};

onMounted(() => {
  window.addEventListener('update-contacts', (event) => {
    updateChats(event.detail);
  });
});
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  padding: 10px;
  margin-bottom: 5px;
}

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
  width: 95%;
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
