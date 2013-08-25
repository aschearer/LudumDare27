/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/gameOver.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>

module views.states {

    export class GameOver implements IState {

        public id: string = "views.states.GameOver";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.GameOver;

        constructor(datacontext: viewmodels.states.GameOver) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('game-over-layer');
        }

        public enter(previousState: IState) {
            this.layer.onclick = (event) => {
                this.datacontext.endGame();
            };
        }

        public exit(nextState: IState) {
            this.layer.onclick = null;
        }
    }
}
