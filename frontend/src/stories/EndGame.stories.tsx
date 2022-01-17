import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import EndGame, {EndGameProps} from '../EndGame';
import EndState from './services/interfaces'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Words/EndGame',
  component: EndGame,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof EndGame>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EndGame> = (args) => <EndGame {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  endState: {
    tie: true,
  },
  endState: {
    winner_name: "Faiz",
    tie: false
  }
}
export const Secondary = Template.bind({});
Secondary.args = {
  endState: {
    tie: true,
  },
}
