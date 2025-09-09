<template>
    <div class="new-carousel mt-5 px-5">
        <!-- <a-empty v-if="dataCarousel.length === 0" class="!mt-10" /> -->
        <!-- v-else -->
        <VueSlickCarousel
            key="slide"
            ref="SliderCarousel"
            v-bind="settings"
            @beforeChange="afterChangeSlide"
        >
            <div v-for="_data in dataCarousel" :key="_data.id" class="">
                <div v-if="loading">
                    <Loading />
                </div>
                <div>
                    <div v-if="_data" class="group relative overflow-hidden rounded-lg hover:after:opacity-100 after:content-[''] after:absolute after:z-0 z-0 after:opacity-0 after:w-full after:h-full after:transition-all after:duration-[0.5s] after:z-[1] after:left-0 after:top-0 after:bg-gradient-to-t after:from-primary-100">
                        <div class="w-full min-w-full h-full">
                            <img :src="_data.thumbnail" alt="" class="block w-full object-cover h-[350px]">
                        </div>
                        <span class="absolute bg-secondary-100 left-0 text-white uppercase py-[4px] px-2.5 font-semibold text-xs leading-[18px] z-[2] group-hover:top-0 top-[-40px] duration-500">top seller</span>
                        <div class="hover-content flex justify-between py-5 px-[30px] z-10 absolute bottom-0 opacity-0 w-full items-center duration-500 mb-[-100px] group-hover:mb-0 group-hover:opacity-100">
                            <div class="info relative">
                                <h5 class="mb-0 text-white text-2xl font-bold">
                                    {{ _data.product_name }}
                                </h5>
                            </div>
                            <nuxt-link :to="`/san-pham/${_data.id}`">
                                <span class="bg-white cursor-pointer z-10 rounded-md min-w-[45px] h-[45px] min-h-[45px] leading-[45px] flex items-center relative justify-center text-2xl text-center">
                                    <i class="fas fa-shopping-cart text-primary-100" />
                                </span>
                            </nuxt-link>
                        </div>
                    </div>
                </div>
            </div>

            <template #prevArrow>
                <div slot="prev-arrow" class="absolute !top-[110%] !left-[30%] sm:!left-[35%] lg:!left-[44%] !flex !flex-col !items-center !justify-center !w-12 !h-12 rounded-full !text-center !bg-primary-900 hover:!text-primary-900 !border-[2px] !border-solid !border-primary-900 !text-white duration-300 hover:!bg-white">
                    <i class="fas fa-chevron-left  text-3xl" />
                </div>
            </template>
            <template #nextArrow>
                <div slot="next-arrow" class="absolute !top-[110%] !right-[30%] sm:!right-[35%] lg:!right-[44%] !flex !flex-col !items-center !justify-center !w-12 !h-12 rounded-full !text-center !bg-primary-900 hover:!text-primary-900 !border-[2px] !border-solid !border-primary-900 !text-white duration-300 hover:!bg-white">
                    <i class="fas fa-chevron-right  text-3xl" />
                </div>
            </template>

            <template #customPaging>
                <div slot="custom-paging">
                    <span class="block mx-auto w-20 h-1 rounded-full bg-white duration-300" />
                </div>
            </template>
        </VueSlickCarousel>
    </div>
</template>

<script>
    import VueSlickCarousel from 'vue-slick-carousel';
    import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
    import 'vue-slick-carousel/dist/vue-slick-carousel.css';
    import Loading from '@/components/shared/LoadingSecond.vue';

    export default {
        components: {
            VueSlickCarousel,
            Loading,
        },

        props: {
            data: {
                type: Array,
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                dataCarousel: this.data?.length > 0 ? this.data.slice(0, 5) : Array(5).fill({}),
                settings: {
                    speed: 500,
                    dots: false,
                    infinite: true,
                    arrows: true,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: false,
                    responsive: [
                        {
                            breakpoint: 1400,
                            settings: {
                                slidesToShow: 4,
                            },
                        },
                        {
                            breakpoint: 1280,
                            settings: {
                                arrows: true,
                                slidesToShow: 3,
                            },
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: true,
                                slidesToShow: 2.5,
                            },
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                arrows: true,
                                slidesToShow: 1,
                            },
                        },
                    ],
                },
            };
        },

        watch: {
            data: {
                handler() {
                    this.dataCarousel = this.data.slice(0, 5) || [];
                    this.$refs.SliderCarousel.onPropsUpdated();
                },
                deep: true,
            },
        },

        methods: {
            afterChangeSlide() {
                this.titleAnimate = false;
                setTimeout(() => {
                    this.titleAnimate = true;
                }, 0);
            },
        },
    };
</script>

<style lang="scss">
    .new-carousel {
        .slick-prev:before, .slick-next:before {
            content: '' !important;
        }
        .slick-list {
            overflow: hidden;
            padding: 0px 0px !important;
        }
        .slick-slide {
            float: left !important;
            padding: 0px 5px !important;
        }
        .slick-slider {
            margin: 0px -20px !important;
        }
        .slick-dots {
            bottom: -6px;
            .slick-active {
                span {
                    @apply w-20 bg-black relative;
                }
            }
            li {
                @apply w-20 mx-1;
            }
        }
        p {
            @apply mb-0
        }
    }
</style>
