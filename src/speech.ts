import { randomElement } from './random';


function getDefaultVoice() {
    return (new SpeechSynthesisUtterance('Hello, World!')).voice;
}


export interface Speech {
    voice: any;
    speak(phrase: string, context: object): void;
    speakRandomPhrase(phrases: string[], context: object): void;
}


export class BrowserSpeech implements Speech {
    voice: SpeechSynthesisVoice = getDefaultVoice();

    speak(phrase: string, context: object) {
        // TODO render template
        const utter = new SpeechSynthesisUtterance(phrase);
        utter.voice = this.voice;
        speechSynthesis.speak(utter);
    }

    speakRandomPhrase(phrases: string[], context: object) {
        const phrase = randomElement(phrases);
        this.speak(phrase, context);
    }
}


export class MockSpeech {
    voice: any = null;
    transcript: string[] = [];

    reset() {
        this.transcript = [];
    }

    speak(phrase: string, context: object) {
        // TODO render template
        this.transcript.push(phrase);
    }

    speakRandomPhrase(phrases: string[], context: object) {
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
