<template>
    <div>
        <Emoji ref="emojiEditor"></Emoji>
        <div @click="showInput">123</div>
    </div>
</template>
<script>
    import Emoji from './emoji.vue';
    export default {
        methods: {
            showInput() {
                console.log(this.$refs.emojiEditor.input);
            }
        },
        mounted() {
            this.$refs.emojiEditor.input = 'asdsadsads';
        },
        components: {
            Emoji,
        },
    };
</script>
<style></style>