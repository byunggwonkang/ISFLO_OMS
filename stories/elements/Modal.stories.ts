import type { Meta, StoryObj } from '@storybook/vue3';

import Modal from '../../components/common/elements/Modal.vue';
import Button from "../../components/common/elements/Button.vue";

const meta = {
  title: 'Elements/Modal',
  component: Modal,
  tags: ['autodocs'],

  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'],
    },
  },
  args: {
    size: 'md',
  }, // default value
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        size: 'md',
    },
  render: (args) => ({
    components: { Modal, Button },
    template: `<div>
      <Button @click="args.show = true">Open Modal</Button>
      <Modal :size="args.size" :show="args.show" @close="args.show = false">
        <template #header>
            <h3>Modal Header</h3>
        </template>
        <template #body>
            <p>Modal Body</p>
        </template>
        <template #footer>
            <Button @click="args.show = false">Close</Button>
        </template>
      </Modal>
    </div>`,
    setup() {
      return { args };
    },
  })
};
