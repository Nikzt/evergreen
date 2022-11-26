import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DialogScriptId } from "./dialogDB";

type DialogState = {
    isDialogOpen: boolean,
    dialogId: DialogScriptId | null,
}

const initialState: DialogState = {
    isDialogOpen: false,
    dialogId: null,
}

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        beginDialog: (state, action: PayloadAction<DialogScriptId>) => {
            state.isDialogOpen = true;
            state.dialogId = action.payload;
        },
        endDialog: (state) => {
            state.isDialogOpen = false;
            state.dialogId = null;
        }
    }
});

export const {
    beginDialog,
    endDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;
