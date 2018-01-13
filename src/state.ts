import { Preset, Event, EventType, Report, Settings, State, defaultPreset } from './models';
import { randomInteger } from './random';
import getSpeech from './speech';
import getSettings from './settings';


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

    public get currentTime() {
        // XXX
        return 0;
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
    }

    // BEGIN STATE TRANSITION METHODS

    getReady() {
        this.performStateTransition(['waiting'], 'preparation', 'getReady')
    }

    start() {
        this.performStateTransition(['preparation'], 'punishment', 'start');
    }

    scold() {
        this.performStateTransition(['punishment'], 'cooldown', 'scold');
    }

    penalize() {
        const range = this.preset.penaltyRange;
        const penalty = randomInteger(range.minimum, range.maximum);
        this.performStateTransition(['punishment'], 'cooldown', 'penalize', penalty);
    }

    cooldownFinished() {
        this.performStateTransition(['cooldown'], 'punishment');
    }

    end() {
        this.performStateTransition(['punishment', 'cooldown'], 'finished', 'end');
    }

    // END STATE TRANSITION METHODS

    performStateTransition(fromStates: State[], toState: State, eventType?: EventType, adjustment: number = 0) {
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
    }

    movementDetected() {
        if (this.state !== 'punishment') {
            return;
        }

        let penaltyProbability = this.preset.penaltyProbabilities[this.violations];
        if (typeof penaltyProbability === 'undefined') {
            const lastIndex = this.preset.penaltyProbabilities.length - 1;
            penaltyProbability = this.preset.penaltyProbabilities[lastIndex];
        }

        if (Math.random() < penaltyProbability) {
            this.penalize();
        } else {
            this.scold();
        }

        this.violations += 1;
    }
}
