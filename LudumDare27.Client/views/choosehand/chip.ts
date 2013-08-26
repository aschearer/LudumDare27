module views.choosehand {

    var color : Array<string> = [];
    color[models.entities.BetType.Up] = 'green';
    color[models.entities.BetType.Left] = 'pink';
    color[models.entities.BetType.Right] = 'yellow';
    color[models.entities.BetType.Down] = 'purple';

    export class Chip {
        private betType: models.entities.BetType;

        constructor(betType: models.entities.BetType) {
            this.betType = betType;
        }

        public createElement(x, y, z): HTMLDivElement {
            var chip: HTMLDivElement = document.createElement('div');
            chip.classList.add('chip');
            chip.classList.add(color[this.betType]);
            chip.style.left = x + "px";
            chip.style.top = y + "px";
            chip.style.zIndex = z + "";
            return chip;
        }

        static GetColor(betType: models.entities.BetType): string {
            return color[betType];
        }
    }
}