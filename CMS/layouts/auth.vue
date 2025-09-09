<template>
    <div class="flex justify-between h-screen">
        <div class="hidden w-full h-full md:flex items-center justify-center bg-gray-50">
            <img src="/images/login.png" alt="">
        </div>

        <div class="w-screen md:w-6/12 flex flex-col items-center px-4 my-4">
            <div class="flex-grow flex flex-col items-center justify-center w-[360px] max-w-[95%]">
                <slot name="title" />
                <nuxt class="w-full" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
    };
</script>
