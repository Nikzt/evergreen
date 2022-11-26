import { ComponentStory, ComponentMeta } from '@storybook/react';

import DialogContainer from './DialogContainer';
import '../../../reset.css';
import '../../../app.scss';
import { getTestStore } from '../../../tests/storyUtils';
import { Provider } from 'react-redux';

const store = getTestStore();

export default {
    title: 'Dialog/DialogContainer',
    component: DialogContainer,

} as ComponentMeta<typeof DialogContainer>;

const Template: ComponentStory<typeof DialogContainer> = () =>
    <Provider store={store}>
        <DialogContainer />
    </Provider>

export const Primary = Template.bind({});
Primary.args = {
}