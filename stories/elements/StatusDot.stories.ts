import type { Meta, StoryObj } from '@storybook/vue3';

import StatusDot from '../../components/common/elements/StatusDot.vue';

const meta = {
    title: 'Elements/StatusDot',
    component: StatusDot,

    tags: ['autodocs'],
    argTypes: {
        isActive: { control: 'boolean', default: true },
        activeVariant: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
        },
        inactiveVariant: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
        },
    },
    args: {
        isActive: true,
        activeVariant: 'success',
        inactiveVariant: 'danger',
    }, // default value
    render: (args) => ({
        components: { StatusDot },
        template: `<StatusDot
            :active="args.isActive"
            :active-variant="args.activeVariant"
            :inactive-variant="args.inactiveVariant"
        />`,
        setup() {
            return { args };
        },
    }),
} as Meta<typeof StatusDot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Active: Story = {
    args: {
        isActive: true,
    },
};

export const Inactive: Story = {
    args: {
        isActive: false,
    },
};
