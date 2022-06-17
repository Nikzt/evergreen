import { Dictionary } from "@reduxjs/toolkit";

export const getEntityList = (entities: Dictionary<any>) => {
    return Object.values(entities).filter(entity => entity != null); 
}