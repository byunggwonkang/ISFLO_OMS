import type { Meta, StoryObj } from '@storybook/vue3';

import FormSelect from '../../components/common/form/Select.vue';
import FormCheckbox from '../../components/common/form/Checkbox.vue';

const meta = {
    title: 'Form/Select',
    component: FormSelect,

    tags: ['autodocs'],
    argTypes: {
        options: { control: 'array' },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        multiple: { control: 'boolean' }
    },
    args: {
        options: [
            { value: '1', name: 'Option 1' },
            { value: '2', name: 'Option 2' },
            { value: '3', name: 'Option 3' },
        ],
        placeholder: 'Select an option',
        disabled: false,
        multiple: false
    }, // default value
} as Meta<typeof FormSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SelectInput: Story = {
    args:{
        multiple: false,
    },
    name: 'Single Select',
}

export const MultipleSelectInput: Story = {
    argTypes: {
        multiple: { control: 'boolean' },
        selectedOptions: { control: 'array' },
    },
    args:{
        multiple: true,
        selectedOptions: []
    },
    name: 'Multiple Select',
    render: (args) => ({
        components: { FormSelect, FormCheckbox },
        template: `<FormSelect
            :options="args.options"
            :placeholder="args.placeholder"
            :disabled="args.disabled"
            :multiple="args.multiple"
            v-model="args.selectedOptions"
        >
          <template #checkbox="{ selected }">
            <FormCheckbox :model-value="selected" />
          </template>
        </FormSelect>`,
        setup() {
            return { args };
        },
    })
}
