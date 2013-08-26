var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/help.ts"/>
    (function (states) {
        var Help = (function () {
            function Help(datacontext) {
                this.id = "views.states.Help";
                this.datacontext = datacontext;
                this.layer = document.getElementById('help-layer');
            }
            Help.prototype.enter = function (previousState) {
                //this.backButton.onclick = (event) => {
                //    this.datacontext.goBack();
                //};
            };

            Help.prototype.exit = function (nextState) {
                //this.backButton.onclick = null;
            };
            return Help;
        })();
        states.Help = Help;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=help.js.map
