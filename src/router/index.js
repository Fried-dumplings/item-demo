import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/Login'
import Index from '@/pages/Index'

// 系统设置	el-icon-setting	1	  
// 菜单管理		2	/menu
// 角色管理		2	/role
// 管理员管理		2	/user
// 商城管理	el-icon-s-goods	1	
// 商品分类		2	/category
// 商品规格		2	/specs
// 商品管理		2	/goods
// 会员管理		2	/member
// 轮播图管理		2	/banner
// 秒杀活动		2	/seckill

import Home from '@/components/main/Home'
import menu from '@/components/main/menu'
import role from '@/components/main/role'
import user from '@/components/main/user'
import category from '@/components/main/category'
import specs from '@/components/main/specs'
import goods from '@/components/main/goods'
import member from '@/components/main/member'
import banner from '@/components/main/banner'
import seckill from '@/components/main/seckill'



// 重定向错误
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

// 系统设置	el-icon-setting	1	  
// 菜单管理		2	/menu
// 角色管理		2	/role
// 管理员管理		2	/user
// 商城管理	el-icon-s-goods	1	
// 商品分类		2	/category
// 商品规格		2	/specs
// 商品管理		2	/goods
// 会员管理		2	/member
// 轮播图管理		2	/banner
// 秒杀活动		2	/seckill

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'menu',
          component: menu
        },
        {
          path: 'role',
          component: role
        },
        {
          path: 'user',
          component: user
        },
        {
          path: 'category',
          component: category
        },
        {
          path: 'specs',
          component: specs
        },
        {
          path: 'goods',
          component: goods
        },
        {
          path: 'member',
          component: member
        },
        {
          path: 'banner',
          component: banner
        },
        {
          path: 'seckill',
          component: seckill
        },
        {
          path: '',
          redirect: '/home'
        }
      ],
    }
  ]
})

//是否登录
let isLogin = false;
let count = 0

router.beforeEach((to, from, next) => {

  let sessionS = JSON.parse(sessionStorage.getItem('user'))
  // console.log(1);
  if (sessionS) {
    //已登录
    if (to.path == '/') {
      next()
    } else {
      next()
    }
  } else {
    //未登录
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }
})


export default router