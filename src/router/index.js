import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ExpensesView from '../views/ExpensesView.vue'
import AnalysisView from '../views/AnalysisView.vue'
import { getToken } from '../api/http.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/expenses', component: ExpensesView },
    { path: '/analysis', component: AnalysisView },
  ],
})
router.beforeEach((to) => {
  const hasToken = Boolean(getToken())
  const authPages = ['/login', '/register']
  if (!hasToken && !authPages.includes(to.path)) {
    return '/login'
  }
  if (hasToken && authPages.includes(to.path)) {
    return '/expenses'
  }
  return true
})
export default router