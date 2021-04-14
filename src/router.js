import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: 'dashboard',
          component: () => import('@/views/dashboard/Dashboard'),
          meta: {
            show: true
          }
        },
        // Pages
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          meta: {
            show: true
          }
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
          meta: {
            show: true
          }
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
          meta: {
            show: true
          }
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
          meta: {
            show: true
          }
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables'),
          meta: {
            show: true
          }
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps'),
          meta: {
            show: true
          }
        },
        // Upgrade
        {
          name: 'Upgrade',
          path: 'upgrade',
          component: () => import('@/views/dashboard/Upgrade'),
          meta: {
            show: true
          }
        },
        {
          name: 'Users',
          path: 'users',
          component: () => import('@/views/Users'),
          meta: {
            show: true
          },
          beforeEnter: (to, from, next) => {
            if (to.name == 'Users' && localStorage.getItem("level") == "reader") next({ name: 'Documents' })
            next()
          }
        },
        {
          name: 'Readers',
          path: 'readers',
          component: () => import('@/views/Readers'),
          meta: {
            show: true
          },
          beforeEnter: (to, from, next) => {
            if (to.name == 'Readers' && localStorage.getItem("level") == "reader") next({ name: 'Documents' })
            next()
          }
        },
        {
          name: 'Hồ sơ bệnh nhân',
          path: '/',
          component: () => import('@/views/Patient'),
          meta: {
            show: true
          }
        },
        {
          name: 'Authors',
          path: 'authors',
          component: () => import('@/views/Authors'),
          meta: {
            show: true
          }
        },
        {
          name: 'Publishers',
          path: 'publishers',
          component: () => import('@/views/Publishers'),
          meta: {
            show: true
          }
        },
        {
          name: 'Languages',
          path: 'languages',
          component: () => import('@/views/Languages'),
          meta: {
            show: true
          }
        },
        {
          name: 'Fields',
          path: 'fields',
          component: () => import('@/views/Fields'),
          meta: {
            show: true
          }
        },
        {
          name: 'Bills',
          path: 'bills',
          component: () => import('@/views/Bills'),
          meta: {
            show: true
          },
          beforeEnter: (to, from, next) => {
            if (to.name == 'Bills' && localStorage.getItem("level") == "reader") next({ name: 'Documents' })
            next()
          }
        },
        {
          name: 'Login',
          path: 'login',
          component: () => import('@/views/Login'),
          meta: {
            show: false
          },
          beforeEnter: (to, from, next) => {
            if (to.name == 'Login' && localStorage.getItem("token")) next({ name: 'Documents' })
            next()
          }
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('@/views/Register'),
          meta: {
            show: false
          }
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (to.name != 'Login' && to.name != 'Register' && !localStorage.getItem("token")) next({ name: 'Login' })
  next()
})
export default router
