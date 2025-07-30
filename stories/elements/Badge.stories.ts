import type { Meta, StoryObj } from '@storybook/vue3';

import Badge from '../../components/common/elements/Badge.vue';

const meta = {
    title: 'Elements/Badge',
    component: Badge,

    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        pill: { control: 'boolean', default: false },
        flat: { control: 'boolean', default: false },
        dot: { control: 'boolean', default: false },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
        },
    },
    args: {
        label: 'Badge',
        pill: false,
        flat: false,
        dot: false,
        variant: 'primary',
    }, // default value
} as Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
    },
};

export const Danger: Story = {
    args: {
        variant: 'danger',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
    },
};

export const Info: Story = {
    args: {
        variant: 'info',
    },
};

export const Pill: Story = {
    args: {
        pill: true,
    },
};

export const Flat: Story = {
    args: {
        flat: true,
    },
};

export const Dot: Story = {
    args: {
        dot: true,
    },
};
