/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/duel.ts"/>

module views.states {
    class PlayerInfo {
        private iconElement: HTMLImageElement;
        private nameElement: HTMLParagraphElement;
        private healthElement: HTMLDivElement;
        private readyElement: HTMLSpanElement;
        private playerId: number;
        private health: number;

        constructor(root: HTMLElement, playerInfo: models.simulations.PlayerResult) {
            this.playerId = playerInfo.player.playerId;
            this.health = playerInfo.score;
            var playerElement: HTMLDivElement = <HTMLDivElement>root.getElementsByClassName('player' + (this.playerId + 1))[0];
            this.iconElement = <HTMLImageElement>playerElement.getElementsByClassName('playericon')[0];
            this.nameElement = <HTMLParagraphElement>playerElement.getElementsByClassName('playername')[0];
            this.nameElement.innerText = playerInfo.player.name;
            this.healthElement = <HTMLDivElement>playerElement.getElementsByClassName('health')[0];
            this.readyElement = <HTMLSpanElement>playerElement.getElementsByClassName('playerready')[0];
            this.showReady(false);
            this.updateHealth();
        }

        public showReady(show: boolean) {
            this.readyElement.style.visibility = show ? '' : 'hidden';
        }

        public updateHealth() {
            this.healthElement.style.width = ((this.health / 5) * 100) + '%';
        }

        public onTurnResult(winningPlayer: models.entities.Player) {
            this.showReady(false);
            if (winningPlayer && winningPlayer.playerId !== this.playerId) {
                --this.health;
                this.updateHealth();
            }
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

    function removeClasses(classList: DOMTokenList, spaceDeliminiatedClassesToRemove: string) {
        var classesToRemove: Array<string> = spaceDeliminiatedClassesToRemove.split(" ");
        for (var i = 0, c = classesToRemove.length; i < c; ++i) {
            var classToRemove = classesToRemove[i];
            if (classList.contains(classToRemove)) {
                classList.remove(classToRemove);
            }
        }
    }

    export class Duel implements IState {

        public id: string = "views.states.Duel";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Duel;
        private playButton: HTMLButtonElement;
        private showScoreboardButton: HTMLButtonElement;
        private players: Array<PlayerInfo>;

        private scoreboardShown: boolean = false;

        private countdownElement: HTMLSpanElement;
        private countdown: number;
        private currentTurn: number;

        constructor(datacontext: viewmodels.states.Duel) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('duel-layer');
            this.showScoreboardButton = <HTMLButtonElement>document.getElementById('toggle-scoreboard-button');
            this.players = [];
            var gamePlayers: Array<models.simulations.PlayerResult> = datacontext.GetCurrentPlayers();
            this.players[0] = new PlayerInfo(this.layer, gamePlayers[0]);
            this.players[1] = new PlayerInfo(this.layer, gamePlayers[1]);

            this.countdownElement = <HTMLSpanElement>document.getElementById('countdown');
            this.countdownElement.style.visibility = 'hidden';
            this.countdown = 3;
            this.currentTurn = 1;

            this.resetScoreboard();
        }

        public enter(previousState: IState) {
            this.datacontext.turnReady.add(this.onTurnReady, this);
            this.datacontext.turnResult.add(this.onTurnResult, this);

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
            this.datacontext.turnReady.remove(this.onTurnReady, this);
            this.datacontext.turnResult.remove(this.onTurnResult, this);
            this.showScoreboardButton.onclick = null;
            document.onkeyup = null;
        }

        private forEachTurnElement(turn, func) {
            var elements = document.getElementsByClassName("turn" + turn);
            for (var i = 0, c = elements.length; i < c; ++i) {
                var element: HTMLElement = <HTMLElement>elements[i];
                func(element);
            }
        }

        private resetScoreboard() {
            for (var i = 1; i < 11; ++i) {
                this.forEachTurnElement(i, function (element: HTMLElement) {
                    removeClasses(element.classList, 'past-turn current-turn');
                    if (element.classList.contains('rowplayer1') || element.classList.contains('rowplayer2') || element.classList.contains('rowactual')) {
                        var chip: HTMLElement = <HTMLElement>element.getElementsByClassName('chip')[0];
                        removeClasses(chip.classList, 'pink green yellow purple');
                    } else if (element.classList.contains('rowwinner')) {
                        element.innerHTML = "";
                    }

                    if (i === 1) {
                        element.classList.add('current-turn');
                    }
                });
            }
        }

        private updateTurnInformation(bet1: models.entities.BetType, bet2: models.entities.BetType, betWin: models.entities.BetType, playerWin: number) {
            this.forEachTurnElement(this.currentTurn, function (element: HTMLElement) {
                element.classList.remove('current-turn');
                element.classList.add('past-turn');
                if (element.classList.contains('rowplayer1')) {
                    var chip:HTMLElement = <HTMLElement>element.getElementsByClassName('chip')[0];
                    chip.classList.add(views.choosehand.Chip.GetColor(bet1));
                } else if (element.classList.contains('rowplayer2')) {
                    var chip: HTMLElement = <HTMLElement>element.getElementsByClassName('chip')[0];
                    chip.classList.add(views.choosehand.Chip.GetColor(bet2));
                } else if (element.classList.contains('rowactual')) {
                    var chip: HTMLElement = <HTMLElement>element.getElementsByClassName('chip')[0];
                    chip.classList.add(views.choosehand.Chip.GetColor(betWin));
                } else if (element.classList.contains('rowwinner')) {
                    if (playerWin !== null) {
                        // $TODO: put correct player image here
                        element.innerHTML = "" + (playerWin + 1);
                        //element.innerHTML = "<img class=\"profile-pic\" src =\"http://lorempixel.com/16/16\" />";
                    } else {
                        element.innerHTML = "&ndash;";
                    }
                }
            });
            ++this.currentTurn;
            this.forEachTurnElement(this.currentTurn, function (element: HTMLElement) {
                element.classList.add('current-turn');
            });
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

        private onTurnReady() {
            if (this.countdown > 0) {
                this.countdownElement.innerText = "" + this.countdown;
                this.countdownElement.style.visibility = "";
                --this.countdown;

                // Kick off timer
                var that = this;
                window.setTimeout(function () {
                    that.onTurnReady();
                }, 1000);
            } else {
                this.countdownElement.style.visibility = "hidden";
                this.countdown = 3;
                this.datacontext.TakeTurn();
            }
        }

        private onTurnResult(winningPlayer: models.entities.Player, betType: models.entities.BetType, players: Array<models.entities.Player>) {
            for (var i = 0; i < this.players.length; ++i) {
                this.players[i].onTurnResult(winningPlayer);
            }

            // Update turn information
            this.updateTurnInformation(players[0].currentBet, players[1].currentBet, betType, winningPlayer ? winningPlayer.playerId : null);

            this.datacontext.AdvanceGame();
        }
    }
}