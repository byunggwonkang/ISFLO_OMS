import type { Meta, StoryObj } from '@storybook/vue3';

import FormTextInput from '../../components/common/form/TextInput.vue';

const meta = {
    title: 'Form/Input',
    component: FormTextInput,

    tags: ['autodocs'],
    argTypes: {},
    args: {
    }, // default value
} as Meta<typeof FormTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
    args:{},
    name: 'Input',
}


