var views;
(function (views) {
    (function (choosehand) {
        var ChipStack = (function () {
            function ChipStack(root, column, betType, numberOfChips) {
                this.activeEnabled = true;
                this.topOffset = -300;
                this.activeOffset = 200;
                this.inactiveOffset = 560;
                this.bottomOffset = 700;
                this.chipStackChanged = new Signal();
                this.root = root;
                this.betType = betType;
                this.column = column;
                this.numberOfChips = numberOfChips;
                this.activeChips = [];
                this.inactiveChips = [];
            }
            ChipStack.prototype.reset = function () {
                var _this = this;
                while (this.activeChips.length > 0) {
                    this.root.removeChild(this.activeChips.pop());
                }

                while (this.inactiveChips.length > 0) {
                    this.root.removeChild(this.inactiveChips.pop());
                }

                var x = (20 + 128 * this.column + 82 * (this.column));
                for (var i = 0; i < this.numberOfChips; i++) {
                    var chip = new choosehand.Chip(this.betType);
                    var chipElement = chip.createElement(x, this.topOffset, i * 10);
                    this.activeChips.push(chipElement);
                    this.root.appendChild(chipElement);
                }

                var that = this;
                window.setTimeout(function () {
                    for (var j = 0; j < that.activeChips.length; j++) {
                        that.activeChips[j].style.top = that.activeOffset + (j * -10) + "px";
                    }
                }, 200 * (this.column + 1));

                this.peek(this.activeChips).onclick = function (event) {
                    _this.onActiveChipClicked();
                };
            };

            ChipStack.prototype.setActiveEnabled = function (enable) {
                this.activeEnabled = enable;
            };

            ChipStack.prototype.commit = function () {
                for (var i = 0; i < this.activeChips.length; i++) {
                    this.activeChips[i].style.top = this.topOffset + "px";
                }

                if (this.inactiveChips.length > 0) {
                    this.peek(this.inactiveChips).style.top = this.bottomOffset + "px";
                }
            };

            ChipStack.prototype.peek = function (stack) {
                return stack[stack.length - 1];
            };

            ChipStack.prototype.onActiveChipClicked = function () {
                var _this = this;
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
                    this.peek(this.activeChips).onclick = function (event) {
                        _this.onActiveChipClicked();
                    };
                }

                this.peek(this.inactiveChips).onclick = function (event) {
                    _this.onInactiveChipClicked();
                };

                this.chipStackChanged.dispatch(this.betType, false);
            };

            ChipStack.prototype.onInactiveChipClicked = function () {
                var _this = this;
                this.peek(this.inactiveChips).style.top = this.activeOffset + (this.activeChips.length * -10) + "px";
                this.peek(this.inactiveChips).onclick = null;
                if (this.activeChips.length > 0) {
                    this.peek(this.activeChips).onclick = null;
                }

                this.activeChips.push(this.peek(this.inactiveChips));
                this.inactiveChips.pop();

                if (this.inactiveChips.length > 0) {
                    this.peek(this.inactiveChips).style.top = this.inactiveOffset + "px";
                }

                this.peek(this.activeChips).onclick = function (event) {
                    _this.onActiveChipClicked();
                };

                if (this.inactiveChips.length > 0) {
                    this.peek(this.inactiveChips).onclick = function (event) {
                        _this.onInactiveChipClicked();
                    };
                }

                this.chipStackChanged.dispatch(this.betType, true);
            };
            return ChipStack;
        })();
        choosehand.ChipStack = ChipStack;
    })(views.choosehand || (views.choosehand = {}));
    var choosehand = views.choosehand;
})(views || (views = {}));
//# sourceMappingURL=chipStack.js.map
