/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/gameOver.ts"/>

module views.states {

    export class GameOver implements IState {

        public id: string = "views.states.GameOver";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.GameOver;

        constructor(datacontext: viewmodels.states.GameOver) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('game-over-layer');


            var messageElement: HTMLDivElement = <HTMLDivElement>document.getElementById('game-over-text');
            var winner: string = this.datacontext.GetWinningPlayerName();
            var message = "";
            if (winner) {
                message = winner + " Wins";
            } else {
                message = "It's a Draw";
            }

            messageElement.innerText = message;
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
