/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');


window.Vue = require('vue');

import Profile from './components/Profile.vue'
import Dashboard from './components/Dashboard.vue'
import Developer from './components/Developer.vue'
import Users from './components/Users.vue'
import NotFound from './components/NotFound.vue'
import moment from 'moment'

//Gate.js import if user is authenticated
import Gate from "./Gate.js";

Vue.prototype.$gate = new Gate(window.user);


//Validation Vform
import { Form, HasError, AlertError } from 'vform'

window.Form =Form;  //registered globally
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


//Pagination

Vue.component('pagination', require('laravel-vue-pagination'));


// Added Routes
import VueRouter from 'vue-router'
import { Verify } from 'crypto';
Vue.use(VueRouter)

// 2. Define some routes
let routes = [
    { path: '/dashboard', component: Dashboard},
    { path: '/profile', component: Profile },
    { path: '/developer', component: Developer },
    { path: '/users', component: Users },
    { path: '*', component: NotFound }
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


  //ProgressBar 
  import VueProgressBar from 'vue-progressbar'

  Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
  })


  //Sweet Alert
  import Swal from 'sweetalert2'
   window.Swal =Swal

  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  })
  window.toast =toast

  window.Fire = new Vue();



///Paspport Authentication import 
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);
 
//Not Found Vue
Vue.component(
  'not-found',
  require('./components/NotFound.vue').default
);



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
    data:{
      search:''
    },
    methods:{ 
     searchit(){

      Fire.$emit('searching'); //custom event
       console.log('searching')
     }

    },

    el: '#app',
    router // Make sure to inject the router with the router option to make the // whole app router-aware.
});
