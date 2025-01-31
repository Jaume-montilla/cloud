import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('../views/AboutView.vue'),
		},
		{
			path: '/home',
			name: 'id',
			props: true,
			component: () => import('../views/MainLogged.vue'),
		},
		{
			path: '/file/:name',
			name: 'file',
			props: true,
			component: () => import('../views/FileOpened.vue'),
		},
	],
})

export default router
