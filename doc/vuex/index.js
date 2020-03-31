import Vue from 'vue';
import Vuex from 'vuex';
import app from './app.vue';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        count: 4,
        position: 100,
    },
    getters: {
        doubleCount(state, getter) {
            return 2 * state.count;
        },
    },
    mutations: {
        increments(state, data) {
            state.count = state.count + data;
        },
        decrements(state, data) {
            state.count = state.count - data;
        },
        movingPosition(state, distance) {
            state.position = state.position + distance;
        }
    },
    actions: {
        asycIncrement(context, data) {
            setTimeout(() => {
                context.commit('movingPosition', data);
            }, 1000);
        }
    },
    modules: {
        A: {
            state: {
                count: 3,
            },
        },
    },
});

new Vue({
    store,
    components: {
        app,
    },
    el: '#content',
    template: '<app />',
});
