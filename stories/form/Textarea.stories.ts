import type { Meta, StoryObj } from '@storybook/vue3';

import FormTextarea from '../../components/common/form/TextareaInput.vue';

const meta = {
    title: 'Form/Textarea',
    component: FormTextarea,

    tags: ['autodocs'],
    argTypes: {
        rows: { control: 'number' },
    },
    args: {
        rows: 3
    }, // default value
} as Meta<typeof FormTextarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextareaInput: Story = {
    args:{},
    name: 'Textarea',
}
