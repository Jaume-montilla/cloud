import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
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
