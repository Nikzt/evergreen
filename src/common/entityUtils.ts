import { Dictionary } from '@reduxjs/toolkit';

export function getEntityList<T>(entities: Dictionary<T>): T[] {
    const values = Object.values(entities);
    const filteredValues = values.filter((value) => value != undefined);
    return filteredValues as T[];
}
