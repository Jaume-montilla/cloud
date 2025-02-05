import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: "login",
			component: () => import("../views/LogIn.vue"),
		},
		{
			path: "/signup",
			name: "signup",
			component: () => import("../views/SignUpView.vue"),
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
		{
			path: '/chat',
			name: 'chat',
			props: true,
			component: () => import('../views/ChatLayout.vue')
		},
	],
})

export default router
