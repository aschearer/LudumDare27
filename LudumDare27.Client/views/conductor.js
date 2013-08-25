/// <reference path="../viewmodels/conductor.ts" />
/// <reference path="states/istate.ts"/>
var views;
(function (views) {
    var Conductor = (function () {
        function Conductor(conductor) {
            var _this = this;
            this.onPushed = function (viewmodel, replaced) {
                var previousView = _this.stack.length > 0 ? _this.peek() : null;
                var nextView = _this.createView(viewmodel);

                if (previousView != null) {
                    console.debug("Exiting " + (replaced ? "(Replaced) " : "(Pushed) ") + previousView.id);
                    previousView.exit(nextView);
                    previousView.layer.classList.remove('active-layer');
                    nextView.layer.classList.add('active-layer');

                    if (replaced) {
                        _this.stack.pop();
                    }
                }

                console.debug("Entering " + nextView.id);
                nextView.enter(previousView);
                _this.stack.push(nextView);
            };
            this.onPopped = function () {
                var popped = _this.stack.pop();
                var nextState = _this.peek();
                console.debug("Exiting (Popped) " + popped.id);
                popped.exit(nextState);
                popped.layer.classList.remove('active-layer');
                console.debug("Entering " + nextState.id);
                nextState.enter(popped);
                nextState.layer.classList.add('active-layer');
            };
            this.stack = [];
            this.conductor = conductor;
            this.conductor.pushed.add(this.onPushed);
            this.conductor.popped.add(this.onPopped);
        }
        Conductor.prototype.createView = function (viewmodel) {
            var viewName = viewmodel.id.replace('viewmodels', 'views');

            var modules = viewName.split('.');
            var viewConstructor = window;
            for (var i = 0; i < modules.length; i++) {
                viewConstructor = viewConstructor[modules[i]];
            }

            var view = Object.create(viewConstructor.prototype);
            view.constructor.apply(view, [viewmodel]);

            return view;
        };

        Conductor.prototype.peek = function () {
            return this.stack[this.stack.length - 1];
        };
        return Conductor;
    })();
    views.Conductor = Conductor;
})(views || (views = {}));
//# sourceMappingURL=conductor.js.map
