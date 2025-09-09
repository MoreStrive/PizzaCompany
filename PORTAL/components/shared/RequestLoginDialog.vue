<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Yêu cầu đăng nhập"
        :footer="false"
    >
        <div class="text-center">
            <h3 class="text-lg">
                Chỉ còn một bước nữa để tiếp tục
            </h3>
            <p>Vui lòng đăng nhập</p>
            <div class="flex items-center gap-5 justify-center mt-5">
                <a-button class="w-28" @click="close">
                    Hủy bỏ
                </a-button>
                <a-button type="primary" class="w-28">
                    <nuxt-link to="/dang-nhap">
                        Đăng nhập
                    </nuxt-link>
                </a-button>
            </div>
        </div>
    </a-modal>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
            };
        },

        methods: {
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },
        },
    };
</script>
