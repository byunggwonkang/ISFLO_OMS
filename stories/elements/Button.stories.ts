import type { Meta, StoryObj } from '@storybook/vue3';

import Button from '../../components/common/elements/Button.vue';
import ButtonGroup from "../../components/common/elements/ButtonGroup.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Elements/Button',
  component: Button,

  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: { control: 'boolean', default: false },
    loading: { control: 'boolean', default: false },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
    },
  },
  args: {
    label: 'Button',
    size: 'md',
    rounded: false,
    variant: 'primary',
    loading: false,
  }, // default value
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Button',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    label: 'Button',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    label: 'Button',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    label: 'Button',
  },
};

export const RoundedButton: Story = {
  args: {
    rounded: true,
    label: 'Button',
  },
};

export const LoadingButton: Story = {
  args: {
    loading: true,
    label: 'Button',
  },
};

export const GroupedButton: Story = {
  render: (args) => ({
    components: { ButtonGroup, Button },
    setup() {
      return { args };
    },
    template: `<ButtonGroup :rounded="args.rounded" :border="args.border">
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>`,
  }),
  args: {
    rounded: true,
    border: true,
  },
  argTypes: {
    rounded: { control: 'boolean', default: true },
    border: { control: 'boolean', default: true },
  }
}
