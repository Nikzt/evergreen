import { useEffect, useState } from "react";
import UnitPortrait from "../../../common/components/UnitPortrait/UnitPortrait";
import { wait } from "../../../common/timeout";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import { beginPlayerTurn, setShowTurnIndicator } from "../../combat/state/combatSlice";
import { DialogScriptId, getDialog } from "../state/dialogDB";
import { endDialog } from "../state/dialogSlice";
import './dialogContainer.scss';

const DialogContainer = () => {
    const dispatch = useAppDispatch();
    const showDialog = useAppSelector((state: RootState) => state.dialog.isDialogOpen);
    const dialogId = useAppSelector((state: RootState) => state.dialog.dialogId);

    const getCurrentUnitId = () => dialogData[currentDialogIdx].unitConfigId;
    const getPreviousDialog = () => {
        if (currentDialogIdx <= 0) return null;
        return dialogData[currentDialogIdx - 1];
    }

    const [currentDialogIdx, setCurrentDialogIdx] = useState(0);
    const [currentDialogBuffer, setCurrentDialogBuffer] = useState("");
    const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(true);
    const [isDialogStarted, setIsDialogStarted] = useState(false);

    const dialogData = getDialog(dialogId ?? DialogScriptId.BARK_DOG_ENCOUNTER);

    useEffect(() => {
        dialogId != null && onNextButtonClick();
    }, [dialogId])

    const onNextButtonClick = async () => {
        const currentDialogContainerElement = document.querySelector('.current-dialog') as HTMLElement;

        if (!isDialogStarted) {
            setIsDialogStarted(true);
            speak(0);
            currentDialogContainerElement.style.animation = 'slideIn 0.3s';
            currentDialogContainerElement.style.opacity = '1';
            setTimeout(() => {
                currentDialogContainerElement.style.animation = '';
            }, 500);
        }

        if (isCharacterSpeaking) return;
        if (currentDialogIdx >= dialogData.length - 1) {
            dispatch(endDialog());
            dispatch(beginPlayerTurn());
            return;
        }

        const previousDialogContainerElement = document.querySelector('.previous-dialog') as HTMLElement;
        currentDialogContainerElement.style.animation = 'slideIn 0.3s ease-in-out';
        previousDialogContainerElement.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => {
            currentDialogContainerElement.style.animation = '';
            previousDialogContainerElement.style.animation = '';
        }, 500);

        const nextDialogIdx = currentDialogIdx + 1;
        setCurrentDialogIdx(nextDialogIdx);
        speak(nextDialogIdx);

    }


    const speak = async (dialogIdx: number) => {
        setIsCharacterSpeaking(true);
        setCurrentDialogBuffer("");
        const currentDialog = dialogData[dialogIdx].dialog;
        for await (let letter of currentDialog) {
            setCurrentDialogBuffer(prevBuffer => prevBuffer + letter);
            if ('.?!'.includes(letter)) await wait(300);
            else if (letter === ',') await wait(160);
            else if (letter === ' ') continue;
            else await wait(35);
        }
        setIsCharacterSpeaking(false);
    }

    if (!showDialog || !dialogId) return <></>;

    return (
        <div className="dialog-layer">
            <div className="dialog-wrapper">
                <section className="dialog-container current-dialog"
                    style={{opacity: '0'}}
                    onClick={onNextButtonClick} >
                    <div className="dialog-container__body">
                        <UnitPortrait unitConfigId={getCurrentUnitId()} />
                        <div className="dialog-container__text">{currentDialogBuffer}</div>
                    </div>
                </section>
                <section className="dialog-container previous-dialog">
                    <div className="dialog-container__body">
                        <UnitPortrait unitConfigId={getPreviousDialog()?.unitConfigId ?? ""} />
                        <div className="dialog-container__text">{getPreviousDialog()?.dialog}</div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DialogContainer;
