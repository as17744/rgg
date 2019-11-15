<template>
  <div @click="$emit('update:value', (++value))">{{value}}</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    }
  },
};
</script>

<style>

</style>