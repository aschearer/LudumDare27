var viewmodels;
(function (viewmodels) {
    (function (states) {
        var Help = (function () {
            function Help(simulation) {
                this.id = "viewmodels.states.Help";
                this.stateChanged = new Signal();
                this.simulation = simulation;
            }
            Help.prototype.enter = function () {
            };

            Help.prototype.exit = function () {
            };

            Help.prototype.goBack = function () {
                this.stateChanged.dispatch(null);
            };
            return Help;
        })();
        states.Help = Help;
    })(viewmodels.states || (viewmodels.states = {}));
    var states = viewmodels.states;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=help.js.map
