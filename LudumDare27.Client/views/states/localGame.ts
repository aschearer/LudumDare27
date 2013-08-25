/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/localGame.ts"/>
/// <reference path="../../libs/typings/easeljs/easeljs.d.ts" />

module views.states {

    interface ISubState {
        datacontext: viewmodels.states.LocalGame;
        layer: HTMLCanvasElement;
        stage: createjs.Stage;

        enter();
        exit();
    }

    class ChoosePlayerSubState implements ISubState {
        public id: string = "views.states.ChoosePlayerSubState";
        public datacontext: viewmodels.states.LocalGame;
        public layer: HTMLCanvasElement;
        public stage: createjs.Stage;

        private playerId: number;

        constructor(playerId) {
            this.onCanvasClick = this.onCanvasClick.bind(this);
            this.playerId = playerId;
        }

        public enter() {
            this.layer.addEventListener('click', this.onCanvasClick);
            var text = new createjs.Text("Player " + this.playerId + ", click when ready");
            text.x = 100;
            text.y = 100;
            this.stage.addChild(text);
            this.stage.update();
        }

        public exit() {
            this.layer.removeEventListener('click', this.onCanvasClick);
        }

        private onCanvasClick() {
            this.datacontext.PlayerReady();
        }
    }

    class ChooseHandSubState implements ISubState {
        public id: string = "views.states.ChooseHandSubState";
        public datacontext: viewmodels.states.LocalGame;
        public layer: HTMLCanvasElement;
        public stage: createjs.Stage;

        private commitEnabled: boolean = false;

        constructor() {
            this.onCanvasClick = this.onCanvasClick.bind(this);
        }

        public enter() {
            this.layer.addEventListener('click', this.onCanvasClick);
            var text = new createjs.Text("Choose Hand");
            text.x = 100;
            text.y = 100;
            this.stage.addChild(text);
            this.stage.update();
            this.datacontext.showCanCommit.add(this.onShowCanCommit, this);
        }

        public exit() {
            this.layer.removeEventListener('click', this.onCanvasClick);
            this.datacontext.showCanCommit.remove(this.onShowCanCommit, this);
        }

        private onShowCanCommit(enable: boolean) {
            this.commitEnabled = enable;
            var text = new createjs.Text("Click to Commit");
            text.x = 100;
            text.y = 200;
            this.stage.addChild(text);
            this.stage.update();
        }

        private onCanvasClick() {
            if (this.commitEnabled) {
                this.datacontext.CommitHat();
            } else {
                this.datacontext.AddBetToHat(models.entities.BetType.Down);
                this.datacontext.AddBetToHat(models.entities.BetType.Down);
                this.datacontext.AddBetToHat(models.entities.BetType.Left);
                this.datacontext.AddBetToHat(models.entities.BetType.Left);
                this.datacontext.AddBetToHat(models.entities.BetType.Up);
            }
        }
    }

    class ChooseBetsSubState implements ISubState {
        public id: string = "views.states.ChooseBetsSubState";
        public datacontext: viewmodels.states.LocalGame;
        public layer: HTMLCanvasElement;
        public stage: createjs.Stage;

        private betsTaken: number;

        constructor(betsTaken: number) {
            this.onCanvasClick = this.onCanvasClick.bind(this);
            this.betsTaken = betsTaken;
        }

        public enter() {
            this.layer.addEventListener('click', this.onCanvasClick);
            var text = new createjs.Text("Choose Bets (" + this.betsTaken + ")");
            text.x = 100;
            text.y = 100;
            this.stage.addChild(text);
            this.stage.update();
            this.datacontext.showReady.add(this.onShowReady, this);
        }

        public exit() {
            this.layer.removeEventListener('click', this.onCanvasClick);
            this.datacontext.showReady.remove(this.onShowReady, this);
        }

        private onShowReady(playerId: number) {
        }

        private onCanvasClick() {
            this.datacontext.MakeBet(0, models.entities.BetType.Down);
            this.datacontext.MakeBet(1, models.entities.BetType.Left);
        }
    }

    class TurnResultSubState implements ISubState {
        public id: string = "views.states.TurnResultSubState";
        public datacontext: viewmodels.states.LocalGame;
        public layer: HTMLCanvasElement;
        public stage: createjs.Stage;

        private betsTaken: number;

        constructor(betsTaken: number) {
            this.onCanvasClick = this.onCanvasClick.bind(this);
            this.betsTaken = betsTaken;
        }

        public enter() {
            this.layer.addEventListener('click', this.onCanvasClick);
            var text = new createjs.Text("Winner of (" + this.betsTaken + ") is ");
            text.x = 100;
            text.y = 100;
            this.stage.addChild(text);
            this.stage.update();
        }

        public exit() {
            this.layer.removeEventListener('click', this.onCanvasClick);
        }

        private onCanvasClick() {
            this.datacontext.AdvanceGame();
        }
    }

    class GameOverSubState implements ISubState {
        public id: string = "views.states.GameOverSubState";
        public datacontext: viewmodels.states.LocalGame;
        public layer: HTMLCanvasElement;
        public stage: createjs.Stage;

        constructor() {
            this.onCanvasClick = this.onCanvasClick.bind(this);
        }

        public enter() {
            this.layer.addEventListener('click', this.onCanvasClick);
            var text = new createjs.Text("Game Over");
            text.x = 100;
            text.y = 100;
            this.stage.addChild(text);
            this.stage.update();
        }

        public exit() {
            this.layer.removeEventListener('click', this.onCanvasClick);
        }

        private onCanvasClick() {
            this.datacontext.EndGame();
        }
    }

    export class LocalGame implements IState {

        public id: string = "views.states.LocalGame";

        public layer: HTMLCanvasElement;

        private datacontext: viewmodels.states.LocalGame;
        private stage: createjs.Stage;
        private currentSubState: ISubState;
        private betsTaken: number = 0;

        constructor(datacontext: viewmodels.states.LocalGame) {
            this.datacontext = datacontext;
            this.layer  = <HTMLCanvasElement>document.getElementById('game-layer');
            this.stage = new createjs.Stage(this.layer);
        }

        public enter(previousState: IState) {
            createjs.Ticker.addEventListener('tick', this.onTick);
            this.datacontext.showSubState.add(this.onShowSubState, this);
            this.datacontext.StartGame();
        }

        public exit(nextState: IState) {
            createjs.Ticker.removeEventListener('tick', this.onTick);
            this.datacontext.showSubState.remove(this.onShowSubState, this);
        }

        private onTick = (tickEvent: createjs.TickerEvent) => {
            //this.datacontext.update(tickEvent.delta);
        }

        private onShowSubState(subState: string, playerId: number) {
            if (this.currentSubState) {
                this.currentSubState.exit();
                this.currentSubState = null;
                this.stage.clear();
                this.stage.removeAllChildren();
            }
            var newState = null;
            switch (subState) {
                case "choosePlayer":
                    newState = new ChoosePlayerSubState(playerId);
                    break;
                case "chooseHand":
                    newState = new ChooseHandSubState();
                    break;
                case "chooseBets":
                    ++this.betsTaken;
                    newState = new ChooseBetsSubState(this.betsTaken);
                    break;
                case "turnResult":
                    newState = new TurnResultSubState(this.betsTaken);
                    break;
                case "gameOver":
                    newState = new GameOverSubState();
                    break;
            }

            this.currentSubState = newState;
            newState.datacontext = this.datacontext;
            newState.layer = this.layer;
            newState.stage = this.stage;
            newState.enter();
        }
    }
}