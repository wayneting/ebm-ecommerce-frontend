import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 客戶端
    {
      path: '/',
      redirect: '/app',
    },
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

    // Admin 後台
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

    // 開發用：元件規範頁
    {
      path: '/styleguide',
      name: 'styleguide',
      component: () => import('../views/StyleguideView.vue'),
      meta: { title: '元件規範' },
    },

    // POC · 舊版結構照抄（用於與現有實作並行對比）
    {
      path: '/poc/product-config/:productId',
      name: 'poc-product-config',
      component: () => import('../views/poc/LegacyProductConfigView.vue'),
      meta: { title: 'POC · 新購產品-自訂（舊版結構照抄）' },
    },

    // 404 → 回儀表板
    { path: '/:pathMatch(.*)*', redirect: '/app' },
  ],
})

router.afterEach((to) => {
  const base = 'EBM Technologies'
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · ${base}` : base
})

export default router
