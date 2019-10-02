/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import Profile from './components/Profile.vue'
import Dashboard from './components/Dashboard.vue'
import Users from './components/Users.vue'
import moment from 'moment'

//Validation Vform
import { Form, HasError, AlertError } from 'vform'
window.Form =Form;  //registered globally
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


// Added Routes
import VueRouter from 'vue-router'
import { Verify } from 'crypto';
Vue.use(VueRouter)

// 2. Define some routes
let routes = [
    { path: '/dashboard', component: Dashboard},
    { path: '/profile', component: Profile },
    { path: '/users', component: Users }
  ]
  
  //3. Create the router instance and pass the `routes` option
  const router = new VueRouter({
    mode:'history',
    routes // short for `routes: routes`
  })


  //Filter
  Vue.filter('upText',function (text) {
      //return text.toUpperCase();
      return text.charAt(0).toUpperCase() + text.slice(1)
  });
  
  Vue.filter('myDate',function (created) {
    return moment(created).format('MMMM Do YYYY, h:mm:ss a');
  });


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue'));

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router // Make sure to inject the router with the router option to make the // whole app router-aware.
});
