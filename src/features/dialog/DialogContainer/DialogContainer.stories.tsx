import { ComponentStory, ComponentMeta } from '@storybook/react';

import DialogContainer from './DialogContainer';
import '../../../reset.css';
import '../../../app.scss';

export default {
    title: 'Dialog/DialogContainer',
    component: DialogContainer,

} as ComponentMeta<typeof DialogContainer>;

const Template: ComponentStory<typeof DialogContainer> = () => <DialogContainer />;

export const Primary = Template.bind({});
Primary.args = {
}