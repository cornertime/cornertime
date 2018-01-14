import { create } from 'diffyjs';
import getSettings from './settings';


type MotionEventHandler = (magnitude: number) => void;
const MOTION_MAX = 255;


export interface Motion {
    onUpdate(handler: MotionEventHandler): void;
}


function minimum2d(matrix: number[][]) {
    return Math.min(...matrix.map(row => Math.min(...row)));
}


class BaseMotion implements Motion {
    handlers: MotionEventHandler[] = [];

    onUpdate(handler: MotionEventHandler) {
        this.handlers.push(handler);
    }

    updateListeners(magnitude: number) {
        this.handlers.forEach(handler => handler(magnitude));
    }
}


class BrowserMotion extends BaseMotion {
    diffy: {};
    settings = getSettings();

    constructor() {
        super();

        this.diffy = create({
            ...this.settings.diffy,
            // magnitude seems to be 0–255 with 255 meaning "no movement", 0 meaning "chaos"
            onFrame: matrix => this.updateListeners((MOTION_MAX - minimum2d(matrix)) / MOTION_MAX),
        });
    }
}


export default function getMotion() {
    if (process.env.NODE_ENV === 'test') {
        return new BaseMotion();
    } else {
        return new BrowserMotion();
    }
}
