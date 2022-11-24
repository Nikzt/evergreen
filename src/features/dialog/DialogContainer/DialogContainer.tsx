import { useState } from "react";

const DialogContainer = () => {
    const dialogData = [
        {
            unitId: 'greg',
            dialog: 'Hey Mira, wanna hear a joke?'
        },
        {
            unitId: 'mira',
            dialog: 'No.',
        },
        {
            unitId: 'greg',
            dialog: 'I\'m afraid for the calendar. Its days are numbered.',
        },
        {
            unitId: 'mira',
            dialog: '...',
        },
    ]

    const [currentDialogIdx, setCurrentDialogIdx] = useState(0);

    const onNextButtonClick = () => {
        if (currentDialogIdx >= dialogData.length - 1) return;
        setCurrentDialogIdx(currentDialogIdx + 1);
    }

    return (
        <section>
            <div>{dialogData[currentDialogIdx].unitId}</div>
            <div>{dialogData[currentDialogIdx].dialog}</div>
            <button onClick={onNextButtonClick}>Next</button>
        </section>
    );
};

export default DialogContainer;
