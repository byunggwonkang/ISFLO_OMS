import type { Meta, StoryObj } from '@storybook/vue3';

import FormGroup from '../../components/common/form/Group.vue';
import FormTextInput from '../../components/common/form/TextInput.vue';
import VueFeather from 'vue-feather';

const meta = {
    title: 'Form/Form Group',
    components: { FormGroup, FormTextInput },

    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        gap: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
        },
        border: { control: 'boolean' },
        errorText: { control: 'text' },
        helpText: { control: 'text' },
        horizontal: { control: 'boolean' },
    },
    args: {
        label: 'Label',
        gap: 'md',
        border: false,
        errorText: '',
        helperText: '',
        horizontal: false,
    }, // default value
    render: (args) => ({
        components: { FormGroup, FormTextInput },
        template: `<FormGroup
            :label="args.label"
            :gap="args.gap"
            :border="args.border"
            :error-text="args.errorText"
            :helper-text="args.helperText"
            :horizontal="args.horizontal"
        >
          <FormTextInput />
        </FormGroup>`,
        setup() {
            return { args };
        },
    })
} as Meta<typeof Group>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
    name: 'Horizontal',
    args:{
        horizontal: true,
    },
}

export const Vertical: Story = {
    name: 'Vertical',
    args:{
        horizontal: false,
    },
}

export const WithError: Story = {
    name: 'With Error Message',
    args:{
        errorText: 'Error text',
    },
}

export const WithHelp: Story = {
    name: 'With Helper Text',
    args:{
        helperText: 'Help text',
    },
}

export const WithPrefix: Story = {
    name: 'With Prefix',
    args:{
      border: true,
    },
    render: (args) => ({
        components: { FormGroup, FormTextInput, VueFeather },
        template: `<FormGroup
            :label="args.label"
            :gap="args.gap"
            :border="args.border"
            :error-text="args.errorText"
            :helper-text="args.helperText"
            :horizontal="args.horizontal"
        >
          <template #prefix>
            <VueFeather
                type="user"
                class="h-5 w-5 text-gray-400"
            />
          </template>
          <FormTextInput />
        </FormGroup>`,
        setup() {
            return { args };
        },
    })
}

export const WithSuffix: Story = {
    name: 'With Suffix',
    args:{
      border: true,
    },
    render: (args) => ({
        components: { FormGroup, FormTextInput, VueFeather },
        template: `<FormGroup
            :label="args.label"
            :gap="args.gap"
            :border="args.border"
            :error-text="args.errorText"
            :helper-text="args.helperText"
            :horizontal="args.horizontal"
        >
          <template #suffix>
            <VueFeather
                type="user"
                class="h-5 w-5 text-gray-400"
            />
          </template>
          <FormTextInput />
        </FormGroup>`,
        setup() {
            return { args };
        },
    })
}

export const WithPrefixAndSuffix: Story = {
    name: 'With Prefix and Suffix',
    args:{
      border: true,
    },
    render: (args) => ({
        components: { FormGroup, FormTextInput, VueFeather },
        template: `<FormGroup
            :label="args.label"
            :gap="args.gap"
            :border="args.border"
            :error-text="args.errorText"
            :helper-text="args.helperText"
            :horizontal="args.horizontal"
        >
          <template #prefix>
            <VueFeather
                type="user"
                class="h-5 w-5 text-gray-400"
            />
          </template>
          <template #suffix>
            <VueFeather
                type="user"
                class="h-5 w-5 text-gray-400"
            />
          </template>
          <FormTextInput />
        </FormGroup>`,
        setup() {
            return { args };
        },
    })
}
