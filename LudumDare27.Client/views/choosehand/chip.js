var views;
(function (views) {
    (function (choosehand) {
        var color = [];
        color[models.entities.BetType.Up] = 'green';
        color[models.entities.BetType.Left] = 'pink';
        color[models.entities.BetType.Right] = 'yellow';
        color[models.entities.BetType.Down] = 'purple';

        var Chip = (function () {
            function Chip(betType) {
                this.betType = betType;
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
            return Chip;
        })();
        choosehand.Chip = Chip;
    })(views.choosehand || (views.choosehand = {}));
    var choosehand = views.choosehand;
})(views || (views = {}));
//# sourceMappingURL=chip.js.map
