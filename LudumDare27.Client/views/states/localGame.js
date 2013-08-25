var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    (function (states) {
        var LocalGame = (function () {
            function LocalGame(datacontext) {
                this.id = "views.states.LocalGame";
                this.datacontext = datacontext;
                this.layer = document.getElementById('game-layer');
            }
            LocalGame.prototype.enter = function (previousState) {
                var _this = this;
                this.layer.onclick = function (event) {
                    _this.datacontext.goBack();
                };
            };

            LocalGame.prototype.exit = function (nextState) {
                this.layer.onclick = null;
            };
            return LocalGame;
        })();
        states.LocalGame = LocalGame;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=localGame.js.map
