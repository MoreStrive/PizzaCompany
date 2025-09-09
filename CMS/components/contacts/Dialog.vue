<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Chi tiết"
        width="850px"
    >
        <div class="flex flex-col gap-3">
            <h3><span class="font-semibold">Tên khách hàng:</span>{{ form.fullname }}</h3>
            <h3><span class="font-semibold">Số điện thoại:</span>{{ form.content }}</h3>
            <h3><span class="font-semibold">Email:</span>{{ form.email }}</h3>
            <div>
                <h3 class="font-semibold">
                    Lời nhắn:
                </h3>
                <p>{{ form.content }}</p>
            </div>
        </div>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Đóng
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';

    const defaulForm = {
        fullname: '',
        phone_number: '',
        email: '',
        message: '',
    };

    export default {
        props: {
        },

        data() {
            return {
                visible: false,
                loading: false,
                contact: null,
            };
        },

        watch: {
            contact: {
                handler() {
                    this.form = this.contact ? _cloneDeep(this.contact) : _cloneDeep(defaulForm);
                },
                deep: true,
                immediate: true,
            },
        },

        methods: {
            open(contact) {
                this.contact = contact;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },
        },
    };
</script>
