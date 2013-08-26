/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/duel.ts"/>

module views.states {
    export class Duel implements IState {

        public id: string = "views.states.Duel";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Duel;
        private playButton: HTMLButtonElement;
        private showScoreboardButton: HTMLButtonElement;

        private scoreboardShown: boolean = false;

        constructor(datacontext: viewmodels.states.Duel) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('duel-layer');
            this.showScoreboardButton = <HTMLButtonElement>document.getElementById('toggle-scoreboard-button');
        }

        public enter(previousState: IState) {
            var that = this;
            this.showScoreboardButton.onclick = (event) => {
                if (this.scoreboardShown) {
                    document.getElementById('scoreboard').style.top = '-300px';
                    this.showScoreboardButton.classList.remove('glyphicon-chevron-up');
                    this.showScoreboardButton.classList.add('glyphicon-chevron-down');
                }
                else {
                    document.getElementById('scoreboard').style.top = '84px';
                    this.showScoreboardButton.classList.remove('glyphicon-chevron-down');
                    this.showScoreboardButton.classList.add('glyphicon-chevron-up');
                }

                this.scoreboardShown = !this.scoreboardShown;
            };


        }

        public exit(nextState: IState) {
            this.showScoreboardButton.onclick = null;
        }
    }
}