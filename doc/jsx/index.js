import vue from 'vue';
import App from './app.vue';

new vue({
    el: '#app',
    components: {
        App,
    },
    render() {
        return <App/>;
    },
})