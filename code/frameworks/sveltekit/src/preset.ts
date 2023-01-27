// @ts-expect-error -- TS picks up the type from preset.js instead of dist/preset.d.ts
import { viteFinal as svelteViteFinal } from '@storybook/svelte-vite/preset';
import type { PresetProperty } from '@storybook/types';
import { withoutVitePlugins } from '@storybook/builder-vite';
import { configOverrides } from './plugins/config-overrides';
import { type StorybookConfig } from './types';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/svelte',
};

export const viteFinal: NonNullable<StorybookConfig['viteFinal']> = async (config, options) => {
  const baseConfig = await svelteViteFinal(config, options);

  let { plugins = [] } = baseConfig;

  // Remove vite-plugin-svelte-kit from plugins if using SvelteKit
  // see https://github.com/storybookjs/storybook/issues/19280#issuecomment-1281204341
  plugins = (
    await withoutVitePlugins(plugins, [
      // @sveltejs/kit@1.0.0-next.587 and later
      'vite-plugin-sveltekit-compile',
    ])
  ).concat(configOverrides());

  return { ...baseConfig, plugins };
};
