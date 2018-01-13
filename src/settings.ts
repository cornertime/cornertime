import { Settings } from './models';


const defaultSettings: Settings = {
    name: 'Anonymous',
    threshold: 0.1,
}


export default function getSettings(): Settings {
    if (typeof localStorage !== 'undefined') {
        const storedSettings = localStorage.getItem('settings');
        if (storedSettings) {
            return JSON.parse(storedSettings);
        }
    }

    return defaultSettings;
}
