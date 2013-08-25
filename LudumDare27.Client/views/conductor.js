/// <reference path="../viewmodels/conductor.ts" />
/// <reference path="states/istate.ts"/>
var views;
(function (views) {
    var Conductor = (function () {
        function Conductor(conductor) {
            var _this = this;
            this.onPushed = function (viewModel) {
                // create view for viewmodel
            };
            this.onPopped = function () {
                var popped = _this.stack.pop();
                var nextState = _this.stack[_this.stack.length - 1];
                popped.exit(nextState);
            };
            this.stack = [];
            this.conductor = conductor;
            this.conductor.pushed.add(this.onPushed);
            this.conductor.popped.add(this.onPopped);
        }
        return Conductor;
    })();
    views.Conductor = Conductor;
})(views || (views = {}));
//# sourceMappingURL=conductor.js.map
