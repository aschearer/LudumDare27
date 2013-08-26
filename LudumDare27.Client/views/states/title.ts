/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/title.ts"/>

module views.states {
    export class Title implements IState {

        public id: string = "views.states.Title";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Title;
        private playButton: HTMLButtonElement;

        constructor(datacontext: viewmodels.states.Title) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('title-layer');
            this.playButton = <HTMLButtonElement> document.getElementById('play-button');
        }

        public enter(previousState: IState) {
            this.playButton.onclick = (event) => {
                this.datacontext.onPlayGame();
            };
        }

        public exit(nextState: IState) {
            this.playButton.onclick = null;
        }
    }
}