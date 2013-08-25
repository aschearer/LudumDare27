/// <reference path="viewmodels/states/title.ts"/>
/// <reference path="views/states/title.ts"/>

window.onload = () => {
    var titleViewModel = new viewmodels.states.Title();
    var titleView = new views.states.Title(titleViewModel, <HTMLDivElement>document.getElementById('title-view'));
    titleViewModel.enter();
    titleView.enter(null);
};