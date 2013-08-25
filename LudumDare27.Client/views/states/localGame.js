var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    /// <reference path="../../libs/typings/easeljs/easeljs.d.ts" />
    (function (states) {
        var ChoosePlayerSubState = (function () {
            function ChoosePlayerSubState(playerId) {
                this.id = "views.states.ChoosePlayerSubState";
                this.onCanvasClick = this.onCanvasClick.bind(this);
                this.playerId = playerId;
            }
            ChoosePlayerSubState.prototype.enter = function () {
                this.layer.addEventListener('click', this.onCanvasClick);
                var text = new createjs.Text("Player " + this.playerId + ", click when ready");
                text.x = 100;
                text.y = 100;
                this.stage.addChild(text);
                this.stage.update();
            };

            ChoosePlayerSubState.prototype.exit = function () {
                this.layer.removeEventListener('click', this.onCanvasClick);
            };

            ChoosePlayerSubState.prototype.onCanvasClick = function () {
                this.datacontext.PlayerReady();
            };
            return ChoosePlayerSubState;
        })();

        var ChooseHandSubState = (function () {
            function ChooseHandSubState() {
                this.id = "views.states.ChooseHandSubState";
                this.commitEnabled = false;
                this.onCanvasClick = this.onCanvasClick.bind(this);
            }
            ChooseHandSubState.prototype.enter = function () {
                this.layer.addEventListener('click', this.onCanvasClick);
                var text = new createjs.Text("Choose Hand");
                text.x = 100;
                text.y = 100;
                this.stage.addChild(text);
                this.stage.update();
                this.datacontext.showCanCommit.add(this.onShowCanCommit, this);
            };

            ChooseHandSubState.prototype.exit = function () {
                this.layer.removeEventListener('click', this.onCanvasClick);
                this.datacontext.showCanCommit.remove(this.onShowCanCommit, this);
            };

            ChooseHandSubState.prototype.onShowCanCommit = function (enable) {
                this.commitEnabled = enable;
                var text = new createjs.Text("Click to Commit");
                text.x = 100;
                text.y = 200;
                this.stage.addChild(text);
                this.stage.update();
            };

            ChooseHandSubState.prototype.onCanvasClick = function () {
                if (this.commitEnabled) {
                    this.datacontext.CommitHat();
                } else {
                    this.datacontext.AddBetToHat(models.entities.BetType.Down);
                    this.datacontext.AddBetToHat(models.entities.BetType.Down);
                    this.datacontext.AddBetToHat(models.entities.BetType.Left);
                    this.datacontext.AddBetToHat(models.entities.BetType.Left);
                    this.datacontext.AddBetToHat(models.entities.BetType.Up);
                }
            };
            return ChooseHandSubState;
        })();

        var ChooseBetsSubState = (function () {
            function ChooseBetsSubState(betsTaken) {
                this.id = "views.states.ChooseBetsSubState";
                this.onCanvasClick = this.onCanvasClick.bind(this);
                this.betsTaken = betsTaken;
            }
            ChooseBetsSubState.prototype.enter = function () {
                this.layer.addEventListener('click', this.onCanvasClick);
                var text = new createjs.Text("Choose Bets (" + this.betsTaken + ")");
                text.x = 100;
                text.y = 100;
                this.stage.addChild(text);
                this.stage.update();
                this.datacontext.showReady.add(this.onShowReady, this);
            };

            ChooseBetsSubState.prototype.exit = function () {
                this.layer.removeEventListener('click', this.onCanvasClick);
                this.datacontext.showReady.remove(this.onShowReady, this);
            };

            ChooseBetsSubState.prototype.onShowReady = function (playerId) {
            };

            ChooseBetsSubState.prototype.onCanvasClick = function () {
                this.datacontext.MakeBet(0, models.entities.BetType.Down);
                this.datacontext.MakeBet(1, models.entities.BetType.Left);
            };
            return ChooseBetsSubState;
        })();

        var TurnResultSubState = (function () {
            function TurnResultSubState(betsTaken) {
                this.id = "views.states.TurnResultSubState";
                this.onCanvasClick = this.onCanvasClick.bind(this);
                this.betsTaken = betsTaken;
            }
            TurnResultSubState.prototype.enter = function () {
                this.layer.addEventListener('click', this.onCanvasClick);
                var text = new createjs.Text("Winner of (" + this.betsTaken + ") is ");
                text.x = 100;
                text.y = 100;
                this.stage.addChild(text);
                this.stage.update();
            };

            TurnResultSubState.prototype.exit = function () {
                this.layer.removeEventListener('click', this.onCanvasClick);
            };

            TurnResultSubState.prototype.onCanvasClick = function () {
                this.datacontext.AdvanceGame();
            };
            return TurnResultSubState;
        })();

        var GameOverSubState = (function () {
            function GameOverSubState() {
                this.id = "views.states.GameOverSubState";
                this.onCanvasClick = this.onCanvasClick.bind(this);
            }
            GameOverSubState.prototype.enter = function () {
                this.layer.addEventListener('click', this.onCanvasClick);
                var text = new createjs.Text("Game Over");
                text.x = 100;
                text.y = 100;
                this.stage.addChild(text);
                this.stage.update();
            };

            GameOverSubState.prototype.exit = function () {
                this.layer.removeEventListener('click', this.onCanvasClick);
            };

            GameOverSubState.prototype.onCanvasClick = function () {
                this.datacontext.EndGame();
            };
            return GameOverSubState;
        })();

        var LocalGame = (function () {
            function LocalGame(datacontext) {
                this.id = "views.states.LocalGame";
                this.betsTaken = 0;
                this.onTick = function (tickEvent) {
                    //this.datacontext.update(tickEvent.delta);
                };
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-layer');
                this.stage = new createjs.Stage(this.layer);
            }
            LocalGame.prototype.enter = function (previousState) {
                createjs.Ticker.addEventListener('tick', this.onTick);
                this.datacontext.showSubState.add(this.onShowSubState, this);
                this.datacontext.StartGame();
            };

            LocalGame.prototype.exit = function (nextState) {
                createjs.Ticker.removeEventListener('tick', this.onTick);
                this.datacontext.showSubState.remove(this.onShowSubState, this);
            };

            LocalGame.prototype.onShowSubState = function (subState, playerId) {
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
            };
            return LocalGame;
        })();
        states.LocalGame = LocalGame;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=localGame.js.map
