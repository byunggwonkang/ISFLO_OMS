import type { ThemeVars } from "@storybook/theming";
import { create } from '@storybook/theming/create';

const isacTheme: ThemeVars = create({
    base: 'light',

    brandTitle: '<img src="https://isac-rho.vercel.app/_nuxt/isac.aa23159b.svg" alt="ISAC" style="height: 2.2rem; margin-right: 0.5rem; vertical-align: middle;" />',
    brandTarget: '_self',

    colorPrimary: '#0052cc',
    colorSecondary: '#0052cc',
    appBg: '#f5f5f5',
    appContentBg: '#ffffff',
    appBorderColor: '#eaeaea',
    appBorderRadius: 4,
    barBg: '#ffffff',
    barSelectedColor: '#0052cc',
    barTextColor: '#999999',
    inputBg: '#ffffff',
    inputBorder: '#eaeaea',
    inputTextColor: '#333333',
    textColor: '#333333',
    textInverseColor: '#ffffff',
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',
    gridCellSize: 12
});
export default isacTheme;
