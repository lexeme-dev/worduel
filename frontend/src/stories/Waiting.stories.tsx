import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Waiting, {WaitingProps} from '../components/Waiting';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Words/Waiting',
  component: Waiting,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Waiting>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Waiting> = (args) => <Waiting {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  bodyText: 'Game ID testy-fraud',
}
