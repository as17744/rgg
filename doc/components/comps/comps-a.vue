<template>
  <div class="outer">
      <input v-bind="$attrs" type="text" v-on="mixListener" />
  </div>
</template>

<script>
export default {
    inheritAttrs: false,
    computed: {
        mixListener() {
            const vm = this;
            return Object.assign({}, this.$listeners, {
                input(e) {
                    vm.$emit('input', e.target.value);
                }
            })
        },
    },
};
</script>

<style>
    .outer {
        background: red;
    }
</style>