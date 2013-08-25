var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/changingPlayer.ts"/>
    /// <reference path="../../viewmodels/states/localGame.ts"/>
    (function (states) {
        var ChangingPlayer = (function () {
            function ChangingPlayer(datacontext) {
                this.id = "views.states.ChangingPlayer";
                this.datacontext = datacontext;
                this.layer = document.getElementById('player-ready-layer');
            }
            ChangingPlayer.prototype.enter = function (previousState) {
                var _this = this;
                this.layer.onclick = function (event) {
                    _this.datacontext.playerReady();
                };
            };

            ChangingPlayer.prototype.exit = function (nextState) {
                this.layer.onclick = null;
            };
            return ChangingPlayer;
        })();
        states.ChangingPlayer = ChangingPlayer;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=changingPlayer.js.map
