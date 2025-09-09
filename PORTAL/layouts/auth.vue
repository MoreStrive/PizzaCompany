<template>
    <div class="flex justify-center items-center h-screen bg-[#eef2f5]">
        <div class="w-screen md:w-[500px] h-fit rounded-md flex flex-col items-center mx-4 my-4">
            <div class="flex-grow min-w-[500px] card flex flex-col items-center justify-around !px-12 !py-10">
                <div class="flex items-center justify-center w-full mb-4">
                    <img src="/images/logo.png" class="w-[150px]">
                </div>
                <div class="w-full">
                    <nuxt />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            currentYear() {
                return (new Date()).getFullYear();
            },
        },
    };
</script>
