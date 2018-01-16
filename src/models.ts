export interface Preset {
    title: string;
    durationRange: {
        minimum: number; // inclusive (all times are seconds)
        maximum: number; // exclusive
    };
    penaltyRange: {
        minimum: number;
        maximum: number;
    };

    /**
     * 0.1–1.0, per consecutive violation.
     * first violation uses penaltyProbabilities[0], the next uses penaltyProbabilities[1] and so on.
     * last element used when exhausted.
     */
    penaltyProbabilities: number[];

    // TODO Make per phrase tunable?
    // TODO Introduce different kinds of encouragements for different parts?
    encouragementProbability: number;

    phrases: Phrases;
}


export const defaultPreset: Preset = {
    title: 'Default',
    durationRange: {
        minimum: 600,
        maximum: 900,
    },
    penaltyRange: {
        minimum: 60,
        maximum: 180,
    },

    // first violation will trigger a scold, subsequent ones will trigger penalties
    penaltyProbabilities: [0.0, 1.0],

    encouragementProbability: 0.1,
    phrases: {
        getReady: [
            `You have been naughty. Get in the corner, facing the wall.`,
        ],
        start: [
            `You better not move. I'm starting your punishment now.`,
        ],
        encourage: [
            `You're doing fine. Keep it up and this will be over in no time.`,
        ],
        scold: [
            `Do I see you moving?`,
        ],
        penalize: [
            `I warned you not to move. I'm adding some more minutes in the clock.`,
        ],
        end: [
            `You can come out of the corner now.`
        ],
    }
};


export interface Phrases {
    getReady: string[];
    start: string[];
    encourage: string[];
    scold: string[];
    penalize: string[];
    end: string[];
}


export type State = 'waiting' | 'preparation' | 'punishment' | 'cooldown' | 'finished';
export const allStates: State[] = ['waiting', 'preparation', 'punishment', 'cooldown', 'finished'];
export type EventType = 'getReady' | 'start' |  'scold' | 'encourage' | 'penalize' | 'end';


export interface Event {
    eventType: EventType;
    time: number;
    adjustment: number;
}


export interface Report {
    name: string;
    presetTitle: string;
    initialDuration: number;
    totalDuration: number;
    startedAt: string; // ISO-8601 timestamp
    events: Event[];
    violations: number; // equals the number of total scold and penalize events
}
