<template>
    <div>
        <div v-if="label" class="text-gray-80">
            {{ label }}
        </div>
        <a-input-search
            v-model="keySearch"
            :placeholder="placeholder"
            class="search-filter"
            :size="size"
            :allow-clear="clearable"
            @keyup.native.enter="onSearch"
            @search="onSearch"
        >
            <template #enterButton>
                <a-button type="primary">
                    <i class="isax isax-search-normal" />
                </a-button>
            </template>
        </a-input-search>
    </div>
</template>

<script>
    import _assign from 'lodash/assign';
    import _map from 'lodash/map';
    import _omit from 'lodash/omit';
    import _debounce from 'lodash/debounce';

    export default {
        model: {
            prop: 'value',
        },

        props: {
            label: String,
            value: [Object, String, Number, Array],
            router: {
                type: Boolean,
                default: true,
            },
            icon: String,
            placeholder: {
                type: String,
                default: 'Tìm kiếm',
            },
            size: {
                type: String,
                default: 'default',
            },
            query: {
                type: String,
                default: 'freeWord',
            },
            clearable: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            const defaultValue = this.router
                ? this.$route.query[this.query]
                : this.value;

            return {
                searchDebounce: null,
                keySearch: this.$route.query[this.query] || defaultValue,
            };
        },

        watch: {
            '$route.query': {
                handler(query) {
                    this.keySearch = query[this.query];
                },
                deep: true,
                immediate: true,
            },

            value(data) {
                this.keySearch = data;
            },

            keySearch() {
                this.onSearch();
            },
        },

        methods: {
            async onSearch() {
                if (this.searchDebounce) {
                    await this.searchDebounce.cancel();
                }
                this.searchDebounce = _debounce(async () => {
                    this.$emit('input', this.keySearch);
                    this.$emit('change', this.keySearch);
                    if (this.router) {
                        if (this.query && this.keySearch) {
                            this.$router.push({
                                query: _assign({}, _omit(this.$route.query, _map(this.options, 'value')), {
                                    [this.query]: this.keySearch.trim(),
                                    page: 1,
                                }),
                            });
                        }

                        if (!this.keySearch) {
                            this.$router.push({
                                query: _assign({}, _omit(this.$route.query, [this.query])),
                            });
                        }
                    }
                }, 200);
                await this.searchDebounce();
            },
        },
    };
</script>
