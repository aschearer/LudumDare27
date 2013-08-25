var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/title.ts"/>
    (function (states) {
        var Title = (function () {
            function Title(datacontext, root) {
                this.datacontext = datacontext;
                this.root = root;
                this.playButton = document.getElementById('play-button');
            }
            Title.prototype.enter = function (previousState) {
                var _this = this;
                this.playButton.onclick = function (event) {
                    _this.datacontext.onPlayGame();
                };
            };

            Title.prototype.exit = function (nextState) {
                this.playButton.onclick = null;
            };
            return Title;
        })();
        states.Title = Title;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=title.js.map
