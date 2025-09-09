<template>
    <main class="py-40">
        <div class="container">
            <div class="grid grid-cols-1">
                <div class="mb-5 border-b-[1px] border-solid border-gray-20 pb-5">
                    <h1 class="text-4xl mb-1">
                        Thông tin cá nhân
                    </h1>
                    <span v-if="currentUser && !currentUser.verifyOtp" class="italic flex items-center gap-2">
                        <img class="w-5 h-5 object-cover" src="/images/verify.png" alt="">
                        Tài khoản đã được xác minh
                    </span>
                    <span v-else class="italic flex items-center gap-2">
                        Tài khoản chưa được xác minh
                        <span
                            class="text-primary-100 cursor-pointer font-semibold"
                            @click="$refs.VerifyDialog.open()"
                        >
                            Xác minh ngay
                        </span>
                    </span>
                </div>
                <div>
                    <a-tabs tab-position="left">
                        <a-tab-pane key="1" tab="Thông tin cá nhân">
                            <div class="mb-5 flex flex-wrap justify-between items-center">
                                <h3 class="text-black text-xl mb-0">
                                    <span class="uppercase">Thông tin cá nhân</span>
                                </h3>
                                <a-button
                                    :loading="loading"
                                    type="primary"
                                    @click="$refs.UpdatePassword.open()"
                                >
                                    Đổi mật khẩu
                                </a-button>
                            </div>
                            <ProfileForm :user="currentUser" :loading="loading" @submit="updateProfile" />
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="Đơn hàng của bạn">
                            <h3 class="text-black text-xl mb-5">
                                <span class="uppercase">Đơn hàng của bạn</span>
                            </h3>
                            <div>
                                <OrderTable :orders="orders" :loading="loading" />
                                <div>
                                    <Pagination :data="pagination" />
                                </div>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="Chính sách bảo mật thông tin">
                            <h3 class="text-black text-xl mb-5">
                                <span class="uppercase">Chính sách bảo mật thông tin</span>
                            </h3>
                            <div class="space-y-4">
                                <p class="mb-0 text-sm">
                                    Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.
                                </p>
                                <p class="mb-0 text-sm">
                                    Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng thông tin cá nhân của Quý khách.
                                </p>
                                <p class="mb-0 text-sm">
                                    Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán và những thông tin quý khách đồng ý cung cấp cho chúng tôi
                                </p>
                                <p class="mb-0 text-sm">
                                    Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng thông tin cá nhân của Quý khách.
                                </p>
                                <div>
                                    <a-collapse>
                                        <a-collapse-panel key="1" header="1. Mục đích thu thập thông tin cá nhân">
                                            Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng,...
                                            Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua website và theo yêu cầu của bạn.
                                            Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản lý tài khoản của bạn; xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học, gửi thông tin bao gồm thông tin sản phẩm và dịch vụ. Nếu quý khách không muốn nhận bất cứ thông tin tiếp thị của chúng tôi thì có thể từ chối bất cứ lúc nào.
                                            Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc nhà cung cấp).
                                            Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lí do bảo mật nên chúng tôi không công khai trực tiếp được. Tuy nhiên, quý khách có thể tiếp cận thông tin bằng cách đăng nhập tài khoản trên web. Tại đây, quý khách sẽ thấy chi tiết đơn đặt hàng của mình, những sản phẩm đã nhận và những sản phẩm đã gửi và chi tiết email, ngân hàng và bản tin mà bạn đặt theo dõi dài hạn.
                                            Quý khách cam kết bảo mật dữ liệu cá nhân và không được phép tiết lộ cho bên thứ ba. Chúng tôi không chịu bất kỳ trách nhiệm nào cho việc dùng sai mật khẩu nếu đây không phải lỗi của chúng tôi.
                                            Chúng tôi có thể dùng thông tin cá nhân của bạn để nghiên cứu thị trường. Mọi thông tin chi tiết sẽ được ẩn và chỉ được dùng để thống kê. Quý khách có thể từ chối không tham gia bất cứ lúc nào.
                                        </a-collapse-panel>
                                        <a-collapse-panel key="2" header="2. Bảo mật">
                                            Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.
                                            Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về việc thanh toán với bất kỳ ai bằng e-mail, chúng tôi không chịu trách nhiệm về những mất mát quý khách có thể gánh chịu trong việc trao đổi thông tin của quý khách qua internet hoặc email.
                                            Quý khách tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống website. Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.
                                            Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.
                                            Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt Nam và tòa án Việt Nam có thẩm quyền xem xét.
                                        </a-collapse-panel>
                                        <a-collapse-panel key="3" header="3. Quyền lợi khách hàng">
                                            Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí.
                                            Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị.
                                        </a-collapse-panel>
                                    </a-collapse>
                                </div>

                                <div v-if="currentUser && currentUser.acceptPolicy">
                                    <a-checkbox :disabled="currentUser.acceptPolicy" @change="updateProfile({ ...currentUser, acceptPolicy: true})">
                                        <span class="-ml-2">
                                            Bạn đồng ý điều khoản và điều kiện cũng như chính sách bảo mật của chúng tôi
                                        </span>
                                    </a-checkbox>
                                </div>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </div>

        <VerifyDialog ref="VerifyDialog" />
        <UpdatePassword ref="UpdatePassword" />
    </main>
</template>

<script>
    import { mapState } from 'vuex';
    import ProfileForm from '@/components/profile/Form.vue';
    import OrderTable from '@/components/profile/OrderTable.vue';
    import VerifyDialog from '@/components/profile/VerifyDialog.vue';
    import UpdatePassword from '@/components/auth/dialogs/UpdatePassword.vue';
    import Pagination from '@/components/shared/Pagination.vue';

    export default {
        middleware: ['auth'],

        components: {
            ProfileForm,
            OrderTable,
            VerifyDialog,
            UpdatePassword,
            Pagination,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapState('orders', ['orders', 'pagination']),
            currentUser() {
                return this.$auth.user || null;
            },
        },

        watch: {
            '$route.query': {
                async handler() {
                    await this.fetchData();
                },
                deep: true,
                immediate: true,
            },
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('orders/fetchAll', { ...this.$route.query, userId: this.currentUser.id });
                    await this.$store.dispatch('products/fetchAll', this.$route.query);
                    await this.$store.dispatch('combos/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            logout() {
                this.$auth.logout();
                this.$router.push('/');
            },

            async updateProfile(form) {
                try {
                    this.loading = true;
                    await this.$api.auth.update(form);
                    await this.$auth.fetchUser();
                    this.$message.success('Cập nhật thông tin thành công');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>
