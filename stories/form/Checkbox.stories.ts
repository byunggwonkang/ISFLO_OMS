import type { Meta, StoryObj } from '@storybook/vue3';

import FormCheckbox from '../../components/common/form/Checkbox.vue';

const meta = {
    title: 'Form/Checkbox',
    component: FormCheckbox,

    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        label: { control: 'text' },
        labelPosition: { control: 'select', options: ['left', 'right'] },
        value: { control: 'text' },
    },
    args: {
        disabled: false,
        label: 'Checkbox',
        labelPosition: 'right',
        value: '1',
    }, // default value
} as Meta<typeof FormCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CheckboxInput: Story = {
    args:{},
    name: 'Checkbox',
}
