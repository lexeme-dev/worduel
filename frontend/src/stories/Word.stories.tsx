import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Word from '../Word';
import {LetterState} from "../services/interfaces";

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
  guess: {
    guess_word: 'ANGST',
    player_name: 'Varun',
    letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
  },
  opponent: true,
}

export const Slyly = Template.bind({});
Slyly.args = {
  guess: {
    guess_word: 'SLYLY',
    player_name: 'Varun',
    letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.PRESENT, LetterState.RIGHT, LetterState.WRONG]
  },
  opponent: false,
}

export const Sl_ly = Template.bind({});
Sl_ly.args = {
  guess: {
    guess_word: 'SL LY',
    player_name: 'Varun',
    letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.PRESENT, LetterState.RIGHT, LetterState.WRONG]
  },
  opponent: true
}

export const Blank = Template.bind({});
Blank.args = {
  guess: {
    guess_word: '     ',
    player_name: 'Varun',
    letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.PRESENT, LetterState.RIGHT, LetterState.WRONG]
  },
  opponent: true,
}
