<template>
    <div>
        <input @input="debounceSearch()" ref="search" />
    </div>
</template>

<script>
const debounce = function (fn, wait) {
    let timeout = null;
    return function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(fn, wait);
    };
}
let timeout = null;
export default {
    data() {
        return {
            value: '',
        };
    },
    methods: {
        search() {
            console.log(this.$refs.search.value);
        },
        debounceSearch() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(this.search, 1000);
        },
    },
};
</script>

<style>

</style>