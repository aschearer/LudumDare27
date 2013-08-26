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
        private inactiveOffset: number = 560;
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

        public reset() {
            while (this.activeChips.length > 0) {
                this.root.removeChild(this.activeChips.pop());
            }

            while (this.inactiveChips.length > 0) {
                this.root.removeChild(this.inactiveChips.pop());
            }

            var x: number = (20 + 128 * this.column + 82 * (this.column));
            for (var i: number = 0; i < this.numberOfChips; i++) {
                var chip: Chip = new Chip(this.betType);
                var chipElement: HTMLDivElement = chip.createElement(x, this.topOffset, i * 10);
                this.activeChips.push(chipElement);
                this.root.appendChild(chipElement);
            }

            var that = this;
            window.setTimeout(function () {
                for (var j = 0; j < that.activeChips.length; j++) {
                    that.activeChips[j].style.top = that.activeOffset + (j * -10) + "px";
                }
            }, 200 * (this.column + 1));

            this.peek(this.activeChips).onclick = (event) => {
                this.onActiveChipClicked();
            };
        }

        public setActiveEnabled(enable: boolean) {
            this.activeEnabled = enable;
        }

        public commit() {
            for (var i = 0; i < this.activeChips.length; i++) {
                this.activeChips[i].style.top = this.topOffset + "px";
            }

            if (this.inactiveChips.length > 0) {
                this.peek(this.inactiveChips).style.top = this.bottomOffset + "px";
            }
        }

        private peek(stack: HTMLDivElement[]): HTMLDivElement {
            return stack[stack.length - 1];
        }

        private onActiveChipClicked() {
            if (!this.activeEnabled) {
                return;
            }

            this.peek(this.activeChips).style.top = this.inactiveOffset + "px";
            this.peek(this.activeChips).onclick = null;
            if (this.inactiveChips.length > 0) {
                this.peek(this.inactiveChips).onclick = null;
                this.peek(this.inactiveChips).style.top = this.bottomOffset + "px";
            }

            this.inactiveChips.push(this.peek(this.activeChips));
            this.activeChips.pop();

            if (this.activeChips.length > 0) {
                this.peek(this.activeChips).onclick = (event) => {
                    this.onActiveChipClicked();
                };
            }

            this.peek(this.inactiveChips).onclick = (event) => {
                this.onInactiveChipClicked();
            };

            this.chipStackChanged.dispatch(this.betType, false);
        }

        private onInactiveChipClicked() {
            this.peek(this.inactiveChips).style.top = this.activeOffset + (this.activeChips.length * -10) + "px";
            this.peek(this.inactiveChips).onclick = null;
            if (this.activeChips.length > 0)
            {
                this.peek(this.activeChips).onclick = null;
            }

            this.activeChips.push(this.peek(this.inactiveChips));
            this.inactiveChips.pop();

            if (this.inactiveChips.length > 0) {
                this.peek(this.inactiveChips).style.top = this.inactiveOffset + "px";
            }

            this.peek(this.activeChips).onclick = (event) => {
                this.onActiveChipClicked();
            };

            if (this.inactiveChips.length > 0) {
                this.peek(this.inactiveChips).onclick = (event) => {
                    this.onInactiveChipClicked();
                };
            }

            this.chipStackChanged.dispatch(this.betType, true);
        }
    }
}