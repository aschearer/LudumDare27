var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    /// <reference path="../../libs/typings/easeljs/easeljs.d.ts" />
    (function (states) {
        var LocalGame = (function () {
            function LocalGame(datacontext) {
                this.id = "views.states.LocalGame";
                this.onTick = function (tickEvent) {
                    //this.datacontext.update(tickEvent.delta);
                };
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-layer');
                this.stage = new createjs.Stage(this.layer);
                this.isListeningToClick = false;
            }
            LocalGame.prototype.enter = function (previousState) {
                createjs.Ticker.addEventListener('tick', this.onTick);
                this.datacontext.showCanCommit.add(this.onShowCanCommit, this);
                this.datacontext.showReady.add(this.onShowReady, this);
                this.datacontext.showSubState.add(this.onShowSubState, this);
                this.datacontext.StartGame();
            };

            LocalGame.prototype.exit = function (nextState) {
                if (this.isListeningToClick) {
                    this.layer.removeEventListener('click', this.onCanvasClick);
                    this.isListeningToClick = false;
                }
                createjs.Ticker.removeEventListener('tick', this.onTick);
                this.datacontext.showCanCommit.remove(this.onShowCanCommit, this);
                this.datacontext.showReady.remove(this.onShowReady, this);
                this.datacontext.showSubState.remove(this.onShowSubState, this);
            };

            LocalGame.prototype.onCanvasClick = function () {
            };

            LocalGame.prototype.onShowCanCommit = function (enable) {
            };

            LocalGame.prototype.onShowReady = function (playerId) {
            };

            LocalGame.prototype.onShowSubState = function (subState, playerId) {
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
            };
            return LocalGame;
        })();
        states.LocalGame = LocalGame;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=localGame.js.map
