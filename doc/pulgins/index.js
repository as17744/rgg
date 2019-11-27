import Vue from 'vue';
import App from './app.vue';
import plugins from './plugins';

Vue.use(plugins);
new Vue({
    el: '#app',
    components: {
        App,
    },
    template: '<App/>'
});
