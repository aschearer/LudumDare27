/// <reference path="viewmodels/states/title.ts"/>
/// <reference path="views/states/title.ts"/>
window.onload = function () {
    var titleViewModel = new viewmodels.states.Title();
    var titleView = new views.states.Title(titleViewModel, document.getElementById('title-view'));
    titleViewModel.enter();
    titleView.enter(null);
};
//# sourceMappingURL=main.js.map
