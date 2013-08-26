/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/help.ts"/>

module views.states {
    export class Help implements IState {

        public id: string = "views.states.Help";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Help;

        constructor(datacontext: viewmodels.states.Help) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('help-layer');
        }

        public enter(previousState: IState) {
            //this.backButton.onclick = (event) => {
            //    this.datacontext.goBack();
            //};
        }

        public exit(nextState: IState) {
            //this.backButton.onclick = null;
        }
    }
}