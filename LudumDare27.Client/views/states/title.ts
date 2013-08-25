/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/title.ts"/>

module views.states {
    export class Title implements IState {

        private datacontext: viewmodels.states.Title;
        private root: HTMLDivElement;
        private playButton: HTMLButtonElement;

        constructor(datacontext: viewmodels.states.Title, root: HTMLDivElement) {
            this.datacontext = datacontext;
            this.root = root;
            this.playButton = <HTMLButtonElement> document.getElementById('play-button');
        }

        public enter(previousState: IState) {
            this.playButton.onclick = (event) => {
                this.datacontext.onPlayGame();
            };
        }

        public exit(previousState: IState) {
            this.playButton.onclick = null;
        }
    }
}