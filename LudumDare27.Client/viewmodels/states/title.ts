/// <reference path="istate.ts"/>
/// <reference path="localGame.ts"/>

module viewmodels.states {

    export class Title implements IState {

        public id: string = "viewmodels.states.Title";

        public stateChanged: Signal = new Signal();

        public enter() {
        }

        public exit() {
        }

        public onPlayGame() {
            this.stateChanged.dispatch(new LocalGame());
        }
    }
}