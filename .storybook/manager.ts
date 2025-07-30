import { addons } from '@storybook/addons';
import isacTheme from './theme/isacTheme';

addons.setConfig({
    theme: isacTheme,
    docs: {
        theme: isacTheme,
    },
});
