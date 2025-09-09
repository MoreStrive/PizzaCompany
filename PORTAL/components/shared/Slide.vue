<template>
    <div class="new-carousel mt-5 px-5">
        <a-empty v-if="news.length === 0" class="!mt-10" />
        <VueSlickCarousel
            v-else
            :key="`slide-${random(100000)}`"
            ref="SliderCarousel"
            v-bind="settings"
            @beforeChange="afterChangeSlide"
        >
            <div v-for="_data in dataCarousel" :key="_data.id" class="">
                <div v-if="loading">
                    <Loading />
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
                settings: {
                    speed: 500,
                    dots: false,
                    infinite: true,
                    arrows: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    responsive: [
                        {
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 3,
                            },
                        },
                        {
                            breakpoint: 1279,
                            settings: {
                                arrows: true,
                                slidesToShow: 2,
                            },
                        },
                        {
                            breakpoint: 768,
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
                    @apply w-20 bg-black-100 relative;
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
