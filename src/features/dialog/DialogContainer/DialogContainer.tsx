import { useState } from "react";
import UnitPortrait from "../../../common/components/UnitPortrait/UnitPortrait";
import { wait } from "../../../common/timeout";
import { PlayerConfigIds } from "../../../common/unitConfigs";
import { getDialog, PortraitPosition } from "../state/dialogDB";
import './dialogContainer.scss';

const DialogContainer = () => {
    const dialogData = getDialog("barkDogEncounter");
    const getCurrentUnitId = () => dialogData[currentDialogIdx].unitConfigId;
    const getCurrentDialog = () => dialogData[currentDialogIdx].dialog;
    const getCurrentPortraitPosition = () => dialogData[currentDialogIdx].portraitPosition;

    const [currentDialogIdx, setCurrentDialogIdx] = useState(0);
    const [currentDialogBuffer, setCurrentDialogBuffer] = useState("");
    const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(true);
    const [isDialogStarted, setIsDialogStarted] = useState(false);

    const onNextButtonClick = async () => {
        if (!isDialogStarted) {
            setIsDialogStarted(true);
            speak(0);
        }

        if (isCharacterSpeaking || currentDialogIdx >= dialogData.length - 1) return;

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

    const getGridTemplateColumns = () => getCurrentPortraitPosition() === PortraitPosition.LEFT 
        ? "150px auto"
        : "auto 150px";

    return (
        <section className="dialog-container" 
                 onClick={onNextButtonClick} >
            <div className="dialog-container__body"
                 style={{gridTemplateColumns: getGridTemplateColumns()}}>
                {getCurrentPortraitPosition() === PortraitPosition.LEFT 
                    && <UnitPortrait unitConfigId={getCurrentUnitId()} /> }
                <div className="dialog-container__text">{currentDialogBuffer}</div>
                {getCurrentPortraitPosition() === PortraitPosition.RIGHT 
                    && <UnitPortrait unitConfigId={getCurrentUnitId()} /> }
            </div>
        </section>
    );
};

export default DialogContainer;
