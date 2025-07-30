import type { Meta, StoryObj } from '@storybook/vue3';

import FormRadio from '../../components/common/form/Radio.vue';

const meta = {
    title: 'Form/Radio',
    component: FormRadio,

    render: (args) => ({
        components: { FormRadio },
        template: `<div class="w-40">
           <FormRadio
              :disabled="args.disabled"
              :label="args.label"
              :labelPosition="args.labelPosition"
              :value="args.value"
              :name="args.name"
           />
        </div>`,
        setup() {
            return { args };
        },
    }),

    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        label: { control: 'text' },
        labelPosition: { control: 'select', options: ['left', 'right'] },
        value: { control: 'text' },
        name: { control: 'text' },
    },
    args: {
        disabled: false,
        label: 'Radio Button',
        labelPosition: 'right',
        value: '1',
        name: 'radio',
    }, // default value
} as Meta<typeof FormRadio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RadioInput: Story = {
    args:{},
    name: 'Radio',
}
