<template>
    <div class="bg-white py-4 px-4 md:px-6 flex justify-between items-center">
        <div>
            <div class="hidden md:flex items-center gap-4 !text-black">
                <Breadcrumb :links="breadcrumbs" class="max-w-[400px]" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Breadcrumb from '@/components/shared/Breadcrumb.vue';

    export default {
        components: {
            Breadcrumb,
        },

        data() {
            return {
                sidebarVisible: false,
            };
        },

        computed: {
            ...mapState('breadcrumbs', ['breadcrumbs']),
        },

        methods: {
        },
    };
</script>

<style lang="scss">
    .header-sidebar-drawer {
        .ant-drawer-body {
            @apply p-0 h-full #{!important};
        }
    }
</style>
