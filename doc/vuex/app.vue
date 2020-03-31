<template>
    <div>
        <div>{{count}}</div>
        <div>{{position}}</div>
        <div>addCount: {{addCount}}</div>
        <div>doubleCount: {{doubleCount}}</div>
        <button @click="clickIncrements">add</button>
        <button @click="clickDecrements">minus</button>
        <button @click="clickAsynceMoving">asynceMoving</button>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
export default {
    data() {
        return {
            num: 3,
        };
    },
    computed: {
        ...mapState({
            count: 'count',
            position: 'position',
        }),
        doubleCount() {
            return this.$store.getters.doubleCount;
        },
        addCount() {
            return this.num + this.position;
        },
    },
    methods: {
        ...mapMutations(['increments', 'decrements']),
        clickIncrements() {
            this.increments(10);
        },
        clickDecrements() {
            this.decrements(1);
        },
        clickAsynceMoving() {
            this.$store.dispatch('asycIncrement', 1);
        }
    },
    created() {
        console.log(this.$store.state.A);
    },
};
</script>

<style>

</style>