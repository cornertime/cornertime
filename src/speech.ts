import { randomElement } from './random';


export interface Speech {
    speak(phrase: string, context: object): void;
    speakRandomPhrase(phrases: string[], context: object): void;
}


export class BrowserSpeech implements Speech {
    // TODO voice selection

    speak(phrase: string, context: object) {
        // TODO render template
        const utter = new SpeechSynthesisUtterance(phrase);
        speechSynthesis.speak(utter);
    }

    speakRandomPhrase(phrases: string[], context: object) {
        const phrase = randomElement(phrases);
        this.speak(phrase, context);
    }
}


export class MockSpeech {
    transcript: string[] = [];

    reset() {
        this.transcript = [];
    }

    speak(phrase: string, context: object) {
        // TODO render template
        this.transcript.push(phrase);
    }

    speakRandomPhrase(phrases: string[], context: object) {
        if (phrases.length === 0) {
            return;
        }

        const phrase = randomElement(phrases);
        this.speak(phrase, context);
    }
}


export default function getSpeech(env: string = process.env.NODE_ENV!): Speech {
    if (env === 'test') {
        return new MockSpeech();
    } else {
        return new BrowserSpeech();
    }
}
