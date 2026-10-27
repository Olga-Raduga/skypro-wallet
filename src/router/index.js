import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ExpensesView from '../views/ExpensesView.vue'
import AnalysisView from '../views/AnalysisView.vue'
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
export default router