import PunishmentStateMachine from '../state';
import * as React from 'react';
import { TextField, SecondsField, ProbabilityField, MultiLineField } from '../forms';
import { serializePreset } from '../serialization';


interface PunishmentSetupProps {
    fsm: PunishmentStateMachine;
    onBack(): void;
}

interface PunishmentSetupState {
    title: string;
    minimumDuration: number;
    maximumDuration: number;
    minimumPenalty: number;
    maximumPenalty: number;
    encouragementProbability: number;

    penaltyProbabilities: number[];
    rawPenaltyProbabilities: string;

    getReadyPhrases: string[];
    rawGetReadyPhrases: string;

    startPhrases: string[];
    rawStartPhrases: string;

    encouragePhrases: string[];
    rawEncouragePhrases: string;

    scoldPhrases: string[];
    rawScoldPhrases: string;

    penalizePhrases: string[];
    rawPenalizePhrases: string;

    endPhrases: string[];
    rawEndPhrases: string;
}


export default class PunishmentSetup extends React.Component<PunishmentSetupProps, PunishmentSetupState> {
    constructor(props: PunishmentSetupProps) {
        super(props);

        const preset = props.fsm.preset;

        this.state = {
            title: preset.title === 'Default Punishment' ? 'Custom Punishment' : preset.title,
            minimumDuration: preset.durationRange.minimum,
            maximumDuration: preset.durationRange.maximum,
            minimumPenalty: preset.penaltyRange.minimum,
            maximumPenalty: preset.penaltyRange.maximum,
            encouragementProbability: preset.encouragementProbability,
            penaltyProbabilities: preset.penaltyProbabilities,
            rawPenaltyProbabilities: preset.penaltyProbabilities.map(p => '' + p).join(' '),

            getReadyPhrases: preset.phrases.getReady,
            rawGetReadyPhrases: preset.phrases.getReady.join('\n'),

            startPhrases: preset.phrases.start,
            rawStartPhrases: preset.phrases.start.join('\n'),

            encouragePhrases: preset.phrases.encourage,
            rawEncouragePhrases: preset.phrases.encourage.join('\n'),

            scoldPhrases: preset.phrases.scold,
            rawScoldPhrases: preset.phrases.scold.join('\n'),

            penalizePhrases: preset.phrases.penalize,
            rawPenalizePhrases: preset.phrases.penalize.join('\n'),

            endPhrases: preset.phrases.end,
            rawEndPhrases: preset.phrases.end.join('\n'),
        };
    }

    render() {
        return (
            <div className="container my-4">
                <h2>Design a Custom Punishment</h2>

                <form onSubmit={this.start} className="form">
                    <div className="row mt-3 mb-5">
                        <div className="col-md-10">
                            <button className="btn btn-primary btn-block btn-lg" type="submit">
                                Start the Custom Punishment Now
                            </button>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-secondary btn-block btn-lg" onClick={this.props.onBack}>
                                Back
                            </button>
                        </div>
                    </div>

                    <TextField
                        name="title"
                        label="Title of the custom punishment"
                        helpText="This is the only field that will be disclosed to the receiver before punishment."
                        value={this.state.title}
                        onChange={this.onChangeText}
                    />

                    <SecondsField
                        name="minimumDuration"
                        label="Minimum duration (seconds)"
                        value={this.state.minimumDuration}
                        onChange={this.onChangeNumeric}
                    />

                    <SecondsField
                        name="maximumDuration"
                        label="Maximum duration (seconds)"
                        helpText="The duration of the punishment will be picked randomly within these bounds."
                        value={this.state.maximumDuration}
                        onChange={this.onChangeNumeric}
                    />

                    {/* TODO Richer field type */}
                    <TextField
                        name="penaltyProbabilities"
                        label="Penalty probabilities"
                        helpText={`Probability of penalty for each consecutive movement violation, separated by
                                   whitespace. The first violation will use the first value, the second violation
                                   will use the second value and so on until values run out, after which the last
                                   value is used for any subsequent violations.`}
                        value={this.state.rawPenaltyProbabilities}
                        onChange={this.onChangePenaltyProbabilities}
                    />

                    <SecondsField
                        name="minimumPenalty"
                        label="Minimum penalty (seconds)"
                        value={this.state.minimumPenalty}
                        onChange={this.onChangeNumeric}
                    />

                    <SecondsField
                        name="maximumPenalty"
                        label="Maximum penalty (seconds)"
                        value={this.state.maximumPenalty}
                        onChange={this.onChangeNumeric}
                        helpText={`When a penalty is given for moving, the time adjustment will be picked randomly
                                   within these bounds.`}
                    />

                    <ProbabilityField
                        name="encouragementProbability"
                        label="Encouragement probability"
                        value={this.state.encouragementProbability}
                        onChange={this.onChangeNumeric}
                        helpText={`At each full minute, there is a chance of receiving encouragement in the form of
                                   one of the encouragement phrases. This field controls that probability.`}
                    />

                    <MultiLineField
                        name="getReadyPhrases"
                        label="Get Ready phrases"
                        helpText={`One of these phrases will be spoken at random at the start of the preparation delay,
                                   during which the person being punished is supposed to walk to the corner and assume
                                   a position they can hold for the remainder of the punishment. One phrase per line.`}
                        value={this.state.rawGetReadyPhrases}
                        onChange={this.onChangePhrases}
                    />

                    <MultiLineField
                        name="startPhrases"
                        label="Starting phrases"
                        helpText={`One of these phrases will be spoken at random at the start of the punishment.
                                   One phrase per line.`}
                        value={this.state.rawStartPhrases}
                        onChange={this.onChangePhrases}
                    />

                    <MultiLineField
                        name="scoldPhrases"
                        label="Scolding phrases"
                        helpText={`One of these phrases will be spoken at random when movement has been detected but
                                   a penalty has not been triggered.`}
                        value={this.state.rawScoldPhrases}
                        onChange={this.onChangePhrases}
                    />

                    <MultiLineField
                        name="penalizePhrases"
                        label="Penalty phrases"
                        helpText={`One of these phrases will be spoken at random when movement has been detected and
                                   a penalty has been triggered.`}
                        value={this.state.rawPenalizePhrases}
                        onChange={this.onChangePhrases}
                    />

                    <MultiLineField
                        name="encouragePhrases"
                        label="Encouragement phrases"
                        helpText={`One of these phrases may be spoken at random at any full minute as specified by the
                                   encouragement probability.`}
                        value={this.state.rawEncouragePhrases}
                        onChange={this.onChangePhrases}
                    />

                    <MultiLineField
                        name="endPhrases"
                        label="Ending phrases"
                        helpText={`One of these phrases will be spoken at random when the punishment is finished.`}
                        value={this.state.rawEndPhrases}
                        onChange={this.onChangePhrases}
                    />
                </form>

                <p className="mt-5">
                    To have someone else use this preset without seeing its content, give this to them and instruct
                    them to use the "I Have a Custom Punishment" link from the welcome screen.
                </p>

                <pre>{this.serializedPreset}</pre>
            </div>
        );
    }

    start = (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fsm = this.props.fsm;

        fsm.loadPreset(this.preset);
        fsm.getReady();
    }

    public get preset() {
        return {
            title: this.state.title,
            durationRange: {
                minimum: this.state.minimumDuration,
                maximum: this.state.maximumDuration,
            },
            penaltyProbabilities: this.state.penaltyProbabilities,
            penaltyRange: {
                minimum: this.state.minimumPenalty,
                maximum: this.state.maximumPenalty,
            },
            encouragementProbability: this.state.encouragementProbability,
            phrases: {
                getReady: this.state.getReadyPhrases,
                start: this.state.startPhrases,
                scold: this.state.scoldPhrases,
                penalize: this.state.penalizePhrases,
                encourage: this.state.encouragePhrases,
                end: this.state.endPhrases,
            }
        };
    }

    public get serializedPreset() {
        return serializePreset(this.preset);
    }

    onChangeNumeric = (event: React.FormEvent<HTMLInputElement>) => {
        const name = event.currentTarget.name;
        const value = parseFloat(event.currentTarget.value);
        const stateChange: any = { [name]: value };

        this.setState(stateChange);
    }

    onChangeText = (event: React.FormEvent<HTMLInputElement>) => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        const stateChange: any = { [name]: value };

        this.setState(stateChange);
    }

    onChangePenaltyProbabilities = (event: React.FormEvent<HTMLInputElement>) => {
        const rawValue = event.currentTarget.value;
        const stateChange: any = { rawPenaltyProbabilities: rawValue };

        try {
            stateChange.penaltyProbabilities = rawValue.split(/\s+/).map(parseFloat);
        } catch (e) {
            // noop
        }

        this.setState(stateChange);
    }

    onChangePhrases = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const name = event.currentTarget.name;

        const rawName = `raw${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        const rawValue = event.currentTarget.value;

        const phrases = rawValue.split('\n').map(s => s.trim());

        const stateChange: any = {
            [name]: phrases,
            [rawName]: rawValue,
        };

        this.setState(stateChange);
    }
}
