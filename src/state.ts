import { Preset, Event, EventType, State, defaultPreset } from './models';
import { randomInteger } from './random';
import getSpeech from './speech';
import getSettings from './settings';


export type Listener = () => void;

const PREPARATION_SECONDS = 10;
const COOLDOWN_SECONDS = 5;


export default class PunishmentStateMachine {
    preset: Preset = defaultPreset;
    initialDuration: number = 0;
    totalDuration: number = 0;
    startedAt: string = ''; // ISO-8601 timestamp
    events: Event[] = [];
    state: State = 'waiting';
    speech = getSpeech();
    context = {};
    settings = getSettings();
    violations = 0;
    listeners: Listener[] = [];
    currentTime = 0;
    cooldownEndTime = 0;
    timer = 0;

    public get timeLeft() {
        return this.totalDuration - this.currentTime;
    }

    /**
     * @param state For testing. Production use should always reset to 'waiting'.
     */
    constructor(state: State = 'waiting') {
        this.reset(state);
    }

    /**
     * @param state For testing. Production use should always reset to 'waiting'.
     */
    reset(state: State = 'waiting') {
        this.initialDuration = randomInteger(
            this.preset.durationRange.minimum,
            this.preset.durationRange.maximum,
        );
        this.totalDuration = this.initialDuration;
        this.startedAt = (new Date()).toISOString();
        this.events = [];
        this.state = state;
        this.context = {}; // TODO
        this.settings = getSettings();
        this.violations = 0;
        this.cooldownEndTime = 0;
        this.currentTime = -PREPARATION_SECONDS;
    }

    // BEGIN STATE TRANSITION METHODS

    getReady() {
        this.transition(['waiting'], 'preparation', 'getReady');
        this.startClock();
    }

    start() {
        this.transition(['preparation'], 'punishment', 'start');
    }

    scold() {
        this.transition(['punishment'], 'cooldown', 'scold');
    }

    penalize() {
        const range = this.preset.penaltyRange;
        const penalty = randomInteger(range.minimum, range.maximum);
        this.transition(['punishment'], 'cooldown', 'penalize', penalty);
    }

    cooldownFinished() {
        this.transition(['cooldown'], 'punishment');
    }

    end() {
        this.transition(['punishment', 'cooldown'], 'finished', 'end');
        this.stopClock();
    }

    // END STATE TRANSITION METHODS

    transition(fromStates: State[], toState: State, eventType?: EventType, adjustment: number = 0) {
        if (fromStates.indexOf(this.state) < 0) {
            throw new TypeError(`cannot go to ${toState} from ${this.state}`);
        }

        this.state = toState;
        this.totalDuration += adjustment;

        if (!eventType) {
            return;
        }

        this.events.push({
            adjustment,
            eventType,
            time: this.currentTime,
        });

        const phrases = this.preset.phrases[eventType];
        if (phrases.length > 0) {
            this.speech.speakRandomPhrase(phrases, this.context);
        }

        this.updateListeners();
    }

    updateListeners() {
        this.listeners.forEach(listener => listener());
    }

    addListener(listener: Listener) {
        this.listeners.push(listener);
    }

    removeListener(listener: Listener) {
        const idx = this.listeners.indexOf(listener);
        if (idx >= 0) {
            delete this.listeners[idx];
        }
    }

    encourage() {
        if (this.state !== 'punishment') {
            throw new TypeError(`cannot encourage in state ${this.state}`);
        }
        this.events.push({
            eventType: 'encourage',
            adjustment: 0,
            time: this.currentTime,
        });
        this.speech.speakRandomPhrase(this.preset.phrases.encourage, this.context);

        this.updateListeners();
    }

    movementDetected() {
        if (this.state !== 'punishment') {
            return;
        }

        let penaltyProbability = this.preset.penaltyProbabilities[this.violations];
        this.violations += 1;
        this.cooldownEndTime = this.currentTime + COOLDOWN_SECONDS;

        if (typeof penaltyProbability === 'undefined') {
            const lastIndex = this.preset.penaltyProbabilities.length - 1;
            penaltyProbability = this.preset.penaltyProbabilities[lastIndex];
        }

        if (Math.random() < penaltyProbability) {
            this.penalize();
        } else {
            this.scold();
        }
    }

    startClock() {
        if (process.env.NODE_ENV === 'test') {
            return;
        }

        this.timer = window.setInterval(() => this.tick(), 1000);
    }

    stopClock() {
        if (process.env.NODE_ENV === 'test') {
            return;
        }

        window.clearInterval(this.timer);
    }

    tick() {
        this.currentTime += 1;

        switch (this.state) {
            case 'preparation':
                if (this.currentTime >= 0) {
                    this.start();
                }
                break;


            case 'cooldown':
                if (this.currentTime >= this.totalDuration) {
                    this.end();
                } else if (this.currentTime >= this.cooldownEndTime) {
                    this.cooldownFinished();
                }
                break;

            case 'punishment':
                if (this.currentTime >= this.totalDuration) {
                    this.end();
                }
                break;

            case 'waiting':
            case 'finished':
            default:
                throw TypeError(`Clock should not be running in ${this.state}`);
        }

        this.updateListeners();
    }
}
