import type { Meta, StoryObj } from '@storybook/vue3';

import Pagination from '../../components/common/elements/Pagination.vue';

const meta = {
    title: 'Elements/Pagination',
    component: Pagination,

    tags: ['autodocs'],
    argTypes: {
        totalItems: { control: 'number' },
        itemsPerPage: { control: 'number' },
        currentPage: { control: 'number' },
        activeVariant: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
        },
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        rounded: { control: 'boolean', default: false }
    },
    args: {
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 1,
        activeVariant: 'primary',
        size: 'md',
        rounded: true
    }, // default value
} as Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 1,
        activeVariant: 'primary',
    },
    render: (args) => ({
        components: { Pagination },
        template: `<Pagination v-bind="args" @page-changed="args.currentPage = $event" />`,
        setup() {
            return { args };
        },
    })
};
