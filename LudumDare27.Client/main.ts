/// <reference path="viewmodels/conductor.ts"/>
/// <reference path="views/conductor.ts"/>
/// <reference path="viewmodels/states/title.ts"/>

var DEBUG = true;

window.onload = () => {
    var conductorViewModel = new viewmodels.Conductor();
    var conductorView = new views.Conductor(conductorViewModel);

    conductorViewModel.push(new viewmodels.states.Title());
};