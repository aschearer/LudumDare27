/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>
/// <reference path="../../libs/typings/easeljs/easeljs.d.ts" />

module views.states {

    export class LocalGame implements IState {

        public id: string = "views.states.LocalGame";

        public layer: HTMLCanvasElement;

        private datacontext: viewmodels.states.LocalGame;
        private stage: createjs.Stage;
        private isListeningToClick: boolean;

        constructor(datacontext: viewmodels.states.LocalGame) {
            this.datacontext = datacontext;
            this.layer  = <HTMLCanvasElement>document.getElementById('game-layer');
            this.stage = new createjs.Stage(this.layer);
            this.isListeningToClick = false;
        }

        public enter(previousState: IState) {
            createjs.Ticker.addEventListener('tick', this.onTick);
            this.datacontext.showCanCommit.add(this.onShowCanCommit, this);
            this.datacontext.showReady.add(this.onShowReady, this);
            this.datacontext.showSubState.add(this.onShowSubState, this);
            this.datacontext.StartGame();
        }

        public exit(nextState: IState) {
            if (this.isListeningToClick) {
                this.layer.removeEventListener('click', this.onCanvasClick);
                this.isListeningToClick = false;
            }
            createjs.Ticker.removeEventListener('tick', this.onTick);
            this.datacontext.showCanCommit.remove(this.onShowCanCommit, this);
            this.datacontext.showReady.remove(this.onShowReady, this);
            this.datacontext.showSubState.remove(this.onShowSubState, this);
        }

        private onCanvasClick () {
        }

        private onTick = (tickEvent: createjs.TickerEvent) => {
            //this.datacontext.update(tickEvent.delta);
        }

        private onShowCanCommit(enable: boolean) {
        }

        private onShowReady(playerId: number) {
        }

        private onShowSubState(subState: string, playerId: number) {
            switch (subState) {
                case "choosePlayer":
                    break;
                case "chooseHand":
                    break;
                case "chooseBets":
                    break;
                case "turnReady":
                    break;
                case "chooseBets":
                    break;
                case "gameOver":
                    break;
            }
            if (!this.isListeningToClick) {
                this.layer.addEventListener('click', this.onCanvasClick);
                this.isListeningToClick = true;
            }
        }
    }
}