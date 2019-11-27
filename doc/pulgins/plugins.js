import popup from './dialogs/popup.vue';
export default {
    install(Vue) {
        const Popup = Vue.extend(popup);
        Vue.component('comps', {
            data() {
                return {
                    num: 777,
                };
            },
            render() {
                return <div>{this.num}</div>
            },
        });
        Vue.filter('mjj', (value) => {
            return (value / 100).toFixed(1);
        });
        Vue.prototype.$pop = function(data) {
            const popupIdendity = new Popup({
                data,
            }).$mount();
            document.querySelector('body').appendChild(popupIdendity.$el);
        };
    },
};