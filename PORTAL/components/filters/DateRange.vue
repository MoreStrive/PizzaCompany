<template>
    <div>
        <div v-if="label" class="text-gray-80">
            {{ label }}
        </div>
        <div>
            <a-range-picker
                v-model="selectedValue"
                class="w-full"
                :allow-clear="allowClear"
                :ranges="presetRanges"
                :placeholder="[placeholderFrom, placeholderTo]"
                :size="size"
                :mode="mode"
                :default-value="defaultValue"
                :format="format"
                :value-format="valueFormat"
                @change="onFilter"
                @panelChange="changeDate"
            >
                <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import _assign from 'lodash/assign';
    import _omit from 'lodash/omit';

    export default {
        model: {
            prop: 'value',
        },

        props: {
            query: {
                type: String,
                default: '',
            },
            label: String,
            placeholderFrom: {
                type: String,
                default: 'From date',
            },
            placeholderTo: {
                type: String,
                default: 'To date',
            },
            allowClear: {
                type: Boolean,
                default: true,
            },
            customHandler: {
                type: Boolean,
                default: false,
            },
            size: {
                type: String,
                default: 'default',
            },
            mode: {
                type: [String, Array],
                default: 'date',
            },
            prefix: {
                type: String,
                default: 'From',
            },
            suffix: {
                type: String,
                default: 'To',
            },
            value: {
                type: Array,
                default: () => [],
            },
            defaultValue: {
                type: Array,
                default: () => [],
            },
            valueFormat: {
                type: String,
                default: 'YYYY-MM-DD',
            },
            format: {
                type: String,
                default: 'DD/MM/YYYY',
            },
        },

        data() {
            let selectedValue = '';
            selectedValue = [
                this.$route.query[`${this.query}${this.prefix}`],
                this.$route.query[`${this.query}${this.suffix}`],
            ] || this.defaultValue;

            return {
                selectedValue,
            };
        },

        computed: {
            presetRanges() {
                return {
                    Today: [moment(), moment()],
                    'This week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                    'This month': [moment().startOf('month'), moment().endOf('month')],
                    'This year': [moment().startOf('year'), moment().endOf('year')],
                };
            },
        },

        watch: {
            '$route.query': {
                handler() {
                    const dates = [
                        this.$route.query[`${this.query}${this.prefix}`],
                        this.$route.query[`${this.query}${this.suffix}`],
                    ] || [];
                    this.$emit('input', dates);
                    this.selectValue = dates;
                },
                deep: true,
                immediate: true,
            },

            value(data) {
                this.selectValue = data;
            },
        },

        methods: {
            onFilter(dates, dateStrings) {
                if (dateStrings[0] === '' || dateStrings[1] === '') {
                    this.clear();
                } else {
                    const from = dates[0];
                    const to = dates[1];

                    if (this.customHandler) {
                        this.$emit('onChange', { from, to });
                    } else {
                        const query = {
                            [`${this.query}${this.prefix}`]: from,
                            [`${this.query}${this.suffix}`]: to,
                        };

                        this.$router.push({
                            query: _assign({}, this.$route.query, query),
                        });
                    }
                }
            },

            clear() {
                this.$router.push({
                    query: _assign({}, _omit(this.$route.query, [`${this.query}${this.prefix}`, `${this.query}${this.suffix}`]), {}),
                });
            },

            changeDate(value) {
                if (this.mode !== 'date') {
                    this.selectedValue = [value[0].format('YYYY'), value[1].format('YYYY')];
                    this.onFilter(this.selectedValue, [`${value[0].format('YYYY')}`, `${value[1].format('YYYY')}`]);
                }
            },
        },
    };
</script>
<style scoped>
</style>
