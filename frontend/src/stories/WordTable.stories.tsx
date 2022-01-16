import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TileVariant } from '../Tile';
import WordTable from '../WordTable';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Words/WordTable',
  component: WordTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WordTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WordTable> = (args) => <WordTable {...args} />;

export const Angst = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Angst.args = {
  words: ['ANGST', "     ", "AN   ", "  Y  ", "     ", "PYREX", "     ", "     "],
  words_variants: [
    [TileVariant.Default, TileVariant.Default, TileVariant.Default, TileVariant.Default, TileVariant.Default],
    [TileVariant.Default, TileVariant.Wrong, TileVariant.Default, TileVariant.Default, TileVariant.Default],
    [TileVariant.Default, TileVariant.Right, TileVariant.Default, TileVariant.Contains, TileVariant.Default],
    [TileVariant.Default, TileVariant.Default, TileVariant.Right, TileVariant.Unknown, TileVariant.Default],
    [TileVariant.Default, TileVariant.Default, TileVariant.Right, TileVariant.Unknown, TileVariant.Default],
    [TileVariant.Default, TileVariant.Default, TileVariant.Right, TileVariant.Unknown, TileVariant.Default],
    [TileVariant.Default, TileVariant.Default, TileVariant.Right, TileVariant.Unknown, TileVariant.Default],
    [TileVariant.Default, TileVariant.Default, TileVariant.Right, TileVariant.Unknown, TileVariant.Default],
    [TileVariant.Default, TileVariant.Default, TileVariant.Right, TileVariant.Unknown, TileVariant.Default],
  ]
}
