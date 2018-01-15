export interface Settings {
    /**
     * Diffy returns us a NxM matrix. We take maximum movement of that and average it over 1s.
     * This is the threshold between 0.0 and 1.0 that average must cross in order to be considered
     * movement.
     */
    threshold: number; // between 0.0–1.0
    name: string;
    preparationSeconds: number;
    cooldownSeconds: number;

    /**
     * These parameters are given as-is to diffy.js, the movement detection library.
     */
    diffy: {
        /**
         * any number between 0 and 255 can be used. But ahem magic numbers are around 20 and 25.
         * Experiment with this. This parameter defines the minimum average value that registers
         * as "movement" for Diffy.js
         */
        threshold: number;

        /**
         * sensitivity (number) [default: 0.2] - a decimal value between 0 and 1. It impacts the
         * contrast of the blended image. Somewhere around 0.2 is usually good. yay magic numbers!
         */
        sensitivity: number;

        /**
         * defines the dimensions for the source frame. Keep in mind that the larger the dimensions,
         * the more pixels Diffy.js needs to examine, hence the lower the performance.
         */
        sourceDimensions: {
            w: number;
            h: number;
        };

        /**
         * defines the size of the output matrix. generally a denser output matrix makes us notice
         * smaller movement (note ../threshold though).
         */
        resolution: {
            x: number;
            y: number;
        };

        /**
         * Show or hide the debug window
         */
        debug: boolean;
    };
}


const defaultSettings: Settings = {
    name: 'Anonymous',
    threshold: 0.3,
    preparationSeconds: 10,
    cooldownSeconds: 5,
    diffy: {
        resolution: { x: 10, y: 10 },
        sensitivity: 0.2,
        threshold: 21,
        sourceDimensions: { w: 130, h: 100 },
        // debug: process.env.NODE_ENV !== 'production',
        debug: false,
    },
};


export default function getSettings(): Settings {
    if (typeof localStorage !== 'undefined') {
        const storedSettings = localStorage.getItem('settings');
        if (storedSettings) {
            return JSON.parse(storedSettings);
        }
    }

    return defaultSettings;
}
