/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/title.ts"/>

module views.states {
    export class Title implements IState {

        public id: string = "views.states.Title";

        private datacontext: viewmodels.states.Title;
        private root: HTMLDivElement;
        private playButton: HTMLButtonElement;

        constructor(datacontext: viewmodels.states.Title) {
            this.datacontext = datacontext;
            this.root = <HTMLDivElement>document.getElementById('title-view');
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