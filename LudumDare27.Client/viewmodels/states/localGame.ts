/// <reference path="istate.ts"/>

module viewmodels.states {
    export class LocalGame implements IState {

        public id: string = "viewmodels.states.LocalGame";

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