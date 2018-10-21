<template>
    <div>
        <div class="aa" ref="aaa">3131</div>
        <div>
            <input type="file" value="Upload" @change="uploadFile"/>
        </div>
    </div>
</template>
<script>
    import mix from './mixin.js';
    export default {
        mixins: [mix],
        data() {
            return {};
        },
        methods: {
            uploadFile(e) {
                const fm = new FormData(e.currentTarget.files[0]);
                
            },
            tryFetch() {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: 'http://www.lwk.com/mroute?method=upload',
                        type: 'POST',
                        data: {
                            aa: 1,
                            bb: 2,
                        },
                        success(res) {
                            resolve(res);
                        }
                    })
                });
            }
        },
        mounted() {
            this.tryFetch().then((res) => {
                console.log(res);
            })
        }
    };
</script>
<style>
    .aa {
        width: 100px;
        height: 100px;
        background: red;
        border: 1px solid black;
    }
</style>
    
