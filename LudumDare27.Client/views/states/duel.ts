/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/duel.ts"/>

module views.states {
    export class Duel implements IState {

        public id: string = "views.states.Duel";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Duel;
        private playButton: HTMLButtonElement;

        constructor(datacontext: viewmodels.states.Duel) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('duel-layer');
        }

        public enter(previousState: IState) {
            this.layer.onclick = (event) => {
                this.datacontext.goBack();
            };
        }

        public exit(nextState: IState) {
            this.layer.onclick = null;
        }
    }
}