<template>
  <div>
        <div @click="showAsync = true">show</div>
        <div v-if="showAsync">
            <asyncComps></asyncComps>
        </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            showAsync: false,
        };
    },
    components: {
        // asyncComps: () => import('./async-comp.vue'),
        asyncComps: (resolve) => require(['./async-comp.vue'], resolve),
    },
};
</script>

<style>

</style>