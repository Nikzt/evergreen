import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitPortrait from './UnitPortrait';
import { PlayerConfigIds } from '../../unitConfigs';

import '../../../reset.css';
import '../../../app.scss';

export default {
    title: 'Common/UnitPortrait',
    component: UnitPortrait,
} as ComponentMeta<typeof UnitPortrait>;

const Template: ComponentStory<typeof UnitPortrait> = (props) => 
<div style={{'width': '200px', 'height': '300px'}}>
    <UnitPortrait unitConfigId={props.unitConfigId} />
</div>

export const Greg = Template.bind({});
Greg.args = {
    unitConfigId: PlayerConfigIds.GREG,
}

export const Mira = Template.bind({});
Mira.args = {
    unitConfigId: PlayerConfigIds.MIRA,
}