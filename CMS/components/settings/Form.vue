<template>
    <div class="h-full flex flex-col gap-4">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            layout="vertical"
        >
            <div>
                <div class="col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 mb-2 mt-5">
                    <a-form-model-item class="md:col-span-2" label="Tên công ty" prop="company_name">
                        <a-input v-model="form.company_name" placeholder="Tên công ty" />
                    </a-form-model-item>
                    <a-form-model-item label="Số điện thoại" prop="phone_number">
                        <a-input v-model="form.phone_number" placeholder="Số điện thoại" />
                    </a-form-model-item>
                    <a-form-model-item label="Email" prop="email">
                        <a-input v-model="form.email" placeholder="Email" />
                    </a-form-model-item>
                </div>
                <a-form-model-item label="Địa chỉ" prop="address">
                    <a-input v-model="form.address" placeholder="Địa chỉ" />
                </a-form-model-item>
                <a-form-model-item label="Nhúng bản đồ" prop="iframe">
                    <a-textarea
                        v-model="form.map"
                        :auto-size="{ minRows: 3, maxRows: 4 }"
                        placeholder="Nhúng iframe vào đây"
                        :spellcheck="false"
                        @change="changeMap"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
        <div class="map-iframe h-[300px]" v-html="form.map === '' ? defaultMap : form.map" />
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import {
        validEmail,
        phoneValidator,
    } from '@/utils/form';

    const defaultForm = {
        company_name: '',
        address: '',
        phone_number: '',
        email: '',
        map: '',
        logo: '',
    };

    export default {
        props: {
            setting: Object,
        },

        data() {
            return {
                form: this.setting ? _cloneDeep(this.setting) : _cloneDeep(defaultForm),
                rules: {
                    company_name: [{ required: true, message: 'Vui lòng nhập tên công ty - doanh nghiệp', trigger: 'blur' }],
                    address: [{ required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'change' }],
                    email: [{
                        required: true, validator: validEmail, message: 'Vui lòng nhập đúng định dạng email', trigger: ['change', 'blur'],
                    }],
                    phone_number: [{
                        required: true, validator: phoneValidator, message: 'Vui lòng nhập đúng định dạng số điện thoại', trigger: ['change', 'blur'],
                    }],
                },
                thumbnailFile: null,
                defaultMap: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29792.424525167047!2d105.83535335847166!3d21.030562611805735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba15ec15d17%3A0x620e85c2cfe14d4c!2zTMSDbmcgQ2jhu6cgdOG7i2NoIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1679202761644!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            };
        },

        watch: {
            setting() {
                this.form = this.setting ? _cloneDeep(this.setting) : _cloneDeep(defaultForm);
                if (this.form && this.form.map && this.form.map.split(' ')[0] !== '<iframe') {
                    this.form.map = this.defaultMap;
                }
            },
        },

        methods: {
            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', { ...this.form });
                    }
                });
            },

            changeMap() {
                if (this.form.map.split(' ')[0] !== '<iframe') {
                    this.form.map = this.defaultMap;
                }
            },
        },
    };
</script>

<style lang="scss">
    .map-iframe {
        iframe {
            @apply w-full h-[300px] #{!important};
        }
    }
</style>
