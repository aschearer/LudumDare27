/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>

module views.states {

    export class LocalGame implements IState {

        public id: string = "views.states.LocalGame";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.LocalGame;

        constructor(datacontext: viewmodels.states.LocalGame) {
            this.datacontext = datacontext;
            this.layer  = <HTMLDivElement>document.getElementById('game-layer');
        }

        public enter(previousState: IState) {
            this.layer.onclick = (event) => {
                this.datacontext.goBack();
            };
        }

        public exit(nextState: IState) {
            this.layer.onclick = null;
        }
    }
}