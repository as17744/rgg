<template>
  <div>
    <slot name="part-one"></slot>
    <slot name="part-two"></slot>
    <slot name="part-three" :inner="innerObj"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      innerObj: {
        name: 'c',
        type: 'slot',
      },
    };
  },
};
</script>

<style>

</style>