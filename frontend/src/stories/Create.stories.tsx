import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {action } from '@storybook/addon-actions';
import Create from '../components/Create';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Words/Create',
  component: Create,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Create>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Create> = (args) => <Create {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onCreate: action('create'),
  onJoin: action('join'),
}
