import * as React from 'react';
import PunishmentStateMachine, { Listener } from '../state';
import getSettings from '../settings';
import { create } from 'diffyjs';
import WelcomeScreen from './WelcomeScreen';
import PunishmentSetup from './PunishmentSetup';
import ReportCard from './ReportCard';

import 'bootstrap/dist/css/bootstrap.css';
import { formatDuration } from '../time';


const MOTION_MAX = 255;
type SetupScreen = 'default' | 'custom';

interface AppState {
    setupScreen: SetupScreen;
}


class App extends React.Component<{}, AppState> {
    fsm = new PunishmentStateMachine();
    settings = getSettings();
    listener: Listener;
    diffy: {};

    state: AppState = {
        setupScreen: 'default',
    };

    componentDidMount() {
        this.fsm.addListener(this.handleFsmUpdate);

        // Debug globals
        if (typeof window !== 'undefined') {
            const anyWindow: any = window;
            anyWindow.cornertime = anyWindow.cornertime || {};
            anyWindow.cornertime.fsm = this.fsm;
        }

        if (process.env.NODE_ENV !== 'test') {
            this.diffy = create({
                ...this.settings.diffy,
                onFrame: matrix => this.handleMotionUpdate(matrix),
            });
        }
    }

    componentWillUnmount() {
        this.fsm.removeListener(this.handleFsmUpdate);
    }

    render() {
        const fsm = this.fsm;

        switch (fsm.state) {
            case 'waiting':
                switch (this.state.setupScreen) {
                    case 'custom':
                        return <PunishmentSetup fsm={fsm} />;
                    default:
                        return <WelcomeScreen fsm={fsm} onCustom={this.setUpCustom} />;
                }

            case 'preparation':
                return (
                    <h1 className="display-2 my-5 text-center">
                        The punishment will start in {formatDuration(-fsm.currentTime)}.
                    </h1>
                );

            case 'punishment':
            case 'cooldown':
                return <h1 className="display-1 my-5 text-center">{formatDuration(fsm.timeLeft)}</h1>;

            case 'finished':
                return <ReportCard report={fsm.report()} />;

            default:
                return null;
        }
    }

    setUpCustom = () => this.setState({ setupScreen: 'custom' });

    handleFsmUpdate = () => {
        this.forceUpdate();
    }

    handleMotionUpdate = (matrix: number[][]) => {
        // matrix elements seem to be 0–255 with 255 meaning "no movement", 0 meaning "chaos"
        // we turn it into a a single number 0.0–1.0 by taking busiest cell
        const minValue = Math.min(...matrix.map(row => Math.min(...row)));
        const magnitude = (MOTION_MAX - minValue) / MOTION_MAX;
        // this.setState({ magnitude });
        this.fsm.handleMotionUpdate(magnitude);
    }
}

export default App;
