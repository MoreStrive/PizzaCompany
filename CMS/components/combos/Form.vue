<!-- eslint-disable camelcase -->
<!-- eslint-disable no-unused-vars -->
<template>
    <div class="px-3 xl:px-0 overflow-auto pb-4">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="card">
                <p class="font-semibold text-xl">
                    1. Thông tin cơ bản
                </p>
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
                                        {{ _isEmpty(combo) ? "Tải lên" : "Thay đổi" }}
                                    </div>
                                </a-upload>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 xl:col-span-7 p-3 rounded-md bg-white">
                        <a-form-model-item prop="title" label="Tên Combo">
                            <a-input
                                v-model="form.title"
                                :disabled="!$permission.Admin()"
                                placeholder="Nhập tên Combo"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            label="Mô tả của Combo"
                            prop="content"
                        >
                            <a-textarea
                                v-model="form.content"
                                :disabled="!$permission.Admin()"
                                placeholder="Mô tả cho Combo"
                                :auto-size="{ minRows: 3, maxRows: 3 }"
                            />
                        </a-form-model-item>
                        <div class="grid grid-cols-2 gap-x-5">
                            <a-form-model-item
                                label="Giảm giá (phần trăm)"
                                prop="discount"
                            >
                                <a-input-number
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
                    </div>
                </div>
            </div>
            <div class="card mt-4">
                <p class="font-semibold text-xl">
                    2. Chọn sản phẩm
                </p>
                <div v-if="$permission.Admin()" class="flex items-center flex-wrap gap-10">
                    <div class="max-w-[900px] flex items-center gap-5 flex-wrap w-full">
                        <a-form-model-item class="flex-1" prop="" label="Danh mục">
                            <a-select
                                placeholder="Danh mục"
                                @change="(value) => categoryFilter = value"
                            >
                                <a-select-option v-for="_category in categories" :key="_category.id" :value="_category.id">
                                    {{ _category.title }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item class="flex-1" prop="" label="Sản phẩm trong Combo">
                            <a-select
                                v-model="stateSelectProduct"
                                placeholder="Tìm kiếm sản phẩm"
                                @change="changeProduct"
                            >
                                <a-select-option v-for="_product in products.filter((item) => categoryFilter === item.category_id)" :key="_product.id" :value="_product.id">
                                    {{ _product.product_name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item class="flex-1" prop="" label="Tổng tiền tạm tính">
                            <a-input
                                :value="totalPriceCombo"
                                disabled
                                placeholder="Tổng số tiền tạm tính"
                            />
                        </a-form-model-item>
                    </div>
                </div>
                <div class="max-w-[1200px] mt-5 grid grid-cols-1 gap-5">
                    <ProductCard
                        v-for="_product in productInCombo"
                        :key="_product.productInCombo"
                        :product="_product"
                        :product-in-combo="form.combo_products.find((element) => element.id === _product.productInCombo)"
                        @remove="removeProductInCombo"
                        @change="changeSelect"
                        @changeCount="changeCountProductInCombo"
                    />
                </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import ProductCard from '@/components/combos/ProductCard.vue';

    const defaultForm = {
        title: '',
        thumbnail: '',
        totalPrice: 0,
        discount: 0, // theo phần trăm
        count: 1,
        combo_products: [],
    };

    export default {
        components: {
            ProductCard,
        },

        props: {
            combo: {
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
                stateSelectProduct: undefined,
                querySearch: null,
                form: this.combo ? _cloneDeep(this.combo) : _cloneDeep(defaultForm),
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    totalPrice: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    content: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    thumbnail: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    discount: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }], // theo phần trăm
                    count: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }, {
                        validator: checkCount, trigger: 'blur',
                    }],
                },
                fileThumbnail: null,
                categoryFilter: null,
            };
        },

        computed: {
            ...mapState('products', ['products']),
            ...mapState('categories', ['categories']),
            productInCombo() {
                const productInCombo = [];
                // eslint-disable-next-line no-unused-vars
                const empty = this.form.combo_products && this.form.combo_products.map((product) => {
                    const hasProduct = this.products.find((element) => product.product_id === element.id);
                    productInCombo.push({ ...hasProduct, productInCombo: product.id });

                    return product;
                });
                return productInCombo;
            },

            totalPriceCombo() {
                const price = this.form.combo_products && this.form.combo_products.length > 0 && this.form.combo_products.reduce((total, item) => total + item.total_price, 0);
                return this.form.discount ? price - ((price / 100) * +this.form.discount) : price || 0;
            },
        },

        watch: {
            combo() {
                this.form = this.combo ? _cloneDeep(this.combo) : _cloneDeep(defaultForm);
            },
        },

        async mounted() {
            await this.fetchData();
        },

        methods: {
            _isEmpty,

            async fetchData() {
                try {
                    await this.$store.dispatch('products/fetchFullRecord', this.querySearch);
                } catch (e) {
                    this.$handleError(e);
                }
            },

            async handlerThumbnail(file) {
                this.fileThumbnail = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            async changeProduct() {
                const product = this.products.find((item) => item.id === this.stateSelectProduct);
                await this.form.combo_products.unshift({
                    id: Date.now(),
                    product_id: product.id,
                    size: product.sizes && product.sizes.length > 0 ? product.sizes[0]?.size_value : '',
                    option: product.options && product.options.length > 0 ? product.options[0]?.option_value : '',
                    toppings: product.toppings && product.toppings.length > 0 ? [product.toppings[0]?.topping_value] : [],
                    total_price: 0,
                    count: 1,
                });
                this.updatePriceArr(product);
                this.stateSelectProduct = undefined;
            },

            removeProductInCombo(_producInCombo, _product) {
                this.form.combo_products = this.form.combo_products.filter((element) => element.product_id === _product.value);
            },

            changeCountProductInCombo(value, _producInCombo, _product) {
                const combo_products = this.form.combo_products;
                combo_products.forEach((element) => {
                    if (element.id === _producInCombo.id) {
                        element.count = element.count ? element.count += value : 1;
                    }
                });
                this.form.combo_products = combo_products;
                this.updatePriceArr(_product);
            },

            changeSelect(key, value, _producInCombo, _product) {
                const combo_products = this.form.combo_products;
                combo_products.forEach((element) => {
                    if (element.id === _producInCombo.id) {
                        element[key] = value;
                    }
                });
                this.form.combo_products = combo_products;
                this.updatePriceArr(_product);
            },

            calculatePrice(_producInCombo, _product) {
                const priceOfOption = _product.sizes.find((_size) => _size.size_value === _producInCombo?.size)?.price || 0;
                const priceOfSize = _product.options.find((_options) => _options.option_value === _producInCombo?.option)?.price || 0;
                const discount = _product.discount;
                let topingPrice = 0;
                if (_producInCombo && _producInCombo.toppings && _producInCombo.toppings.length > 0) {
                    _producInCombo.toppings.map((topping) => {
                        const result = _product.toppings && _product.toppings.find((element) => element.topping_value === topping);
                        if (result) {
                            topingPrice += result.price;
                        }
                        return topping;
                    });
                }
                const totalPrice = _producInCombo.count ? (Number(priceOfSize) + Number(priceOfOption) + Number(topingPrice)) * _producInCombo.count : (Number(priceOfSize) + Number(priceOfOption) + Number(topingPrice));
                return discount ? totalPrice - ((totalPrice / 100) * discount) : totalPrice;
            },

            updatePriceArr(_product) {
                this.form.combo_products = this.form.combo_products.map((_producInCombo) => {
                    if (_product.id === _producInCombo.product_id) {
                        return {
                            ..._producInCombo,
                            total_price: this.calculatePrice(_producInCombo, _product),
                        };
                    }
                    return {
                        ..._producInCombo,
                    };
                });
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (!this.form.combo_products || this.form.combo_products.length <= 0) {
                            this.$message.error('Trong Combo cần ít nhất 1 sản phẩm');
                            return;
                        }
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
