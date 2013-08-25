var viewmodels;
(function (viewmodels) {
    /// <reference path="istate.ts"/>
    (function (states) {
        var Title = (function () {
            function Title() {
            }
            Title.prototype.enter = function () {
            };

            Title.prototype.exit = function () {
            };

            Title.prototype.onPlayGame = function () {
                console.log("Start Game");
            };
            return Title;
        })();
        states.Title = Title;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=title.js.map
