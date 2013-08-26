var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/title.ts"/>
    (function (states) {
        var Title = (function () {
            function Title(datacontext) {
                this.id = "views.states.Title";
                this.datacontext = datacontext;
                this.layer = document.getElementById('title-layer');
                this.playButton = document.getElementById('play-button');
                this.helpButton = document.getElementById('help-button');
            }
            Title.prototype.enter = function (previousState) {
                var _this = this;
                this.playButton.onclick = function (event) {
                    _this.datacontext.onPlayGame();
                };

                this.helpButton.onclick = function (event) {
                    _this.datacontext.showHelp();
                };
            };

            Title.prototype.exit = function (nextState) {
                this.playButton.onclick = null;
                this.helpButton.onclick = null;
            };
            return Title;
        })();
        states.Title = Title;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=title.js.map
