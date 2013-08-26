/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/duel.ts"/>

module views.states {
    class PlayerInfo {
        private iconElement: HTMLImageElement;
        private nameElement: HTMLParagraphElement;
        private healthElement: HTMLDivElement;
        private readyElement: HTMLSpanElement;

        constructor(root: HTMLElement, playerInfo: models.simulations.PlayerResult) {
            var playerId: number = playerInfo.player.playerId;
            var playerElement: HTMLDivElement = <HTMLDivElement>root.getElementsByClassName('player' + (playerId + 1))[0];
            this.iconElement = <HTMLImageElement>playerElement.getElementsByClassName('playericon')[0];
            this.nameElement = <HTMLParagraphElement>playerElement.getElementsByClassName('playername')[0];
            this.nameElement.innerText = playerInfo.player.name;
            this.healthElement = <HTMLDivElement>playerElement.getElementsByClassName('health')[0];
            this.healthElement.style.width = ((playerInfo.score / 5) * 100) + '%';
            this.readyElement = <HTMLSpanElement>playerElement.getElementsByClassName('playerready')[0];
            this.showReady(false);
        }

        public showReady(show: boolean) {
            this.readyElement.style.visibility = show ? '' : 'hidden';
        }
    }

    var playerKeys = [];
    playerKeys[0] = [];
    playerKeys[1] = [];
    playerKeys[0][65] = models.entities.BetType.Left;
    playerKeys[0][87] = models.entities.BetType.Up;
    playerKeys[0][68] = models.entities.BetType.Right;
    playerKeys[0][83] = models.entities.BetType.Down;
    playerKeys[1][37] = models.entities.BetType.Left;
    playerKeys[1][38] = models.entities.BetType.Up;
    playerKeys[1][39] = models.entities.BetType.Right;
    playerKeys[1][40] = models.entities.BetType.Down;

    export class Duel implements IState {

        public id: string = "views.states.Duel";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Duel;
        private playButton: HTMLButtonElement;
        private showScoreboardButton: HTMLButtonElement;
        private players: Array<PlayerInfo>;

        private scoreboardShown: boolean = false;

        constructor(datacontext: viewmodels.states.Duel) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('duel-layer');
            this.showScoreboardButton = <HTMLButtonElement>document.getElementById('toggle-scoreboard-button');
            this.players = [];
            var gamePlayers: Array<models.simulations.PlayerResult> = datacontext.GetCurrentPlayers();
            this.players[0] = new PlayerInfo(this.layer, gamePlayers[0]);
            this.players[1] = new PlayerInfo(this.layer, gamePlayers[1]);
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


            document.onkeyup = (event) => {
                this.onKeyUp(event.keyCode);
            };
        }

        public exit(nextState: IState) {
            this.showScoreboardButton.onclick = null;
            document.onkeyup = null;
        }

        private onKeyUp(keyCode: number) {
            for (var playerId = 0; playerId < playerKeys.length; ++playerId) {
                if (keyCode in playerKeys[playerId]) {
                    if (this.datacontext.MakeBet(playerId, playerKeys[playerId][keyCode])) {
                        this.players[playerId].showReady(true);
                    }
                }
            }
        }
    }
}