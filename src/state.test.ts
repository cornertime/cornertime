import * as assert from 'assert';
import PunishmentStateMachine from './state';
import { State, allStates } from './models';


describe('PunishmentStateMachine', () => {
    describe('getReady', () => {
        it('(waiting) instantiates the punishment and enters preparation', () => {
            const sm = new PunishmentStateMachine();
            sm.getReady();
            assert.equal(sm.state, 'preparation');
            assert.equal(sm.events[0].eventType, 'getReady');
        });

        it('(any other state) complains loudly', () => {
            allStates.forEach((state) => {
                if (state === 'waiting') {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                assert.throws(() => { sm.getReady(); });
            });
        });
    });

    describe('start', () => {
        it('(preparation) starts the punishment', () => {
            const sm = new PunishmentStateMachine();
            sm.getReady();
            sm.start();
            assert.equal(sm.state, 'punishment');
            assert.equal(sm.events[0].eventType, 'getReady');
            assert.equal(sm.events[1].eventType, 'start');
        });

        it('(any other state) complains loudly', () => {
            allStates.forEach((state) => {
                if (state === 'preparation') {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                assert.throws(() => { sm.start(); });
            });
        });
    });

    describe('scold', () => {
        it('(punishment) scolds and enters cooldown', () => {
            const sm = new PunishmentStateMachine('punishment');
            sm.scold();
            assert.equal(sm.state, 'cooldown');
            assert.equal(sm.events[0].eventType, 'scold');
        });

        it('(any other state) complains loudly', () => {
            allStates.forEach((state) => {
                if (state === 'punishment') {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                assert.throws(() => { sm.scold(); });
            });
        });
    });

    describe('encourage', () => {
        it('(punishment) gives encouragement', () => {
            const sm = new PunishmentStateMachine('punishment');
            sm.encourage();
            assert.equal(sm.events[0].eventType, 'encourage');
        });

        it('(any other state) complains loudly', () => {
            allStates.forEach((state) => {
                if (state === 'punishment') {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                assert.throws(() => { sm.encourage(); });
            });
        });
    });

    describe('penalize', () => {
        it('(punishment) raises the total duration and enters cooldown', () => {
            const sm = new PunishmentStateMachine('punishment');
            assert.equal(sm.totalDuration, sm.initialDuration);
            sm.penalize();
            assert(sm.totalDuration > sm.initialDuration);
            assert.equal(sm.state, 'cooldown');
            assert.equal(sm.events[0].eventType, 'penalize');
        });

        it('(any other state) complains loudly', () => {
            allStates.forEach((state) => {
                if (state === 'punishment') {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                assert.throws(() => { sm.penalize(); });
            });
        });
    });

    describe('end', () => {
        it('(punishment, cooldown) ends the punishment', () => {
            const states: State[] = ['punishment', 'cooldown'];
            states.forEach((state) => {
                const sm = new PunishmentStateMachine(state);
                sm.end();
                assert(sm.state === 'finished');
            });
        });

        it('(any other state) complains loudly', () => {
            allStates.forEach((state) => {
                if (state === 'punishment' || state === 'cooldown') {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                assert.throws(() => { sm.end(); });
            });
        });
    });

    describe('movementDetected', () => {
        it('(punishment) either scolds or penalizes, depending on luck', () => {
            // default preset: always scold at the first time, always penalize after that
            const sm = new PunishmentStateMachine('punishment');
            sm.movementDetected();
            sm.cooldownFinished();
            sm.movementDetected();
            sm.cooldownFinished();
            sm.movementDetected();

            assert.equal(sm.events.length, 3);
            assert.equal(sm.events[0].eventType, 'scold');
            assert.equal(sm.events[1].eventType, 'penalize');
            assert.equal(sm.events[2].eventType, 'penalize');
        });

        it('(cooldown) does nothing until cooldown has been finished', () => {
            const sm = new PunishmentStateMachine('punishment');
            sm.movementDetected();
            sm.movementDetected(); // this should not cause an event
            sm.cooldownFinished();
            sm.movementDetected();

            assert(sm.totalDuration > sm.initialDuration);
            assert.equal(sm.events.length, 2);
            assert.equal(sm.events[0].eventType, 'scold');
            assert.equal(sm.events[1].eventType, 'penalize');
        });

        it('(any other state) does nothing', () => {
            allStates.forEach((state) => {
                if (state === 'punishment') {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                sm.movementDetected();
                assert.equal(sm.events.length, 0);
            });
        });
    });

    describe('tick', () => {
        it('(preparation) starts the punishment at t=0', () => {
            const sm = new PunishmentStateMachine('preparation');

            sm.tick();
            assert.equal(sm.state, 'preparation');

            sm.currentTime = 0 - 1;
            sm.tick();
            assert.equal(sm.state, 'punishment');
        });

        it('(punishment, cooldown) ends the punishment when the total time has been reached', () => {
            const states: State[] = ['punishment', 'cooldown'];
            states.forEach((initialState) => {
                const sm = new PunishmentStateMachine(initialState);
                sm.totalDuration = 300;
                sm.cooldownEndTime = 310;

                sm.currentTime = 290;
                sm.tick();
                assert.equal(sm.state, initialState);

                sm.currentTime = sm.totalDuration - 1;
                sm.tick();
                assert.equal(sm.state, 'finished');
            });
        });

        it('(cooldown) ends the cooldown when the cooldown end has been reached', () => {
            const sm = new PunishmentStateMachine('cooldown');
            sm.totalDuration = 300;
            sm.cooldownEndTime = 290;

            sm.currentTime = sm.cooldownEndTime - 1;
            sm.tick();
            assert.equal(sm.state, 'punishment');
        });

        it('(any other state) complains loudly', () => {
            allStates.forEach((state) => {
                if (['preparation', 'punishment', 'cooldown'].indexOf(state) >= 0) {
                    return;
                }

                const sm = new PunishmentStateMachine(state);
                assert.throws(() => sm.tick());
            });
        });
    });

    it('eventually finishes', () => {
        const sm = new PunishmentStateMachine();
        sm.getReady();
        while (sm.state !== 'finished') {
            sm.tick();
        }
    });
});
