/// <reference path="istate.ts"/>

module viewmodels.states {

    export class Title implements IState {

        public enter() {
        }

        public exit() {
        }

        public onPlayGame() {
            console.log("Start Game");
        }
    }
}