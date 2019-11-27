<template>
  <div class="shadow" @click="visible = false" v-if="visible"></div>
</template>

<script>
export default {
    data() {
        return {
            visible: true,
            num: 123,
        };
    },
    mounted() {
        this.visible = true;
        console.log(this.num);
    }
}
</script>

<style lang="less">
    .shadow {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
    }
</style>