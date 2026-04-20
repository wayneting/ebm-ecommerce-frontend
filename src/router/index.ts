import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth_v2'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ─── 公開 ───
    { path: '/', redirect: '/app' },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true, title: '登入' },
    },
    {
      path: '/styleguide',
      name: 'styleguide',
      component: () => import('../views/StyleguideView.vue'),
      meta: { public: true, title: '元件規範' },
    },

    // ─── 登入後客戶端 ───
    {
      path: '/app',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: '儀表板' },
    },
    {
      path: '/app/products',
      name: 'product-list',
      component: () => import('../views/ProductListView.vue'),
      meta: { title: '產品列表' },
    },
    {
      path: '/app/products/:productId/configure',
      name: 'product-config',
      component: () => import('../views/ProductConfigView.vue'),
      meta: { title: '配置模組' },
    },
    {
      path: '/app/upgrade',
      name: 'upgrade-select',
      component: () => import('../views/DongleSelectView.vue'),
      meta: { title: '升級產品 · 選擇 Dongle' },
    },
    {
      path: '/app/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { title: '購物車' },
    },
    {
      path: '/app/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { title: '確認訂單' },
    },
    {
      path: '/app/orders/success',
      name: 'order-success',
      component: () => import('../views/OrderSuccessView.vue'),
      meta: { title: '訂單建立成功' },
    },
    {
      path: '/app/orders',
      name: 'order-list',
      component: () => import('../views/OrderListView.vue'),
      meta: { title: '訂單列表' },
    },
    {
      path: '/app/orders/:id',
      name: 'order-detail',
      component: () => import('../views/OrderDetailView.vue'),
      meta: { title: '訂單詳情' },
    },
    {
      path: '/app/dongles',
      name: 'dongle-list',
      component: () => import('../views/DongleListView.vue'),
      meta: { title: 'Dongle 列表' },
    },
    {
      path: '/app/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: { title: '帳戶設定' },
    },

    // ─── Admin 後台 ───
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboardView.vue'),
      meta: { title: '後台儀表板' },
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/admin/AdminProductListView.vue'),
      meta: { title: '產品管理' },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('../views/admin/AdminOrderListView.vue'),
      meta: { title: '訂單管理' },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/admin/AdminUserListView.vue'),
      meta: { title: '使用者管理' },
    },

    // ─── POC（舊版結構照抄） ───
    {
      path: '/poc/product-config/:productId',
      name: 'poc-product-config',
      component: () => import('../views/poc/LegacyProductConfigView.vue'),
      meta: { title: 'POC · 新購產品-自訂' },
    },

    // 404 fallback
    { path: '/:pathMatch(.*)*', redirect: '/app' },
  ],
})

// ─── Router Guard ───
// 未登入時導 /login（帶 redirect query）。
// meta.public 為 true 的路由不檢查 auth。
router.beforeEach(async (to: RouteLocationNormalized) => {
  if (to.meta.public) return true

  const auth = useAuthStore()

  // 首次進來若 user === null，先嘗試 /api/auth/me（可能 token 還有效）
  if (!auth.isLoggedIn) {
    await auth.fetchMe()
  }

  if (!auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true
})

router.afterEach((to) => {
  const base = 'EBM Technologies'
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · ${base}` : base
})

export default router
