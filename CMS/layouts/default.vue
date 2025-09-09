<template>
    <div class="flex justify-between min-h-screen">
        <div class="hidden md:block">
            <TheSidebar ref="Sidebar" :setting="setting" />
        </div>
        <div class="flex-grow flex flex-col h-screen overflow-x-hidden">
            <TheHeader @toggleSidebar="$refs.Sidebar.toggleCollapsed()" />
            <div class="flex-grow overflow-y-auto max-h-screen custom-scroll flex flex-col bg-[#f6f6f6]">
                <nuxt class="p-4 flex-grow" />
            </div>
        </div>
    </div>
</template>

<script>
    import TheSidebar from '@/components/layout/TheSidebar.vue';
    import TheHeader from '@/components/layout/TheHeader.vue';

    export default {
        components: {
            TheSidebar,
            TheHeader,
        },
    };
</script>
