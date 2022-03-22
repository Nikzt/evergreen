import { tick } from '../../common/actions';
import { store } from '../../store';

export default class TimerManager {
    private static instance: TimerManager | null = null;
    private static timer: NodeJS.Timer | null = null;

    static getInstance() {
        if (TimerManager.instance == null) {
            TimerManager.instance = new TimerManager();
        }

        return this.instance;
    }

    static startTimer() {
        if (TimerManager.timer == null) {
            TimerManager.timer = setInterval(() => {
                store.dispatch(tick());
            }, 1000);
        }
    }
}
