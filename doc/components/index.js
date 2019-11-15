import Vue from 'vue';
const requireComponents = require.context('./comps', false, /comps-\w+\.vue/);
// console.log(requireComponents);
requireComponents.keys().forEach((key) => {
    const name = key.replace('./', '').replace('.vue', '');
    Vue.component(name, requireComponents(key).default);
});
new Vue ({
    el: '#app',
    data() {
        return {
            num: 250,
            items: [
                {
                    name: 'Devin Booker',
                    number: 1,
                },
                {
                    name: 'Ricky Rubio',
                    number: 11,
                },
                {
                    name: 'Kelly Oubre',
                    number: 3,
                }
            ],
        };
    },
    methods: {
        listerInput(val) {
            console.log(val);
        },
        tryInput(e) {
            console.log(e.target.value);
        }
    },
});