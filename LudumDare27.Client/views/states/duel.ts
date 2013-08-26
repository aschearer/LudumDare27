/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/duel.ts"/>
/// <reference path="../../models/entities/betting.ts"/>
/// <reference path="../choosehand/chip.ts"/>
/// <reference path="../../libs/typings/greensock.d.ts"/>
/// <reference path="../../libs/typings/jquery/jquery.d.ts"/>
/// <reference path="../../libs/typings/jquery/jqueryui.d.ts"/>

module views.states {
    class PlayerInfo {
        private iconElement: HTMLImageElement;
        private nameElement: HTMLParagraphElement;
        private healthElement: HTMLDivElement;
        private playerId: number;
        private health: number;

        constructor(root: HTMLElement, playerInfo: models.simulations.PlayerResult) {
            this.playerId = playerInfo.player.playerId;
            this.health = 3 - playerInfo.score;
            var playerElement: HTMLDivElement = <HTMLDivElement>root.getElementsByClassName('player' + (this.playerId + 1))[0];
            this.iconElement = <HTMLImageElement>playerElement.getElementsByClassName('playericon')[0];
            this.nameElement = <HTMLParagraphElement>playerElement.getElementsByClassName('playername')[0];
            this.nameElement.innerText = playerInfo.player.name;
            this.healthElement = <HTMLDivElement>playerElement.getElementsByClassName('remainingHealth')[0];
            this.updateHealth();
        }

        public updateHealth() {
            this.healthElement.style.width = ((Math.max(0, this.health) / 3) * 100) + '%';
        }

        public onTurnResult(winningPlayer: models.entities.Player) {
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

    interface TurnResults {
        winningPlayer: models.entities.Player;
        betType: models.entities.BetType;
        players: models.entities.Player[];
    }

    export class Duel implements IState {

        public id: string = "views.states.Duel";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Duel;
        private playButton: HTMLButtonElement;
        private showScoreboardButton: HTMLButtonElement;
        private startTurnLabel: HTMLElement;
        private players: Array<PlayerInfo>;

        private scoreboardShown: boolean = false;

        private activeChip: choosehand.Chip;
        private chips: choosehand.Chip[];
        private player1Chip: choosehand.Chip;
        private player2Chip: choosehand.Chip;
        private player1Bullet: HTMLElement;
        private player2Bullet: HTMLElement;

        private currentTurn: number;
        private turnInProgress: boolean;
        private turnLocked: boolean;

        private turnResults: TurnResults;

        constructor(datacontext: viewmodels.states.Duel) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('duel-layer');
            this.showScoreboardButton = <HTMLButtonElement>document.getElementById('toggle-scoreboard-button');
            this.players = [];
            var gamePlayers: Array<models.simulations.PlayerResult> = datacontext.GetCurrentPlayers();
            this.players[0] = new PlayerInfo(this.layer, gamePlayers[0]);
            this.players[1] = new PlayerInfo(this.layer, gamePlayers[1]);
            this.startTurnLabel = document.getElementById('start-turn-text');

            this.currentTurn = 1;

            this.resetScoreboard();
            this.chips = [];
            this.player1Chip = new choosehand.Chip(models.entities.BetType.Unknown, 25, 1000, 200);
            this.player2Chip = new choosehand.Chip(models.entities.BetType.Unknown, 650, 1000, 200);

            this.player1Bullet = document.getElementById('player1-bullet');
            this.player2Bullet = document.getElementById('player2-bullet');
        }

        public enter(previousState: IState) {
            this.turnInProgress = false;
            this.turnLocked = false;
            this.datacontext.turnReady.add(this.onTurnReady, this);
            this.datacontext.turnResult.add(this.onTurnResult, this);

            var that = this;
            this.showScoreboardButton.onclick = (event) => {
                if (that.scoreboardShown) {
                    document.getElementById('scoreboard').style.top = '-300px';
                    that.showScoreboardButton.classList.remove('glyphicon-chevron-up');
                    that.showScoreboardButton.classList.add('glyphicon-chevron-down');
                }
                else {
                    document.getElementById('scoreboard').style.top = '84px';
                    that.showScoreboardButton.classList.remove('glyphicon-chevron-down');
                    that.showScoreboardButton.classList.add('glyphicon-chevron-up');
                }

                this.scoreboardShown = !this.scoreboardShown;
            };

            var chipsContainer: HTMLDivElement = <HTMLDivElement>this.layer.getElementsByClassName('chips')[0];
            for (var i = 0; i < 10; i++) {
                var chip: choosehand.Chip = new choosehand.Chip(models.entities.BetType.Unknown, x, -100, 10 + 10 * i);
                var x: number = i % 2 == 0 ? -200 : 1000;
                chipsContainer.appendChild(chip.element);
                this.chips.push(chip);

                TweenLite.to(chip.element, 0.75, { top: 440 - 10 * i, delay: i * 0.05 });
                TweenLite.to(chip.element, 0.75, { left: 338, delay: i * 0.05, ease: Cubic.easeOut });
            }

            chipsContainer.appendChild(this.player1Chip.element);
            chipsContainer.appendChild(this.player2Chip.element);

            document.onkeydown = (event) => {
                this.onKeyDown(event.keyCode, event);
            };

            this.chips[this.chips.length - 1].element.onclick = this.startNewTurn.bind(this);
        }

        public exit(nextState: IState) {
            this.datacontext.turnReady.remove(this.onTurnReady, this);
            this.datacontext.turnResult.remove(this.onTurnResult, this);
            this.showScoreboardButton.onclick = null;
            var chipsContainer: HTMLDivElement = <HTMLDivElement>this.layer.getElementsByClassName('chips')[0];
            for (var i = 0; i < chipsContainer.childElementCount; i++) {
                (<HTMLElement>chipsContainer.children[i]).onclick = null;
            }

            while (chipsContainer.childElementCount > 0) {
                chipsContainer.removeChild(chipsContainer.children[0]);
            }

            document.onkeydown = null;
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
                        removeClasses(chip.classList, 'up down left right');
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
                        var imageName: string = playerWin == 0 ? 'sally' : 'riley';
                        element.innerHTML = "<img class=\"profile-pic\" src =\"/images/players/" + imageName + ".png\" width=\"16\" height=\"16\" />";
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

        private onKeyDown(keyCode: number, e) {
            if (keyCode == 32) {
                e.preventDefault();
                if (!this.turnInProgress && !this.turnLocked) {
                    this.startNewTurn();
                }
            }

            for (var playerId = 0; playerId < playerKeys.length; ++playerId) {
                if (keyCode in playerKeys[playerId]) {
                    e.preventDefault();
                    if (!this.turnInProgress || this.turnLocked) {
                        return;
                    }

                    var newBet: models.entities.BetType = playerKeys[playerId][keyCode];
                    var previousBet: models.entities.BetType = this.datacontext.MakeBet(playerId, newBet);
                    if (null === previousBet) {
                        var playerChip: choosehand.Chip = playerId === 0 ? this.player1Chip : this.player2Chip;

                        playerChip.element.style.opacity = "1";
                        playerChip.element.style.visibility = "visible";
                        TweenMax.fromTo(playerChip.element, 0.2, { top: 1000 }, { top: 300, ease: Cubic.easeOut });
                    } else if (newBet !== previousBet) {
                        // flip chip
                        var playerChip: choosehand.Chip = playerId === 0 ? this.player1Chip : this.player2Chip;
                        // flip guesses to reveal them
                        var p1ChipTimeline: TimelineMax = new TimelineMax();
                        p1ChipTimeline.to(playerChip.element, 0.1, { scaleX: 0 });
                        p1ChipTimeline.to(playerChip.element, 0.1, { scaleX: 1 });
                        p1ChipTimeline.play();

                    }
                }
            }
        }

        private onTurnReady() {
            window.setTimeout(function () {
                this.turnLocked = true;
                this.datacontext.TakeTurn();
            }.bind(this), 1000);
        }

        private onTurnResult(winningPlayer: models.entities.Player, betType: models.entities.BetType, players: Array<models.entities.Player>) {
            this.activeChip.setBetType(betType);
            TweenLite.to(this.activeChip.element, 1, { top: 300 });
            TweenMax.to(this.activeChip.element, 0, { scaleY: 1 });
            TweenMax.to(this.activeChip.element, .2, { scaleX: 0, yoyo: true, repeat: 5, ease: Cubic.easeIn });

            // flip guesses to reveal them
            var p1Chip = this.player1Chip;
            var p1ChipTimeline: TimelineMax = new TimelineMax();
            p1ChipTimeline.to(this.player1Chip.element, 0.1, {
                scaleX: 0, delay: 1, onComplete: function () {
                    p1Chip.setBetType(players[0].currentBet);
                }
            });
            p1ChipTimeline.to(this.player1Chip.element, 0.1, {scaleX: 1 });
            p1ChipTimeline.to(this.player1Chip.element, 0.4, { autoAlpha: 0, onComplete: function () { p1Chip.setBetType(models.entities.BetType.Unknown); } }, "+=2");
            p1ChipTimeline.play();

            var p2Chip = this.player2Chip;
            var p2ChipTimeline: TimelineMax = new TimelineMax();
            p2ChipTimeline.to(this.player2Chip.element, 0.1, {
                scaleX: 0, delay: 1, onComplete: function () {
                    p2Chip.setBetType(players[1].currentBet);
                }
            });
            p2ChipTimeline.to(this.player2Chip.element, 0.1, { scaleX: 1 });
            p2ChipTimeline.to(this.player2Chip.element, 0.4, { autoAlpha: 0, onComplete: function () { p2Chip.setBetType(models.entities.BetType.Unknown); } }, "+=2");
            p2ChipTimeline.play();

            TweenMax.to(this.activeChip.element, 0.4, { autoAlpha: 0, delay: 3.2 });

            this.player1Bullet.style.left = "-136px";
            this.player1Bullet.style.top = "300px";
            this.player2Bullet.style.left = "900px";
            this.player2Bullet.style.top = "300px";

            // fire bullets
            var p1Timeline: TimelineLite = new TimelineLite();
            var p2Timeline: TimelineLite = new TimelineLite();
            if (winningPlayer == null) {                
                p1Timeline.to(this.player1Bullet, 0.5, { left: 364, delay: 2, ease: Linear.easeNone });
                p1Timeline.to(this.player1Bullet, 1, { left: -136, ease: Linear.easeNone });
                p1Timeline.to(this.player1Bullet, 1, { top: -100 }, "-=1");

                p2Timeline.to(this.player2Bullet, 0.5, { left: 400, delay: 2, ease: Linear.easeNone });
                p2Timeline.to(this.player2Bullet, 1, { left: 900, ease: Linear.easeNone });
                p2Timeline.to(this.player2Bullet, 1, { top: -100, onComplete: this.updatePlayersHealth.bind(this) }, "-=1");
            }
            else if (winningPlayer.playerId == players[0].playerId) {
                p1Timeline.to(this.player1Bullet, 1, { left: 900, delay: 2, ease: Linear.easeNone, onComplete: this.updatePlayersHealth.bind(this) });
            }
            else {
                p2Timeline.to(this.player2Bullet, 1, { left: -136, delay: 2, ease: Linear.easeNone, onComplete: this.updatePlayersHealth.bind(this) });
            }

            p1Timeline.play();
            p2Timeline.play();

            this.turnResults =
            {
                winningPlayer: winningPlayer,
                players: players,
                betType: betType,
            };
        }

        private updatePlayersHealth() {
            this.turnInProgress = false;
            this.turnLocked = false;

            for (var i = 0; i < this.players.length; ++i) {
                this.players[i].onTurnResult(this.turnResults.winningPlayer);
            }

            if (this.turnResults.winningPlayer != null) {
                $('#duel-layer').effect('shake', 15);
            }

            // Update turn information
            this.updateTurnInformation(
                this.turnResults.players[0].currentBet,
                this.turnResults.players[1].currentBet,
                this.turnResults.betType,
                this.turnResults.winningPlayer ? this.turnResults.winningPlayer.playerId : null);

            this.datacontext.AdvanceGame();
        }

        private startNewTurn() {
            if (this.turnInProgress) {
                return;
            }

            this.turnResults = null;
            this.turnInProgress = true;
            this.flipNextChip();
        }

        private flipNextChip() {
            if (this.activeChip != null) {
                this.activeChip.element.onclick = null;
            }

            if (this.chips.length > 0) {
                this.activeChip = this.chips.pop();
                TweenLite.to(this.activeChip.element, 1.5, { top: -100 });
                TweenMax.to(this.activeChip.element, 0.1, { scaleY: 0, yoyo: true, repeat: 8 });

                TweenMax.fromTo(this.startTurnLabel, 0.5, { opacity: 0 }, { autoAlpha: 1, yoyo: true, repeat: 1, delay: 1, repeatDelay: 1.5 });
                TweenMax.fromTo(this.startTurnLabel, 2.5, { marginLeft: 20 }, { marginLeft: -20, delay: 1 });

                if (this.chips.length > 0) {
                    this.chips[this.chips.length - 1].element.onclick = this.startNewTurn.bind(this);
                }
            }
        }
    }
}