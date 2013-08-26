module views.choosehand {

    var color : Array<string> = [];
    color[models.entities.BetType.Up] = 'up';
    color[models.entities.BetType.Left] = 'left';
    color[models.entities.BetType.Right] = 'right';
    color[models.entities.BetType.Down] = 'down';
    color[models.entities.BetType.Unknown] = 'unknown';

    export class Chip {
        private betType: models.entities.BetType;

        public element: HTMLDivElement;

        constructor(betType: models.entities.BetType, x: number, y: number, z: number) {
            this.betType = betType;
            this.element = this.createElement(x, y, z);
        }

        private createElement(x, y, z): HTMLDivElement {
            var chip: HTMLDivElement = document.createElement('div');
            chip.classList.add('chip');
            chip.classList.add(color[this.betType]);
            chip.style.left = x + "px";
            chip.style.top = y + "px";
            chip.style.zIndex = z + "";
            return chip;
        }

        public setBetType(betType: models.entities.BetType) {
            this.element.classList.remove(color[this.betType]);
            this.betType = betType;
            this.element.classList.add(color[this.betType]);
        }

        static GetColor(betType: models.entities.BetType): string {
            return color[betType];
        }
    }
}