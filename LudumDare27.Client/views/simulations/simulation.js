var views;
(function (views) {
    /// <reference path="../../models/simulations/simulation.ts" />
    /// <reference path="../../libs/typings/easeljs/easeljs.d.ts" />
    (function (simulations) {
        var Simulation = (function () {
            function Simulation(canvas, datacontext) {
                var _this = this;
                this.onTick = function (tickEvent) {
                    _this.datacontext.update(tickEvent.delta);
                };
                this.datacontext = datacontext;
                this.stage = new createjs.Stage(canvas);
            }
            Simulation.prototype.activate = function () {
                createjs.Ticker.addEventListener('tick', this.onTick);
            };

            Simulation.prototype.deactivate = function () {
                createjs.Ticker.removeEventListener('tick', this.onTick);
            };
            return Simulation;
        })();
        simulations.Simulation = Simulation;
    })(views.simulations || (views.simulations = {}));
    var simulations = views.simulations;
})(views || (views = {}));
//# sourceMappingURL=simulation.js.map
