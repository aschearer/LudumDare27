var models;
(function (models) {
    /// <reference path="../entities/ientity.ts"/>
    (function (simulations) {
        var Simulation = (function () {
            function Simulation() {
            }
            Simulation.prototype.update = function (elapsedTime) {
                console.log(elapsedTime);
            };

            Simulation.prototype.Add = function (entity) {
                this.entities[entity.id] = entity;
                this.entityAdded.dispatch(entity);
            };

            Simulation.prototype.Remove = function (entity) {
                if (entity.id in this.entities) {
                    delete this.entities[entity.id];
                }
            };
            return Simulation;
        })();
        simulations.Simulation = Simulation;
    })(models.simulations || (models.simulations = {}));
    var simulations = models.simulations;
})(models || (models = {}));
//# sourceMappingURL=simulation.js.map
