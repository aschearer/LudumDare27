/// <reference path="models/simulations/simulation.ts"/>
/// <reference path="views/simulations/simulation.ts"/>
window.onload = function () {
    var simulation = new models.simulations.Simulation();
    var simulationView = new views.simulations.Simulation(document.getElementById('game-layer'), simulation);
    simulationView.activate();
};
//# sourceMappingURL=main.js.map
