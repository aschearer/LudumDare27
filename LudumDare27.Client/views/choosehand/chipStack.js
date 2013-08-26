var views;
(function (views) {
    (function (choosehand) {
        var ChipStack = (function () {
            function ChipStack(root, column, betType, numberOfChips) {
                this.activeEnabled = true;
                this.topOffset = -300;
                this.activeOffset = 200;
                this.inactiveOffset = 570;
                this.bottomOffset = 700;
                this.chipStackChanged = new Signal();
                this.root = root;
                this.betType = betType;
                this.column = column;
                this.numberOfChips = numberOfChips;
                this.activeChips = [];
                this.inactiveChips = [];
            }
            ChipStack.prototype.enter = function () {
                var _this = this;
                var x = (20 + 128 * this.column + 82 * (this.column));
                for (var i = 0; i < this.numberOfChips; i++) {
                    var chip = new choosehand.Chip(this.betType, x, this.topOffset, i * 10);
                    this.activeChips.push(chip.element);
                    this.root.appendChild(chip.element);
                    chip.element.onclick = function (event) {
                        _this.onActiveChipClicked();
                    };
                }

                var that = this;
                window.setTimeout(function () {
                    for (var j = 0; j < that.activeChips.length; j++) {
                        that.activeChips[j].style.top = that.activeOffset + (j * -10) + "px";
                    }
                }, 200 * (this.column + 1));
            };

            ChipStack.prototype.hideChips = function () {
                for (var i = 0; i < this.activeChips.length; i++) {
                    this.activeChips[i].style.top = this.topOffset + "px";
                    this.activeChips[i].onclick = null;
                }

                for (var i = 0; i < this.inactiveChips.length; i++) {
                    this.inactiveChips[i].style.top = this.bottomOffset + "px";
                    this.inactiveChips[i].onclick = null;
                }
            };

            ChipStack.prototype.exit = function () {
                for (var j = 0; j < this.activeChips.length; j++) {
                    this.activeChips[j].onclick = null;
                }
                this.activeChips = [];
                for (var j = 0; j < this.inactiveChips.length; j++) {
                    this.inactiveChips[j].onclick = null;
                }
                this.inactiveChips = [];
            };

            ChipStack.prototype.setActiveEnabled = function (enable) {
                this.activeEnabled = enable;
            };

            ChipStack.prototype.onActiveChipClicked = function () {
                var _this = this;
                if (!this.activeEnabled) {
                    return;
                }

                var newInactiveChip = this.activeChips.pop();
                this.inactiveChips.push(newInactiveChip);
                newInactiveChip.style.top = this.inactiveOffset + (this.inactiveChips.length * -10) + "px";
                newInactiveChip.onclick = function (event) {
                    _this.onInactiveChipClicked();
                };

                this.chipStackChanged.dispatch(this.betType, false);
            };

            ChipStack.prototype.onInactiveChipClicked = function () {
                var _this = this;
                var newActiveChip = this.inactiveChips.pop();
                newActiveChip.style.top = this.activeOffset + (this.activeChips.length * -10) + "px";
                newActiveChip.onclick = null;
                this.activeChips.push(newActiveChip);

                newActiveChip.onclick = function (event) {
                    _this.onActiveChipClicked();
                };

                this.chipStackChanged.dispatch(this.betType, true);
            };
            return ChipStack;
        })();
        choosehand.ChipStack = ChipStack;
    })(views.choosehand || (views.choosehand = {}));
    var choosehand = views.choosehand;
})(views || (views = {}));
//# sourceMappingURL=chipStack.js.map
