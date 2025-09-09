<template>
    <div :class="`w-full 'bg-white' : 'bg-[#18191a]' px-3 xl:px-0 overflow-auto pb-4`">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="grid grid-cols-10 gap-4">
                <div class="col-span-12 xl:col-span-3">
                    <div class="bg-white p-3 mb-3 rounded-md">
                        <div class="flex flex-col items-center gap-y-8 mb-6 w-full">
                            <div class="flex flex-col items-center w-full h-[200px] border-[2px] border-dashed border-gray-20 overflow-hidden rounded-md">
                                <img
                                    v-if="form.thumbnail"
                                    :src="form.thumbnail"
                                    onerror="this.src='/images/default.jpg'"
                                    alt="/"
                                    class="w-full h-[200px] rounded-md object-cover"
                                >
                                <a-empty v-else class="pt-10" :description="false" />
                            </div>
                            <a-upload
                                v-if="$permission.Admin()"
                                :show-upload-list="false"
                                action=""
                                class="mx-auto block text-center"
                                :transform-file="handlerThumbnail"
                            >
                                <div class="flex gap-x-2">
                                    <img src="/images/upload.svg" alt="avatar">
                                    {{ _isEmpty(product) ? "Tải lên" : "Thay đổi" }}
                                </div>
                            </a-upload>
                        </div>
                        <a-form-model-item
                            label="Danh mục sản phẩm"
                            prop="description"
                        >
                            <SelectRemote
                                v-model="form.category_id"
                                placeholder="Chọn danh mục"
                                fetch-url="categories/fetchAll"
                                option-label="title"
                                option-value="id"
                                store="categories"
                                store-prop="categories"
                                :disabled="!$permission.Admin()"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            label="Mô tả của sản phẩm"
                            prop="description"
                        >
                            <a-textarea
                                v-model="form.description"
                                placeholder="Mô tả cho sản phẩm"
                                :auto-size="{ minRows: 3, maxRows: 3 }"
                                :disabled="!$permission.Admin()"
                            />
                        </a-form-model-item>
                    </div>
                </div>
                <div class="col-span-12 xl:col-span-7 p-3 rounded-md bg-white">
                    <a-form-model-item prop="product_name" label="Tên sản phẩm">
                        <a-input
                            v-model="form.product_name"
                            :disabled="!$permission.Admin()"
                            placeholder="Nhập tên sản phẩm"
                        />
                    </a-form-model-item>
                    <div class="grid grid-cols-2 gap-x-5">
                        <a-form-model-item
                            label="Giảm giá (phần trăm)"
                        >
                            <a-input
                                v-model="form.discount"
                                :disabled="!$permission.Admin()"
                                placeholder="Nhập số phần trăm giảm giá"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            label="Số lượng (Update hằng ngày)"
                            prop="count"
                        >
                            <a-input
                                v-model="form.count"
                                :disabled="!$permission.Admin() && !$permission.Manage()"
                                placeholder="Nhập số lượng sản phẩm"
                            />
                        </a-form-model-item>
                    </div>
                    <Editor
                        :content-props="form.content"
                        label="Mô tả sản phẩm"
                        :is-edit="!$permission.Admin()"
                        @getContent="getContent"
                    />
                </div>
            </div>
            <div class="mt-10">
                <div class="flex items-center gap-5">
                    <h3 class="text-xl font-semibold mb-0">
                        Kích cỡ
                    </h3>
                    <a-button v-if="$permission.Admin()" type="primary" @click="addSize">
                        Thêm kích cỡ
                    </a-button>
                </div>
                <div class="mt-2">
                    <div v-for="(size, index) in form.sizes" :key="size.key">
                        <div class="flex items-center gap-5">
                            <a-form-model-item
                                :prop="'sizes.' + index + '.size_value'"
                                label="Size sản phẩm"
                                :rules="{
                                    required: true,
                                    message: 'Không được để trống trường này',
                                    trigger: 'blur',
                                }"
                                class="flex-1"
                            >
                                <a-select
                                    v-model="size.size_value"
                                    placeholder="Chọn size bánh"
                                    :disabled="!$permission.Admin()"
                                >
                                    <a-select-option v-for="_size in SIZE_OPTIONS" :key="_size.value" :value="_size.value">
                                        {{ _size.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item
                                :prop="'sizes.' + index + '.price'"
                                label="Giá sản phẩm"
                                :rules="{
                                    required: true,
                                    message: 'Không được để trống trường này',
                                    trigger: 'blur',
                                }"
                                class="flex-1"
                            >
                                <a-input
                                    v-model="size.price"
                                    :disabled="!$permission.Admin()"
                                    placeholder="Vui lòng nhập Size bánh"
                                />
                            </a-form-model-item>
                            <div v-if="$permission.Admin()" class="pt-9 cursor-pointer" @click="removeSize(size)">
                                <i class="fas fa-trash text-danger-100 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-10">
                <div class="flex items-center gap-5">
                    <h3 class="text-xl font-semibold mb-0">
                        Lựa chọn
                    </h3>
                    <a-button v-if="$permission.Admin()" type="primary" @click="addOption">
                        Thêm lựa chọn
                    </a-button>
                </div>
                <div class="mt-2">
                    <div v-for="(option, index) in form.options" :key="option.key">
                        <div class="flex items-center gap-5">
                            <a-form-model-item
                                :prop="'options.' + index + '.option_value'"
                                label="Lựa chọn của sản phẩm"
                                :rules="{
                                    required: true,
                                    message: 'Không được để trống trường này',
                                    trigger: 'blur',
                                }"
                                class="flex-1"
                            >
                                <a-select
                                    v-model="option.option_value"
                                    :disabled="!$permission.Admin()"
                                    placeholder="Chọn lựa chọn thêm của bánh"
                                >
                                    <a-select-option v-for="_option in OPTIONS" :key="_option.value" :value="_option.value">
                                        {{ _option.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item
                                :prop="'options.' + index + '.price'"
                                label="Giá sản phẩm"
                                :rules="{
                                    required: true,
                                    message: 'Không được để trống trường này',
                                    trigger: 'blur',
                                }"
                                class="flex-1"
                            >
                                <a-input
                                    v-model="option.price"
                                    :disabled="!$permission.Admin()"
                                    placeholder="Vui lòng nhập giá của lựa chọn"
                                />
                            </a-form-model-item>
                            <div v-if="$permission.Admin()" class="pt-9 cursor-pointer" @click="removeOption(option)">
                                <i class="fas fa-trash text-danger-100 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-10">
                <div class="flex items-center gap-5">
                    <h3 class="text-xl font-semibold mb-0">
                        Toppings
                    </h3>
                    <a-button v-if="$permission.Admin()" type="primary" @click="addToping">
                        Thêm Toping
                    </a-button>
                </div>
                <div class="mt-2">
                    <div v-for="(topping, index) in form.toppings" :key="topping.key">
                        <div class="flex items-center gap-5">
                            <a-form-model-item
                                :prop="'toppings.' + index + '.topping_value'"
                                label="Toping đi kèm của sản phẩm"
                                :rules="{
                                    required: true,
                                    message: 'Không được để trống trường này',
                                    trigger: 'blur',
                                }"
                                class="flex-1"
                            >
                                <a-select
                                    v-model="topping.topping_value"
                                    :disabled="!$permission.Admin()"
                                    placeholder="Chọn loại topping bánh"
                                >
                                    <a-select-option v-for="_toping in TOPPINGS" :key="_toping.value" :value="_toping.value">
                                        {{ _toping.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item
                                :prop="'toppings.' + index + '.price'"
                                label="Giá sản phẩm"
                                :rules="{
                                    required: true,
                                    message: 'Không được để trống trường này',
                                    trigger: 'blur',
                                }"
                                class="flex-1"
                            >
                                <a-input
                                    v-model="topping.price"
                                    :disabled="!$permission.Admin()"
                                    placeholder="Vui lòng nhập giá bánh"
                                />
                            </a-form-model-item>
                            <div v-if="$permission.Admin()" class="pt-9 cursor-pointer" @click="removeToping(topping)">
                                <i class="fas fa-trash text-danger-100 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _uniqBy from 'lodash/uniqBy';
    import _cloneDeep from 'lodash/cloneDeep';
    import Editor from '@/components/shared/Editor.vue';
    import SelectRemote from '@/components/filters/SelectRemote.vue';
    import { CATEGORY_OPTIONS } from '@/constants/products/categories';
    import { SIZE_OPTIONS } from '@/constants/products/size';
    import { OPTIONS } from '@/constants/products/options';
    import { TOPPINGS } from '@/constants/products/toppings';

    const form = {
        product_name: '',
        price: 0,
        content: '',
        description: '',
        thumbnail: '',
        category_id: 1,
        status: 'inactive',
        discount: 0, // theo phần trăm
        shipping_fee: 0,
        count: 0,
        sizes: [],
        options: [],
        toppings: [],
    };

    export default {
        components: {
            Editor,
            SelectRemote,
        },

        props: {
            product: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            const checkCount = (rule, value, callback) => {
                if (value <= 0) {
                    callback(new Error('Số lượng cần lớn hơn hoặc bằng 1'));
                } else {
                    callback();
                }
            };
            return {
                TOPPINGS,
                SIZE_OPTIONS,
                CATEGORY_OPTIONS,
                OPTIONS,
                form: this.product ? _cloneDeep(this.product) : _cloneDeep(form),
                rules: {
                    product_name: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    price: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    content: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    description: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    thumbnail: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    category_id: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    shipping_fee: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    count: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }, {
                        validator: checkCount, trigger: 'blur',
                    }],
                },
                fileThumbnail: null,
                synchorus: false,
            };
        },

        watch: {
            product() {
                this.form = this.product ? _cloneDeep(this.product) : _cloneDeep(form);
            },
            'form.count': {
                handler() {
                    if (!this.form.count) this.form.count = 0;
                },
            },
        },

        methods: {
            _isEmpty,
            async handlerThumbnail(file) {
                this.fileThumbnail = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            getContent(content) {
                this.form.content = content;
            },

            addSize() {
                this.removeDuplicateInArray('sizes');
                this.form.sizes.push({ size_value: '', price: 0 });
            },

            removeSize(item) {
                const index = this.form.sizes.indexOf(item);
                if (index !== -1) {
                    this.form.sizes.splice(index, 1);
                }
            },

            addOption() {
                this.removeDuplicateInArray('options');
                this.form.options.push({ option_value: '', price: 0 });
            },
            removeOption(item) {
                const index = this.form.options.indexOf(item);
                if (index !== -1) {
                    this.form.options.splice(index, 1);
                }
            },

            addToping() {
                this.removeDuplicateInArray('toppings');
                this.form.toppings.push({ topping_value: '', price: 0 });
            },
            removeToping(item) {
                const index = this.form.toppings.indexOf(item);
                if (index !== -1) {
                    this.form.toppings.splice(index, 1);
                }
            },

            removeDuplicateInArray(field) {
                field = `${field.slice(0, -1).toString()}_value`;
                this.form[field] = _uniqBy(this.form[field], (e) => e.value);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', this.form, this.fileThumbnail);
                    }
                });
            },
        },
    };
</script>

<style lang="scss">
    .ant-upload-list-picture-card {
        .ant-upload-list-item-actions {
            a:nth-child(1) {
                @apply hidden
            }
        }
    }
</style>
