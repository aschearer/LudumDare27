var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/duel.ts"/>
    (function (states) {
        var Duel = (function () {
            function Duel(datacontext) {
                this.id = "views.states.Duel";
                this.datacontext = datacontext;
                this.layer = document.getElementById('duel-layer');
            }
            Duel.prototype.enter = function (previousState) {
                var _this = this;
                this.layer.onclick = function (event) {
                    _this.datacontext.goBack();
                };
            };

            Duel.prototype.exit = function (nextState) {
                this.layer.onclick = null;
            };
            return Duel;
        })();
        states.Duel = Duel;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=duel.js.map
