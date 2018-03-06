import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios, axios);

import App from './App.vue';
import ShowCustomers from './components/ShowCustomers.vue';
import CreateItem from './components/CreateItem.vue';
import EditItem from './components/EditItem.vue';

import Vuetify from 'vuetify'
Vue.use(Vuetify)

const routes = [
  {
        name: 'CreateItem',
        path: '/create/item',
        component: CreateItem
    },
    {
          name: 'ShowCustomers',
          path: '/',
          component: ShowCustomers
      },
      {
            name: 'EditItem',
            path: '/edit/:id',
            component: EditItem
        }
];

const router = new VueRouter({ mode: 'history', routes: routes });
new Vue(Vue.util.extend({ router }, App)).$mount('#app');
