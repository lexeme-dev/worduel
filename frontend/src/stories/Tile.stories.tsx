import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Tile from '../Tile';
import {LetterState} from "../services/interfaces";

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
  letterState: LetterState.UNKNOWN,
}

export const LetterA = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterA.args = {
  letter: 'A',
  letterState: LetterState.UNKNOWN,
  opponent: true,
}

export const LetterO = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterO.args = {
  letter: 'O',
  letterState: LetterState.WRONG,
  opponent: true,
}

export const LetterK = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterK.args = {
  letter: 'K',
  letterState: LetterState.PRESENT,
  opponent: false,
}

export const LetterI = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LetterI.args = {
  letter: 'I',
  letterState: LetterState.RIGHT,
  opponent: false,
}

export const Space = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Space.args = {
  letter: ' ',
  letterState: LetterState.RIGHT,
  opponent: false,
}

export const Person = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Person.args = {
  letter: ' ',
  letterState: LetterState.UNKNOWN,
  opponent: true,
}
