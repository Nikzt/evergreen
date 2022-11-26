import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitInfo from './UnitInfo';
import { PlayerConfigIds } from '../../unitConfigs';
import { Provider } from 'react-redux';

import '../../../reset.css';
import '../../../app.scss';
import { getTestStore } from '../../../tests/storyUtils';

export default {
    title: 'Common/UnitInfo',
    component: UnitInfo,
} as ComponentMeta<typeof UnitInfo>;

const store = getTestStore();

const Template: ComponentStory<typeof UnitInfo> = (props) => 
<Provider store={store}>
    <div style={{'width': '200px', 'height': '300px'}}>
        <UnitInfo unitId={props.unitId} />
    </div>
</Provider>

export const Greg = Template.bind({});
Greg.args = {
    unitId: PlayerConfigIds.GREG,
}

export const Mira = Template.bind({});
Mira.args = {
    unitId: PlayerConfigIds.MIRA,
}