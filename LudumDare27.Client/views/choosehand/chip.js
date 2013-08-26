var views;
(function (views) {
    (function (choosehand) {
        var color = [];
        color[models.entities.BetType.Up] = 'up';
        color[models.entities.BetType.Left] = 'left';
        color[models.entities.BetType.Right] = 'right';
        color[models.entities.BetType.Down] = 'down';
        color[models.entities.BetType.Unknown] = 'unknown';

        var Chip = (function () {
            function Chip(betType, x, y, z) {
                this.betType = betType;
                this.element = this.createElement(x, y, z);
            }
            Chip.prototype.createElement = function (x, y, z) {
                var chip = document.createElement('div');
                chip.classList.add('chip');
                chip.classList.add(color[this.betType]);
                chip.style.left = x + "px";
                chip.style.top = y + "px";
                chip.style.zIndex = z + "";
                return chip;
            };

            Chip.prototype.setBetType = function (betType) {
                this.element.classList.remove(color[this.betType]);
                this.betType = betType;
                this.element.classList.add(color[this.betType]);
            };

            Chip.GetColor = function (betType) {
                return color[betType];
            };
            return Chip;
        })();
        choosehand.Chip = Chip;
    })(views.choosehand || (views.choosehand = {}));
    var choosehand = views.choosehand;
})(views || (views = {}));
//# sourceMappingURL=chip.js.map
