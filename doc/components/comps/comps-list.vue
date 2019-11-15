<template>
    <div>
        <div v-for="item in items" :key="item.number">
            <slot name="item" :item="item"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
}
</script>

<style>

</style>