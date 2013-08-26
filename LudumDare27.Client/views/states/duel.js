var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/duel.ts"/>
    (function (states) {
        var Duel = (function () {
            function Duel(datacontext) {
                this.id = "views.states.Duel";
                this.scoreboardShown = false;
                this.datacontext = datacontext;
                this.layer = document.getElementById('duel-layer');
                this.showScoreboardButton = document.getElementById('toggle-scoreboard-button');
            }
            Duel.prototype.enter = function (previousState) {
                var _this = this;
                var that = this;
                this.showScoreboardButton.onclick = function (event) {
                    if (_this.scoreboardShown) {
                        document.getElementById('scoreboard').style.top = '-300px';
                        _this.showScoreboardButton.classList.remove('glyphicon-chevron-up');
                        _this.showScoreboardButton.classList.add('glyphicon-chevron-down');
                    } else {
                        document.getElementById('scoreboard').style.top = '84px';
                        _this.showScoreboardButton.classList.remove('glyphicon-chevron-down');
                        _this.showScoreboardButton.classList.add('glyphicon-chevron-up');
                    }

                    _this.scoreboardShown = !_this.scoreboardShown;
                };
            };

            Duel.prototype.exit = function (nextState) {
                this.showScoreboardButton.onclick = null;
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=duel.js.map
