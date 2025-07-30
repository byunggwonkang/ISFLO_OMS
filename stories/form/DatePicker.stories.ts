import type { Meta, StoryObj } from '@storybook/vue3';

import FormDatePicker from '../../components/common/form/DatePicker.vue';

const meta = {
    title: 'Form/Date Picker',
    component: FormDatePicker,

    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    args: {
        placeholder: 'Select a date',
        disabled: false,
    }, // default value
    render: (args) => ({
        components: { FormDatePicker },
        template: `<FormDatePicker
            :disabled="args.disabled"
            :placeholder="args.placeholder"
        />`,
        setup() {
            return { args };
        },
    })
} as Meta<typeof FormDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DatePicker: Story = {
    args:{},
    name: 'Date Picker',
}
