/// <reference path="models/simulations/simulation.ts"/>
/// <reference path="views/simulations/simulation.ts"/>

window.onload = () => {
    var simulation = new models.simulations.Simulation();
    var simulationView = new views.simulations.Simulation(<HTMLCanvasElement>document.getElementById('game-layer'), simulation);
    simulationView.activate();
};