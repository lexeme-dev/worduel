import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Tile, { TileVariant } from '../Tile';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Words/Tile',
  component: Tile,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Tile>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tile> = (args) => <Tile {...args} />;

export const LetterT = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterT.args = {
  letter: 'T',
  variant: TileVariant.Default,
}

export const LetterA = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterA.args = {
  letter: 'A',
  variant: TileVariant.Unknown,
}

export const LetterO = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterO.args = {
  letter: 'O',
  variant: TileVariant.Wrong,
}

export const LetterK = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterK.args = {
  letter: 'K',
  variant: TileVariant.Contains,
}

export const LetterI = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterI.args = {
  letter: 'I',
  variant: TileVariant.Right,
}
