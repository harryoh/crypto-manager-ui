import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import koLang from 'element-ui/lib/locale/lang/ko'

import firebase from 'firebase'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'development') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: koLang
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAMmnsoQKZblhpF3hAu5Fk_fJQlDNH5CXM',
  authDomain: 'crypto-manager-ff78a.firebaseapp.com',
  projectId: 'crypto-manager-ff78a',
  storageBucket: 'crypto-manager-ff78a.appspot.com',
  messagingSenderId: '171156851462',
  appId: '1:171156851462:web:a1a2a7fdbb44787a4e2c87',
  measurementId: 'G-J6NQC1M21S'
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
