/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>

module views.states {

    export class LocalGame implements IState {

        public id: string = "views.states.LocalGame";

        private datacontext: viewmodels.states.LocalGame;
        private root: HTMLDivElement;

        constructor(datacontext: viewmodels.states.LocalGame) {
            this.datacontext = datacontext;
            this.root = <HTMLDivElement>document.getElementById('game-view');
        }

        public enter(previousState: IState) {

        }

        public exit(nextState: IState) {
        }
    }
}