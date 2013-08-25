/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/changingPlayer.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>

module views.states {

    export class ChangingPlayer implements IState {

        public id: string = "views.states.ChangingPlayer";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.ChangingPlayer;

        constructor(datacontext: viewmodels.states.ChangingPlayer) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('player-ready-layer');

            var message: HTMLDivElement = <HTMLDivElement>document.getElementById('player-ready-text');
            message.innerText = this.datacontext.GetCurrentPlayerName() + "'s Turn";
        }

        public enter(previousState: IState) {
            this.layer.onclick = (event) => {
                this.datacontext.playerReady();
            };
        }

        public exit(nextState: IState) {
            this.layer.onclick = null;
        }
    }
}
