<template>
    <div>
        <div @click="popup">{{555|mjj}}</div>
        <comps></comps>
    </div>
</template>

<script>
export default {
    methods: {
        popup() {
            this.$pop({
                num: 100,
            });
        },
    },
};
</script>

<style>

</style>