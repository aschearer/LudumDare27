/// <reference path="istate.ts"/>
/// <reference path="chooseHand.ts"/>

module viewmodels.states {

    export class Duel implements IState {

        public id: string = "viewmodels.states.Duel";

        public stateChanged: Signal = new Signal();

        public enter() {
        }

        public exit() {
        }

        public goBack() {
            this.stateChanged.dispatch(null);
        }
    }
}