<template>
    <div class="flex justify-between bg-white  ">
        <div class="flex-grow flex flex-col w-full  ">
            <TheHeader />

            <div class="flex-grow custom-scroll ">
                <nuxt class="bg-white -mb-0" />
            </div>

            <TheFooter />
        </div>
        <!-- <SharedScrollToTop /> -->
    </div>
</template>

<script>
    import TheHeader from '@/components/layout/TheHeader.vue';
    import TheFooter from '@/components/layout/TheFooter.vue';

    export default {
        components: {
            TheHeader,
            TheFooter,
        },

        async fetch() {
            await this.fetchData();
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('settings/fetchAll');
                    await this.$store.dispatch('products/fetchCart');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>
