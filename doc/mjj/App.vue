<template>
    <div>
        <div class="wrapper">
            <div class="img-wrapper">
                <img src="http://h0.hucdn.com/open/201842/560a7dce9d80e099_500x500.jpg" class="pic"/>
            </div>
            <div class="introduction">
                使用贝店AR扫描特仑苏商品图片，惊喜彩蛋等你揭晓！
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {};
        },
    };
</script>
<style lang="less">
    @import "../common/common.less";
    @g-base: 46.875rem;
    html, body {
        background-color: #191970;
    }
    .wrapper {
        overflow: hidden;
        width: 750/@g-base;
        height: 700/@g-base;
        background: #000;
        margin-top: 250/@g-base;
        .title {
            margin-top: 50/@g-base;
            color: #000;
            text-align: center;
            font-size: 40/@g-base;
        }
        .img-wrapper {
            margin-top: 50/@g-base;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 750/@g-base;
            height: 400/@g-base;
        }
        .pic {
            width: 300/@g-base;
            height: 300/@g-base;
            border-radius: 50%;
            animation: scaleDraw 0.5s linear 0s infinite normal;
        }
        .introduction {
            padding: 0 30/@g-base;
            font-size: 30/@g-base;
            color: #f2f4f6;
        }
    }
     @keyframes scaleDraw {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
            0%{
                transform: scale(1);  /*开始为原始大小*/
            }
            25%{
                transform: scale(1.2); /*放大1.1倍*/
            }
            50%{
                transform: scale(1);
            }
            75%{
                transform: scale(1.2);
            }
        }
</style>