var views;
(function (views) {
    (function (choosehand) {
        var ChipStack = (function () {
            function ChipStack(root, column, color, numberOfChips) {
                this.root = root;
                this.color = color;
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

                for (var i = 0; i < this.numberOfChips; i++) {
                    var chip = document.createElement('div');
                    chip.classList.add('chip');
                    chip.classList.add(this.color);
                    chip.style.left = (20 + 168 * this.column + 104 * (this.column)) + "px";
                    chip.style.top = "-300px";
                    chip.style.zIndex = (i * 10) + "";
                    this.activeChips.push(chip);
                    this.root.appendChild(chip);
                }

                var that = this;
                window.setTimeout(function () {
                    for (var j = 0; j < that.activeChips.length; j++) {
                        that.activeChips[j].style.top = 260 + (j * -10) + "px";
                    }
                }, 200 * this.column);

                this.peek(this.activeChips).onclick = function (event) {
                    _this.onActiveChipClicked();
                };
            };

            ChipStack.prototype.commit = function () {
                for (var i = 0; i < this.activeChips.length; i++) {
                    this.activeChips[i].style.top = "-300px";
                }

                if (this.inactiveChips.length > 0) {
                    this.peek(this.inactiveChips).style.top = "820px";
                }
            };

            ChipStack.prototype.peek = function (stack) {
                return stack[stack.length - 1];
            };

            ChipStack.prototype.onActiveChipClicked = function () {
                var _this = this;
                this.peek(this.activeChips).style.top = "720px";
                this.peek(this.activeChips).onclick = null;
                if (this.inactiveChips.length > 0) {
                    this.peek(this.inactiveChips).onclick = null;
                    this.peek(this.inactiveChips).style.top = "820px";
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
            };

            ChipStack.prototype.onInactiveChipClicked = function () {
                var _this = this;
                this.peek(this.inactiveChips).style.top = 260 + (this.activeChips.length * -10) + "px";
                this.peek(this.inactiveChips).onclick = null;
                if (this.activeChips.length > 0) {
                    this.peek(this.activeChips).onclick = null;
                }

                this.activeChips.push(this.peek(this.inactiveChips));
                this.inactiveChips.pop();

                if (this.inactiveChips.length > 0) {
                    this.peek(this.inactiveChips).style.top = "720px";
                }

                this.peek(this.activeChips).onclick = function (event) {
                    _this.onActiveChipClicked();
                };

                if (this.inactiveChips.length > 0) {
                    this.peek(this.inactiveChips).onclick = function (event) {
                        _this.onInactiveChipClicked();
                    };
                }
            };
            return ChipStack;
        })();
        choosehand.ChipStack = ChipStack;
    })(views.choosehand || (views.choosehand = {}));
    var choosehand = views.choosehand;
})(views || (views = {}));
//# sourceMappingURL=chipStack.js.map
