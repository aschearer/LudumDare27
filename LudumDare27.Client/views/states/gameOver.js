var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/gameOver.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    (function (states) {
        var GameOver = (function () {
            function GameOver(datacontext) {
                this.id = "views.states.GameOver";
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-over-layer');
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
