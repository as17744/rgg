<template>
  <div v-lwk:mjj="num" @click="num++"></div>
</template>

<script>
export default {
    data() {
        return {
            num: 123,
        };
    },
    directives: {
        lwk: {
            bind(dom, obj, vNode) {
                console.log(vNode);
                dom.textContent = obj.value;
            },
            inserted(dom, obj) {
                console.log(obj);
            },
            update(dom, obj, vNode) {
                console.log(vNode);
                dom.textContent = obj.value;
            },
        },
    },
};
</script>

<style>

</style>