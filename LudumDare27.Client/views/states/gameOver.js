var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/gameOver.ts"/>
    (function (states) {
        var GameOver = (function () {
            function GameOver(datacontext) {
                this.id = "views.states.GameOver";
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-over-layer');

                var messageElement = document.getElementById('game-over-text');
                var winner = this.datacontext.GetWinningPlayerName();
                var message = "";
                if (winner) {
                    message = winner + " Wins";
                } else {
                    message = "It's a Draw";
                }

                messageElement.innerText = message;
            }
            GameOver.prototype.enter = function (previousState) {
                var _this = this;
                this.layer.onclick = function (event) {
                    _this.datacontext.endGame();
                };
            };

            GameOver.prototype.exit = function (nextState) {
                this.layer.onclick = null;
            };
            return GameOver;
        })();
        states.GameOver = GameOver;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=gameOver.js.map
