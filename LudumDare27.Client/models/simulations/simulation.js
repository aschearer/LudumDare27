var models;
(function (models) {
    (function (simulations) {
        var Simulation = (function () {
            function Simulation() {
            }
            Simulation.prototype.update = function (elapsedTime) {
                console.log(elapsedTime);
            };
            return Simulation;
        })();
        simulations.Simulation = Simulation;
    })(models.simulations || (models.simulations = {}));
    var simulations = models.simulations;
})(models || (models = {}));
//# sourceMappingURL=simulation.js.map
