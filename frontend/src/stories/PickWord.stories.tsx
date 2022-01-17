import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {action } from '@storybook/addon-actions';
import PickWord from '../PickWord';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Words/PickWord',
  component: PickWord,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PickWord>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PickWord> = (args) => <PickWord {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onWordPicked: action('wordPicked'),
}
