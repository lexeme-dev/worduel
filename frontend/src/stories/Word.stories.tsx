import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TileVariant } from '../Tile';
import Word, { WordProps } from '../Word';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Words/Word',
  component: Word,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Word>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Word> = (args) => <Word {...args} />;

export const Angst = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Angst.args = {
  word: 'ANGST',
  variants: [TileVariant.Default, TileVariant.Default, TileVariant.Default, TileVariant.Default, TileVariant.Default]
}
