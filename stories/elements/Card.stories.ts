import type { Meta, StoryObj } from '@storybook/vue3';

import Card from '../../components/common/elements/Card.vue';
import Button from "../../components/common/elements/Button.vue";

const meta = {
    title: 'Elements/Card',
    component: Card,

    tags: ['autodocs'],
    argTypes: {
        shadowSize: { control: 'select', options: ['default', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'none'] },
        variant: {
            control: 'select',
            options: ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'],
        },
    },
    args: {
        shadowSize: 'default',
        variant: 'default',
        divider: false,
        cardHeaderClass: 'p-3',
        cardBodyClass: 'p-3',
        cardFooterClass: 'p-3',
    }, // default value

    render: (args) => ({
      components: { Card, Button },
      template: `<Card
        :shadow-size="args.shadowSize"
        :variant="args.variant"
        :divider="args.divider"
        :card-header-class="args.cardHeaderClass"
        :card-body-class="args.cardBodyClass"
        :card-footer-class="args.cardFooterClass"
        >
        <template #header>
          <div class="flex justify-between">
            <div class="text-xl font-bold">Card Header</div>
          </div>
        </template>
        <template #default>
          <div>
            <div class="text-sm">Card Body</div>
          </div>
        </template>
        <template #footer>
          <div class="text-sm">Card Footer</div>
        </template>
      </Card>`,
      setup() {
        return { args };
      }
    })
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: 'default',
    },
};

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
