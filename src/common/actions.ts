import { createAction } from '@reduxjs/toolkit';

export const chargeBattery = createAction<string>('chargeBattery');
export const tick = createAction('tick');
