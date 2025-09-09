<template>
    <footer class="py-28 bg-[#222222]">
        <div class="container !max-w-[1300px]">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-[#CCCCCC]">
                <div data-aos="fade-up" data-aos-delay="100">
                    <div class="">
                        <nuxt-link class="flex items-center gap-2" to="/">
                            <span><img class="w-[200px] object-cover" src="/images/logo-dark.png" alt="The VICODE - COFFEE LOVE"></span>
                        </nuxt-link>
                        <h4 class="text-xl mb-1 font-semibold mt-5 text-white">
                            {{ setting.companyName || '' }}
                        </h4>
                        <span class="block">{{ setting.email || '' }} - {{ setting.phone_number || '' }}</span>
                        <span class="block">Đồ án tốt nghiệp</span>
                        <p class="text-lg mt-3">
                            Tiện lợi giao hàng hỏa tốc
                        </p>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="500">
                    <div class="">
                        <h3 class="mb-0 font-semibold text-2xl text-white">
                            Thông tin
                        </h3>
                        <ul class="mt-5 grid grid-cols-1 gap-4">
                            <li class="text-xl">
                                <span class="font-semibold">Địa chỉ</span>
                                <span class="block">{{ setting.address || '' }}</span>
                            </li>
                            <li class="text-xl">
                                <span class="font-semibold">Các ngày trong tuần</span>
                                <span class="block">
                                    từ 08:00 - 22:00
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="700">
                    <div class="">
                        <h3 class="mb-0 font-semibold text-2xl text-white">
                            Tham gia cộng đồng của chúng tôi
                        </h3>

                        <div class="mt-4">
                            <ul class="flex items-center gap-4">
                                <li class="social-icon text-primary-100 bg-[#f7f7f7] hover:bg-primary-100 hover:text-white">
                                    <i class="fab fa-tiktok" />
                                </li>
                                <li class="social-icon text-primary-100 bg-[#f7f7f7] hover:bg-primary-100 hover:text-white">
                                    <i class="fab fa-facebook-f" />
                                </li>
                                <li class="social-icon text-primary-100 bg-[#f7f7f7] hover:bg-primary-100 hover:text-white">
                                    <i class="fab fa-instagram" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        computed: {
            ...mapState('settings', ['setting']),
        },
    };
</script>
