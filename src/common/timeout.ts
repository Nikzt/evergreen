const TICK_INTERVAL_MS = 10;

export const timeout = (
    tickCallback: (currTime: number, totalTime: number, interval: NodeJS.Timer) => void,
    ms: number,
) => {
    return new Promise((resolve) => {
        let timeInMs = 0;
        const interval = setInterval(() => {
            tickCallback(timeInMs, ms, interval);
            timeInMs += TICK_INTERVAL_MS;
            if (timeInMs >= ms) {
                clearInterval(interval);
                resolve(true);
            }
        }, TICK_INTERVAL_MS);
    });
};

export const wait = (ms: number) => {
    // If you want to test the game without delays, uncomment this line
    //return new Promise((resolve) => resolve(true));
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), ms);
    });
};
