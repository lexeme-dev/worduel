import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import WordTable from '../components/WordTable';
import {LetterState} from "../services/interfaces";
import {action} from '@storybook/addon-actions';

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
  guesses: [
    {
      guess_word: 'ANGST',
      player_name: 'Varun',
      letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
    },
    {
      guess_word: 'AN ST',
      player_name: 'Faiz',
      letter_results: [LetterState.UNKNOWN, LetterState.WRONG, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
    },
    {
      guess_word: 'AN   ',
      player_name: 'Varun',
      letter_results: [LetterState.UNKNOWN, LetterState.RIGHT, LetterState.UNKNOWN, LetterState.PRESENT, LetterState.UNKNOWN],
    },
    {
      guess_word: '  Y  ',
      player_name: 'Faiz',
      letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.RIGHT, LetterState.UNKNOWN, LetterState.UNKNOWN],
    },
  ],
  playerName: "Faiz",
  isPlayerOne: true,
}
