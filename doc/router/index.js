import VueRouter from 'vue-router';
import Vue from 'vue';
import main from './view/main/main.vue';

Vue.use(VueRouter);

const compsA = {
    template: '<div @click="showRouter">{{name}}</div>',
    data() {
        return {
            name: 'a',
        };
    },
    methods: {
        showRouter() {
            console.log(this.$route.params);
        }
    },
};
const compsB = {
    template: '<div>{{name}}</div>',
    data() {
        return {
            name: 'b',
        };
    },
};
const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: main,
        },
        {
            path: '/compsa/:id/:name',
            component: compsA,
        },
        {
            path: '/compsb',
            component: compsB,
        },
    ]
})
new Vue({
    router,
}).$mount('#app');
