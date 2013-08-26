/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/gameOver.ts"/>

module views.states {

    var drawMessages = [
        "You did your job, but they didn't manage to kill each other.",
        "After shooting at each other they decided to switch to shots.",
        "I'm sorry, the duelists are in another castle.",
        "Hahahahaha. I'm evil. I enjoy suffering and tie games.",
        "The duel resulted in a draw.",
        "Three words: ye olde rematch.",
    ];
    var lastDrawMessage = null;

    var endMessages = [
        ", so I may have another.",
        " for a rematch.",
        " to make them pay.  Make them all pay.",
        " to restore your honor. Your poor, poor honor.",
        " to play again.",
        ", please.",
    ];
    var lastEndMessage = null;

    var winMessages = [
        "The winner is you, if you were <span id='game-over-winner-name' class='highlight'></span>'s second.",
        "<span id='game-over-winner-name' class='highlight'></span>'s second is a trap master.",
        "You ded. Unless you are <span id='game-over-winner-name' class='highlight'></span>. Then you only have a flesh wound.",
        "<span id='game-over-winner-name' class='highlight'></span>'s second is handsome and smart and witty.  Oh, and a winner.",
        "Good job, <span id='game-over-winner-name' class='highlight'></span>'s second! You are the best.",
    ];
    var lastWinMessage = null;

    export class GameOver implements IState {

        public id: string = "views.states.GameOver";

        public layer: HTMLElement;
        private readyButton: HTMLAnchorElement;

        private datacontext: viewmodels.states.GameOver;

        constructor(datacontext: viewmodels.states.GameOver) {
            this.datacontext = datacontext;
            this.layer = <HTMLDivElement>document.getElementById('game-over-layer');

            if (this.layer.classList.contains('game-over-draw')) {
                this.layer.classList.remove('game-over-draw');
            }
            if (this.layer.classList.contains('game-over-victory')) {
                this.layer.classList.remove('game-over-victory');
            }

            var messageElement: HTMLLIElement = <HTMLLIElement>document.getElementById('game-over-text');
            var winner: string = this.datacontext.GetWinningPlayerName();
            var message = "";
            if (winner) {
                message = lastWinMessage = views.states.getRandomInstruction(winMessages, lastWinMessage);
                this.layer.classList.add('game-over-victory');
            } else {
                message = lastDrawMessage = views.states.getRandomInstruction(drawMessages, lastDrawMessage);
                this.layer.classList.add('game-over-draw');
            }
                        
            message += "<br/>Click <a id='game-over-button' href='#'>here</a>";
            message += lastEndMessage = views.states.getRandomInstruction(endMessages, lastEndMessage);

            messageElement.innerHTML = message;
            var nameElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById('game-over-winner-name');
            if (nameElement) {
                nameElement.innerText = winner;
            }
            this.readyButton = <HTMLAnchorElement>document.getElementById('game-over-button');
        }

        public enter(previousState: IState) {
            this.readyButton.onclick = () => {
                this.datacontext.endGame();
                return false;
            };
        }

        public exit(nextState: IState) {
            this.layer.onclick = null;
            this.readyButton.onclick = null;
        }
    }
}
