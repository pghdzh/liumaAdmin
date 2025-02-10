<template>
    <div class="container">
        <div class="head-layout">
            <layoutTop />
        </div>
        <div class="routers-boxes flex">
            <layoutLeftNav />
            <div class="router-content">
                <RouterView />
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>

import layoutTop from "./componts/layoutTop.vue"
import layoutLeftNav from "./componts/layoutLeftNav.vue";
import { RouterView } from 'vue-router'

</script>
<style scoped lang='scss'>
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #F7F8FA;

    .head-layout {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        background: #FFFFFF;
        z-index: 9;
        box-shadow: 0px 2px 8px 0px rgba(78, 89, 105, 0.05);
    }

    .routers-boxes {
        width: 100%;
        height: 100%;
        overflow: hidden;
        flex-direction: row;

        .router-content {
            width: calc(100% - 40px - 200px);
            margin: 20px;
            border-radius: 6px;
            background: #FFFFFF;
        }

        // .router-content::-webkit-scrollbar {
        //     display: none;
        // }

        // .router-content::-webkit-scrollbar {
        //     width: 10px;
        //     background-color: transparent;
        //     cursor: pointer;
        // }

        // .router-content::-webkit-scrollbar-track {
        //     border-radius: 10px;
        // }

        // .router-content::-webkit-scrollbar-thumb {
        //     background-color: black;
        //     border-radius: 10px;
        //     cursor: pointer;
        // }

        // .router-content::-webkit-scrollbar-thumb:hover {
        //     background-color: black;
        // }
    }
}
</style>