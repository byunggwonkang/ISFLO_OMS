import type { Meta, StoryObj } from '@storybook/vue3';

import Accordion from '../../components/common/elements/Accordion.vue';

const meta = {
    title: 'Elements/Accordion',
    component: Accordion,

    tags: ['autodocs'],
    argTypes: {
        border: { control: 'boolean', default: false },
        divider: { control: 'boolean', default: false },
        defaultOpen: { control: 'boolean', default: false },
        headerVariant: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'white', 'dark'],
        },
    },
    args: {
        border: false,
        divider: false,
        headerVariant: 'white',
        defaultOpen: false,
    }, // default value

    render: (args) => ({
        components: { Accordion },
        template: `
            <Accordion
                :border="args.border"
                :divider="args.divider"
                :header-variant="args.headerVariant"
                :default-open="args.defaultOpen"
            >
              <template #header>
                  <p>Header</p>
              </template>

              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates.</p>
            </Accordion>
        `,
        setup() {
            return { args };
        },
    }),
} as Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
    },
};

export const Border: Story = {
    name: 'With Border',
    args: {
        border: true,
    },
};

export const Variant: Story = {
    name: 'With Header Variant',
    args: {
        border: true,
        headerVariant: 'secondary',
    },
};

export const DefaultOpen: Story = {
    name: 'With Default Open',
    args: {
        border: true,
        defaultOpen: true,
    },
};
