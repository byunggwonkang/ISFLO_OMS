import type { Meta, StoryObj } from '@storybook/vue3';

import FormCombobox from '../../components/common/form/Combobox.vue';

const meta = {
    title: 'Form/Combobox',
    component: FormCombobox,

    tags: ['autodocs'],
    argTypes: {
        options: { control: 'array' },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        notFoundText: { control: 'text' },
    },
    args: {
        options: [
            { value: '1', name: 'Option 1' },
            { value: '2', name: 'Option 2' },
            { value: '3', name: 'Option 3' },
        ],
        placeholder: 'Select an option',
        disabled: false,
        notFoundText: 'No results found',
    }, // default value
} as Meta<typeof FormCombobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ComboboxInput: Story = {
    args:{},
    name: 'Combobox',
}
