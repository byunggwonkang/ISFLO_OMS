import type { Preview } from "@storybook/vue3";

import '../assets/css/main.css';
import 'v-calendar/style.css';
import './css/preview.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
