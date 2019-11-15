import Mvvm from './util/mvvm';

var vm = new Mvvm({
    el: '#app',
    data() {
        return {
            word: 'Hello World!',
            num: 1,
        };
    },
    computed: {
        doubleNum() {
            return this.num * 2;
        },
    },
    methods: {
        sayHi: function() {
            this.word = 'Hi, everybody!';
        }
    },
    created() {
        this.num = 7;
        this.sayHi();
    },
});