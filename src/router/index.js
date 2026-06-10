import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginVieww from '@/views/auth/LoginVieww.vue'
import RegisterVieww from '@/views/auth/RegisterVieww.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import DashboardUser from '@/views/DashboardUser.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView,
  // },
  {
    path: '/register',
    name: 'register',
    component: RegisterVieww,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginVieww,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardUser,
    meta: { requiresAuth: true }
  },
   {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: DashboardAdmin,
    meta: { requiresAuth: true }
  },
   {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { guestOnly: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { guestOnly: true }
  },
  {
    path: '/admin/destinations',
    name: 'Destinations',
    component: () => import('@/views/admin/DestinationsView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
},
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const authRoutes = ['/login', '/register']  // Routes d'auth

  // 1. Si la route nécessite un token et qu'il n'y en a pas
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  // 2. Si l'utilisateur a un token et essaie d'aller sur login/register
  if (token && authRoutes.includes(to.path)) {
    return '/dashboard'
  }

  // 3. Sinon, on laisse passer
  return true
})

export default router
