var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    (function (states) {
        var LocalGame = (function () {
            function LocalGame(datacontext) {
                this.id = "views.states.LocalGame";
                this.datacontext = datacontext;
                this.root = document.getElementById('game-view');
            }
            LocalGame.prototype.enter = function (previousState) {
            };

            LocalGame.prototype.exit = function (nextState) {
            };
            return LocalGame;
        })();
        states.LocalGame = LocalGame;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=localGame.js.map
