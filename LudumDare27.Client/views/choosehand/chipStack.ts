module views.choosehand {
    export class ChipStack {
        private root: HTMLElement;
        private column: number;
        private betType: models.entities.BetType;
        private numberOfChips: number;

        private activeEnabled: boolean = true;

        private activeChips: HTMLDivElement[];
        private inactiveChips: HTMLDivElement[];
        private topOffset: number = -300;
        private activeOffset: number = 200;
        private inactiveOffset: number = 570;
        private bottomOffset: number = 700;

        public chipStackChanged: Signal = new Signal();

        constructor(root: HTMLElement, column: number, betType: models.entities.BetType, numberOfChips: number) {
            this.root = root;
            this.betType = betType;
            this.column = column;
            this.numberOfChips = numberOfChips;
            this.activeChips = [];
            this.inactiveChips = [];
        }

        public enter() {
            var x: number = (20 + 128 * this.column + 82 * (this.column));
            for (var i: number = 0; i < this.numberOfChips; i++) {
                var chip: Chip = new Chip(this.betType, x, this.topOffset, i * 10);
                this.activeChips.push(chip.element);
                this.root.appendChild(chip.element);
                chip.element.onclick = (event) => {
                    this.onActiveChipClicked();
                };
            }

            var that = this;
            window.setTimeout(function () {
                for (var j = 0; j < that.activeChips.length; j++) {
                    that.activeChips[j].style.top = that.activeOffset + (j * -10) + "px";
                }
            }, 200 * (this.column + 1));
        }

        public hideChips() {
            for (var i = 0; i < this.activeChips.length; i++) {
                this.activeChips[i].style.top = this.topOffset + "px";
                this.activeChips[i].onclick = null;
            }

            for (var i = 0; i < this.inactiveChips.length; i++) {
                this.inactiveChips[i].style.top = this.bottomOffset + "px";
                this.inactiveChips[i].onclick = null;
            }
        }

        public exit() {
            for (var j = 0; j < this.activeChips.length; j++) {
                this.activeChips[j].onclick = null;
            }
            this.activeChips = [];
            for (var j = 0; j < this.inactiveChips.length; j++) {
                this.inactiveChips[j].onclick = null;
            }
            this.inactiveChips = [];
        }

        public setActiveEnabled(enable: boolean) {
            this.activeEnabled = enable;
        }

        private onActiveChipClicked() {
            if (!this.activeEnabled) {
                return;
            }

            var newInactiveChip = this.activeChips.pop();
            this.inactiveChips.push(newInactiveChip);
            newInactiveChip.style.top = this.inactiveOffset + (this.inactiveChips.length * -10) + "px";
            newInactiveChip.onclick = (event) => {
                this.onInactiveChipClicked();
            };

            this.chipStackChanged.dispatch(this.betType, false);
        }

        private onInactiveChipClicked() {
            var newActiveChip = this.inactiveChips.pop();
            newActiveChip.style.top = this.activeOffset + (this.activeChips.length * -10) + "px";
            newActiveChip.onclick = null;
            this.activeChips.push(newActiveChip);

            newActiveChip.onclick = (event) => {
                this.onActiveChipClicked();
            };

            this.chipStackChanged.dispatch(this.betType, true);
        }
    }
}