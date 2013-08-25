this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            throw"UID cannot be instantiated";
        };
    c._nextID = 0;
    c.get = function()
    {
        return c._nextID++
    };
    createjs.UID = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            this.initialize()
        },
        a = c.prototype;
    c.initialize = function(b)
    {
        b.addEventListener = a.addEventListener;
        b.removeEventListener = a.removeEventListener;
        b.removeAllEventListeners = a.removeAllEventListeners;
        b.hasEventListener = a.hasEventListener;
        b.dispatchEvent = a.dispatchEvent
    };
    a._listeners = null;
    a.initialize = function(){};
    a.addEventListener = function(b, g)
    {
        var d = this._listeners;
        d ? this.removeEventListener(b, g) : d = this._listeners = {};
        var a = d[b];
        a || (a = d[b] = []);
        a.push(g);
        return g
    };
    a.removeEventListener = function(b, g)
    {
        var d = this._listeners;
        if (d)
        {
            var a = d[b];
            if (a)
                for (var c = 0, e = a.length; c < e; c++)
                    if (a[c] == g)
                    {
                        1 == e ? delete d[b] : a.splice(c, 1);
                        break
                    }
        }
    };
    a.removeAllEventListeners = function(b)
    {
        b ? this._listeners && delete this._listeners[b] : this._listeners = null
    };
    a.dispatchEvent = function(b, g)
    {
        var d = !1,
            a = this._listeners;
        if (b && a)
        {
            "string" == typeof b && (b = {type: b});
            a = a[b.type];
            if (!a)
                return d;
            b.target = g || this;
            for (var a = a.slice(), c = 0, e = a.length; c < e; c++)
                var h = a[c],
                    d = h.handleEvent ? d || h.handleEvent(b) : d || h(b)
        }
        return !!d
    };
    a.hasEventListener = function(b)
    {
        var g = this._listeners;
        return !(!g || !g[b])
    };
    a.toString = function()
    {
        return "[EventDispatcher]"
    };
    createjs.EventDispatcher = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            throw"Ticker cannot be instantiated.";
        };
    c.useRAF = !1;
    c.addEventListener = null;
    c.removeEventListener = null;
    c.removeAllEventListeners = null;
    c.dispatchEvent = null;
    c.hasEventListener = null;
    c._listeners = null;
    createjs.EventDispatcher.initialize(c);
    c._listeners = null;
    c._pauseable = null;
    c._paused = !1;
    c._inited = !1;
    c._startTime = 0;
    c._pausedTime = 0;
    c._ticks = 0;
    c._pausedTicks = 0;
    c._interval = 50;
    c._lastTime = 0;
    c._times = null;
    c._tickTimes = null;
    c._rafActive = !1;
    c._timeoutID = null;
    c.addListener = function(b, g)
    {
        null != b && (c.removeListener(b), c._pauseable[c._listeners.length] = null == g ? !0 : g, c._listeners.push(b))
    };
    c.init = function()
    {
        c._inited = !0;
        c._times = [];
        c._tickTimes = [];
        c._pauseable = [];
        c._listeners = [];
        c._times.push(c._lastTime = c._startTime = c._getTime());
        c.setInterval(c._interval)
    };
    c.removeListener = function(b)
    {
        var g = c._listeners;
        g && (b = g.indexOf(b), -1 != b && (g.splice(b, 1), c._pauseable.splice(b, 1)))
    };
    c.removeAllListeners = function()
    {
        c._listeners = [];
        c._pauseable = []
    };
    c.setInterval = function(b)
    {
        c._interval = b;
        c._inited && c._setupTick()
    };
    c.getInterval = function()
    {
        return c._interval
    };
    c.setFPS = function(b)
    {
        c.setInterval(1E3 / b)
    };
    c.getFPS = function()
    {
        return 1E3 / c._interval
    };
    c.getMeasuredFPS = function(b)
    {
        if (2 > c._times.length)
            return -1;
        null == b && (b = c.getFPS() | 0);
        b = Math.min(c._times.length - 1, b);
        return 1E3 / ((c._times[0] - c._times[b]) / b)
    };
    c.setPaused = function(b)
    {
        c._paused = b
    };
    c.getPaused = function()
    {
        return c._paused
    };
    c.getTime = function(b)
    {
        return c._getTime() - c._startTime - (b ? c._pausedTime : 0)
    };
    c.getTicks = function(b)
    {
        return c._ticks - (b ? c._pausedTicks : 0)
    };
    c._handleAF = function()
    {
        c._rafActive = !1;
        c._setupTick();
        c._getTime() - c._lastTime >= 0.97 * (c._interval - 1) && c._tick()
    };
    c._handleTimeout = function()
    {
        c.timeoutID = null;
        c._setupTick();
        c._tick()
    };
    c._setupTick = function()
    {
        if (!(c._rafActive || null != c.timeoutID))
        {
            if (c.useRAF)
            {
                var b = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
                if (b)
                {
                    b(c._handleAF);
                    c._rafActive = !0;
                    return
                }
            }
            c.timeoutID = setTimeout(c._handleTimeout, c._interval)
        }
    };
    c._tick = function()
    {
        var b = c._getTime();
        c._ticks++;
        var g = b - c._lastTime,
            d = c._paused;
        d && (c._pausedTicks++, c._pausedTime += g);
        c._lastTime = b;
        for (var a = c._pauseable, f = c._listeners.slice(), e = f ? f.length : 0, h = 0; h < e; h++)
        {
            var m = f[h];
            null == m || d && a[h] || (m.tick ? m.tick(g, d) : m instanceof Function && m(g, d))
        }
        c.dispatchEvent({
            type: "tick", paused: d, delta: g, time: b, runTime: b - c._pausedTime
        });
        for (c._tickTimes.unshift(c._getTime() - b); 100 < c._tickTimes.length; )
            c._tickTimes.pop();
        for (c._times.unshift(b); 100 < c._times.length; )
            c._times.pop()
    };
    var a = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
    c._getTime = function()
    {
        return a && a.call(performance) || (new Date).getTime()
    };
    c.init();
    createjs.Ticker = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, g, d, a, c, e, h, m, k)
        {
            this.initialize(b, g, d, a, c, e, h, m, k)
        },
        a = c.prototype;
    a.stageX = 0;
    a.stageY = 0;
    a.rawX = 0;
    a.rawY = 0;
    a.type = null;
    a.nativeEvent = null;
    a.onMouseMove = null;
    a.onMouseUp = null;
    a.target = null;
    a.pointerID = 0;
    a.primary = !1;
    a.addEventListener = null;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a.initialize = function(b, g, d, a, c, e, h, m, k)
    {
        this.type = b;
        this.stageX = g;
        this.stageY = d;
        this.target = a;
        this.nativeEvent = c;
        this.pointerID = e;
        this.primary = h;
        this.rawX = null == m ? g : m;
        this.rawY = null == k ? d : k
    };
    a.clone = function()
    {
        return new c(this.type, this.stageX, this.stageY, this.target, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY)
    };
    a.toString = function()
    {
        return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
    };
    createjs.MouseEvent = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, g, d, a, c, e)
        {
            this.initialize(b, g, d, a, c, e)
        },
        a = c.prototype;
    c.identity = null;
    c.DEG_TO_RAD = Math.PI / 180;
    a.a = 1;
    a.b = 0;
    a.c = 0;
    a.d = 1;
    a.tx = 0;
    a.ty = 0;
    a.alpha = 1;
    a.shadow = null;
    a.compositeOperation = null;
    a.initialize = function(b, g, d, a, c, e)
    {
        null != b && (this.a = b);
        this.b = g || 0;
        this.c = d || 0;
        null != a && (this.d = a);
        this.tx = c || 0;
        this.ty = e || 0;
        return this
    };
    a.prepend = function(b, g, d, a, c, e)
    {
        var h = this.tx;
        if (1 != b || 0 != g || 0 != d || 1 != a)
        {
            var m = this.a,
                k = this.c;
            this.a = m * b + this.b * d;
            this.b = m * g + this.b * a;
            this.c = k * b + this.d * d;
            this.d = k * g + this.d * a
        }
        this.tx = h * b + this.ty * d + c;
        this.ty = h * g + this.ty * a + e;
        return this
    };
    a.append = function(b, g, d, a, c, e)
    {
        var h = this.a,
            m = this.b,
            k = this.c,
            p = this.d;
        this.a = b * h + g * k;
        this.b = b * m + g * p;
        this.c = d * h + a * k;
        this.d = d * m + a * p;
        this.tx = c * h + e * k + this.tx;
        this.ty = c * m + e * p + this.ty;
        return this
    };
    a.prependMatrix = function(b)
    {
        this.prepend(b.a, b.b, b.c, b.d, b.tx, b.ty);
        this.prependProperties(b.alpha, b.shadow, b.compositeOperation);
        return this
    };
    a.appendMatrix = function(b)
    {
        this.append(b.a, b.b, b.c, b.d, b.tx, b.ty);
        this.appendProperties(b.alpha, b.shadow, b.compositeOperation);
        return this
    };
    a.prependTransform = function(b, g, d, a, f, e, h, m, k)
    {
        if (f % 360)
        {
            var p = f * c.DEG_TO_RAD;
            f = Math.cos(p);
            p = Math.sin(p)
        }
        else
            f = 1,
            p = 0;
        if (m || k)
            this.tx -= m,
            this.ty -= k;
        e || h ? (e *= c.DEG_TO_RAD, h *= c.DEG_TO_RAD, this.prepend(f * d, p * d, -p * a, f * a, 0, 0), this.prepend(Math.cos(h), Math.sin(h), -Math.sin(e), Math.cos(e), b, g)) : this.prepend(f * d, p * d, -p * a, f * a, b, g);
        return this
    };
    a.appendTransform = function(b, g, d, a, f, e, h, m, k)
    {
        if (f % 360)
        {
            var p = f * c.DEG_TO_RAD;
            f = Math.cos(p);
            p = Math.sin(p)
        }
        else
            f = 1,
            p = 0;
        e || h ? (e *= c.DEG_TO_RAD, h *= c.DEG_TO_RAD, this.append(Math.cos(h), Math.sin(h), -Math.sin(e), Math.cos(e), b, g), this.append(f * d, p * d, -p * a, f * a, 0, 0)) : this.append(f * d, p * d, -p * a, f * a, b, g);
        if (m || k)
            this.tx -= m * this.a + k * this.c,
            this.ty -= m * this.b + k * this.d;
        return this
    };
    a.rotate = function(b)
    {
        var g = Math.cos(b);
        b = Math.sin(b);
        var d = this.a,
            a = this.c,
            c = this.tx;
        this.a = d * g - this.b * b;
        this.b = d * b + this.b * g;
        this.c = a * g - this.d * b;
        this.d = a * b + this.d * g;
        this.tx = c * g - this.ty * b;
        this.ty = c * b + this.ty * g;
        return this
    };
    a.skew = function(b, g)
    {
        b *= c.DEG_TO_RAD;
        g *= c.DEG_TO_RAD;
        this.append(Math.cos(g), Math.sin(g), -Math.sin(b), Math.cos(b), 0, 0);
        return this
    };
    a.scale = function(b, g)
    {
        this.a *= b;
        this.d *= g;
        this.c *= b;
        this.b *= g;
        this.tx *= b;
        this.ty *= g;
        return this
    };
    a.translate = function(b, g)
    {
        this.tx += b;
        this.ty += g;
        return this
    };
    a.identity = function()
    {
        this.alpha = this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        this.shadow = this.compositeOperation = null;
        return this
    };
    a.invert = function()
    {
        var b = this.a,
            g = this.b,
            d = this.c,
            a = this.d,
            c = this.tx,
            e = b * a - g * d;
        this.a = a / e;
        this.b = -g / e;
        this.c = -d / e;
        this.d = b / e;
        this.tx = (d * this.ty - a * c) / e;
        this.ty = -(b * this.ty - g * c) / e;
        return this
    };
    a.isIdentity = function()
    {
        return 0 == this.tx && 0 == this.ty && 1 == this.a && 0 == this.b && 0 == this.c && 1 == this.d
    };
    a.decompose = function(b)
    {
        null == b && (b = {});
        b.x = this.tx;
        b.y = this.ty;
        b.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        b.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
        var g = Math.atan2(-this.c, this.d),
            d = Math.atan2(this.b, this.a);
        g == d ? (b.rotation = d / c.DEG_TO_RAD, 0 > this.a && 0 <= this.d && (b.rotation += 0 >= b.rotation ? 180 : -180), b.skewX = b.skewY = 0) : (b.skewX = g / c.DEG_TO_RAD, b.skewY = d / c.DEG_TO_RAD);
        return b
    };
    a.reinitialize = function(b, g, d, a, c, e, h, m, k)
    {
        this.initialize(b, g, d, a, c, e);
        this.alpha = h || 1;
        this.shadow = m;
        this.compositeOperation = k;
        return this
    };
    a.appendProperties = function(b, g, d)
    {
        this.alpha *= b;
        this.shadow = g || this.shadow;
        this.compositeOperation = d || this.compositeOperation;
        return this
    };
    a.prependProperties = function(b, g, d)
    {
        this.alpha *= b;
        this.shadow = this.shadow || g;
        this.compositeOperation = this.compositeOperation || d;
        return this
    };
    a.clone = function()
    {
        var b = new c(this.a, this.b, this.c, this.d, this.tx, this.ty);
        b.shadow = this.shadow;
        b.alpha = this.alpha;
        b.compositeOperation = this.compositeOperation;
        return b
    };
    a.toString = function()
    {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
    };
    c.identity = new c(1, 0, 0, 1, 0, 0);
    createjs.Matrix2D = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, g)
        {
            this.initialize(b, g)
        },
        a = c.prototype;
    a.x = 0;
    a.y = 0;
    a.initialize = function(b, g)
    {
        this.x = null == b ? 0 : b;
        this.y = null == g ? 0 : g
    };
    a.clone = function()
    {
        return new c(this.x, this.y)
    };
    a.toString = function()
    {
        return "[Point (x=" + this.x + " y=" + this.y + ")]"
    };
    createjs.Point = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, g, d, a)
        {
            this.initialize(b, g, d, a)
        },
        a = c.prototype;
    a.x = 0;
    a.y = 0;
    a.width = 0;
    a.height = 0;
    a.initialize = function(b, g, d, a)
    {
        this.x = null == b ? 0 : b;
        this.y = null == g ? 0 : g;
        this.width = null == d ? 0 : d;
        this.height = null == a ? 0 : a
    };
    a.clone = function()
    {
        return new c(this.x, this.y, this.width, this.height)
    };
    a.toString = function()
    {
        return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
    };
    createjs.Rectangle = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, g, d, a, c, e, h)
        {
            this.initialize(b, g, d, a, c, e, h)
        },
        a = c.prototype;
    a.target = null;
    a.overLabel = null;
    a.outLabel = null;
    a.downLabel = null;
    a.play = !1;
    a._isPressed = !1;
    a._isOver = !1;
    a.initialize = function(b, g, d, a, c, e, h)
    {
        b.addEventListener && (this.target = b, b.cursor = "pointer", this.overLabel = null == d ? "over" : d, this.outLabel = null == g ? "out" : g, this.downLabel = null == a ? "down" : a, this.play = c, this.setEnabled(!0), this.handleEvent({}), e && (h && (e.actionsEnabled = !1, e.gotoAndStop && e.gotoAndStop(h)), b.hitArea = e))
    };
    a.setEnabled = function(b)
    {
        var g = this.target;
        b ? (g.addEventListener("mouseover", this), g.addEventListener("mouseout", this), g.addEventListener("mousedown", this)) : (g.removeEventListener("mouseover", this), g.removeEventListener("mouseout", this), g.removeEventListener("mousedown", this))
    };
    a.toString = function()
    {
        return "[ButtonHelper]"
    };
    a.handleEvent = function(b)
    {
        var g = this.target,
            d = b.type;
        "mousedown" == d ? (b.addEventListener("mouseup", this), this._isPressed = !0, b = this.downLabel) : "mouseup" == d ? (this._isPressed = !1, b = this._isOver ? this.overLabel : this.outLabel) : "mouseover" == d ? (this._isOver = !0, b = this._isPressed ? this.downLabel : this.overLabel) : (this._isOver = !1, b = this._isPressed ? this.overLabel : this.outLabel);
        this.play ? g.gotoAndPlay && g.gotoAndPlay(b) : g.gotoAndStop && g.gotoAndStop(b)
    };
    createjs.ButtonHelper = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, g, d, a)
        {
            this.initialize(b, g, d, a)
        },
        a = c.prototype;
    c.identity = null;
    a.color = null;
    a.offsetX = 0;
    a.offsetY = 0;
    a.blur = 0;
    a.initialize = function(b, g, d, a)
    {
        this.color = b;
        this.offsetX = g;
        this.offsetY = d;
        this.blur = a
    };
    a.toString = function()
    {
        return "[Shadow]"
    };
    a.clone = function()
    {
        return new c(this.color, this.offsetX, this.offsetY, this.blur)
    };
    c.identity = new c("transparent", 0, 0, 0);
    createjs.Shadow = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b)
        {
            this.initialize(b)
        },
        a = c.prototype;
    a.complete = !0;
    a.onComplete = null;
    a.addEventListener = null;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a._animations = null;
    a._frames = null;
    a._images = null;
    a._data = null;
    a._loadCount = 0;
    a._frameHeight = 0;
    a._frameWidth = 0;
    a._numFrames = 0;
    a._regX = 0;
    a._regY = 0;
    a.initialize = function(b)
    {
        var g,
            d,
            a;
        if (null != b)
        {
            if (b.images && 0 < (d = b.images.length))
            {
                a = this._images = [];
                for (g = 0; g < d; g++)
                {
                    var c = b.images[g];
                    if ("string" == typeof c)
                    {
                        var e = c,
                            c = new Image;
                        c.src = e
                    }
                    a.push(c);
                    !c.getContext && !c.complete && (this._loadCount++, this.complete = !1, function(b)
                        {
                            c.onload = function()
                            {
                                b._handleImageLoad()
                            }
                        }(this))
                }
            }
            if (null != b.frames)
                if (b.frames instanceof Array)
                {
                    this._frames = [];
                    a = b.frames;
                    g = 0;
                    for (d = a.length; g < d; g++)
                        e = a[g],
                        this._frames.push({
                            image: this._images[e[4] ? e[4] : 0], rect: new createjs.Rectangle(e[0], e[1], e[2], e[3]), regX: e[5] || 0, regY: e[6] || 0
                        })
                }
                else
                    d = b.frames,
                    this._frameWidth = d.width,
                    this._frameHeight = d.height,
                    this._regX = d.regX || 0,
                    this._regY = d.regY || 0,
                    this._numFrames = d.count,
                    0 == this._loadCount && this._calculateFrames();
            if (null != (d = b.animations))
            {
                this._animations = [];
                this._data = {};
                for (var h in d)
                {
                    b = {name: h};
                    e = d[h];
                    if ("number" == typeof e)
                        a = b.frames = [e];
                    else if (e instanceof Array)
                        if (1 == e.length)
                            b.frames = [e[0]];
                        else
                        {
                            b.frequency = e[3];
                            b.next = e[2];
                            a = b.frames = [];
                            for (g = e[0]; g <= e[1]; g++)
                                a.push(g)
                        }
                    else
                        b.frequency = e.frequency,
                        b.next = e.next,
                        g = e.frames,
                        a = b.frames = "number" == typeof g ? [g] : g.slice(0);
                    b.next = 2 > a.length || !1 == b.next ? null : null == b.next || !0 == b.next ? h : b.next;
                    b.frequency || (b.frequency = 1);
                    this._animations.push(h);
                    this._data[h] = b
                }
            }
        }
    };
    a.getNumFrames = function(b)
    {
        if (null == b)
            return this._frames ? this._frames.length : this._numFrames;
        b = this._data[b];
        return null == b ? 0 : b.frames.length
    };
    a.getAnimations = function()
    {
        return this._animations.slice(0)
    };
    a.getAnimation = function(b)
    {
        return this._data[b]
    };
    a.getFrame = function(b)
    {
        var g;
        return this.complete && this._frames && (g = this._frames[b]) ? g : null
    };
    a.getFrameBounds = function(b)
    {
        return (b = this.getFrame(b)) ? new createjs.Rectangle(-b.regX, -b.regY, b.rect.width, b.rect.height) : null
    };
    a.toString = function()
    {
        return "[SpriteSheet]"
    };
    a.clone = function()
    {
        var b = new c;
        b.complete = this.complete;
        b._animations = this._animations;
        b._frames = this._frames;
        b._images = this._images;
        b._data = this._data;
        b._frameHeight = this._frameHeight;
        b._frameWidth = this._frameWidth;
        b._numFrames = this._numFrames;
        b._loadCount = this._loadCount;
        return b
    };
    a._handleImageLoad = function()
    {
        0 == --this._loadCount && (this._calculateFrames(), this.complete = !0, this.onComplete && this.onComplete(), this.dispatchEvent("complete"))
    };
    a._calculateFrames = function()
    {
        if (!(this._frames || 0 == this._frameWidth))
        {
            this._frames = [];
            for (var b = 0, g = this._frameWidth, d = this._frameHeight, a = 0, c = this._images; a < c.length; a++)
            {
                for (var e = c[a], h = (e.width + 1) / g | 0, m = (e.height + 1) / d | 0, m = 0 < this._numFrames ? Math.min(this._numFrames - b, h * m) : h * m, k = 0; k < m; k++)
                    this._frames.push({
                        image: e, rect: new createjs.Rectangle(k % h * g, (k / h | 0) * d, g, d), regX: this._regX, regY: this._regY
                    });
                b += m
            }
            this._numFrames = b
        }
    };
    createjs.SpriteSheet = c
})();
this.createjs = this.createjs || {};
(function()
{
    function c(b, d, a)
    {
        this.f = b;
        this.params = d;
        this.path = null == a ? !0 : a
    }
    c.prototype.exec = function(b)
    {
        this.f.apply(b, this.params)
    };
    var a = function()
        {
            this.initialize()
        },
        b = a.prototype;
    a.getRGB = function(b, d, a, c)
    {
        null != b && null == a && (c = d, a = b & 255, d = b >> 8 & 255, b = b >> 16 & 255);
        return null == c ? "rgb(" + b + "," + d + "," + a + ")" : "rgba(" + b + "," + d + "," + a + "," + c + ")"
    };
    a.getHSL = function(b, d, a, c)
    {
        return null == c ? "hsl(" + b % 360 + "," + d + "%," + a + "%)" : "hsla(" + b % 360 + "," + d + "%," + a + "%," + c + ")"
    };
    a.BASE_64 = {
        A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9, K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19, U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25, a: 26, b: 27, c: 28, d: 29, e: 30, f: 31, g: 32, h: 33, i: 34, j: 35, k: 36, l: 37, m: 38, n: 39, o: 40, p: 41, q: 42, r: 43, s: 44, t: 45, u: 46, v: 47, w: 48, x: 49, y: 50, z: 51, "0": 52, 1: 53, 2: 54, 3: 55, 4: 56, 5: 57, 6: 58, 7: 59, 8: 60, 9: 61, "+": 62, "/": 63
    };
    a.STROKE_CAPS_MAP = ["butt", "round", "square"];
    a.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
    a._ctx = (createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")).getContext("2d");
    a.beginCmd = new c(a._ctx.beginPath, [], !1);
    a.fillCmd = new c(a._ctx.fill, [], !1);
    a.strokeCmd = new c(a._ctx.stroke, [], !1);
    b._strokeInstructions = null;
    b._strokeStyleInstructions = null;
    b._ignoreScaleStroke = !1;
    b._fillInstructions = null;
    b._instructions = null;
    b._oldInstructions = null;
    b._activeInstructions = null;
    b._active = !1;
    b._dirty = !1;
    b.initialize = function()
    {
        this.clear();
        this._ctx = a._ctx
    };
    b.isEmpty = function()
    {
        return !(this._instructions.length || this._oldInstructions.length || this._activeInstructions.length)
    };
    b.draw = function(b)
    {
        this._dirty && this._updateInstructions();
        for (var d = this._instructions, a = 0, c = d.length; a < c; a++)
            d[a].exec(b)
    };
    b.drawAsPath = function(b)
    {
        this._dirty && this._updateInstructions();
        for (var d, a = this._instructions, c = 0, e = a.length; c < e; c++)
            ((d = a[c]).path || 0 == c) && d.exec(b)
    };
    b.moveTo = function(b, d)
    {
        this._activeInstructions.push(new c(this._ctx.moveTo, [b, d]));
        return this
    };
    b.lineTo = function(b, d)
    {
        this._dirty = this._active = !0;
        this._activeInstructions.push(new c(this._ctx.lineTo, [b, d]));
        return this
    };
    b.arcTo = function(b, d, a, f, e)
    {
        this._dirty = this._active = !0;
        this._activeInstructions.push(new c(this._ctx.arcTo, [b, d, a, f, e]));
        return this
    };
    b.arc = function(b, d, a, f, e, h)
    {
        this._dirty = this._active = !0;
        null == h && (h = !1);
        this._activeInstructions.push(new c(this._ctx.arc, [b, d, a, f, e, h]));
        return this
    };
    b.quadraticCurveTo = function(b, d, a, f)
    {
        this._dirty = this._active = !0;
        this._activeInstructions.push(new c(this._ctx.quadraticCurveTo, [b, d, a, f]));
        return this
    };
    b.bezierCurveTo = function(b, d, a, f, e, h)
    {
        this._dirty = this._active = !0;
        this._activeInstructions.push(new c(this._ctx.bezierCurveTo, [b, d, a, f, e, h]));
        return this
    };
    b.rect = function(b, d, a, f)
    {
        this._dirty = this._active = !0;
        this._activeInstructions.push(new c(this._ctx.rect, [b, d, a, f]));
        return this
    };
    b.closePath = function()
    {
        this._active && (this._dirty = !0, this._activeInstructions.push(new c(this._ctx.closePath, [])));
        return this
    };
    b.clear = function()
    {
        this._instructions = [];
        this._oldInstructions = [];
        this._activeInstructions = [];
        this._strokeStyleInstructions = this._strokeInstructions = this._fillInstructions = null;
        this._active = this._dirty = !1;
        return this
    };
    b.beginFill = function(b)
    {
        this._active && this._newPath();
        this._fillInstructions = b ? [new c(this._setProp, ["fillStyle", b], !1), a.fillCmd] : null;
        return this
    };
    b.beginLinearGradientFill = function(b, d, j, f, e, h)
    {
        this._active && this._newPath();
        j = this._ctx.createLinearGradient(j, f, e, h);
        f = 0;
        for (e = b.length; f < e; f++)
            j.addColorStop(d[f], b[f]);
        this._fillInstructions = [new c(this._setProp, ["fillStyle", j], !1), a.fillCmd];
        return this
    };
    b.beginRadialGradientFill = function(b, d, j, f, e, h, m, k)
    {
        this._active && this._newPath();
        j = this._ctx.createRadialGradient(j, f, e, h, m, k);
        f = 0;
        for (e = b.length; f < e; f++)
            j.addColorStop(d[f], b[f]);
        this._fillInstructions = [new c(this._setProp, ["fillStyle", j], !1), a.fillCmd];
        return this
    };
    b.beginBitmapFill = function(b, d, j)
    {
        this._active && this._newPath();
        b = this._ctx.createPattern(b, d || "");
        b = new c(this._setProp, ["fillStyle", b], !1);
        this._fillInstructions = j ? [b, new c(this._ctx.save, [], !1), new c(this._ctx.transform, [j.a, j.b, j.c, j.d, j.tx, j.ty], !1), a.fillCmd, new c(this._ctx.restore, [], !1)] : [b, a.fillCmd];
        return this
    };
    b.endFill = function()
    {
        return this.beginFill()
    };
    b.setStrokeStyle = function(b, d, j, f, e)
    {
        this._active && this._newPath();
        this._strokeStyleInstructions = [new c(this._setProp, ["lineWidth", null == b ? "1" : b], !1), new c(this._setProp, ["lineCap", null == d ? "butt" : isNaN(d) ? d : a.STROKE_CAPS_MAP[d]], !1), new c(this._setProp, ["lineJoin", null == j ? "miter" : isNaN(j) ? j : a.STROKE_JOINTS_MAP[j]], !1), new c(this._setProp, ["miterLimit", null == f ? "10" : f], !1)];
        this._ignoreScaleStroke = e;
        return this
    };
    b.beginStroke = function(b)
    {
        this._active && this._newPath();
        this._strokeInstructions = b ? [new c(this._setProp, ["strokeStyle", b], !1)] : null;
        return this
    };
    b.beginLinearGradientStroke = function(b, d, a, f, e, h)
    {
        this._active && this._newPath();
        a = this._ctx.createLinearGradient(a, f, e, h);
        f = 0;
        for (e = b.length; f < e; f++)
            a.addColorStop(d[f], b[f]);
        this._strokeInstructions = [new c(this._setProp, ["strokeStyle", a], !1)];
        return this
    };
    b.beginRadialGradientStroke = function(b, d, a, f, e, h, m, k)
    {
        this._active && this._newPath();
        a = this._ctx.createRadialGradient(a, f, e, h, m, k);
        f = 0;
        for (e = b.length; f < e; f++)
            a.addColorStop(d[f], b[f]);
        this._strokeInstructions = [new c(this._setProp, ["strokeStyle", a], !1)];
        return this
    };
    b.beginBitmapStroke = function(b, d)
    {
        this._active && this._newPath();
        var a = this._ctx.createPattern(b, d || "");
        this._strokeInstructions = [new c(this._setProp, ["strokeStyle", a], !1)];
        return this
    };
    b.endStroke = function()
    {
        this.beginStroke();
        return this
    };
    b.curveTo = b.quadraticCurveTo;
    b.drawRect = b.rect;
    b.drawRoundRect = function(b, d, a, c, e)
    {
        this.drawRoundRectComplex(b, d, a, c, e, e, e, e);
        return this
    };
    b.drawRoundRectComplex = function(b, d, a, f, e, h, m, k)
    {
        var p = (a < f ? a : f) / 2,
            s = 0,
            r = 0,
            t = 0,
            v = 0;
        0 > e && (e *= s = -1);
        e > p && (e = p);
        0 > h && (h *= r = -1);
        h > p && (h = p);
        0 > m && (m *= t = -1);
        m > p && (m = p);
        0 > k && (k *= v = -1);
        k > p && (k = p);
        this._dirty = this._active = !0;
        var p = this._ctx.arcTo,
            q = this._ctx.lineTo;
        this._activeInstructions.push(new c(this._ctx.moveTo, [b + a - h, d]), new c(p, [b + a + h * r, d - h * r, b + a, d + h, h]), new c(q, [b + a, d + f - m]), new c(p, [b + a + m * t, d + f + m * t, b + a - m, d + f, m]), new c(q, [b + k, d + f]), new c(p, [b - k * v, d + f + k * v, b, d + f - k, k]), new c(q, [b, d + e]), new c(p, [b - e * s, d - e * s, b + e, d, e]), new c(this._ctx.closePath));
        return this
    };
    b.drawCircle = function(b, d, a)
    {
        this.arc(b, d, a, 0, 2 * Math.PI);
        return this
    };
    b.drawEllipse = function(b, d, a, f)
    {
        this._dirty = this._active = !0;
        var e = 0.5522848 * (a / 2),
            h = 0.5522848 * (f / 2),
            m = b + a,
            k = d + f;
        a = b + a / 2;
        f = d + f / 2;
        this._activeInstructions.push(new c(this._ctx.moveTo, [b, f]), new c(this._ctx.bezierCurveTo, [b, f - h, a - e, d, a, d]), new c(this._ctx.bezierCurveTo, [a + e, d, m, f - h, m, f]), new c(this._ctx.bezierCurveTo, [m, f + h, a + e, k, a, k]), new c(this._ctx.bezierCurveTo, [a - e, k, b, f + h, b, f]));
        return this
    };
    b.drawPolyStar = function(b, d, a, f, e, h)
    {
        this._dirty = this._active = !0;
        null == e && (e = 0);
        e = 1 - e;
        h = null == h ? 0 : h / (180 / Math.PI);
        var m = Math.PI / f;
        this._activeInstructions.push(new c(this._ctx.moveTo, [b + Math.cos(h) * a, d + Math.sin(h) * a]));
        for (var k = 0; k < f; k++)
            h += m,
            1 != e && this._activeInstructions.push(new c(this._ctx.lineTo, [b + Math.cos(h) * a * e, d + Math.sin(h) * a * e])),
            h += m,
            this._activeInstructions.push(new c(this._ctx.lineTo, [b + Math.cos(h) * a, d + Math.sin(h) * a]));
        return this
    };
    b.decodePath = function(b)
    {
        for (var d = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath], c = [2, 2, 4, 6, 0], f = 0, e = b.length, h = [], m = 0, k = 0, p = a.BASE_64; f < e; )
        {
            var s = b.charAt(f),
                r = p[s],
                t = r >> 3,
                v = d[t];
            if (!v || r & 3)
                throw"bad path data (@" + f + "): " + s;
            s = c[t];
            t || (m = k = 0);
            h.length = 0;
            f++;
            r = (r >> 2 & 1) + 2;
            for (t = 0; t < s; t++)
            {
                var q = p[b.charAt(f)],
                    u = q >> 5 ? -1 : 1,
                    q = (q & 31) << 6 | p[b.charAt(f + 1)];
                3 == r && (q = q << 6 | p[b.charAt(f + 2)]);
                q = u * q / 10;
                t % 2 ? m = q += m : k = q += k;
                h[t] = q;
                f += r
            }
            v.apply(this, h)
        }
        return this
    };
    b.clone = function()
    {
        var b = new a;
        b._instructions = this._instructions.slice();
        b._activeInstructions = this._activeInstructions.slice();
        b._oldInstructions = this._oldInstructions.slice();
        this._fillInstructions && (b._fillInstructions = this._fillInstructions.slice());
        this._strokeInstructions && (b._strokeInstructions = this._strokeInstructions.slice());
        this._strokeStyleInstructions && (b._strokeStyleInstructions = this._strokeStyleInstructions.slice());
        b._active = this._active;
        b._dirty = this._dirty;
        return b
    };
    b.toString = function()
    {
        return "[Graphics]"
    };
    b.mt = b.moveTo;
    b.lt = b.lineTo;
    b.at = b.arcTo;
    b.bt = b.bezierCurveTo;
    b.qt = b.quadraticCurveTo;
    b.a = b.arc;
    b.r = b.rect;
    b.cp = b.closePath;
    b.c = b.clear;
    b.f = b.beginFill;
    b.lf = b.beginLinearGradientFill;
    b.rf = b.beginRadialGradientFill;
    b.bf = b.beginBitmapFill;
    b.ef = b.endFill;
    b.ss = b.setStrokeStyle;
    b.s = b.beginStroke;
    b.ls = b.beginLinearGradientStroke;
    b.rs = b.beginRadialGradientStroke;
    b.bs = b.beginBitmapStroke;
    b.es = b.endStroke;
    b.dr = b.drawRect;
    b.rr = b.drawRoundRect;
    b.rc = b.drawRoundRectComplex;
    b.dc = b.drawCircle;
    b.de = b.drawEllipse;
    b.dp = b.drawPolyStar;
    b.p = b.decodePath;
    b._updateInstructions = function()
    {
        this._instructions = this._oldInstructions.slice();
        this._instructions.push(a.beginCmd);
        this._instructions.push.apply(this._instructions, this._activeInstructions);
        this._fillInstructions && this._instructions.push.apply(this._instructions, this._fillInstructions);
        this._strokeInstructions && (this._strokeStyleInstructions && this._instructions.push.apply(this._instructions, this._strokeStyleInstructions), this._instructions.push.apply(this._instructions, this._strokeInstructions), this._ignoreScaleStroke ? this._instructions.push(new c(this._ctx.save, [], !1), new c(this._ctx.setTransform, [1, 0, 0, 1, 0, 0], !1), a.strokeCmd, new c(this._ctx.restore, [], !1)) : this._instructions.push(a.strokeCmd))
    };
    b._newPath = function()
    {
        this._dirty && this._updateInstructions();
        this._oldInstructions = this._instructions;
        this._activeInstructions = [];
        this._active = this._dirty = !1
    };
    b._setProp = function(b, d)
    {
        this[b] = d
    };
    createjs.Graphics = a
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            this.initialize()
        },
        a = c.prototype;
    c.suppressCrossDomainErrors = !1;
    c._hitTestCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    c._hitTestCanvas.width = c._hitTestCanvas.height = 1;
    c._hitTestContext = c._hitTestCanvas.getContext("2d");
    c._nextCacheID = 1;
    a.alpha = 1;
    a.cacheCanvas = null;
    a.id = -1;
    a.mouseEnabled = !0;
    a.name = null;
    a.parent = null;
    a.regX = 0;
    a.regY = 0;
    a.rotation = 0;
    a.scaleX = 1;
    a.scaleY = 1;
    a.skewX = 0;
    a.skewY = 0;
    a.shadow = null;
    a.visible = !0;
    a.x = 0;
    a.y = 0;
    a.compositeOperation = null;
    a.snapToPixel = !1;
    a.onPress = null;
    a.onClick = null;
    a.onDoubleClick = null;
    a.onMouseOver = null;
    a.onMouseOut = null;
    a.onTick = null;
    a.filters = null;
    a.cacheID = 0;
    a.mask = null;
    a.hitArea = null;
    a.cursor = null;
    a.addEventListener = null;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a._cacheOffsetX = 0;
    a._cacheOffsetY = 0;
    a._cacheScale = 1;
    a._cacheDataURLID = 0;
    a._cacheDataURL = null;
    a._matrix = null;
    a.initialize = function()
    {
        this.id = createjs.UID.get();
        this._matrix = new createjs.Matrix2D
    };
    a.isVisible = function()
    {
        return !(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY))
    };
    a.draw = function(b, a)
    {
        var d = this.cacheCanvas;
        if (a || !d)
            return !1;
        var c = this._cacheScale;
        b.drawImage(d, this._cacheOffsetX, this._cacheOffsetY, d.width / c, d.height / c);
        return !0
    };
    a.updateContext = function(b)
    {
        var a,
            d = this.mask;
        d && (d.graphics && !d.graphics.isEmpty()) && (a = d.getMatrix(d._matrix), b.transform(a.a, a.b, a.c, a.d, a.tx, a.ty), d.graphics.drawAsPath(b), b.clip(), a.invert(), b.transform(a.a, a.b, a.c, a.d, a.tx, a.ty));
        a = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
        createjs.Stage._snapToPixelEnabled && this.snapToPixel ? b.transform(a.a, a.b, a.c, a.d, a.tx + 0.5 | 0, a.ty + 0.5 | 0) : b.transform(a.a, a.b, a.c, a.d, a.tx, a.ty);
        b.globalAlpha *= this.alpha;
        this.compositeOperation && (b.globalCompositeOperation = this.compositeOperation);
        this.shadow && this._applyShadow(b, this.shadow)
    };
    a.cache = function(b, a, d, c, f)
    {
        f = f || 1;
        this.cacheCanvas || (this.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"));
        this.cacheCanvas.width = Math.ceil(d * f);
        this.cacheCanvas.height = Math.ceil(c * f);
        this._cacheOffsetX = b;
        this._cacheOffsetY = a;
        this._cacheScale = f || 1;
        this.updateCache()
    };
    a.updateCache = function(b)
    {
        var a = this.cacheCanvas,
            d = this._cacheScale,
            j = this._cacheOffsetX * d,
            f = this._cacheOffsetY * d;
        if (!a)
            throw"cache() must be called before updateCache()";
        var e = a.getContext("2d");
        e.save();
        b || e.clearRect(0, 0, a.width + 1, a.height + 1);
        e.globalCompositeOperation = b;
        e.setTransform(d, 0, 0, d, -j, -f);
        this.draw(e, !0);
        this._applyFilters();
        e.restore();
        this.cacheID = c._nextCacheID++
    };
    a.uncache = function()
    {
        this._cacheDataURL = this.cacheCanvas = null;
        this.cacheID = this._cacheOffsetX = this._cacheOffsetY = 0;
        this._cacheScale = 1
    };
    a.getCacheDataURL = function()
    {
        if (!this.cacheCanvas)
            return null;
        this.cacheID != this._cacheDataURLID && (this._cacheDataURL = this.cacheCanvas.toDataURL());
        return this._cacheDataURL
    };
    a.getStage = function()
    {
        for (var b = this; b.parent; )
            b = b.parent;
        return b instanceof createjs.Stage ? b : null
    };
    a.localToGlobal = function(b, a)
    {
        var d = this.getConcatenatedMatrix(this._matrix);
        if (null == d)
            return null;
        d.append(1, 0, 0, 1, b, a);
        return new createjs.Point(d.tx, d.ty)
    };
    a.globalToLocal = function(b, a)
    {
        var d = this.getConcatenatedMatrix(this._matrix);
        if (null == d)
            return null;
        d.invert();
        d.append(1, 0, 0, 1, b, a);
        return new createjs.Point(d.tx, d.ty)
    };
    a.localToLocal = function(b, a, d)
    {
        b = this.localToGlobal(b, a);
        return d.globalToLocal(b.x, b.y)
    };
    a.setTransform = function(b, a, d, c, f, e, h, m, k)
    {
        this.x = b || 0;
        this.y = a || 0;
        this.scaleX = null == d ? 1 : d;
        this.scaleY = null == c ? 1 : c;
        this.rotation = f || 0;
        this.skewX = e || 0;
        this.skewY = h || 0;
        this.regX = m || 0;
        this.regY = k || 0;
        return this
    };
    a.getMatrix = function(b)
    {
        return (b ? b.identity() : new createjs.Matrix2D).appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY).appendProperties(this.alpha, this.shadow, this.compositeOperation)
    };
    a.getConcatenatedMatrix = function(b)
    {
        b ? b.identity() : b = new createjs.Matrix2D;
        for (var a = this; null != a; )
            b.prependTransform(a.x, a.y, a.scaleX, a.scaleY, a.rotation, a.skewX, a.skewY, a.regX, a.regY).prependProperties(a.alpha, a.shadow, a.compositeOperation),
            a = a.parent;
        return b
    };
    a.hitTest = function(b, a)
    {
        var d = c._hitTestContext;
        d.setTransform(1, 0, 0, 1, -b, -a);
        this.draw(d);
        var j = this._testHit(d);
        d.setTransform(1, 0, 0, 1, 0, 0);
        d.clearRect(0, 0, 2, 2);
        return j
    };
    a.set = function(b)
    {
        for (var a in b)
            this[a] = b[a];
        return this
    };
    a.clone = function()
    {
        var b = new c;
        this.cloneProps(b);
        return b
    };
    a.toString = function()
    {
        return "[DisplayObject (name=" + this.name + ")]"
    };
    a.cloneProps = function(b)
    {
        b.alpha = this.alpha;
        b.name = this.name;
        b.regX = this.regX;
        b.regY = this.regY;
        b.rotation = this.rotation;
        b.scaleX = this.scaleX;
        b.scaleY = this.scaleY;
        b.shadow = this.shadow;
        b.skewX = this.skewX;
        b.skewY = this.skewY;
        b.visible = this.visible;
        b.x = this.x;
        b.y = this.y;
        b.mouseEnabled = this.mouseEnabled;
        b.compositeOperation = this.compositeOperation;
        this.cacheCanvas && (b.cacheCanvas = this.cacheCanvas.cloneNode(!0), b.cacheCanvas.getContext("2d").putImageData(this.cacheCanvas.getContext("2d").getImageData(0, 0, this.cacheCanvas.width, this.cacheCanvas.height), 0, 0))
    };
    a._applyShadow = function(b, a)
    {
        a = a || Shadow.identity;
        b.shadowColor = a.color;
        b.shadowOffsetX = a.offsetX;
        b.shadowOffsetY = a.offsetY;
        b.shadowBlur = a.blur
    };
    a._tick = function(b)
    {
        this.onTick && this.onTick.apply(this, b);
        var a = this._listeners;
        a && a.tick && this.dispatchEvent({
            type: "tick", params: b
        })
    };
    a._testHit = function(b)
    {
        try
        {
            var a = 1 < b.getImageData(0, 0, 1, 1).data[3]
        }
        catch(d)
        {
            if (!c.suppressCrossDomainErrors)
                throw"An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
        }
        return a
    };
    a._applyFilters = function()
    {
        if (this.filters && 0 != this.filters.length && this.cacheCanvas)
            for (var b = this.filters.length, a = this.cacheCanvas.getContext("2d"), d = this.cacheCanvas.width, c = this.cacheCanvas.height, f = 0; f < b; f++)
                this.filters[f].applyFilter(a, 0, 0, d, c)
    };
    a._hasMouseHandler = function(b)
    {
        var a = this._listeners;
        return !!(b & 1 && (this.onPress || this.onClick || this.onDoubleClick || a && (this.hasEventListener("mousedown") || this.hasEventListener("click") || this.hasEventListener("dblclick"))) || b & 2 && (this.onMouseOver || this.onMouseOut || this.cursor || a && (this.hasEventListener("mouseover") || this.hasEventListener("mouseout"))))
    };
    createjs.DisplayObject = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            this.initialize()
        },
        a = c.prototype = new createjs.DisplayObject;
    a.children = null;
    a.DisplayObject_initialize = a.initialize;
    a.initialize = function()
    {
        this.DisplayObject_initialize();
        this.children = []
    };
    a.isVisible = function()
    {
        var b = this.cacheCanvas || this.children.length;
        return !(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && b))
    };
    a.DisplayObject_draw = a.draw;
    a.draw = function(b, a)
    {
        if (this.DisplayObject_draw(b, a))
            return !0;
        for (var d = this.children.slice(0), c = 0, f = d.length; c < f; c++)
        {
            var e = d[c];
            e.isVisible() && (b.save(), e.updateContext(b), e.draw(b), b.restore())
        }
        return !0
    };
    a.addChild = function(b)
    {
        if (null == b)
            return b;
        var a = arguments.length;
        if (1 < a)
        {
            for (var d = 0; d < a; d++)
                this.addChild(arguments[d]);
            return arguments[a - 1]
        }
        b.parent && b.parent.removeChild(b);
        b.parent = this;
        this.children.push(b);
        return b
    };
    a.addChildAt = function(b, a)
    {
        var d = arguments.length,
            c = arguments[d - 1];
        if (0 > c || c > this.children.length)
            return arguments[d - 2];
        if (2 < d)
        {
            for (var f = 0; f < d - 1; f++)
                this.addChildAt(arguments[f], c + f);
            return arguments[d - 2]
        }
        b.parent && b.parent.removeChild(b);
        b.parent = this;
        this.children.splice(a, 0, b);
        return b
    };
    a.removeChild = function(b)
    {
        var a = arguments.length;
        if (1 < a)
        {
            for (var d = !0, c = 0; c < a; c++)
                d = d && this.removeChild(arguments[c]);
            return d
        }
        return this.removeChildAt(this.children.indexOf(b))
    };
    a.removeChildAt = function(b)
    {
        var a = arguments.length;
        if (1 < a)
        {
            for (var d = [], c = 0; c < a; c++)
                d[c] = arguments[c];
            d.sort(function(b, a)
            {
                return a - b
            });
            for (var f = !0, c = 0; c < a; c++)
                f = f && this.removeChildAt(d[c]);
            return f
        }
        if (0 > b || b > this.children.length - 1)
            return !1;
        if (a = this.children[b])
            a.parent = null;
        this.children.splice(b, 1);
        return !0
    };
    a.removeAllChildren = function()
    {
        for (var b = this.children; b.length; )
            b.pop().parent = null
    };
    a.getChildAt = function(b)
    {
        return this.children[b]
    };
    a.getChildByName = function(b)
    {
        for (var a = this.children, d = 0, c = a.length; d < c; d++)
            if (a[d].name == b)
                return a[d];
        return null
    };
    a.sortChildren = function(b)
    {
        this.children.sort(b)
    };
    a.getChildIndex = function(b)
    {
        return this.children.indexOf(b)
    };
    a.getNumChildren = function()
    {
        return this.children.length
    };
    a.swapChildrenAt = function(b, a)
    {
        var d = this.children,
            c = d[b],
            f = d[a];
        c && f && (d[b] = f, d[a] = c)
    };
    a.swapChildren = function(b, a)
    {
        for (var d = this.children, c, f, e = 0, h = d.length; e < h && !(d[e] == b && (c = e), d[e] == a && (f = e), null != c && null != f); e++)
            ;
        e != h && (d[c] = a, d[f] = b)
    };
    a.setChildIndex = function(b, a)
    {
        var d = this.children,
            c = d.length;
        if (!(b.parent != this || 0 > a || a >= c))
        {
            for (var f = 0; f < c && d[f] != b; f++)
                ;
            f == c || f == a || (d.splice(f, 1), a < f && a--, d.splice(a, 0, b))
        }
    };
    a.contains = function(b)
    {
        for (; b; )
        {
            if (b == this)
                return !0;
            b = b.parent
        }
        return !1
    };
    a.hitTest = function(b, a)
    {
        return null != this.getObjectUnderPoint(b, a)
    };
    a.getObjectsUnderPoint = function(b, a)
    {
        var d = [],
            c = this.localToGlobal(b, a);
        this._getObjectsUnderPoint(c.x, c.y, d);
        return d
    };
    a.getObjectUnderPoint = function(b, a)
    {
        var d = this.localToGlobal(b, a);
        return this._getObjectsUnderPoint(d.x, d.y)
    };
    a.clone = function(b)
    {
        var a = new c;
        this.cloneProps(a);
        if (b)
            for (var d = a.children = [], j = 0, f = this.children.length; j < f; j++)
            {
                var e = this.children[j].clone(b);
                e.parent = a;
                d.push(e)
            }
        return a
    };
    a.toString = function()
    {
        return "[Container (name=" + this.name + ")]"
    };
    a.DisplayObject__tick = a._tick;
    a._tick = function(b)
    {
        for (var a = this.children.length - 1; 0 <= a; a--)
        {
            var d = this.children[a];
            d._tick && d._tick(b)
        }
        this.DisplayObject__tick(b)
    };
    a._getObjectsUnderPoint = function(b, a, d, j)
    {
        var f = createjs.DisplayObject._hitTestContext,
            e = this._matrix,
            h = this._hasMouseHandler(j);
        if (!this.hitArea && (this.cacheCanvas && h) && (this.getConcatenatedMatrix(e), f.setTransform(e.a, e.b, e.c, e.d, e.tx - b, e.ty - a), f.globalAlpha = e.alpha, this.draw(f), this._testHit(f)))
            return f.setTransform(1, 0, 0, 1, 0, 0), f.clearRect(0, 0, 2, 2), this;
        for (var m = this.children.length - 1; 0 <= m; m--)
        {
            var k = this.children[m],
                p = k.hitArea;
            if (k.visible && !(!p && !k.isVisible() || j && !k.mouseEnabled))
            {
                var s = j && k._hasMouseHandler(j);
                if (k instanceof c && (!p || !s))
                {
                    if (h)
                    {
                        if (k = k._getObjectsUnderPoint(b, a))
                            return this
                    }
                    else
                    {
                        if (k = k._getObjectsUnderPoint(b, a, d, j), !d && k)
                            return k
                    }
                }
                else if (!j || h || s)
                    if (k.getConcatenatedMatrix(e), p && (e.appendTransform(p.x, p.y, p.scaleX, p.scaleY, p.rotation, p.skewX, p.skewY, p.regX, p.regY), e.alpha = p.alpha), f.globalAlpha = e.alpha, f.setTransform(e.a, e.b, e.c, e.d, e.tx - b, e.ty - a), (p || k).draw(f), this._testHit(f))
                    {
                        f.setTransform(1, 0, 0, 1, 0, 0);
                        f.clearRect(0, 0, 2, 2);
                        if (h)
                            return this;
                        if (d)
                            d.push(k);
                        else
                            return k
                    }
            }
        }
        return null
    };
    createjs.Container = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b)
        {
            this.initialize(b)
        },
        a = c.prototype = new createjs.Container;
    c._snapToPixelEnabled = !1;
    a.autoClear = !0;
    a.canvas = null;
    a.mouseX = 0;
    a.mouseY = 0;
    a.onMouseMove = null;
    a.onMouseUp = null;
    a.onMouseDown = null;
    a.snapToPixelEnabled = !1;
    a.mouseInBounds = !1;
    a.tickOnUpdate = !0;
    a.mouseMoveOutside = !1;
    a._pointerData = null;
    a._pointerCount = 0;
    a._primaryPointerID = null;
    a._mouseOverIntervalID = null;
    a.Container_initialize = a.initialize;
    a.initialize = function(b)
    {
        this.Container_initialize();
        this.canvas = "string" == typeof b ? document.getElementById(b) : b;
        this._pointerData = {};
        this.enableDOMEvents(!0)
    };
    a.update = function()
    {
        if (this.canvas)
        {
            this.autoClear && this.clear();
            c._snapToPixelEnabled = this.snapToPixelEnabled;
            this.tickOnUpdate && this._tick(arguments.length ? arguments : null);
            var b = this.canvas.getContext("2d");
            b.save();
            this.updateContext(b);
            this.draw(b, !1);
            b.restore()
        }
    };
    a.tick = a.update;
    a.handleEvent = function(b)
    {
        "tick" == b.type && this.update(b)
    };
    a.clear = function()
    {
        if (this.canvas)
        {
            var b = this.canvas.getContext("2d");
            b.setTransform(1, 0, 0, 1, 0, 0);
            b.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
        }
    };
    a.toDataURL = function(b, a)
    {
        a || (a = "image/png");
        var d = this.canvas.getContext("2d"),
            c = this.canvas.width,
            f = this.canvas.height,
            e;
        if (b)
        {
            e = d.getImageData(0, 0, c, f);
            var h = d.globalCompositeOperation;
            d.globalCompositeOperation = "destination-over";
            d.fillStyle = b;
            d.fillRect(0, 0, c, f)
        }
        var m = this.canvas.toDataURL(a);
        b && (d.clearRect(0, 0, c + 1, f + 1), d.putImageData(e, 0, 0), d.globalCompositeOperation = h);
        return m
    };
    a.enableMouseOver = function(b)
    {
        this._mouseOverIntervalID && (clearInterval(this._mouseOverIntervalID), this._mouseOverIntervalID = null);
        if (null == b)
            b = 20;
        else if (0 >= b)
            return;
        var a = this;
        this._mouseOverIntervalID = setInterval(function()
        {
            a._testMouseOver()
        }, 1E3 / Math.min(50, b))
    };
    a.enableDOMEvents = function(b)
    {
        null == b && (b = !0);
        var a,
            d = this._eventListeners;
        if (!b && d)
        {
            for (a in d)
                b = d[a],
                b.t.removeEventListener(a, b.f);
            this._eventListeners = null
        }
        else if (b && !d && this.canvas)
        {
            b = window.addEventListener ? window : document;
            var c = this,
                d = this._eventListeners = {};
            d.mouseup = {
                t: b, f: function(b)
                    {
                        c._handleMouseUp(b)
                    }
            };
            d.mousemove = {
                t: b, f: function(b)
                    {
                        c._handleMouseMove(b)
                    }
            };
            d.dblclick = {
                t: b, f: function(b)
                    {
                        c._handleDoubleClick(b)
                    }
            };
            d.mousedown = {
                t: this.canvas, f: function(b)
                    {
                        c._handleMouseDown(b)
                    }
            };
            for (a in d)
                b = d[a],
                b.t.addEventListener(a, b.f)
        }
    };
    a.clone = function()
    {
        var b = new c(null);
        this.cloneProps(b);
        return b
    };
    a.toString = function()
    {
        return "[Stage (name=" + this.name + ")]"
    };
    a._getPointerData = function(b)
    {
        var a = this._pointerData[b];
        if (!a && (a = this._pointerData[b] = {
            x: 0, y: 0
        }, null == this._primaryPointerID || -1 == this._primaryPointerID))
            this._primaryPointerID = b;
        return a
    };
    a._handleMouseMove = function(b)
    {
        b || (b = window.event);
        this._handlePointerMove(-1, b, b.pageX, b.pageY)
    };
    a._handlePointerMove = function(b, a, d, c)
    {
        if (this.canvas)
        {
            var f = this._getPointerData(b),
                e = f.inBounds;
            this._updatePointerPosition(b, d, c);
            if (e || f.inBounds || this.mouseMoveOutside)
            {
                if (this.onMouseMove || this.hasEventListener("stagemousemove"))
                    d = new createjs.MouseEvent("stagemousemove", f.x, f.y, this, a, b, b == this._primaryPointerID, f.rawX, f.rawY),
                    this.onMouseMove && this.onMouseMove(d),
                    this.dispatchEvent(d);
                if ((c = f.event) && (c.onMouseMove || c.hasEventListener("mousemove")))
                    d = new createjs.MouseEvent("mousemove", f.x, f.y, c.target, a, b, b == this._primaryPointerID, f.rawX, f.rawY),
                    c.onMouseMove && c.onMouseMove(d),
                    c.dispatchEvent(d, c.target)
            }
        }
    };
    a._updatePointerPosition = function(b, a, d)
    {
        var c = this._getElementRect(this.canvas);
        a -= c.left;
        d -= c.top;
        var f = this.canvas.width,
            e = this.canvas.height;
        a /= (c.right - c.left) / f;
        d /= (c.bottom - c.top) / e;
        c = this._getPointerData(b);
        (c.inBounds = 0 <= a && 0 <= d && a <= f - 1 && d <= e - 1) ? (c.x = a, c.y = d) : this.mouseMoveOutside && (c.x = 0 > a ? 0 : a > f - 1 ? f - 1 : a, c.y = 0 > d ? 0 : d > e - 1 ? e - 1 : d);
        c.rawX = a;
        c.rawY = d;
        b == this._primaryPointerID && (this.mouseX = c.x, this.mouseY = c.y, this.mouseInBounds = c.inBounds)
    };
    a._getElementRect = function(b)
    {
        var a;
        try
        {
            a = b.getBoundingClientRect()
        }
        catch(d)
        {
            a = {
                top: b.offsetTop, left: b.offsetLeft, width: b.offsetWidth, height: b.offsetHeight
            }
        }
        var c = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0),
            f = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0),
            e = window.getComputedStyle ? getComputedStyle(b) : b.currentStyle;
        b = parseInt(e.paddingLeft) + parseInt(e.borderLeftWidth);
        var h = parseInt(e.paddingTop) + parseInt(e.borderTopWidth),
            m = parseInt(e.paddingRight) + parseInt(e.borderRightWidth),
            e = parseInt(e.paddingBottom) + parseInt(e.borderBottomWidth);
        return {
                left: a.left + c + b, right: a.right + c - m, top: a.top + f + h, bottom: a.bottom + f - e
            }
    };
    a._handleMouseUp = function(b)
    {
        this._handlePointerUp(-1, b, !1)
    };
    a._handlePointerUp = function(b, a, d)
    {
        var c = this._getPointerData(b),
            f;
        if (this.onMouseMove || this.hasEventListener("stagemouseup"))
            f = new createjs.MouseEvent("stagemouseup", c.x, c.y, this, a, b, b == this._primaryPointerID, c.rawX, c.rawY),
            this.onMouseUp && this.onMouseUp(f),
            this.dispatchEvent(f);
        var e = c.event;
        if (e && (e.onMouseUp || e.hasEventListener("mouseup")))
            f = new createjs.MouseEvent("mouseup", c.x, c.y, e.target, a, b, b == this._primaryPointerID, c.rawX, c.rawY),
            e.onMouseUp && e.onMouseUp(f),
            e.dispatchEvent(f, e.target);
        if ((e = c.target) && (e.onClick || e.hasEventListener("click")) && this._getObjectsUnderPoint(c.x, c.y, null, !0, this._mouseOverIntervalID ? 3 : 1) == e)
            f = new createjs.MouseEvent("click", c.x, c.y, e, a, b, b == this._primaryPointerID, c.rawX, c.rawY),
            e.onClick && e.onClick(f),
            e.dispatchEvent(f);
        d ? (b == this._primaryPointerID && (this._primaryPointerID = null), delete this._pointerData[b]) : c.event = c.target = null
    };
    a._handleMouseDown = function(b)
    {
        this._handlePointerDown(-1, b, !1)
    };
    a._handlePointerDown = function(b, a, d, c)
    {
        var f = this._getPointerData(b);
        null != c && this._updatePointerPosition(b, d, c);
        if (this.onMouseDown || this.hasEventListener("stagemousedown"))
            d = new createjs.MouseEvent("stagemousedown", f.x, f.y, this, a, b, b == this._primaryPointerID, f.rawX, f.rawY),
            this.onMouseDown && this.onMouseDown(d),
            this.dispatchEvent(d);
        if (c = this._getObjectsUnderPoint(f.x, f.y, null, this._mouseOverIntervalID ? 3 : 1))
            if (f.target = c, c.onPress || c.hasEventListener("mousedown"))
                if (d = new createjs.MouseEvent("mousedown", f.x, f.y, c, a, b, b == this._primaryPointerID, f.rawX, f.rawY), c.onPress && c.onPress(d), c.dispatchEvent(d), d.onMouseMove || d.onMouseUp || d.hasEventListener("mousemove") || d.hasEventListener("mouseup"))
                    f.event = d
    };
    a._testMouseOver = function()
    {
        if (-1 == this._primaryPointerID && !(this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds))
        {
            var b = null;
            this.mouseInBounds && (b = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3), this._mouseOverX = this.mouseX, this._mouseOverY = this.mouseY);
            var a = this._mouseOverTarget;
            if (a != b)
            {
                var d = this._getPointerData(-1);
                if (a && (a.onMouseOut || a.hasEventListener("mouseout")))
                {
                    var c = new createjs.MouseEvent("mouseout", d.x, d.y, a, null, -1, d.rawX, d.rawY);
                    a.onMouseOut && a.onMouseOut(c);
                    a.dispatchEvent(c)
                }
                a && (this.canvas.style.cursor = "");
                if (b && (b.onMouseOver || b.hasEventListener("mouseover")))
                    c = new createjs.MouseEvent("mouseover", d.x, d.y, b, null, -1, d.rawX, d.rawY),
                    b.onMouseOver && b.onMouseOver(c),
                    b.dispatchEvent(c);
                b && (this.canvas.style.cursor = b.cursor || "");
                this._mouseOverTarget = b
            }
        }
    };
    a._handleDoubleClick = function(b)
    {
        var a = this._getPointerData(-1),
            d = this._getObjectsUnderPoint(a.x, a.y, null, this._mouseOverIntervalID ? 3 : 1);
        if (d && (d.onDoubleClick || d.hasEventListener("dblclick")))
            evt = new createjs.MouseEvent("dblclick", a.x, a.y, d, b, -1, !0, a.rawX, a.rawY),
            d.onDoubleClick && d.onDoubleClick(evt),
            d.dispatchEvent(evt)
    };
    createjs.Stage = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b)
        {
            this.initialize(b)
        },
        a = c.prototype = new createjs.DisplayObject;
    a.image = null;
    a.snapToPixel = !0;
    a.sourceRect = null;
    a.DisplayObject_initialize = a.initialize;
    a.initialize = function(b)
    {
        this.DisplayObject_initialize();
        "string" == typeof b ? (this.image = new Image, this.image.src = b) : this.image = b
    };
    a.isVisible = function()
    {
        var b = this.cacheCanvas || this.image && (this.image.complete || this.image.getContext || 2 <= this.image.readyState);
        return !(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && b))
    };
    a.DisplayObject_draw = a.draw;
    a.draw = function(b, a)
    {
        if (this.DisplayObject_draw(b, a))
            return !0;
        var d = this.sourceRect;
        d ? b.drawImage(this.image, d.x, d.y, d.width, d.height, 0, 0, d.width, d.height) : b.drawImage(this.image, 0, 0);
        return !0
    };
    a.clone = function()
    {
        var b = new c(this.image);
        this.sourceRect && (b.sourceRect = this.sourceRect.clone());
        this.cloneProps(b);
        return b
    };
    a.toString = function()
    {
        return "[Bitmap (name=" + this.name + ")]"
    };
    createjs.Bitmap = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b)
        {
            this.initialize(b)
        },
        a = c.prototype = new createjs.DisplayObject;
    a.onAnimationEnd = null;
    a.currentFrame = -1;
    a.currentAnimation = null;
    a.paused = !0;
    a.spriteSheet = null;
    a.snapToPixel = !0;
    a.offset = 0;
    a.currentAnimationFrame = 0;
    a.addEventListener = null;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a._advanceCount = 0;
    a._animation = null;
    a.DisplayObject_initialize = a.initialize;
    a.initialize = function(b)
    {
        this.DisplayObject_initialize();
        this.spriteSheet = b
    };
    a.isVisible = function()
    {
        var b = this.cacheCanvas || this.spriteSheet.complete && 0 <= this.currentFrame;
        return !(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && b))
    };
    a.DisplayObject_draw = a.draw;
    a.draw = function(b, a)
    {
        if (this.DisplayObject_draw(b, a))
            return !0;
        this._normalizeFrame();
        var d = this.spriteSheet.getFrame(this.currentFrame);
        if (d)
        {
            var c = d.rect;
            b.drawImage(d.image, c.x, c.y, c.width, c.height, -d.regX, -d.regY, c.width, c.height);
            return !0
        }
    };
    a.play = function()
    {
        this.paused = !1
    };
    a.stop = function()
    {
        this.paused = !0
    };
    a.gotoAndPlay = function(b)
    {
        this.paused = !1;
        this._goto(b)
    };
    a.gotoAndStop = function(b)
    {
        this.paused = !0;
        this._goto(b)
    };
    a.advance = function()
    {
        this._animation ? this.currentAnimationFrame++ : this.currentFrame++;
        this._normalizeFrame()
    };
    a.getBounds = function()
    {
        return this.spriteSheet.getFrameBounds(this.currentFrame)
    };
    a.clone = function()
    {
        var b = new c(this.spriteSheet);
        this.cloneProps(b);
        return b
    };
    a.toString = function()
    {
        return "[BitmapAnimation (name=" + this.name + ")]"
    };
    a.DisplayObject__tick = a._tick;
    a._tick = function(b)
    {
        var a = this._animation ? this._animation.frequency : 1;
        !this.paused && 0 == (++this._advanceCount + this.offset) % a && this.advance();
        this.DisplayObject__tick(b)
    };
    a._normalizeFrame = function()
    {
        var b = this._animation,
            a = this.currentFrame,
            d = this.paused,
            c;
        if (b)
            if (c = b.frames.length, this.currentAnimationFrame >= c)
            {
                var f = b.next;
                this._dispatchAnimationEnd(b, a, d, f, c - 1) || (f ? this._goto(f) : (this.paused = !0, this.currentAnimationFrame = b.frames.length - 1, this.currentFrame = b.frames[this.currentAnimationFrame]))
            }
            else
                this.currentFrame = b.frames[this.currentAnimationFrame];
        else
            c = this.spriteSheet.getNumFrames(),
            a >= c && !this._dispatchAnimationEnd(b, a, d, c - 1) && (this.currentFrame = 0)
    };
    a._dispatchAnimationEnd = function(b, a, d, c, f)
    {
        var e = b ? b.name : null;
        this.onAnimationEnd && this.onAnimationEnd(this, e, c);
        this.dispatchEvent({
            type: "animationend", name: e, next: c
        });
        !d && this.paused && (this.currentAnimationFrame = f);
        return this.paused != d || this._animation != b || this.currentFrame != a
    };
    a.DisplayObject_cloneProps = a.cloneProps;
    a.cloneProps = function(b)
    {
        this.DisplayObject_cloneProps(b);
        b.onAnimationEnd = this.onAnimationEnd;
        b.currentFrame = this.currentFrame;
        b.currentAnimation = this.currentAnimation;
        b.paused = this.paused;
        b.offset = this.offset;
        b._animation = this._animation;
        b.currentAnimationFrame = this.currentAnimationFrame
    };
    a._goto = function(b)
    {
        if (isNaN(b))
        {
            var a = this.spriteSheet.getAnimation(b);
            a && (this.currentAnimationFrame = 0, this._animation = a, this.currentAnimation = b, this._normalizeFrame())
        }
        else
            this.currentAnimation = this._animation = null,
            this.currentFrame = b
    };
    createjs.BitmapAnimation = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b)
        {
            this.initialize(b)
        },
        a = c.prototype = new createjs.DisplayObject;
    a.graphics = null;
    a.DisplayObject_initialize = a.initialize;
    a.initialize = function(b)
    {
        this.DisplayObject_initialize();
        this.graphics = b ? b : new createjs.Graphics
    };
    a.isVisible = function()
    {
        var b = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
        return !(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && b))
    };
    a.DisplayObject_draw = a.draw;
    a.draw = function(b, a)
    {
        if (this.DisplayObject_draw(b, a))
            return !0;
        this.graphics.draw(b);
        return !0
    };
    a.clone = function(b)
    {
        b = new c(b && this.graphics ? this.graphics.clone() : this.graphics);
        this.cloneProps(b);
        return b
    };
    a.toString = function()
    {
        return "[Shape (name=" + this.name + ")]"
    };
    createjs.Shape = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, a, d)
        {
            this.initialize(b, a, d)
        },
        a = c.prototype = new createjs.DisplayObject;
    c._workingContext = (createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")).getContext("2d");
    a.text = "";
    a.font = null;
    a.color = "#000";
    a.textAlign = "left";
    a.textBaseline = "top";
    a.maxWidth = null;
    a.outline = !1;
    a.lineHeight = 0;
    a.lineWidth = null;
    a.DisplayObject_initialize = a.initialize;
    a.initialize = function(b, a, d)
    {
        this.DisplayObject_initialize();
        this.text = b;
        this.font = a;
        this.color = d ? d : "#000"
    };
    a.isVisible = function()
    {
        var b = this.cacheCanvas || null != this.text && "" !== this.text;
        return !(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && b))
    };
    a.DisplayObject_draw = a.draw;
    a.draw = function(b, a)
    {
        if (this.DisplayObject_draw(b, a))
            return !0;
        this.outline ? b.strokeStyle = this.color : b.fillStyle = this.color;
        b.font = this.font;
        b.textAlign = this.textAlign || "start";
        b.textBaseline = this.textBaseline || "alphabetic";
        this._drawText(b);
        return !0
    };
    a.getMeasuredWidth = function()
    {
        return this._getWorkingContext().measureText(this.text).width
    };
    a.getMeasuredLineHeight = function()
    {
        return 1.2 * this._getWorkingContext().measureText("M").width
    };
    a.getMeasuredHeight = function()
    {
        return this._drawText() * (this.lineHeight || this.getMeasuredLineHeight())
    };
    a.clone = function()
    {
        var b = new c(this.text, this.font, this.color);
        this.cloneProps(b);
        return b
    };
    a.toString = function()
    {
        return "[Text (text=" + (20 < this.text.length ? this.text.substr(0, 17) + "..." : this.text) + ")]"
    };
    a.DisplayObject_cloneProps = a.cloneProps;
    a.cloneProps = function(b)
    {
        this.DisplayObject_cloneProps(b);
        b.textAlign = this.textAlign;
        b.textBaseline = this.textBaseline;
        b.maxWidth = this.maxWidth;
        b.outline = this.outline;
        b.lineHeight = this.lineHeight;
        b.lineWidth = this.lineWidth
    };
    a._getWorkingContext = function()
    {
        var b = c._workingContext;
        b.font = this.font;
        b.textAlign = this.textAlign || "start";
        b.textBaseline = this.textBaseline || "alphabetic";
        return b
    };
    a._drawText = function(b)
    {
        var a = !!b;
        a || (b = this._getWorkingContext());
        for (var d = String(this.text).split(/(?:\r\n|\r|\n)/), c = this.lineHeight || this.getMeasuredLineHeight(), f = 0, e = 0, h = d.length; e < h; e++)
        {
            var m = b.measureText(d[e]).width;
            if (null == this.lineWidth || m < this.lineWidth)
                a && this._drawTextLine(b, d[e], f * c);
            else
            {
                for (var m = d[e].split(/(\s)/), k = m[0], p = 1, s = m.length; p < s; p += 2)
                    b.measureText(k + m[p] + m[p + 1]).width > this.lineWidth ? (a && this._drawTextLine(b, k, f * c), f++, k = m[p + 1]) : k += m[p] + m[p + 1];
                a && this._drawTextLine(b, k, f * c)
            }
            f++
        }
        return f
    };
    a._drawTextLine = function(b, a, d)
    {
        this.outline ? b.strokeText(a, 0, d, this.maxWidth || 65535) : b.fillText(a, 0, d, this.maxWidth || 65535)
    };
    createjs.Text = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            throw"SpriteSheetUtils cannot be instantiated";
        };
    c._workingCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    c._workingContext = c._workingCanvas.getContext("2d");
    c.addFlippedFrames = function(a, b, g, d)
    {
        if (b || g || d)
        {
            var j = 0;
            b && c._flip(a, ++j, !0, !1);
            g && c._flip(a, ++j, !1, !0);
            d && c._flip(a, ++j, !0, !0)
        }
    };
    c.extractFrame = function(a, b)
    {
        isNaN(b) && (b = a.getAnimation(b).frames[0]);
        var g = a.getFrame(b);
        if (!g)
            return null;
        var d = g.rect,
            j = c._workingCanvas;
        j.width = d.width;
        j.height = d.height;
        c._workingContext.drawImage(g.image, d.x, d.y, d.width, d.height, 0, 0, d.width, d.height);
        g = new Image;
        g.src = j.toDataURL("image/png");
        return g
    };
    c.mergeAlpha = function(a, b, c)
    {
        c || (c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"));
        c.width = Math.max(b.width, a.width);
        c.height = Math.max(b.height, a.height);
        var d = c.getContext("2d");
        d.save();
        d.drawImage(a, 0, 0);
        d.globalCompositeOperation = "destination-in";
        d.drawImage(b, 0, 0);
        d.restore();
        return c
    };
    c._flip = function(a, b, g, d)
    {
        for (var j = a._images, f = c._workingCanvas, e = c._workingContext, h = j.length / b, m = 0; m < h; m++)
        {
            var k = j[m];
            k.__tmp = m;
            e.setTransform(1, 0, 0, 1, 0, 0);
            e.clearRect(0, 0, f.width + 1, f.height + 1);
            f.width = k.width;
            f.height = k.height;
            e.setTransform(g ? -1 : 1, 0, 0, d ? -1 : 1, g ? k.width : 0, d ? k.height : 0);
            e.drawImage(k, 0, 0);
            var p = new Image;
            p.src = f.toDataURL("image/png");
            p.width = k.width;
            p.height = k.height;
            j.push(p)
        }
        e = a._frames;
        f = e.length / b;
        for (m = 0; m < f; m++)
        {
            var k = e[m],
                s = k.rect.clone(),
                p = j[k.image.__tmp + h * b],
                r = {
                    image: p, rect: s, regX: k.regX, regY: k.regY
                };
            g && (s.x = p.width - s.x - s.width, r.regX = s.width - k.regX);
            d && (s.y = p.height - s.y - s.height, r.regY = s.height - k.regY);
            e.push(r)
        }
        g = "_" + (g ? "h" : "") + (d ? "v" : "");
        d = a._animations;
        a = a._data;
        j = d.length / b;
        for (m = 0; m < j; m++)
        {
            e = d[m];
            k = a[e];
            h = {
                name: e + g, frequency: k.frequency, next: k.next, frames: []
            };
            k.next && (h.next += g);
            e = k.frames;
            k = 0;
            for (p = e.length; k < p; k++)
                h.frames.push(e[k] + f * b);
            a[h.name] = h;
            d.push(h.name)
        }
    };
    createjs.SpriteSheetUtils = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            this.initialize()
        },
        a = c.prototype;
    c.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
    c.ERR_RUNNING = "a build is already running";
    a.maxWidth = 2048;
    a.maxHeight = 2048;
    a.spriteSheet = null;
    a.scale = 1;
    a.padding = 1;
    a.timeSlice = 0.3;
    a.progress = -1;
    a.onComplete = null;
    a.onProgress = null;
    a.addEventListener = null;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a._frames = null;
    a._animations = null;
    a._data = null;
    a._nextFrameIndex = 0;
    a._index = 0;
    a._timerID = null;
    a._scale = 1;
    a.initialize = function()
    {
        this._frames = [];
        this._animations = {}
    };
    a.addFrame = function(b, a, d, j, f, e)
    {
        if (this._data)
            throw c.ERR_RUNNING;
        a = a || b.bounds || b.nominalBounds;
        !a && b.getBounds && (a = b.getBounds());
        if (!a)
            return null;
        d = d || 1;
        return this._frames.push({
                source: b, sourceRect: a, scale: d, funct: j, params: f, scope: e, index: this._frames.length, height: a.height * d
            }) - 1
    };
    a.addAnimation = function(b, a, d, j)
    {
        if (this._data)
            throw c.ERR_RUNNING;
        this._animations[b] = {
            frames: a, next: d, frequency: j
        }
    };
    a.addMovieClip = function(b, a, d)
    {
        if (this._data)
            throw c.ERR_RUNNING;
        var j = b.frameBounds,
            f = a || b.bounds || b.nominalBounds;
        !f && b.getBounds && (f = b.getBounds());
        if (!f && !j)
            return null;
        a = this._frames.length;
        for (var e = b.timeline.duration, h = 0; h < e; h++)
            this.addFrame(b, j && j[h] ? j[h] : f, d, function(b)
            {
                var a = this.actionsEnabled;
                this.actionsEnabled = !1;
                this.gotoAndStop(b);
                this.actionsEnabled = a
            }, [h], b);
        h = b.timeline._labels;
        b = [];
        for (var m in h)
            b.push({
                index: h[m], label: m
            });
        if (b.length)
        {
            b.sort(function(b, a)
            {
                return b.index - a.index
            });
            h = 0;
            for (m = b.length; h < m; h++)
            {
                d = b[h].label;
                for (var j = a + (h == m - 1 ? e : b[h + 1].index), f = [], k = a + b[h].index; k < j; k++)
                    f.push(k);
                this.addAnimation(d, f, !0)
            }
        }
    };
    a.build = function()
    {
        if (this._data)
            throw c.ERR_RUNNING;
        for (this._startBuild(); this._drawNext(); )
            ;
        this._endBuild();
        return this.spriteSheet
    };
    a.buildAsync = function(b)
    {
        if (this._data)
            throw c.ERR_RUNNING;
        this.timeSlice = b;
        this._startBuild();
        var a = this;
        this._timerID = setTimeout(function()
        {
            a._run()
        }, 50 - 50 * Math.max(0.01, Math.min(0.99, this.timeSlice || 0.3)))
    };
    a.stopAsync = function()
    {
        clearTimeout(this._timerID);
        this._data = null
    };
    a.clone = function()
    {
        throw"SpriteSheetBuilder cannot be cloned.";
    };
    a.toString = function()
    {
        return "[SpriteSheetBuilder]"
    };
    a._startBuild = function()
    {
        var b = this.padding || 0;
        this.progress = 0;
        this.spriteSheet = null;
        this._index = 0;
        this._scale = this.scale;
        var a = [];
        this._data = {
            images: [], frames: a, animations: this._animations
        };
        var d = this._frames.slice();
        d.sort(function(b, a)
        {
            return b.height <= a.height ? -1 : 1
        });
        if (d[d.length - 1].height + 2 * b > this.maxHeight)
            throw c.ERR_DIMENSIONS;
        for (var j = 0, f = 0, e = 0; d.length; )
        {
            var h = this._fillRow(d, j, e, a, b);
            h.w > f && (f = h.w);
            j += h.h;
            if (!h.h || !d.length)
            {
                var m = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
                m.width = this._getSize(f, this.maxWidth);
                m.height = this._getSize(j, this.maxHeight);
                this._data.images[e] = m;
                h.h || (f = j = 0, e++)
            }
        }
    };
    a._getSize = function(b, a)
    {
        for (var d = 4; Math.pow(2, ++d) < b; )
            ;
        return Math.min(a, Math.pow(2, d))
    };
    a._fillRow = function(b, a, d, j, f)
    {
        var e = this.maxWidth,
            h = this.maxHeight;
        a += f;
        for (var h = h - a, m = f, k = 0, p = b.length - 1; 0 <= p; p--)
        {
            var s = b[p],
                r = this._scale * s.scale,
                t = s.sourceRect,
                v = s.source,
                q = Math.floor(r * t.x - f),
                u = Math.floor(r * t.y - f),
                w = Math.ceil(r * t.height + 2 * f),
                t = Math.ceil(r * t.width + 2 * f);
            if (t > e)
                throw c.ERR_DIMENSIONS;
            w > h || m + t > e || (s.img = d, s.rect = new createjs.Rectangle(m, a, t, w), k = k || w, b.splice(p, 1), j[s.index] = [m, a, t, w, d, Math.round(-q + r * v.regX - f), Math.round(-u + r * v.regY - f)], m += t)
        }
        return {
                w: m, h: k
            }
    };
    a._endBuild = function()
    {
        this.spriteSheet = new createjs.SpriteSheet(this._data);
        this._data = null;
        this.progress = 1;
        this.onComplete && this.onComplete(this);
        this.dispatchEvent("complete")
    };
    a._run = function()
    {
        for (var b = 50 * Math.max(0.01, Math.min(0.99, this.timeSlice || 0.3)), a = (new Date).getTime() + b, d = !1; a > (new Date).getTime(); )
            if (!this._drawNext())
            {
                d = !0;
                break
            }
        if (d)
            this._endBuild();
        else
        {
            var c = this;
            this._timerID = setTimeout(function()
            {
                c._run()
            }, 50 - b)
        }
        b = this.progress = this._index / this._frames.length;
        this.onProgress && this.onProgress(this, b);
        this.dispatchEvent({
            type: "progress", progress: b
        })
    };
    a._drawNext = function()
    {
        var b = this._frames[this._index],
            a = b.scale * this._scale,
            d = b.rect,
            c = b.sourceRect,
            f = this._data.images[b.img].getContext("2d");
        b.funct && b.funct.apply(b.scope, b.params);
        f.save();
        f.beginPath();
        f.rect(d.x, d.y, d.width, d.height);
        f.clip();
        f.translate(Math.ceil(d.x - c.x * a), Math.ceil(d.y - c.y * a));
        f.scale(a, a);
        b.source.draw(f);
        f.restore();
        return ++this._index < this._frames.length
    };
    createjs.SpriteSheetBuilder = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b)
        {
            this.initialize(b)
        },
        a = c.prototype = new createjs.DisplayObject;
    a.htmlElement = null;
    a._oldMtx = null;
    a.DisplayObject_initialize = a.initialize;
    a.initialize = function(b)
    {
        "string" == typeof b && (b = document.getElementById(b));
        this.DisplayObject_initialize();
        this.mouseEnabled = !1;
        this.htmlElement = b;
        b = b.style;
        b.position = "absolute";
        b.transformOrigin = b.WebkitTransformOrigin = b.msTransformOrigin = b.MozTransformOrigin = b.OTransformOrigin = "0% 0%"
    };
    a.isVisible = function()
    {
        return null != this.htmlElement
    };
    a.draw = function()
    {
        if (null != this.htmlElement)
        {
            var b = this.getConcatenatedMatrix(this._matrix),
                a = this.htmlElement.style;
            if (this.visible)
                a.visibility = "visible";
            else
                return !0;
            var d = this._oldMtx || {};
            d.alpha != b.alpha && (a.opacity = "" + b.alpha, d.alpha = b.alpha);
            if (d.tx != b.tx || d.ty != b.ty || d.a != b.a || d.b != b.b || d.c != b.c || d.d != b.d)
                a.transform = a.WebkitTransform = a.OTransform = a.msTransform = ["matrix(" + b.a, b.b, b.c, b.d, b.tx + 0.5 | 0, (b.ty + 0.5 | 0) + ")"].join(),
                a.MozTransform = ["matrix(" + b.a, b.b, b.c, b.d, (b.tx + 0.5 | 0) + "px", (b.ty + 0.5 | 0) + "px)"].join(),
                this._oldMtx = b.clone();
            return !0
        }
    };
    a.cache = function(){};
    a.uncache = function(){};
    a.updateCache = function(){};
    a.hitTest = function(){};
    a.localToGlobal = function(){};
    a.globalToLocal = function(){};
    a.localToLocal = function(){};
    a.clone = function()
    {
        throw"DOMElement cannot be cloned.";
    };
    a.toString = function()
    {
        return "[DOMElement (name=" + this.name + ")]"
    };
    a.DisplayObject__tick = a._tick;
    a._tick = function(b)
    {
        this.htmlElement.style.visibility = "hidden";
        this.DisplayObject__tick(b)
    };
    createjs.DOMElement = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            this.initialize()
        },
        a = c.prototype;
    a.initialize = function(){};
    a.getBounds = function()
    {
        return new createjs.Rectangle(0, 0, 0, 0)
    };
    a.applyFilter = function(){};
    a.toString = function()
    {
        return "[Filter]"
    };
    a.clone = function()
    {
        return new c
    };
    createjs.Filter = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            throw"Touch cannot be instantiated";
        };
    c.isSupported = function()
    {
        return "ontouchstart" in window || window.navigator.msPointerEnabled
    };
    c.enable = function(a, b, g)
    {
        if (!a || !a.canvas || !c.isSupported())
            return !1;
        a.__touch = {
            pointers: {}, multitouch: !b, preventDefault: !g, count: 0
        };
        "ontouchstart" in window ? c._IOS_enable(a) : window.navigator.msPointerEnabled && c._IE_enable(a);
        return !0
    };
    c.disable = function(a)
    {
        a && ("ontouchstart" in window ? c._IOS_disable(a) : window.navigator.msPointerEnabled && c._IE_disable(a))
    };
    c._IOS_enable = function(a)
    {
        var b = a.canvas,
            g = a.__touch.f = function(b)
            {
                c._IOS_handleEvent(a, b)
            };
        b.addEventListener("touchstart", g, !1);
        b.addEventListener("touchmove", g, !1);
        b.addEventListener("touchend", g, !1);
        b.addEventListener("touchcancel", g, !1)
    };
    c._IOS_disable = function(a)
    {
        var b = a.canvas;
        b && (a = a.__touch.f, b.removeEventListener("touchstart", a, !1), b.removeEventListener("touchmove", a, !1), b.removeEventListener("touchend", a, !1), b.removeEventListener("touchcancel", a, !1))
    };
    c._IOS_handleEvent = function(a, b)
    {
        if (a)
        {
            a.__touch.preventDefault && b.preventDefault && b.preventDefault();
            for (var c = b.changedTouches, d = b.type, j = 0, f = c.length; j < f; j++)
            {
                var e = c[j],
                    h = e.identifier;
                e.target == a.canvas && ("touchstart" == d ? this._handleStart(a, h, b, e.pageX, e.pageY) : "touchmove" == d ? this._handleMove(a, h, b, e.pageX, e.pageY) : ("touchend" == d || "touchcancel" == d) && this._handleEnd(a, h, b))
            }
        }
    };
    c._IE_enable = function(a)
    {
        var b = a.canvas,
            g = a.__touch.f = function(b)
            {
                c._IE_handleEvent(a, b)
            };
        b.addEventListener("MSPointerDown", g, !1);
        window.addEventListener("MSPointerMove", g, !1);
        window.addEventListener("MSPointerUp", g, !1);
        window.addEventListener("MSPointerCancel", g, !1);
        a.__touch.preventDefault && (b.style.msTouchAction = "none");
        a.__touch.activeIDs = {}
    };
    c._IE_disable = function(a)
    {
        var b = a.__touch.f;
        window.removeEventListener("MSPointerMove", b, !1);
        window.removeEventListener("MSPointerUp", b, !1);
        window.removeEventListener("MSPointerCancel", b, !1);
        a.canvas && a.canvas.removeEventListener("MSPointerDown", b, !1)
    };
    c._IE_handleEvent = function(a, b)
    {
        if (a)
        {
            a.__touch.preventDefault && b.preventDefault && b.preventDefault();
            var c = b.type,
                d = b.pointerId,
                j = a.__touch.activeIDs;
            if ("MSPointerDown" == c)
                b.srcElement == a.canvas && (j[d] = !0, this._handleStart(a, d, b, b.pageX, b.pageY));
            else if (j[d])
                if ("MSPointerMove" == c)
                    this._handleMove(a, d, b, b.pageX, b.pageY);
                else if ("MSPointerUp" == c || "MSPointerCancel" == c)
                    delete j[d],
                    this._handleEnd(a, d, b)
        }
    };
    c._handleStart = function(a, b, c, d, j)
    {
        var f = a.__touch;
        if (f.multitouch || !f.count)
        {
            var e = f.pointers;
            e[b] || (e[b] = !0, f.count++, a._handlePointerDown(b, c, d, j))
        }
    };
    c._handleMove = function(a, b, c, d, j)
    {
        a.__touch.pointers[b] && a._handlePointerMove(b, c, d, j)
    };
    c._handleEnd = function(a, b, c)
    {
        var d = a.__touch,
            j = d.pointers;
        j[b] && (d.count--, a._handlePointerUp(b, c, !0), delete j[b])
    };
    createjs.Touch = c
})();
(function()
{
    var c = this.createjs = this.createjs || {},
        c = c.EaselJS = c.EaselJS || {};
    c.version = "2013.05.14";
    c.buildDate = "Tue, 14 May 2013 21:49:54 GMT"
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(b, a, d)
        {
            this.initialize(b, a, d)
        },
        a = c.prototype;
    c.NONE = 0;
    c.LOOP = 1;
    c.REVERSE = 2;
    c.IGNORE = {};
    c._tweens = [];
    c._plugins = {};
    c.get = function(b, a, d, j)
    {
        j && c.removeTweens(b);
        return new c(b, a, d)
    };
    c.tick = function(b, a)
    {
        for (var d = c._tweens.slice(), j = d.length - 1; 0 <= j; j--)
        {
            var f = d[j];
            a && !f.ignoreGlobalPause || f._paused || f.tick(f._useTicks ? 1 : b)
        }
    };
    createjs.Ticker && createjs.Ticker.addListener(c, !1);
    c.removeTweens = function(b)
    {
        if (b.tweenjs_count)
        {
            for (var a = c._tweens, d = a.length - 1; 0 <= d; d--)
                a[d]._target == b && (a[d]._paused = !0, a.splice(d, 1));
            b.tweenjs_count = 0
        }
    };
    c.removeAllTweens = function()
    {
        for (var b = c._tweens, a = 0, d = b.length; a < d; a++)
        {
            var j = b[a];
            j.paused = !0;
            j.target.tweenjs_count = 0
        }
        b.length = 0
    };
    c.hasActiveTweens = function(b)
    {
        return b ? b.tweenjs_count : c._tweens && c._tweens.length
    };
    c.installPlugin = function(b, a)
    {
        var d = b.priority;
        null == d && (b.priority = d = 0);
        for (var j = 0, f = a.length, e = c._plugins; j < f; j++)
        {
            var h = a[j];
            if (e[h])
            {
                for (var m = e[h], k = 0, p = m.length; k < p && !(d < m[k].priority); k++)
                    ;
                e[h].splice(k, 0, b)
            }
            else
                e[h] = [b]
        }
    };
    c._register = function(b, a)
    {
        var d = b._target;
        a ? (d && (d.tweenjs_count = d.tweenjs_count ? d.tweenjs_count + 1 : 1), c._tweens.push(b)) : (d && d.tweenjs_count--, d = c._tweens.indexOf(b), -1 != d && c._tweens.splice(d, 1))
    };
    a.addEventListener = null;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a.ignoreGlobalPause = !1;
    a.loop = !1;
    a.duration = 0;
    a.pluginData = null;
    a.onChange = null;
    a.change = null;
    a.target = null;
    a.position = null;
    a._paused = !1;
    a._curQueueProps = null;
    a._initQueueProps = null;
    a._steps = null;
    a._actions = null;
    a._prevPosition = 0;
    a._stepPosition = 0;
    a._prevPos = -1;
    a._target = null;
    a._useTicks = !1;
    a.initialize = function(b, a, d)
    {
        this.target = this._target = b;
        a && (this._useTicks = a.useTicks, this.ignoreGlobalPause = a.ignoreGlobalPause, this.loop = a.loop, this.onChange = a.onChange, a.override && c.removeTweens(b));
        this.pluginData = d || {};
        this._curQueueProps = {};
        this._initQueueProps = {};
        this._steps = [];
        this._actions = [];
        a && a.paused ? this._paused = !0 : c._register(this, !0);
        a && null != a.position && this.setPosition(a.position, c.NONE)
    };
    a.wait = function(b)
    {
        if (null == b || 0 >= b)
            return this;
        var a = this._cloneProps(this._curQueueProps);
        return this._addStep({
                d: b, p0: a, e: this._linearEase, p1: a
            })
    };
    a.to = function(b, a, d)
    {
        if (isNaN(a) || 0 > a)
            a = 0;
        return this._addStep({
                d: a || 0, p0: this._cloneProps(this._curQueueProps), e: d, p1: this._cloneProps(this._appendQueueProps(b))
            })
    };
    a.call = function(b, a, d)
    {
        return this._addAction({
                f: b, p: a ? a : [this], o: d ? d : this._target
            })
    };
    a.set = function(b, a)
    {
        return this._addAction({
                f: this._set, o: this, p: [b, a ? a : this._target]
            })
    };
    a.play = function(b)
    {
        return this.call(b.setPaused, [!1], b)
    };
    a.pause = function(b)
    {
        b || (b = this);
        return this.call(b.setPaused, [!0], b)
    };
    a.setPosition = function(b, a)
    {
        0 > b && (b = 0);
        null == a && (a = 1);
        var d = b,
            c = !1;
        d >= this.duration && (this.loop ? d %= this.duration : (d = this.duration, c = !0));
        if (d == this._prevPos)
            return c;
        var f = this._prevPos;
        this.position = this._prevPos = d;
        this._prevPosition = b;
        if (this._target)
            if (c)
                this._updateTargetProps(null, 1);
            else if (0 < this._steps.length)
            {
                for (var e = 0, h = this._steps.length; e < h && !(this._steps[e].t > d); e++)
                    ;
                e = this._steps[e - 1];
                this._updateTargetProps(e, (this._stepPosition = d - e.t) / e.d)
            }
        0 != a && 0 < this._actions.length && (this._useTicks ? this._runActions(d, d) : 1 == a && d < f ? (f != this.duration && this._runActions(f, this.duration), this._runActions(0, d, !0)) : this._runActions(f, d));
        c && this.setPaused(!0);
        this.onChange && this.onChange(this);
        this.dispatchEvent("change");
        return c
    };
    a.tick = function(b)
    {
        this._paused || this.setPosition(this._prevPosition + b)
    };
    a.setPaused = function(b)
    {
        this._paused = !!b;
        c._register(this, !b);
        return this
    };
    a.w = a.wait;
    a.t = a.to;
    a.c = a.call;
    a.s = a.set;
    a.toString = function()
    {
        return "[Tween]"
    };
    a.clone = function()
    {
        throw"Tween can not be cloned.";
    };
    a._updateTargetProps = function(b, a)
    {
        var d,
            j,
            f,
            e;
        !b && 1 == a ? d = j = this._curQueueProps : (b.e && (a = b.e(a, 0, 1, 1)), d = b.p0, j = b.p1);
        for (n in this._initQueueProps)
        {
            if (null == (f = d[n]))
                d[n] = f = this._initQueueProps[n];
            if (null == (e = j[n]))
                j[n] = e = f;
            f = f == e || 0 == a || 1 == a || "number" != typeof f ? 1 == a ? e : f : f + (e - f) * a;
            var h = !1;
            if (e = c._plugins[n])
                for (var m = 0, k = e.length; m < k; m++)
                {
                    var p = e[m].tween(this, n, f, d, j, a, !!b && d == j, !b);
                    p == c.IGNORE ? h = !0 : f = p
                }
            h || (this._target[n] = f)
        }
    };
    a._runActions = function(b, a, d)
    {
        var c = b,
            f = a,
            e = -1,
            h = this._actions.length,
            m = 1;
        b > a && (c = a, f = b, e = h, h = m = -1);
        for (; (e += m) != h; )
        {
            a = this._actions[e];
            var k = a.t;
            (k == f || k > c && k < f || d && k == b) && a.f.apply(a.o, a.p)
        }
    };
    a._appendQueueProps = function(b)
    {
        var a,
            d,
            j,
            f,
            e,
            h;
        for (h in b)
        {
            if (void 0 === this._initQueueProps[h])
            {
                d = this._target[h];
                if (a = c._plugins[h])
                {
                    j = 0;
                    for (f = a.length; j < f; j++)
                        d = a[j].init(this, h, d)
                }
                this._initQueueProps[h] = void 0 === d ? null : d
            }
            else
                d = this._curQueueProps[h];
            if (a = c._plugins[h])
            {
                e = e || {};
                j = 0;
                for (f = a.length; j < f; j++)
                    a[j].step && a[j].step(this, h, d, b[h], e)
            }
            this._curQueueProps[h] = b[h]
        }
        e && this._appendQueueProps(e);
        return this._curQueueProps
    };
    a._cloneProps = function(b)
    {
        var a = {},
            d;
        for (d in b)
            a[d] = b[d];
        return a
    };
    a._addStep = function(a)
    {
        0 < a.d && (this._steps.push(a), a.t = this.duration, this.duration += a.d);
        return this
    };
    a._addAction = function(a)
    {
        a.t = this.duration;
        this._actions.push(a);
        return this
    };
    a._set = function(a, c)
    {
        for (var d in a)
            c[d] = a[d]
    };
    createjs.Tween = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(a, c, d)
        {
            this.initialize(a, c, d)
        },
        a = c.prototype;
    a.ignoreGlobalPause = !1;
    a.duration = 0;
    a.loop = !1;
    a.onChange = null;
    a.position = null;
    a._paused = !1;
    a._tweens = null;
    a._labels = null;
    a._prevPosition = 0;
    a._prevPos = -1;
    a._useTicks = !1;
    a.initialize = function(a, c, d)
    {
        this._tweens = [];
        d && (this._useTicks = d.useTicks, this.loop = d.loop, this.ignoreGlobalPause = d.ignoreGlobalPause, this.onChange = d.onChange);
        a && this.addTween.apply(this, a);
        this.setLabels(c);
        d && d.paused ? this._paused = !0 : createjs.Tween._register(this, !0);
        d && null != d.position && this.setPosition(d.position, createjs.Tween.NONE)
    };
    a.addTween = function(a)
    {
        var c = arguments.length;
        if (1 < c)
        {
            for (var d = 0; d < c; d++)
                this.addTween(arguments[d]);
            return arguments[0]
        }
        if (0 == c)
            return null;
        this.removeTween(a);
        this._tweens.push(a);
        a.setPaused(!0);
        a._paused = !1;
        a._useTicks = this._useTicks;
        a.duration > this.duration && (this.duration = a.duration);
        0 <= this._prevPos && a.setPosition(this._prevPos, createjs.Tween.NONE);
        return a
    };
    a.removeTween = function(a)
    {
        var c = arguments.length;
        if (1 < c)
        {
            for (var d = !0, j = 0; j < c; j++)
                d = d && this.removeTween(arguments[j]);
            return d
        }
        if (0 == c)
            return !1;
        c = this._tweens.indexOf(a);
        return -1 != c ? (this._tweens.splice(c, 1), a.duration >= this.duration && this.updateDuration(), !0) : !1
    };
    a.addLabel = function(a, c)
    {
        this._labels[a] = c
    };
    a.setLabels = function(a)
    {
        this._labels = a ? a : {}
    };
    a.gotoAndPlay = function(a)
    {
        this.setPaused(!1);
        this._goto(a)
    };
    a.gotoAndStop = function(a)
    {
        this.setPaused(!0);
        this._goto(a)
    };
    a.setPosition = function(a, c)
    {
        0 > a && (a = 0);
        var d = this.loop ? a % this.duration : a,
            j = !this.loop && a >= this.duration;
        if (d == this._prevPos)
            return j;
        this._prevPosition = a;
        this.position = this._prevPos = d;
        for (var f = 0, e = this._tweens.length; f < e; f++)
            if (this._tweens[f].setPosition(d, c), d != this._prevPos)
                return !1;
        j && this.setPaused(!0);
        this.onChange && this.onChange(this);
        return j
    };
    a.setPaused = function(a)
    {
        this._paused = !!a;
        createjs.Tween._register(this, !a)
    };
    a.updateDuration = function()
    {
        for (var a = this.duration = 0, c = this._tweens.length; a < c; a++)
        {
            var d = this._tweens[a];
            d.duration > this.duration && (this.duration = d.duration)
        }
    };
    a.tick = function(a)
    {
        this.setPosition(this._prevPosition + a)
    };
    a.resolve = function(a)
    {
        var c = parseFloat(a);
        isNaN(c) && (c = this._labels[a]);
        return c
    };
    a.toString = function()
    {
        return "[Timeline]"
    };
    a.clone = function()
    {
        throw"Timeline can not be cloned.";
    };
    a._goto = function(a)
    {
        a = this.resolve(a);
        null != a && this.setPosition(a)
    };
    createjs.Timeline = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            throw"Ease cannot be instantiated.";
        };
    c.linear = function(a)
    {
        return a
    };
    c.none = c.linear;
    c.get = function(a)
    {
        -1 > a && (a = -1);
        1 < a && (a = 1);
        return function(b)
            {
                return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a))
            }
    };
    c.getPowIn = function(a)
    {
        return function(b)
            {
                return Math.pow(b, a)
            }
    };
    c.getPowOut = function(a)
    {
        return function(b)
            {
                return 1 - Math.pow(1 - b, a)
            }
    };
    c.getPowInOut = function(a)
    {
        return function(b)
            {
                return 1 > (b *= 2) ? 0.5 * Math.pow(b, a) : 1 - 0.5 * Math.abs(Math.pow(2 - b, a))
            }
    };
    c.quadIn = c.getPowIn(2);
    c.quadOut = c.getPowOut(2);
    c.quadInOut = c.getPowInOut(2);
    c.cubicIn = c.getPowIn(3);
    c.cubicOut = c.getPowOut(3);
    c.cubicInOut = c.getPowInOut(3);
    c.quartIn = c.getPowIn(4);
    c.quartOut = c.getPowOut(4);
    c.quartInOut = c.getPowInOut(4);
    c.quintIn = c.getPowIn(5);
    c.quintOut = c.getPowOut(5);
    c.quintInOut = c.getPowInOut(5);
    c.sineIn = function(a)
    {
        return 1 - Math.cos(a * Math.PI / 2)
    };
    c.sineOut = function(a)
    {
        return Math.sin(a * Math.PI / 2)
    };
    c.sineInOut = function(a)
    {
        return -0.5 * (Math.cos(Math.PI * a) - 1)
    };
    c.getBackIn = function(a)
    {
        return function(b)
            {
                return b * b * ((a + 1) * b - a)
            }
    };
    c.backIn = c.getBackIn(1.7);
    c.getBackOut = function(a)
    {
        return function(b)
            {
                return --b * b * ((a + 1) * b + a) + 1
            }
    };
    c.backOut = c.getBackOut(1.7);
    c.getBackInOut = function(a)
    {
        a *= 1.525;
        return function(b)
            {
                return 1 > (b *= 2) ? 0.5 * b * b * ((a + 1) * b - a) : 0.5 * ((b -= 2) * b * ((a + 1) * b + a) + 2)
            }
    };
    c.backInOut = c.getBackInOut(1.7);
    c.circIn = function(a)
    {
        return -(Math.sqrt(1 - a * a) - 1)
    };
    c.circOut = function(a)
    {
        return Math.sqrt(1 - --a * a)
    };
    c.circInOut = function(a)
    {
        return 1 > (a *= 2) ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    };
    c.bounceIn = function(a)
    {
        return 1 - c.bounceOut(1 - a)
    };
    c.bounceOut = function(a)
    {
        return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
    };
    c.bounceInOut = function(a)
    {
        return 0.5 > a ? 0.5 * c.bounceIn(2 * a) : 0.5 * c.bounceOut(2 * a - 1) + 0.5
    };
    c.getElasticIn = function(a, b)
    {
        var c = 2 * Math.PI;
        return function(d)
            {
                if (0 == d || 1 == d)
                    return d;
                var j = b / c * Math.asin(1 / a);
                return -(a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - j) * c / b))
            }
    };
    c.elasticIn = c.getElasticIn(1, 0.3);
    c.getElasticOut = function(a, b)
    {
        var c = 2 * Math.PI;
        return function(d)
            {
                if (0 == d || 1 == d)
                    return d;
                var j = b / c * Math.asin(1 / a);
                return a * Math.pow(2, -10 * d) * Math.sin((d - j) * c / b) + 1
            }
    };
    c.elasticOut = c.getElasticOut(1, 0.3);
    c.getElasticInOut = function(a, b)
    {
        var c = 2 * Math.PI;
        return function(d)
            {
                var j = b / c * Math.asin(1 / a);
                return 1 > (d *= 2) ? -0.5 * a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - j) * c / b) : 0.5 * a * Math.pow(2, -10 * (d -= 1)) * Math.sin((d - j) * c / b) + 1
            }
    };
    c.elasticInOut = c.getElasticInOut(1, 0.3 * 1.5);
    createjs.Ease = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            throw"MotionGuidePlugin cannot be instantiated.";
        };
    c.priority = 0;
    c.install = function()
    {
        createjs.Tween.installPlugin(c, ["guide", "x", "y", "rotation"]);
        return createjs.Tween.IGNORE
    };
    c.init = function(a, b, c)
    {
        a = a.target;
        a.hasOwnProperty("x") || (a.x = 0);
        a.hasOwnProperty("y") || (a.y = 0);
        a.hasOwnProperty("rotation") || (a.rotation = 0);
        return "guide" == b ? null : c
    };
    c.step = function(a, b, g, d, j)
    {
        if ("guide" != b)
            return d;
        var f;
        d.hasOwnProperty("path") || (d.path = []);
        a = d.path;
        d.hasOwnProperty("end") || (d.end = 1);
        d.hasOwnProperty("start") || (d.start = g && g.hasOwnProperty("end") && g.path === a ? g.end : 0);
        if (d.hasOwnProperty("_segments") && d._length)
            return d;
        g = a.length;
        if (6 <= g && 0 == (g - 2) % 4)
        {
            d._segments = [];
            d._length = 0;
            for (b = 2; b < g; b += 4)
            {
                for (var e = a[b - 2], h = a[b - 1], m = a[b + 0], k = a[b + 1], p = a[b + 2], s = a[b + 3], r = e, t = h, v, q, u = 0, w = [], y = 1; 10 >= y; y++)
                {
                    q = y / 10;
                    var x = 1 - q;
                    v = x * x * e + 2 * x * q * m + q * q * p;
                    q = x * x * h + 2 * x * q * k + q * q * s;
                    u += w[w.push(Math.sqrt((f = v - r) * f + (f = q - t) * f)) - 1];
                    r = v;
                    t = q
                }
                d._segments.push(u);
                d._segments.push(w);
                d._length += u
            }
        }
        else
            throw"invalid 'path' data, please see documentation for valid paths";
        f = d.orient;
        d.orient = !1;
        c.calc(d, d.end, j);
        d.orient = f;
        return d
    };
    c.tween = function(a, b, g, d, j, f, e)
    {
        j = j.guide;
        if (void 0 == j || j === d.guide)
            return g;
        j.lastRatio != f && (c.calc(j, (j.end - j.start) * (e ? j.end : f) + j.start, a.target), j.orient && (a.target.rotation += d.rotation || 0), j.lastRatio = f);
        return !j.orient && "rotation" == b ? g : a.target[b]
    };
    c.calc = function(a, b, g)
    {
        void 0 == a._segments && c.validate(a);
        void 0 == g && (g = {
            x: 0, y: 0, rotation: 0
        });
        var d = a._segments,
            j = a.path,
            f = a._length * b,
            e = d.length - 2;
        for (b = 0; f > d[b] && b < e; )
            f -= d[b],
            b += 2;
        for (var d = d[b + 1], h = 0, e = d.length - 1; f > d[h] && h < e; )
            f -= d[h],
            h++;
        f = h / ++e + f / (e * d[h]);
        b = 2 * b + 2;
        e = 1 - f;
        g.x = e * e * j[b - 2] + 2 * e * f * j[b + 0] + f * f * j[b + 2];
        g.y = e * e * j[b - 1] + 2 * e * f * j[b + 1] + f * f * j[b + 3];
        a.orient && (g.rotation = 57.2957795 * Math.atan2((j[b + 1] - j[b - 1]) * e + (j[b + 3] - j[b + 1]) * f, (j[b + 0] - j[b - 2]) * e + (j[b + 2] - j[b + 0]) * f));
        return g
    };
    createjs.MotionGuidePlugin = c
})();
(function()
{
    var c = this.createjs = this.createjs || {},
        c = c.TweenJS = c.TweenJS || {};
    c.version = "2013.05.14";
    c.buildDate = "Tue, 14 May 2013 21:49:54 GMT"
})();
this.createjs = this.createjs || {};
(function()
{
    function c()
    {
        throw"Sound cannot be instantiated";
    }
    function a(a, b)
    {
        this.init(a, b)
    }
    function b(){}
    c.DELIMITER = "|";
    c.AUDIO_TIMEOUT = 8E3;
    c.INTERRUPT_ANY = "any";
    c.INTERRUPT_EARLY = "early";
    c.INTERRUPT_LATE = "late";
    c.INTERRUPT_NONE = "none";
    c.PLAY_INITED = "playInited";
    c.PLAY_SUCCEEDED = "playSucceeded";
    c.PLAY_INTERRUPTED = "playInterrupted";
    c.PLAY_FINISHED = "playFinished";
    c.PLAY_FAILED = "playFailed";
    c.SUPPORTED_EXTENSIONS = "mp3 ogg mpeg wav m4a mp4 aiff wma mid".split(" ");
    c.EXTENSION_MAP = {m4a: "mp4"};
    c.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/;
    c.defaultInterruptBehavior = c.INTERRUPT_NONE;
    c.lastId = 0;
    c.activePlugin = null;
    c.pluginsRegistered = !1;
    c.masterVolume = 1;
    c.masterMute = !1;
    c.instances = [];
    c.idHash = {};
    c.preloadHash = {};
    c.defaultSoundInstance = null;
    c.addEventListener = null;
    c.removeEventListener = null;
    c.removeAllEventListeners = null;
    c.dispatchEvent = null;
    c.hasEventListener = null;
    c._listeners = null;
    createjs.EventDispatcher.initialize(c);
    c.onLoadComplete = null;
    c.sendFileLoadEvent = function(a)
    {
        if (c.preloadHash[a])
            for (var b = 0, g = c.preloadHash[a].length; b < g; b++)
            {
                var e = c.preloadHash[a][b],
                    h = {
                        target: this, type: "fileload", src: e.src, id: e.id, data: e.data
                    };
                c.preloadHash[a][b] = !0;
                c.dispatchEvent(h);
                c.onLoadComplete && c.onLoadComplete(h);
                h = {
                    target: this, type: "loadComplete", src: e.src, id: e.id, data: e.data
                };
                c.dispatchEvent(h)
            }
    };
    c.getPreloadHandlers = function()
    {
        return {
                callback: createjs.proxy(c.initLoad, c), types: ["sound"], extensions: c.SUPPORTED_EXTENSIONS
            }
    };
    c.registerPlugin = function(a)
    {
        c.pluginsRegistered = !0;
        return null == a ? !1 : a.isSupported() ? (c.activePlugin = new a, !0) : !1
    };
    c.registerPlugins = function(a)
    {
        for (var b = 0, g = a.length; b < g; b++)
            if (c.registerPlugin(a[b]))
                return !0;
        return !1
    };
    c.initializeDefaultPlugins = function()
    {
        return null != c.activePlugin ? !0 : c.pluginsRegistered ? !1 : c.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]) ? !0 : !1
    };
    c.isReady = function()
    {
        return null != c.activePlugin
    };
    c.getCapabilities = function()
    {
        return null == c.activePlugin ? null : c.activePlugin.capabilities
    };
    c.getCapability = function(a)
    {
        return null == c.activePlugin ? null : c.activePlugin.capabilities[a]
    };
    c.initLoad = function(a, b, g, e)
    {
        a = c.registerSound(a, g, e, !1);
        return null == a ? !1 : a
    };
    c.registerSound = function(b, g, f, e)
    {
        if (!c.initializeDefaultPlugins())
            return !1;
        b instanceof Object && (g = b.id, f = b.data, b = b.src);
        var h = c.parsePath(b, "sound", g, f);
        if (null == h)
            return !1;
        null != g && (c.idHash[g] = h.src);
        var m = null;
        null != f && (isNaN(f.channels) ? isNaN(f) || (m = parseInt(f)) : m = parseInt(f.channels));
        var k = c.activePlugin.register(h.src, m);
        null != k && (null != k.numChannels && (m = k.numChannels), a.create(h.src, m), null == f || !isNaN(f) ? f = h.data = m || a.maxPerChannel() : f.channels = h.data.channels = m || a.maxPerChannel(), null != k.tag ? h.tag = k.tag : k.src && (h.src = k.src), null != k.completeHandler && (h.completeHandler = k.completeHandler), k.type && (h.type = k.type));
        !1 != e && (c.preloadHash[h.src] || (c.preloadHash[h.src] = []), c.preloadHash[h.src].push({
            src: b, id: g, data: f
        }), 1 == c.preloadHash[h.src].length && c.activePlugin.preload(h.src, k));
        return h
    };
    c.registerManifest = function(a)
    {
        for (var b = [], c = 0, g = a.length; c < g; c++)
            b[c] = createjs.Sound.registerSound(a[c].src, a[c].id, a[c].data, a[c].preload);
        return b
    };
    c.removeSound = function(b)
    {
        if (null == c.activePlugin)
            return !1;
        b instanceof Object && (b = b.src);
        b = c.getSrcById(b);
        b = c.parsePath(b);
        if (null == b)
            return !1;
        b = b.src;
        for (var g in c.idHash)
            c.idHash[g] == b && delete c.idHash[g];
        a.remove(b);
        delete c.preloadHash[b];
        c.activePlugin.removeSound(b);
        return !0
    };
    c.removeManifest = function(a)
    {
        for (var b = [], c = 0, g = a.length; c < g; c++)
            b[c] = createjs.Sound.removeSound(a[c].src);
        return b
    };
    c.removeAllSounds = function()
    {
        c.idHash = {};
        c.preloadHash = {};
        a.removeAll();
        c.activePlugin.removeAllSounds()
    };
    c.loadComplete = function(a)
    {
        var b = c.parsePath(a, "sound");
        a = b ? c.getSrcById(b.src) : c.getSrcById(a);
        return !0 == c.preloadHash[a][0]
    };
    c.parsePath = function(a, b, g, e)
    {
        "string" != typeof a && (a = a.toString());
        a = a.split(c.DELIMITER);
        b = {
            type: b || "sound", id: g, data: e
        };
        g = c.getCapabilities();
        e = 0;
        for (var h = a.length; e < h; e++)
        {
            var m = a[e],
                k = m.match(c.FILE_PATTERN);
            if (null == k)
                return !1;
            var p = k[4],
                k = k[5];
            if (g[k] && -1 < c.SUPPORTED_EXTENSIONS.indexOf(k))
                return b.name = p, b.src = m, b.extension = k, b
        }
        return null
    };
    c.play = function(a, b, g, e, h, m, k)
    {
        a = c.createInstance(a);
        c.playInstance(a, b, g, e, h, m, k) || a.playFailed();
        return a
    };
    c.createInstance = function(b)
    {
        if (!c.initializeDefaultPlugins())
            return c.defaultSoundInstance;
        b = c.getSrcById(b);
        b = c.parsePath(b, "sound");
        var g = null;
        null != b && null != b.src ? (a.create(b.src), g = c.activePlugin.create(b.src)) : g = c.defaultSoundInstance;
        g.uniqueId = c.lastId++;
        return g
    };
    c.setVolume = function(a)
    {
        if (null == Number(a))
            return !1;
        a = Math.max(0, Math.min(1, a));
        c.masterVolume = a;
        if (!this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(a))
            for (var b = this.instances, g = 0, e = b.length; g < e; g++)
                b[g].setMasterVolume(a)
    };
    c.getVolume = function()
    {
        return c.masterVolume
    };
    c.mute = function(a)
    {
        this.masterMute = a;
        if (!this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(a))
            for (var b = this.instances, c = 0, g = b.length; c < g; c++)
                b[c].setMasterMute(a)
    };
    c.setMute = function(a)
    {
        if (null == a || void 0 == a)
            return !1;
        this.masterMute = a;
        if (!this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(a))
            for (var b = this.instances, c = 0, g = b.length; c < g; c++)
                b[c].setMasterMute(a);
        return !0
    };
    c.getMute = function()
    {
        return this.masterMute
    };
    c.stop = function()
    {
        for (var a = this.instances, b = a.length; b--; )
            a[b].stop()
    };
    c.playInstance = function(a, b, g, e, h, m, k)
    {
        b = b || c.defaultInterruptBehavior;
        null == g && (g = 0);
        null == e && (e = a.getPosition());
        null == h && (h = 0);
        null == m && (m = a.getVolume());
        null == k && (k = a.getPan());
        if (0 == g)
        {
            if (!c.beginPlaying(a, b, e, h, m, k))
                return !1
        }
        else
            g = setTimeout(function()
            {
                c.beginPlaying(a, b, e, h, m, k)
            }, g),
            a.delayTimeoutId = g;
        this.instances.push(a);
        return !0
    };
    c.beginPlaying = function(b, c, g, e, h, m)
    {
        return !a.add(b, c) ? !1 : !b.beginPlaying(g, e, h, m) ? (b = this.instances.indexOf(b), -1 < b && this.instances.splice(b, 1), !1) : !0
    };
    c.getSrcById = function(a)
    {
        return null == c.idHash || null == c.idHash[a] ? a : c.idHash[a]
    };
    c.playFinished = function(b)
    {
        a.remove(b);
        b = this.instances.indexOf(b);
        -1 < b && this.instances.splice(b, 1)
    };
    c.proxy = function(a, b)
    {
        return function()
            {
                return a.apply(b, arguments)
            }
    };
    createjs.Sound = c;
    createjs.proxy = function(a, b)
    {
        var c = Array.prototype.slice.call(arguments, 2);
        return function()
            {
                return a.apply(b, Array.prototype.slice.call(arguments, 0).concat(c))
            }
    };
    a.channels = {};
    a.create = function(b, c)
    {
        return null == a.get(b) ? (a.channels[b] = new a(b, c), !0) : !1
    };
    a.remove = function(b)
    {
        var c = a.get(b);
        if (null == c)
            return !1;
        c.removeAll();
        delete a.channels[b];
        return !0
    };
    a.removeAll = function()
    {
        for (var b in a.channels)
            a.channels[b].removeAll();
        a.channels = {}
    };
    a.add = function(b, c)
    {
        var g = a.get(b.src);
        return null == g ? !1 : g.add(b, c)
    };
    a.remove = function(b)
    {
        var c = a.get(b.src);
        if (null == c)
            return !1;
        c.remove(b);
        return !0
    };
    a.maxPerChannel = function()
    {
        return g.maxDefault
    };
    a.get = function(b)
    {
        return a.channels[b]
    };
    var g = a.prototype = {
            src: null, max: null, maxDefault: 100, length: 0, init: function(a, b)
                {
                    this.src = a;
                    this.max = b || this.maxDefault;
                    -1 == this.max && this.max == this.maxDefault;
                    this.instances = []
                }, get: function(a)
                {
                    return this.instances[a]
                }, add: function(a, b)
                {
                    if (!this.getSlot(b, a))
                        return !1;
                    this.instances.push(a);
                    this.length++;
                    return !0
                }, remove: function(a)
                {
                    a = this.instances.indexOf(a);
                    if (-1 == a)
                        return !1;
                    this.instances.splice(a, 1);
                    this.length--;
                    return !0
                }, removeAll: function()
                {
                    for (; this.length; )
                        this.instances[this.length - 1].stop()
                }, getSlot: function(a)
                {
                    for (var b, g, e = 0, h = this.max; e < h; e++)
                    {
                        b = this.get(e);
                        if (null == b)
                            return !0;
                        if (!(a == c.INTERRUPT_NONE && b.playState != c.PLAY_FINISHED))
                            if (0 == e)
                                g = b;
                            else if (b.playState == c.PLAY_FINISHED || b.playState == c.PLAY_INTERRUPTED || b.playState == c.PLAY_FAILED)
                                g = b;
                            else if (a == c.INTERRUPT_EARLY && b.getPosition() < g.getPosition() || a == c.INTERRUPT_LATE && b.getPosition() > g.getPosition())
                                g = b
                    }
                    return null != g ? (g.interrupt(), this.remove(g), !0) : !1
                }, toString: function()
                {
                    return "[Sound SoundChannel]"
                }
        };
    c.defaultSoundInstance = new function()
    {
        this.isDefault = !0;
        this.addEventListener = this.removeEventListener = this.removeAllEventListener = this.dispatchEvent = this.hasEventListener = this._listeners = this.interrupt = this.playFailed = this.pause = this.resume = this.play = this.beginPlaying = this.cleanUp = this.stop = this.setMasterVolume = this.setVolume = this.mute = this.setMute = this.getMute = this.setPan = this.getPosition = this.setPosition = function()
        {
            return !1
        };
        this.getVolume = this.getPan = this.getDuration = function()
        {
            return 0
        };
        this.playState = c.PLAY_FAILED;
        this.toString = function()
        {
            return "[Sound Default Sound Instance]"
        }
    };
    b.init = function()
    {
        var a = navigator.userAgent;
        b.isFirefox = -1 < a.indexOf("Firefox");
        b.isOpera = null != window.opera;
        b.isChrome = -1 < a.indexOf("Chrome");
        b.isIOS = -1 < a.indexOf("iPod") || -1 < a.indexOf("iPhone") || -1 < a.indexOf("iPad");
        b.isAndroid = -1 < a.indexOf("Android");
        b.isBlackberry = -1 < a.indexOf("Blackberry")
    };
    b.init();
    createjs.Sound.BrowserDetect = b
})();
this.createjs = this.createjs || {};
(function()
{
    function c()
    {
        this.init()
    }
    function a(a, b)
    {
        this.init(a, b)
    }
    function b(a, b)
    {
        this.init(a, b)
    }
    c.capabilities = null;
    c.isSupported = function()
    {
        var a = createjs.Sound.BrowserDetect.isIOS || createjs.Sound.BrowserDetect.isAndroid || createjs.Sound.BrowserDetect.isBlackberry;
        if ("file:" == location.protocol && !a)
            return !1;
        c.generateCapabilities();
        return null == c.context ? !1 : !0
    };
    c.generateCapabilities = function()
    {
        if (null == c.capabilities)
        {
            var a = document.createElement("audio");
            if (null == a.canPlayType)
                return null;
            if (window.webkitAudioContext)
                c.context = new webkitAudioContext;
            else if (window.AudioContext)
                c.context = new AudioContext;
            else
                return null;
            c.playEmptySound();
            c.capabilities = {
                panning: !0, volume: !0, tracks: -1
            };
            for (var b = createjs.Sound.SUPPORTED_EXTENSIONS, j = createjs.Sound.EXTENSION_MAP, f = 0, e = b.length; f < e; f++)
            {
                var h = b[f],
                    m = j[h] || h;
                c.capabilities[h] = "no" != a.canPlayType("audio/" + h) && "" != a.canPlayType("audio/" + h) || "no" != a.canPlayType("audio/" + m) && "" != a.canPlayType("audio/" + m)
            }
            2 > c.context.destination.numberOfChannels && (c.capabilities.panning = !1);
            c.dynamicsCompressorNode = c.context.createDynamicsCompressor();
            c.dynamicsCompressorNode.connect(c.context.destination);
            c.gainNode = c.context.createGainNode();
            c.gainNode.connect(c.dynamicsCompressorNode)
        }
    };
    c.playEmptySound = function()
    {
        var a = this.context.createBuffer(1, 1, 22050),
            b = this.context.createBufferSource();
        b.buffer = a;
        b.connect(this.context.destination);
        b.noteOn(0)
    };
    c.prototype = {
        capabilities: null, volume: 1, context: null, dynamicsCompressorNode: null, gainNode: null, arrayBuffers: null, init: function()
            {
                this.capabilities = c.capabilities;
                this.arrayBuffers = {};
                this.context = c.context;
                this.gainNode = c.gainNode;
                this.dynamicsCompressorNode = c.dynamicsCompressorNode
            }, register: function(a)
            {
                this.arrayBuffers[a] = !0;
                return {tag: new b(a, this)}
            }, isPreloadStarted: function(a)
            {
                return null != this.arrayBuffers[a]
            }, isPreloadComplete: function(a)
            {
                return !(null == this.arrayBuffers[a] || !0 == this.arrayBuffers[a])
            }, removeFromPreload: function(a)
            {
                delete this.arrayBuffers[a]
            }, removeSound: function(a)
            {
                delete this.arrayBuffers[a]
            }, removeAllSounds: function()
            {
                this.arrayBuffers = {}
            }, addPreloadResults: function(a, b)
            {
                this.arrayBuffers[a] = b
            }, handlePreloadComplete: function()
            {
                createjs.Sound.sendFileLoadEvent(this.src)
            }, preload: function(a)
            {
                this.arrayBuffers[a] = !0;
                a = new b(a, this);
                a.onload = this.handlePreloadComplete;
                a.load()
            }, create: function(b)
            {
                this.isPreloadStarted(b) || this.preload(b);
                return new a(b, this)
            }, setVolume: function(a)
            {
                this.volume = a;
                this.updateVolume();
                return !0
            }, updateVolume: function()
            {
                var a = createjs.Sound.masterMute ? 0 : this.volume;
                a != this.gainNode.gain.value && (this.gainNode.gain.value = a)
            }, getVolume: function()
            {
                return this.volume
            }, setMute: function()
            {
                this.updateVolume();
                return !0
            }, toString: function()
            {
                return "[WebAudioPlugin]"
            }
    };
    createjs.WebAudioPlugin = c;
    a.prototype = {
        src: null, uniqueId: -1, playState: null, owner: null, offset: 0, delay: 0, volume: 1, pan: 0, duration: 0, remainingLoops: 0, delayTimeoutId: null, soundCompleteTimeout: null, panNode: null, gainNode: null, sourceNode: null, sourceNodeNext: null, muted: !1, paused: !1, startTime: 0, addEventListener: null, removeEventListener: null, removeAllEventListeners: null, dispatchEvent: null, hasEventListener: null, _listeners: null, endedHandler: null, readyHandler: null, stalledHandler: null, onReady: null, onPlaySucceeded: null, onPlayInterrupted: null, onPlayFailed: null, onComplete: null, onLoop: null, sendEvent: function(a)
            {
                this.dispatchEvent({
                    target: this, type: a
                })
            }, init: function(a, b)
            {
                this.owner = b;
                this.src = a;
                this.panNode = this.owner.context.createPanner();
                this.panNode.panningModel = 0;
                this.gainNode = this.owner.context.createGainNode();
                this.gainNode.connect(this.panNode);
                this.owner.isPreloadComplete(this.src) && (this.duration = 1E3 * this.owner.arrayBuffers[this.src].duration);
                this.endedHandler = createjs.proxy(this.handleSoundComplete, this);
                this.readyHandler = createjs.proxy(this.handleSoundReady, this);
                this.stalledHandler = createjs.proxy(this.handleSoundStalled, this)
            }, cleanUp: function()
            {
                this.sourceNode && this.sourceNode.playbackState != this.sourceNode.UNSCHEDULED_STATE && (this.cleanUpAudioNode(this.sourceNode), this.sourceNodeNext && this.cleanUpAudioNode(this.sourceNodeNext));
                0 != this.panNode.numberOfOutputs && this.panNode.disconnect(0);
                clearTimeout(this.delayTimeoutId);
                clearTimeout(this.soundCompleteTimeout);
                null != window.createjs && createjs.Sound.playFinished(this)
            }, cleanUpAudioNode: function(a)
            {
                a.noteOff(0);
                a.disconnect(this.gainNode);
                return null
            }, interrupt: function()
            {
                this.playState = createjs.Sound.PLAY_INTERRUPTED;
                if (this.onPlayInterrupted)
                    this.onPlayInterrupted(this);
                this.cleanUp();
                this.paused = !1;
                this.sendEvent("interrupted")
            }, handleSoundStalled: function()
            {
                if (null != this.onPlayFailed)
                    this.onPlayFailed(this);
                this.sendEvent("failed")
            }, handleSoundReady: function()
            {
                if (null != window.createjs)
                    if (1E3 * this.offset > this.getDuration())
                        this.playFailed();
                    else
                    {
                        0 > this.offset && (this.offset = 0);
                        this.playState = createjs.Sound.PLAY_SUCCEEDED;
                        this.paused = !1;
                        this.panNode.connect(this.owner.gainNode);
                        var a = this.owner.arrayBuffers[this.src].duration;
                        this.sourceNode = this.createAndPlayAudioNode(this.owner.context.currentTime - a, this.offset);
                        this.duration = 1E3 * a;
                        this.startTime = this.sourceNode.startTime - this.offset;
                        this.soundCompleteTimeout = setTimeout(this.endedHandler, 1E3 * (a - this.offset));
                        0 != this.remainingLoops && (this.sourceNodeNext = this.createAndPlayAudioNode(this.startTime, 0))
                    }
            }, createAndPlayAudioNode: function(a, b)
            {
                var c = this.owner.context.createBufferSource();
                c.buffer = this.owner.arrayBuffers[this.src];
                c.connect(this.gainNode);
                c.startTime = a + c.buffer.duration;
                c.noteGrainOn(c.startTime, b, c.buffer.duration - b);
                return c
            }, play: function(a, b, c, f, e, h)
            {
                this.cleanUp();
                createjs.Sound.playInstance(this, a, b, c, f, e, h)
            }, beginPlaying: function(a, b, c, f)
            {
                if (null != window.createjs && this.src)
                {
                    this.offset = a / 1E3;
                    this.remainingLoops = b;
                    this.setVolume(c);
                    this.setPan(f);
                    if (this.owner.isPreloadComplete(this.src))
                        return this.handleSoundReady(null), this.onPlaySucceeded && this.onPlaySucceeded(this), this.sendEvent("succeeded"), 1;
                    this.playFailed()
                }
            }, pause: function()
            {
                return !this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED ? (this.paused = !0, this.offset = this.owner.context.currentTime - this.startTime, this.cleanUpAudioNode(this.sourceNode), this.cleanUpAudioNode(this.sourceNodeNext), 0 != this.panNode.numberOfOutputs && this.panNode.disconnect(), clearTimeout(this.delayTimeoutId), clearTimeout(this.soundCompleteTimeout), !0) : !1
            }, resume: function()
            {
                if (!this.paused)
                    return !1;
                this.handleSoundReady(null);
                return !0
            }, stop: function()
            {
                this.playState = createjs.Sound.PLAY_FINISHED;
                this.cleanUp();
                this.offset = 0;
                return !0
            }, setVolume: function(a)
            {
                if (null == Number(a))
                    return !1;
                this.volume = a = Math.max(0, Math.min(1, a));
                this.updateVolume();
                return !0
            }, updateVolume: function()
            {
                var a = this.muted ? 0 : this.volume;
                return a != this.gainNode.gain.value ? (this.gainNode.gain.value = a, !0) : !1
            }, getVolume: function()
            {
                return this.volume
            }, mute: function(a)
            {
                this.muted = a;
                this.updateVolume();
                return !0
            }, setMute: function(a)
            {
                if (null == a || void 0 == a)
                    return !1;
                this.muted = a;
                this.updateVolume();
                return !0
            }, getMute: function()
            {
                return this.muted
            }, setPan: function(a)
            {
                if (this.owner.capabilities.panning)
                    this.panNode.setPosition(a, 0, -0.5),
                    this.pan = a;
                else
                    return !1
            }, getPan: function()
            {
                return this.pan
            }, getPosition: function()
            {
                return 1E3 * (this.paused || null == this.sourceNode ? this.offset : this.owner.context.currentTime - this.startTime)
            }, setPosition: function(a)
            {
                this.offset = a / 1E3;
                this.sourceNode && this.sourceNode.playbackState != this.sourceNode.UNSCHEDULED_STATE && (this.cleanUpAudioNode(this.sourceNode), this.cleanUpAudioNode(this.sourceNodeNext), clearTimeout(this.soundCompleteTimeout));
                !this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED && this.handleSoundReady(null);
                return !0
            }, getDuration: function()
            {
                return this.duration
            }, handleSoundComplete: function()
            {
                this.offset = 0;
                if (0 != this.remainingLoops)
                {
                    this.remainingLoops--;
                    this.sourceNodeNext ? (this.cleanUpAudioNode(this.sourceNode), this.sourceNode = this.sourceNodeNext, this.startTime = this.sourceNode.startTime, this.sourceNodeNext = this.createAndPlayAudioNode(this.startTime, 0), this.soundCompleteTimeout = setTimeout(this.endedHandler, this.duration)) : this.handleSoundReady(null);
                    if (null != this.onLoop)
                        this.onLoop(this);
                    this.sendEvent("loop")
                }
                else if (null != window.createjs)
                {
                    this.playState = createjs.Sound.PLAY_FINISHED;
                    this.cleanUp();
                    if (null != this.onComplete)
                        this.onComplete(this);
                    this.sendEvent("complete")
                }
            }, playFailed: function()
            {
                if (null != window.createjs)
                {
                    this.playState = createjs.Sound.PLAY_FAILED;
                    if (null != this.onPlayFailed)
                        this.onPlayFailed(this);
                    this.cleanUp();
                    this.sendEvent("failed")
                }
            }, toString: function()
            {
                return "[WebAudioPlugin SoundInstance]"
            }
    };
    createjs.EventDispatcher.initialize(a.prototype);
    b.prototype = {
        request: null, owner: null, progress: -1, src: null, result: null, onload: null, onprogress: null, onError: null, init: function(a, b)
            {
                this.src = a;
                this.owner = b
            }, load: function(a)
            {
                null != a && (this.src = a);
                this.request = new XMLHttpRequest;
                this.request.open("GET", this.src, !0);
                this.request.responseType = "arraybuffer";
                this.request.onload = createjs.proxy(this.handleLoad, this);
                this.request.onError = createjs.proxy(this.handleError, this);
                this.request.onprogress = createjs.proxy(this.handleProgress, this);
                this.request.send()
            }, handleProgress: function(a, b)
            {
                this.progress = a / b;
                if (null != this.onprogress)
                    this.onprogress({
                        loaded: a, total: b, progress: this.progress
                    })
            }, handleLoad: function()
            {
                c.context.decodeAudioData(this.request.response, createjs.proxy(this.handleAudioDecoded, this), createjs.proxy(this.handleError, this))
            }, handleAudioDecoded: function(a)
            {
                this.progress = 1;
                this.result = a;
                this.owner.addPreloadResults(this.src, this.result);
                this.onload && this.onload()
            }, handleError: function(a)
            {
                this.owner.removeSound(this.src);
                this.onerror && this.onerror(a)
            }, toString: function()
            {
                return "[WebAudioPlugin WebAudioLoader]"
            }
    }
})();
this.createjs = this.createjs || {};
(function()
{
    function c()
    {
        this.init()
    }
    function a(a, b)
    {
        this.init(a, b)
    }
    function b(a, b)
    {
        this.init(a, b)
    }
    function g(a)
    {
        this.init(a)
    }
    c.MAX_INSTANCES = 30;
    c.capabilities = null;
    c.AUDIO_READY = "canplaythrough";
    c.AUDIO_ENDED = "ended";
    c.AUDIO_SEEKED = "seeked";
    c.AUDIO_ERROR = "error";
    c.AUDIO_STALLED = "stalled";
    c.isSupported = function()
    {
        if (createjs.Sound.BrowserDetect.isIOS)
            return !1;
        c.generateCapabilities();
        return null == c.tag || null == c.capabilities ? !1 : !0
    };
    c.generateCapabilities = function()
    {
        if (null == c.capabilities)
        {
            var a = c.tag = document.createElement("audio");
            if (null == a.canPlayType)
                return null;
            c.capabilities = {
                panning: !0, volume: !0, tracks: -1
            };
            for (var b = createjs.Sound.SUPPORTED_EXTENSIONS, g = createjs.Sound.EXTENSION_MAP, e = 0, h = b.length; e < h; e++)
            {
                var m = b[e],
                    k = g[m] || m;
                c.capabilities[m] = "no" != a.canPlayType("audio/" + m) && "" != a.canPlayType("audio/" + m) || "no" != a.canPlayType("audio/" + k) && "" != a.canPlayType("audio/" + k)
            }
        }
    };
    c.prototype = {
        capabilities: null, audioSources: null, defaultNumChannels: 2, init: function()
            {
                this.capabilities = c.capabilities;
                this.audioSources = {}
            }, register: function(a, b)
            {
                this.audioSources[a] = !0;
                for (var c = g.get(a), e = null, h = b || this.defaultNumChannels, m = 0; m < h; m++)
                    e = this.createTag(a),
                    c.add(e);
                return {
                        tag: e, numChannels: h
                    }
            }, createTag: function(a)
            {
                var b = document.createElement("audio");
                b.autoplay = !1;
                b.preload = "none";
                b.src = a;
                return b
            }, removeSound: function(a)
            {
                delete this.audioSources[a];
                g.remove(a)
            }, removeAllSounds: function()
            {
                this.audioSources = {};
                g.removeAll()
            }, create: function(b)
            {
                if (!this.isPreloadStarted(b))
                {
                    var c = g.get(b),
                        f = this.createTag(b);
                    c.add(f);
                    this.preload(b, {tag: f})
                }
                return new a(b, this)
            }, isPreloadStarted: function(a)
            {
                return null != this.audioSources[a]
            }, preload: function(a, c)
            {
                this.audioSources[a] = !0;
                new b(a, c.tag)
            }, toString: function()
            {
                return "[HTMLAudioPlugin]"
            }
    };
    createjs.HTMLAudioPlugin = c;
    a.prototype = {
        src: null, uniqueId: -1, playState: null, owner: null, loaded: !1, offset: 0, delay: 0, volume: 1, pan: 0, duration: 0, remainingLoops: 0, delayTimeoutId: null, tag: null, muted: !1, paused: !1, addEventListener: null, removeEventListener: null, removeAllEventListeners: null, dispatchEvent: null, hasEventListener: null, _listeners: null, onComplete: null, onLoop: null, onReady: null, onPlayFailed: null, onPlayInterrupted: null, onPlaySucceeded: null, endedHandler: null, readyHandler: null, stalledHandler: null, loopHandler: null, init: function(a, b)
            {
                this.src = a;
                this.owner = b;
                this.endedHandler = createjs.proxy(this.handleSoundComplete, this);
                this.readyHandler = createjs.proxy(this.handleSoundReady, this);
                this.stalledHandler = createjs.proxy(this.handleSoundStalled, this);
                this.loopHandler = createjs.proxy(this.handleSoundLoop, this)
            }, sendEvent: function(a)
            {
                this.dispatchEvent({
                    target: this, type: a
                })
            }, cleanUp: function()
            {
                var a = this.tag;
                if (null != a)
                {
                    a.pause();
                    a.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED, this.endedHandler, !1);
                    a.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, !1);
                    a.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, !1);
                    try
                    {
                        a.currentTime = 0
                    }
                    catch(b) {}
                    g.setInstance(this.src, a);
                    this.tag = null
                }
                clearTimeout(this.delayTimeoutId);
                null != window.createjs && createjs.Sound.playFinished(this)
            }, interrupt: function()
            {
                if (null != this.tag)
                {
                    this.playState = createjs.Sound.PLAY_INTERRUPTED;
                    if (this.onPlayInterrupted)
                        this.onPlayInterrupted(this);
                    this.cleanUp();
                    this.paused = !1;
                    this.sendEvent("interrupted")
                }
            }, play: function(a, b, c, g, h, m)
            {
                this.cleanUp();
                createjs.Sound.playInstance(this, a, b, c, g, h, m)
            }, beginPlaying: function(a, b, c)
            {
                if (null == window.createjs)
                    return -1;
                var e = this.tag = g.getInstance(this.src);
                if (null == e)
                    return this.playFailed(), -1;
                e.addEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED, this.endedHandler, !1);
                this.offset = a;
                this.volume = c;
                this.updateVolume();
                this.remainingLoops = b;
                4 !== e.readyState ? (e.addEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, !1), e.addEventListener(createjs.HTMLAudioPlugin.AUDIO_STALLED, this.stalledHandler, !1), e.preload = "auto", e.load()) : this.handleSoundReady(null);
                this.onPlaySucceeded && this.onPlaySucceeded(this);
                this.sendEvent("succeeded");
                return 1
            }, handleSoundStalled: function()
            {
                if (null != this.onPlayFailed)
                    this.onPlayFailed(this);
                this.cleanUp();
                this.sendEvent("failed")
            }, handleSoundReady: function()
            {
                null != window.createjs && (this.duration = 1E3 * this.tag.duration, this.playState = createjs.Sound.PLAY_SUCCEEDED, this.paused = !1, this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, !1), this.offset >= this.getDuration() ? this.playFailed() : (0 < this.offset && (this.tag.currentTime = 0.0010 * this.offset), -1 == this.remainingLoops && (this.tag.loop = !0), 0 != this.remainingLoops && (this.tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, !1), this.tag.loop = !0), this.tag.play()))
            }, pause: function()
            {
                return !this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED && null != this.tag ? (this.paused = !0, this.tag.pause(), clearTimeout(this.delayTimeoutId), !0) : !1
            }, resume: function()
            {
                if (!this.paused || null == this.tag)
                    return !1;
                this.paused = !1;
                this.tag.play();
                return !0
            }, stop: function()
            {
                this.offset = 0;
                this.pause();
                this.playState = createjs.Sound.PLAY_FINISHED;
                this.cleanUp();
                return !0
            }, setMasterVolume: function()
            {
                this.updateVolume();
                return !0
            }, setVolume: function(a)
            {
                if (null == Number(a))
                    return !1;
                this.volume = a = Math.max(0, Math.min(1, a));
                this.updateVolume();
                return !0
            }, updateVolume: function()
            {
                if (null != this.tag)
                {
                    var a = this.muted || createjs.Sound.masterMute ? 0 : this.volume * createjs.Sound.masterVolume;
                    a != this.tag.volume && (this.tag.volume = a);
                    return !0
                }
                return !1
            }, getVolume: function()
            {
                return this.volume
            }, mute: function(a)
            {
                this.muted = a;
                this.updateVolume();
                return !0
            }, setMasterMute: function()
            {
                this.updateVolume();
                return !0
            }, setMute: function(a)
            {
                if (null == a || void 0 == a)
                    return !1;
                this.muted = a;
                this.updateVolume();
                return !0
            }, getMute: function()
            {
                return this.muted
            }, setPan: function()
            {
                return !1
            }, getPan: function()
            {
                return 0
            }, getPosition: function()
            {
                return null == this.tag ? this.offset : 1E3 * this.tag.currentTime
            }, setPosition: function(a)
            {
                if (null == this.tag)
                    this.offset = a;
                else
                {
                    this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, !1);
                    try
                    {
                        this.tag.currentTime = 0.0010 * a
                    }
                    catch(b)
                    {
                        return !1
                    }
                    this.tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, !1)
                }
                return !0
            }, getDuration: function()
            {
                return this.duration
            }, handleSoundComplete: function()
            {
                this.offset = 0;
                if (null != window.createjs)
                {
                    this.playState = createjs.Sound.PLAY_FINISHED;
                    this.cleanUp();
                    if (null != this.onComplete)
                        this.onComplete(this);
                    this.sendEvent("complete")
                }
            }, handleSoundLoop: function()
            {
                this.offset = 0;
                this.remainingLoops--;
                0 == this.remainingLoops && (this.tag.loop = !1, this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, !1));
                if (null != this.onLoop)
                    this.onLoop(this);
                this.sendEvent("loop")
            }, playFailed: function()
            {
                if (null != window.createjs)
                {
                    this.playState = createjs.Sound.PLAY_FAILED;
                    if (null != this.onPlayFailed)
                        this.onPlayFailed(this);
                    this.cleanUp();
                    this.sendEvent("failed")
                }
            }, toString: function()
            {
                return "[HTMLAudioPlugin SoundInstance]"
            }
    };
    createjs.EventDispatcher.initialize(a.prototype);
    b.prototype = {
        src: null, tag: null, preloadTimer: null, loadedHandler: null, init: function(a, b)
            {
                this.src = a;
                this.tag = b;
                this.preloadTimer = setInterval(createjs.proxy(this.preloadTick, this), 200);
                this.loadedHandler = createjs.proxy(this.sendLoadedEvent, this);
                this.tag.addEventListener && this.tag.addEventListener("canplaythrough", this.loadedHandler);
                this.tag.onreadystatechange = createjs.proxy(this.sendLoadedEvent, this);
                this.tag.preload = "auto";
                this.tag.src = a;
                this.tag.load()
            }, preloadTick: function()
            {
                var a = this.tag.buffered,
                    b = this.tag.duration;
                0 < a.length && a.end(0) >= b - 1 && this.handleTagLoaded()
            }, handleTagLoaded: function()
            {
                clearInterval(this.preloadTimer)
            }, sendLoadedEvent: function()
            {
                this.tag.removeEventListener && this.tag.removeEventListener("canplaythrough", this.loadedHandler);
                this.tag.onreadystatechange = null;
                createjs.Sound.sendFileLoadEvent(this.src)
            }, toString: function()
            {
                return "[HTMLAudioPlugin HTMLAudioLoader]"
            }
    };
    g.tags = {};
    g.get = function(a)
    {
        var b = g.tags[a];
        null == b && (b = g.tags[a] = new g(a));
        return b
    };
    g.remove = function(a)
    {
        var b = g.tags[a];
        if (null == b)
            return !1;
        b.removeAll();
        delete g.tags[a];
        return !0
    };
    g.removeAll = function()
    {
        for (var a in g.tags)
            g.tags[a].removeAll();
        g.tags = {}
    };
    g.getInstance = function(a)
    {
        a = g.tags[a];
        return null == a ? null : a.get()
    };
    g.setInstance = function(a, b)
    {
        var c = g.tags[a];
        return null == c ? null : c.set(b)
    };
    g.prototype = {
        src: null, length: 0, available: 0, tags: null, init: function(a)
            {
                this.src = a;
                this.tags = []
            }, add: function(a)
            {
                this.tags.push(a);
                this.length++;
                this.available++
            }, removeAll: function()
            {
                for (; this.length--; )
                    delete this.tags[this.length];
                this.tags = this.src = null
            }, get: function()
            {
                if (0 == this.tags.length)
                    return null;
                this.available = this.tags.length;
                var a = this.tags.pop();
                null == a.parentNode && document.body.appendChild(a);
                return a
            }, set: function(a)
            {
                -1 == this.tags.indexOf(a) && this.tags.push(a);
                this.available = this.tags.length
            }, toString: function()
            {
                return "[HTMLAudioPlugin TagPool]"
            }
    }
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function()
        {
            this.init()
        };
    c.prototype = {};
    var a = c.prototype;
    c.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/;
    a.loaded = !1;
    a.canceled = !1;
    a.progress = 0;
    a._item = null;
    a._basePath = null;
    a.onProgress = null;
    a.onLoadStart = null;
    a.onComplete = null;
    a.onError = null;
    a.addEventListener = null;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a.getItem = function()
    {
        return this._item
    };
    a.init = function(){};
    a.load = function(){};
    a.close = function(){};
    a._sendLoadStart = function()
    {
        this._isCanceled() || (this.onLoadStart && this.onLoadStart({target: this}), this.dispatchEvent("loadStart"), this.dispatchEvent("loadstart"))
    };
    a._sendProgress = function(a)
    {
        if (!this._isCanceled())
        {
            var c = null;
            if ("number" == typeof a)
                this.progress = a,
                c = {
                    loaded: this.progress, total: 1
                };
            else if (c = a, this.progress = a.loaded / a.total, isNaN(this.progress) || Infinity == this.progress)
                this.progress = 0;
            c.target = this;
            c.type = "progress";
            c.progress = this.progress;
            this.onProgress && this.onProgress(c);
            this.dispatchEvent(c)
        }
    };
    a._sendComplete = function()
    {
        this._isCanceled() || (this.onComplete && this.onComplete({target: this}), this.dispatchEvent("complete"))
    };
    a._sendError = function(a)
    {
        this._isCanceled() || (null == a && (a = {}), a.target = this, a.type = "error", this.onError && this.onError(a), this.dispatchEvent(a))
    };
    a._isCanceled = function()
    {
        return null == window.createjs || this.canceled ? !0 : !1
    };
    a._parseURI = function(a)
    {
        return !a ? null : a.match(c.FILE_PATTERN)
    };
    a._formatQueryString = function(a, c)
    {
        if (null == a)
            throw Error("You must specify data.");
        var d = [],
            j;
        for (j in a)
            d.push(j + "=" + escape(a[j]));
        c && (d = d.concat(c));
        return d.join("&")
    };
    a.buildPath = function(a, c, d)
    {
        if (null != c)
        {
            var j = this._parseURI(a);
            if (null == j[1] || "" == j[1])
                a = c + a
        }
        if (null == d)
            return a;
        c = [];
        j = a.indexOf("?");
        if (-1 != j)
        {
            var f = a.slice(j + 1);
            c = c.concat(f.split("&"))
        }
        return -1 != j ? a.slice(0, j) + "?" + this._formatQueryString(d, c) : a + "?" + this._formatQueryString(d, c)
    };
    a.toString = function()
    {
        return "[PreloadJS AbstractLoader]"
    };
    createjs.AbstractLoader = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(a, b)
        {
            this.init(a, b)
        },
        a = c.prototype = new createjs.AbstractLoader;
    c.LOAD_TIMEOUT = 8E3;
    c.BINARY = "binary";
    c.CSS = "css";
    c.IMAGE = "image";
    c.JAVASCRIPT = "javascript";
    c.JSON = "json";
    c.JSONP = "jsonp";
    c.SOUND = "sound";
    c.SVG = "svg";
    c.TEXT = "text";
    c.XML = "xml";
    c.POST = "POST";
    c.GET = "GET";
    a.useXHR = !0;
    a.stopOnError = !1;
    a.maintainScriptOrder = !0;
    a.next = null;
    a.onFileLoad = null;
    a.onFileProgress = null;
    a._typeCallbacks = null;
    a._extensionCallbacks = null;
    a._loadStartWasDispatched = !1;
    a._maxConnections = 1;
    a._currentlyLoadingScript = null;
    a._currentLoads = null;
    a._loadQueue = null;
    a._loadQueueBackup = null;
    a._loadItemsById = null;
    a._loadItemsBySrc = null;
    a._loadedResults = null;
    a._loadedRawResults = null;
    a._numItems = 0;
    a._numItemsLoaded = 0;
    a._scriptOrder = null;
    a._loadedScripts = null;
    a.init = function(a, b)
    {
        this._numItems = this._numItemsLoaded = 0;
        this._loadStartWasDispatched = this._paused = !1;
        this._currentLoads = [];
        this._loadQueue = [];
        this._loadQueueBackup = [];
        this._scriptOrder = [];
        this._loadedScripts = [];
        this._loadItemsById = {};
        this._loadItemsBySrc = {};
        this._loadedResults = {};
        this._loadedRawResults = {};
        this._typeCallbacks = {};
        this._extensionCallbacks = {};
        this._basePath = b;
        this.setUseXHR(a)
    };
    a.setUseXHR = function(a)
    {
        return this.useXHR = !1 != a && null != window.XMLHttpRequest
    };
    a.removeAll = function()
    {
        this.remove()
    };
    a.remove = function(a)
    {
        var b = null;
        a && !(a instanceof Array) ? b = [a] : a && (b = a);
        a = !1;
        if (b)
        {
            for (; b.length; )
            {
                for (var c = b.pop(), f = this.getResult(c), e = this._loadQueue.length - 1; 0 <= e; e--)
                    if (h = this._loadQueue[e].getItem(), h.id == c || h.src == c)
                    {
                        this._loadQueue.splice(e, 1)[0].cancel();
                        break
                    }
                for (e = this._loadQueueBackup.length - 1; 0 <= e; e--)
                    if (h = this._loadQueueBackup[e].getItem(), h.id == c || h.src == c)
                    {
                        this._loadQueueBackup.splice(e, 1)[0].cancel();
                        break
                    }
                if (f)
                    delete this._loadItemsById[f.id],
                    delete this._loadItemsBySrc[f.src],
                    this._disposeItem(f);
                else
                    for (var e = this._currentLoads.length - 1; 0 <= e; e--)
                    {
                        var h = this._currentLoads[e].getItem();
                        if (h.id == c || h.src == c)
                        {
                            this._currentLoads.splice(e, 1)[0].cancel();
                            a = !0;
                            break
                        }
                    }
            }
            a && this._loadNext()
        }
        else
        {
            this.close();
            for (c in this._loadItemsById)
                this._disposeItem(this._loadItemsById[c]);
            this.init(this.useXHR)
        }
    };
    a.reset = function()
    {
        this.close();
        for (var a in this._loadItemsById)
            this._disposeItem(this._loadItemsById[a]);
        a = [];
        i = 0;
        for (l = this._loadQueueBackup.length; i < l; i++)
            a.push(this._loadQueueBackup[i].getItem());
        this.loadManifest(a, !1)
    };
    c.isBinary = function(a)
    {
        switch (a)
        {
            case createjs.LoadQueue.IMAGE:
            case createjs.LoadQueue.BINARY:
                return !0;
            default:
                return !1
        }
    };
    a.installPlugin = function(a)
    {
        if (!(null == a || null == a.getPreloadHandlers))
        {
            a = a.getPreloadHandlers();
            if (null != a.types)
                for (var b = 0, c = a.types.length; b < c; b++)
                    this._typeCallbacks[a.types[b]] = a.callback;
            if (null != a.extensions)
            {
                b = 0;
                for (c = a.extensions.length; b < c; b++)
                    this._extensionCallbacks[a.extensions[b]] = a.callback
            }
        }
    };
    a.setMaxConnections = function(a)
    {
        this._maxConnections = a;
        !this._paused && 0 < this._loadQueue.length && this._loadNext()
    };
    a.loadFile = function(a, b, c)
    {
        null == a ? this._sendError({text: "PRELOAD_NO_FILE"}) : (this._addItem(a, c), !1 !== b ? this.setPaused(!1) : this.setPaused(!0))
    };
    a.loadManifest = function(a, b, c)
    {
        var f = null;
        if (a instanceof Array)
        {
            if (0 == a.length)
            {
                this._sendError({text: "PRELOAD_MANIFEST_EMPTY"});
                return
            }
            f = a
        }
        else
        {
            if (null == a)
            {
                this._sendError({text: "PRELOAD_MANIFEST_NULL"});
                return
            }
            f = [a]
        }
        a = 0;
        for (var e = f.length; a < e; a++)
            this._addItem(f[a], c);
        !1 !== b ? this.setPaused(!1) : this.setPaused(!0)
    };
    a.load = function()
    {
        this.setPaused(!1)
    };
    a.getItem = function(a)
    {
        return this._loadItemsById[a] || this._loadItemsBySrc[a]
    };
    a.getResult = function(a, b)
    {
        var c = this._loadItemsById[a] || this._loadItemsBySrc[a];
        if (null == c)
            return null;
        c = c.id;
        return b && this._loadedRawResults[c] ? this._loadedRawResults[c] : this._loadedResults[c]
    };
    a.setPaused = function(a)
    {
        (this._paused = a) || this._loadNext()
    };
    a.close = function()
    {
        for (; this._currentLoads.length; )
            this._currentLoads.pop().cancel();
        this._scriptOrder.length = 0;
        this._loadedScripts.length = 0;
        this.loadStartWasDispatched = !1
    };
    a._addItem = function(a, b)
    {
        var c = this._createLoadItem(a);
        if (null != c)
        {
            var f = this._createLoader(c, b);
            null != f && (this._loadQueue.push(f), this._loadQueueBackup.push(f), this._numItems++, this._updateProgress(), this.maintainScriptOrder && (c.type == createjs.LoadQueue.JAVASCRIPT && f instanceof createjs.XHRLoader) && (this._scriptOrder.push(c), this._loadedScripts.push(null)))
        }
    };
    a._createLoadItem = function(a)
    {
        var b = null;
        switch (typeof a)
        {
            case"string":
                b = {src: a};
                break;
            case"object":
                b = window.HTMLAudioElement && a instanceof HTMLAudioElement ? {
                    tag: a, src: b.tag.src, type: createjs.LoadQueue.SOUND
                } : a
        }
        a = this._parseURI(b.src);
        null != a && (b.ext = a[5]);
        null == b.type && (b.type = this._getTypeByExtension(b.ext));
        b.type == createjs.LoadQueue.JSON && null != b.callback && (b.type = createjs.LoadQueue.JSONP);
        if (b.type == createjs.LoadQueue.JSONP && null == b.callback)
            throw Error("callback is required for loading JSONP requests.");
        null == b.tag && (b.tag = this._createTag(b.type));
        if (null == b.id || "" == b.id)
            b.id = b.src;
        if (a = this._typeCallbacks[b.type] || this._extensionCallbacks[b.ext])
        {
            a = a(b.src, b.type, b.id, b.data);
            if (!1 === a)
                return null;
            !0 !== a && (null != a.src && (b.src = a.src), null != a.id && (b.id = a.id), null != a.tag && a.tag.load instanceof Function && (b.tag = a.tag), null != a.completeHandler && (b.completeHandler = a.completeHandler));
            a.type && (b.type = a.type);
            a = this._parseURI(b.src);
            null != a && null != a[5] && (b.ext = a[5].toLowerCase())
        }
        this._loadItemsById[b.id] = b;
        return this._loadItemsBySrc[b.src] = b
    };
    a._createLoader = function(a, b)
    {
        var c = this.useXHR;
        switch (a.type)
        {
            case createjs.LoadQueue.JSON:
            case createjs.LoadQueue.XML:
            case createjs.LoadQueue.TEXT:
                c = !0;
                break;
            case createjs.LoadQueue.SOUND:
            case createjs.LoadQueue.JSONP:
                c = !1
        }
        null == b && (b = this._basePath);
        return c ? new createjs.XHRLoader(a, b) : new createjs.TagLoader(a, b)
    };
    a._loadNext = function()
    {
        if (!this._paused)
        {
            this._loadStartWasDispatched || (this._sendLoadStart(), this._loadStartWasDispatched = !0);
            this._numItems == this._numItemsLoaded && (this.loaded = !0, this._sendComplete(), this.next && this.next.load && this.next.load());
            for (var a = 0, b = this._loadQueue.length; a < b && !(this._currentLoads.length >= this._maxConnections); a++)
            {
                var c = this._loadQueue[a];
                if (this.maintainScriptOrder && c instanceof createjs.TagLoader && c.getItem().type == createjs.LoadQueue.JAVASCRIPT)
                {
                    if (this._currentlyLoadingScript)
                        continue;
                    this._currentlyLoadingScript = !0
                }
                this._loadQueue.splice(a, 1);
                a--;
                b--;
                this._loadItem(c)
            }
        }
    };
    a._loadItem = function(a)
    {
        a.addEventListener("progress", createjs.proxy(this._handleProgress, this));
        a.addEventListener("complete", createjs.proxy(this._handleFileComplete, this));
        a.addEventListener("error", createjs.proxy(this._handleFileError, this));
        this._currentLoads.push(a);
        this._sendFileStart(a.getItem());
        a.load()
    };
    a._handleFileError = function(a)
    {
        var b = a.target;
        this._numItemsLoaded++;
        this._updateProgress();
        a = {item: b.getItem()};
        this._sendError(a);
        this.stopOnError || (this._removeLoadItem(b), this._loadNext())
    };
    a._handleFileComplete = function(a)
    {
        a = a.target;
        var b = a.getItem();
        this._loadedResults[b.id] = a.getResult();
        a instanceof createjs.XHRLoader && (this._loadedRawResults[b.id] = a.getResult(!0));
        this._removeLoadItem(a);
        if (this.maintainScriptOrder && b.type == createjs.LoadQueue.JAVASCRIPT)
            if (a instanceof createjs.TagLoader)
                this._currentlyLoadingScript = !1;
            else
            {
                this._loadedScripts[this._scriptOrder.indexOf(b)] = b;
                this._checkScriptLoadOrder(a);
                return
            }
        this._processFinishedLoad(b, a)
    };
    a._processFinishedLoad = function(a, b)
    {
        this._numItemsLoaded++;
        this._updateProgress();
        this._sendFileComplete(a, b);
        this._loadNext()
    };
    a._checkScriptLoadOrder = function()
    {
        for (var a = this._loadedScripts.length, b = 0; b < a; b++)
        {
            var c = this._loadedScripts[b];
            if (null === c)
                break;
            !0 !== c && (this._processFinishedLoad(c), this._loadedScripts[b] = !0, b--, a--)
        }
    };
    a._removeLoadItem = function(a)
    {
        for (var b = this._currentLoads.length, c = 0; c < b; c++)
            if (this._currentLoads[c] == a)
            {
                this._currentLoads.splice(c, 1);
                break
            }
    };
    a._handleProgress = function(a)
    {
        a = a.target;
        this._sendFileProgress(a.getItem(), a.progress);
        this._updateProgress()
    };
    a._updateProgress = function()
    {
        var a = this._numItemsLoaded / this._numItems,
            b = this._numItems - this._numItemsLoaded;
        if (0 < b)
        {
            for (var c = 0, f = 0, e = this._currentLoads.length; f < e; f++)
                c += this._currentLoads[f].progress;
            a += c / b * (b / this._numItems)
        }
        this._sendProgress(a)
    };
    a._disposeItem = function(a)
    {
        delete this._loadedResults[a.id];
        delete this._loadedRawResults[a.id];
        delete this._loadItemsById[a.id];
        delete this._loadItemsBySrc[a.src]
    };
    a._createTag = function(a)
    {
        var b = null;
        switch (a)
        {
            case createjs.LoadQueue.IMAGE:
                return document.createElement("img");
            case createjs.LoadQueue.SOUND:
                return b = document.createElement("audio"), b.autoplay = !1, b;
            case createjs.LoadQueue.JSONP:
            case createjs.LoadQueue.JAVASCRIPT:
                return b = document.createElement("script"), b.type = "text/javascript", b;
            case createjs.LoadQueue.CSS:
                return b = this.useXHR ? document.createElement("style") : document.createElement("link"), b.rel = "stylesheet", b.type = "text/css", b;
            case createjs.LoadQueue.SVG:
                return this.useXHR ? b = document.createElement("svg") : (b = document.createElement("object"), b.type = "image/svg+xml"), b
        }
        return null
    };
    a._getTypeByExtension = function(a)
    {
        switch (a.toLowerCase())
        {
            case"jpeg":
            case"jpg":
            case"gif":
            case"png":
            case"webp":
            case"bmp":
                return createjs.LoadQueue.IMAGE;
            case"ogg":
            case"mp3":
            case"wav":
                return createjs.LoadQueue.SOUND;
            case"json":
                return createjs.LoadQueue.JSON;
            case"xml":
                return createjs.LoadQueue.XML;
            case"css":
                return createjs.LoadQueue.CSS;
            case"js":
                return createjs.LoadQueue.JAVASCRIPT;
            case"svg":
                return createjs.LoadQueue.SVG;
            default:
                return createjs.LoadQueue.TEXT
        }
    };
    a._sendFileProgress = function(a, b)
    {
        if (this._isCanceled())
            this._cleanUp();
        else
        {
            var c = {
                    target: this, type: "fileprogress", progress: b, loaded: b, total: 1, item: a
                };
            this.onFileProgress && this.onFileProgress(c);
            this.dispatchEvent(c)
        }
    };
    a._sendFileComplete = function(a, b)
    {
        if (!this._isCanceled())
        {
            var c = {
                    target: this, type: "fileload", loader: b, item: a, result: this._loadedResults[a.id], rawResult: this._loadedRawResults[a.id]
                };
            a.completeHandler && a.completeHandler(c);
            this.onFileLoad && this.onFileLoad(c);
            this.dispatchEvent(c)
        }
    };
    a._sendFileStart = function(a)
    {
        this.dispatchEvent({
            target: this, type: "filestart", item: a
        })
    };
    a.toString = function()
    {
        return "[PreloadJS LoadQueue]"
    };
    c.proxy = function(a, b)
    {
        return function()
            {
                return a.apply(b, arguments)
            }
    };
    createjs.LoadQueue = c;
    createjs.proxy || (createjs.proxy = function(a, b)
    {
        var c = Array.prototype.slice.call(arguments, 2);
        return function()
            {
                return a.apply(b, Array.prototype.slice.call(arguments, 0).concat(c))
            }
    });
    var b = function(){};
    b.init = function()
    {
        var a = navigator.userAgent;
        b.isFirefox = -1 < a.indexOf("Firefox");
        b.isOpera = null != window.opera;
        b.isChrome = -1 < a.indexOf("Chrome");
        b.isIOS = -1 < a.indexOf("iPod") || -1 < a.indexOf("iPhone") || -1 < a.indexOf("iPad")
    };
    b.init();
    createjs.LoadQueue.BrowserDetect = b;
    Array.prototype.indexOf || (Array.prototype.indexOf = function(a)
    {
        if (null == this)
            throw new TypeError;
        var b = Object(this),
            c = b.length >>> 0;
        if (0 === c)
            return -1;
        var f = 0;
        1 < arguments.length && (f = Number(arguments[1]), f != f ? f = 0 : 0 != f && (Infinity != f && -Infinity != f) && (f = (0 < f || -1) * Math.floor(Math.abs(f))));
        if (f >= c)
            return -1;
        for (f = 0 <= f ? f : Math.max(c - Math.abs(f), 0); f < c; f++)
            if (f in b && b[f] === a)
                return f;
        return -1
    })
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(a, c)
        {
            this.init(a, c)
        },
        a = c.prototype = new createjs.AbstractLoader;
    a._loadTimeout = null;
    a._tagCompleteProxy = null;
    a._isAudio = !1;
    a._tag = null;
    a._jsonResult = null;
    a.init = function(a, c)
    {
        this._item = a;
        this._basePath = c;
        this._tag = a.tag;
        this._isAudio = window.HTMLAudioElement && a.tag instanceof HTMLAudioElement;
        this._tagCompleteProxy = createjs.proxy(this._handleLoad, this)
    };
    a.getResult = function()
    {
        return this._item.type == createjs.LoadQueue.JSONP ? this._jsonResult : this._tag
    };
    a.cancel = function()
    {
        this.canceled = !0;
        this._clean();
        this.getItem()
    };
    a.load = function()
    {
        var a = this._item,
            c = this._tag;
        clearTimeout(this._loadTimeout);
        this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), createjs.LoadQueue.LOAD_TIMEOUT);
        this._isAudio && (c.src = null, c.preload = "auto");
        c.onerror = createjs.proxy(this._handleError, this);
        this._isAudio ? (c.onstalled = createjs.proxy(this._handleStalled, this), c.addEventListener("canplaythrough", this._tagCompleteProxy, !1)) : (c.onload = createjs.proxy(this._handleLoad, this), c.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this));
        var d = this.buildPath(a.src, this._basePath, a.values);
        switch (a.type)
        {
            case createjs.LoadQueue.CSS:
                c.href = d;
                break;
            case createjs.LoadQueue.SVG:
                c.data = d;
                break;
            default:
                c.src = d
        }
        if (a.type == createjs.LoadQueue.JSONP)
        {
            if (null == a.callback)
                throw Error("callback is required for loading JSONP requests.");
            if (null != window[a.callback])
                throw Error('JSONP callback "' + a.callback + '" already exists on window. You need to specify a different callback. Or re-name the current one.');
            window[a.callback] = createjs.proxy(this._handleJSONPLoad, this)
        }
        if (a.type == createjs.LoadQueue.SVG || a.type == createjs.LoadQueue.JSONP || a.type == createjs.LoadQueue.JSON || a.type == createjs.LoadQueue.JAVASCRIPT || a.type == createjs.LoadQueue.CSS)
            this._startTagVisibility = c.style.visibility,
            c.style.visibility = "hidden",
            (document.body || document.getElementsByTagName("body")[0]).appendChild(c);
        null != c.load && c.load()
    };
    a._handleJSONPLoad = function(a)
    {
        this._jsonResult = a
    };
    a._handleTimeout = function()
    {
        this._clean();
        this._sendError({reason: "PRELOAD_TIMEOUT"})
    };
    a._handleStalled = function(){};
    a._handleError = function()
    {
        this._clean();
        this._sendError()
    };
    a._handleReadyStateChange = function()
    {
        clearTimeout(this._loadTimeout);
        var a = this.getItem().tag;
        ("loaded" == a.readyState || "complete" == a.readyState) && this._handleLoad()
    };
    a._handleLoad = function()
    {
        if (!this._isCanceled())
        {
            var a = this.getItem(),
                c = a.tag;
            if (!(this.loaded || this.isAudio && 4 !== c.readyState))
            {
                this.loaded = !0;
                switch (a.type)
                {
                    case createjs.LoadQueue.SVG:
                    case createjs.LoadQueue.JSONP:
                        c.style.visibility = this._startTagVisibility,
                        (document.body || document.getElementsByTagName("body")[0]).removeChild(c)
                }
                this._clean();
                this._sendComplete()
            }
        }
    };
    a._clean = function()
    {
        clearTimeout(this._loadTimeout);
        var a = this.getItem().tag;
        a.onload = null;
        a.removeEventListener && a.removeEventListener("canplaythrough", this._tagCompleteProxy, !1);
        a.onstalled = null;
        a.onprogress = null;
        a.onerror = null;
        a.parentNode && a.parentNode.removeChild(a);
        a = this.getItem();
        a.type == createjs.LoadQueue.JSONP && (window[a.callback] = null)
    };
    a.toString = function()
    {
        return "[PreloadJS TagLoader]"
    };
    createjs.TagLoader = c
})();
this.createjs = this.createjs || {};
(function()
{
    var c = function(a, c)
        {
            this.init(a, c)
        },
        a = c.prototype = new createjs.AbstractLoader;
    a._request = null;
    a._loadTimeout = null;
    a._xhrLevel = 1;
    a._response = null;
    a._rawResponse = null;
    a.init = function(a, c)
    {
        this._item = a;
        this._basePath = c;
        this._createXHR(a)
    };
    a.getResult = function(a)
    {
        return a && this._rawResponse ? this._rawResponse : this._response
    };
    a.cancel = function()
    {
        this.canceled = !0;
        this._clean();
        this._request.abort()
    };
    a.load = function()
    {
        if (null == this._request)
            this._handleError();
        else
        {
            this._request.onloadstart = createjs.proxy(this._handleLoadStart, this);
            this._request.onprogress = createjs.proxy(this._handleProgress, this);
            this._request.onabort = createjs.proxy(this._handleAbort, this);
            this._request.onerror = createjs.proxy(this._handleError, this);
            this._request.ontimeout = createjs.proxy(this._handleTimeout, this);
            1 == this._xhrLevel && (this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), createjs.LoadQueue.LOAD_TIMEOUT));
            this._request.onload = createjs.proxy(this._handleLoad, this);
            this._request.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
            try
            {
                !this._item.values || this._item.method == createjs.LoadQueue.GET ? this._request.send() : this._item.method == createjs.LoadQueue.POST && this._request.send(this._formatQueryString(this._item.values))
            }
            catch(a)
            {
                this._sendError({source: a})
            }
        }
    };
    a.getAllResponseHeaders = function()
    {
        return this._request.getAllResponseHeaders instanceof Function ? this._request.getAllResponseHeaders() : null
    };
    a.getResponseHeader = function(a)
    {
        return this._request.getResponseHeader instanceof Function ? this._request.getResponseHeader(a) : null
    };
    a._handleProgress = function(a)
    {
        0 < a.loaded && 0 == a.total || this._sendProgress({
            loaded: a.loaded, total: a.total
        })
    };
    a._handleLoadStart = function()
    {
        clearTimeout(this._loadTimeout);
        this._sendLoadStart()
    };
    a._handleAbort = function()
    {
        this._clean();
        this._sendError()
    };
    a._handleError = function()
    {
        this._clean();
        this._sendError()
    };
    a._handleReadyStateChange = function()
    {
        4 == this._request.readyState && this._handleLoad()
    };
    a._handleLoad = function()
    {
        this.loaded || (this.loaded = !0, this._checkError() ? (this._response = this._getResponse(), this._clean(), this._generateTag() && this._sendComplete()) : this._handleError())
    };
    a._handleTimeout = function()
    {
        this._clean();
        this._sendError({reason: "PRELOAD_TIMEOUT"})
    };
    a._checkError = function()
    {
        switch (parseInt(this._request.status))
        {
            case 404:
            case 0:
                return !1
        }
        return !0
    };
    a._getResponse = function()
    {
        if (null != this._response)
            return this._response;
        if (null != this._request.response)
            return this._request.response;
        try
        {
            if (null != this._request.responseText)
                return this._request.responseText
        }
        catch(a) {}
        try
        {
            if (null != this._request.responseXML)
                return this._request.responseXML
        }
        catch(c) {}
        return null
    };
    a._createXHR = function(a)
    {
        var c = document.createElement("a");
        c.href = this.buildPath(a.src, this._basePath);
        var d = document.createElement("a");
        d.href = location.href;
        c = "" != c.hostname && (c.port != d.port || c.protocol != d.protocol || c.hostname != d.hostname);
        d = null;
        if (c && window.XDomainRequest)
            d = new XDomainRequest;
        else if (window.XMLHttpRequest)
            d = new XMLHttpRequest;
        else
            try
            {
                d = new ActiveXObject("Msxml2.XMLHTTP.6.0")
            }
            catch(j)
            {
                try
                {
                    d = new ActiveXObject("Msxml2.XMLHTTP.3.0")
                }
                catch(f)
                {
                    try
                    {
                        d = new ActiveXObject("Msxml2.XMLHTTP")
                    }
                    catch(e)
                    {
                        return !1
                    }
                }
            }
        a.type == createjs.LoadQueue.TEXT && d.overrideMimeType && d.overrideMimeType("text/plain; charset=x-user-defined");
        this._xhrLevel = "string" === typeof d.responseType ? 2 : 1;
        var h = null,
            h = a.method == createjs.LoadQueue.GET ? this.buildPath(a.src, this._basePath, a.values) : this.buildPath(a.src, this._basePath);
        d.open(a.method || createjs.LoadQueue.GET, h, !0);
        c && (d instanceof XMLHttpRequest && 1 == this._xhrLevel) && d.setRequestHeader("Origin", location.origin);
        a.values && a.method == createjs.LoadQueue.POST && d.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        createjs.LoadQueue.isBinary(a.type) && (d.responseType = "arraybuffer");
        this._request = d;
        return !0
    };
    a._clean = function()
    {
        clearTimeout(this._loadTimeout);
        var a = this._request;
        a.onloadstart = null;
        a.onprogress = null;
        a.onabort = null;
        a.onerror = null;
        a.onload = null;
        a.ontimeout = null;
        a.onloadend = null;
        a.onreadystatechange = null
    };
    a._generateTag = function()
    {
        var a = this._item.tag;
        switch (this._item.type)
        {
            case createjs.LoadQueue.IMAGE:
                return a.onload = createjs.proxy(this._handleTagReady, this), a.src = this.buildPath(this._item.src, this._basePath, this._item.values), this._rawResponse = this._response, this._response = a, !1;
            case createjs.LoadQueue.JAVASCRIPT:
                a = document.createElement("script");
                this._rawResponse = a.text = this._response;
                this._response = a;
                break;
            case createjs.LoadQueue.CSS:
                document.getElementsByTagName("head")[0].appendChild(a);
                if (a.styleSheet)
                    a.styleSheet.cssText = this._response;
                else
                {
                    var c = document.createTextNode(this._response);
                    a.appendChild(c)
                }
                this._rawResponse = this._response;
                this._response = a;
                break;
            case createjs.LoadQueue.XML:
                this._response = c = this._parseXML(this._response, "text/xml");
                break;
            case createjs.LoadQueue.SVG:
                c = this._parseXML(this._response, "image/svg+xml");
                this._rawResponse = this._response;
                null != c.documentElement ? (a.appendChild(c.documentElement), this._response = a) : this._response = c;
                break;
            case createjs.LoadQueue.JSON:
                a = {};
                try
                {
                    a = JSON.parse(this._response)
                }
                catch(d)
                {
                    a = d
                }
                this._rawResponse = this._response;
                this._response = a
        }
        return !0
    };
    a._parseXML = function(a, c)
    {
        var d = null;
        window.DOMParser ? d = (new DOMParser).parseFromString(a, c) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = !1, d.loadXML(a));
        return d
    };
    a._handleTagReady = function()
    {
        this._sendComplete()
    };
    a.toString = function()
    {
        return "[PreloadJS XHRLoader]"
    };
    createjs.XHRLoader = c
})();
"object" !== typeof JSON && (JSON = {});
(function()
{
    function c(a)
    {
        return 10 > a ? "0" + a : a
    }
    function a(a)
    {
        d.lastIndex = 0;
        return d.test(a) ? '"' + a.replace(d, function(a)
            {
                var b = e[a];
                return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + a + '"'
    }
    function b(c, d)
    {
        var e,
            g,
            r,
            t,
            v = j,
            q,
            u = d[c];
        u && ("object" === typeof u && "function" === typeof u.toJSON) && (u = u.toJSON(c));
        "function" === typeof h && (u = h.call(d, c, u));
        switch (typeof u)
        {
            case"string":
                return a(u);
            case"number":
                return isFinite(u) ? String(u) : "null";
            case"boolean":
            case"null":
                return String(u);
            case"object":
                if (!u)
                    return "null";
                j += f;
                q = [];
                if ("[object Array]" === Object.prototype.toString.apply(u))
                {
                    t = u.length;
                    for (e = 0; e < t; e += 1)
                        q[e] = b(e, u) || "null";
                    r = 0 === q.length ? "[]" : j ? "[\n" + j + q.join(",\n" + j) + "\n" + v + "]" : "[" + q.join(",") + "]";
                    j = v;
                    return r
                }
                if (h && "object" === typeof h)
                {
                    t = h.length;
                    for (e = 0; e < t; e += 1)
                        "string" === typeof h[e] && (g = h[e], (r = b(g, u)) && q.push(a(g) + (j ? ": " : ":") + r))
                }
                else
                    for (g in u)
                        Object.prototype.hasOwnProperty.call(u, g) && (r = b(g, u)) && q.push(a(g) + (j ? ": " : ":") + r);
                r = 0 === q.length ? "{}" : j ? "{\n" + j + q.join(",\n" + j) + "\n" + v + "}" : "{" + q.join(",") + "}";
                j = v;
                return r
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function()
    {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + c(this.getUTCMonth() + 1) + "-" + c(this.getUTCDate()) + "T" + c(this.getUTCHours()) + ":" + c(this.getUTCMinutes()) + ":" + c(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function()
    {
        return this.valueOf()
    });
    var g = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        d = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        j,
        f,
        e = {
            "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"
        },
        h;
    "function" !== typeof JSON.stringify && (JSON.stringify = function(a, c, d)
    {
        var e;
        f = j = "";
        if ("number" === typeof d)
            for (e = 0; e < d; e += 1)
                f += " ";
        else
            "string" === typeof d && (f = d);
        if ((h = c) && "function" !== typeof c && ("object" !== typeof c || "number" !== typeof c.length))
            throw Error("JSON.stringify");
        return b("", {"": a})
    });
    "function" !== typeof JSON.parse && (JSON.parse = function(a, b)
    {
        function c(a, d)
        {
            var e,
                f,
                g = a[d];
            if (g && "object" === typeof g)
                for (e in g)
                    Object.prototype.hasOwnProperty.call(g, e) && (f = c(g, e), void 0 !== f ? g[e] = f : delete g[e]);
            return b.call(a, d, g)
        }
        var d;
        a = String(a);
        g.lastIndex = 0;
        g.test(a) && (a = a.replace(g, function(a)
        {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            return d = eval("(" + a + ")"), "function" === typeof b ? c({"": d}, "") : d;
        throw new SyntaxError("JSON.parse");
    })
})();
;
var models;
(function(models)
{
    (function(entities)
    {
        (function(BetType)
        {
            BetType[BetType["Up"] = 0] = "Up";
            BetType[BetType["Left"] = 1] = "Left";
            BetType[BetType["Down"] = 2] = "Down";
            BetType[BetType["Right"] = 3] = "Right"
        })(entities.BetType || (entities.BetType = {}));
        var BetType = entities.BetType;
        (function(PlayerId)
        {
            PlayerId[PlayerId["One"] = 0] = "One";
            PlayerId[PlayerId["Two"] = 1] = "Two"
        })(entities.PlayerId || (entities.PlayerId = {}));
        var PlayerId = entities.PlayerId;
        var Player = (function()
            {
                function Player(){}
                Player.prototype.constructor = function(playerId)
                {
                    this.playerId = playerId
                };
                return Player
            })();
        entities.Player = Player;
        var Hat = (function()
            {
                function Hat(){}
                Hat.prototype.constructor = function()
                {
                    this.bets = new Array;
                    this.lastBetIndex = 0
                };
                Hat.prototype.AddBet = function(newBet)
                {
                    this.bets.push(newBet)
                };
                Hat.prototype.Shuffle = function()
                {
                    var tempBets = this.bets;
                    var totalSlots = tempBets.length;
                    this.bets = new Array;
                    while (totalSlots > 0)
                    {
                        var item = Math.random() * totalSlots;
                        this.bets.push(tempBets.splice(item, 1)[0]);
                        --totalSlots
                    }
                };
                Hat.prototype.GetNextBet = function()
                {
                    var ret = this.bets[this.lastBetIndex];
                    ++this.lastBetIndex;
                    return ret
                };
                Hat.prototype.IsDone = function()
                {
                    return this.lastBetIndex >= this.bets.length
                };
                return Hat
            })();
        entities.Hat = Hat;
        var PossibleBets = (function()
            {
                function PossibleBets(){}
                PossibleBets.prototype.constructor = function(betType, available)
                {
                    this.betType = betType;
                    this.available = available;
                    this.selected = 0
                };
                return PossibleBets
            })();
        entities.PossibleBets = PossibleBets;
        var Hand = (function()
            {
                function Hand(){}
                Hand.prototype.constructor = function(){};
                return Hand
            })();
        entities.Hand = Hand
    })(models.entities || (models.entities = {}));
    var entities = models.entities
})(models || (models = {}));
;
var Signal = (function()
    {
        function Signal()
        {
            this._bindings = [];
            this._prevParams = null;
            this.memorize = false;
            this._shouldPropagate = true;
            this.active = true
        }
        Signal.prototype.validateListener = function(listener, fnName)
        {
            if (typeof listener !== 'function')
            {
                throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
            }
        };
        Signal.prototype._registerListener = function(listener, isOnce, listenerContext, priority)
        {
            var prevIndex = this._indexOfListener(listener, listenerContext);
            var binding;
            if (prevIndex !== -1)
            {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce)
                {
                    throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
                }
            }
            else
            {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding)
            }
            if (this.memorize && this._prevParams)
            {
                binding.execute(this._prevParams)
            }
            return binding
        };
        Signal.prototype._addBinding = function(binding)
        {
            var n = this._bindings.length;
            do
                --n;
            while (this._bindings[n] && binding.priority <= this._bindings[n].priority);
            this._bindings.splice(n + 1, 0, binding)
        };
        Signal.prototype._indexOfListener = function(listener, context)
        {
            var n = this._bindings.length;
            var cur;
            while (n--)
            {
                cur = this._bindings[n];
                if (cur.getListener() === listener && cur.context === context)
                {
                    return n
                }
            }
            return -1
        };
        Signal.prototype.has = function(listener, context)
        {
            return this._indexOfListener(listener, context) !== -1
        };
        Signal.prototype.add = function(listener, listenerContext, priority)
        {
            this.validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority)
        };
        Signal.prototype.addOnce = function(listener, listenerContext, priority)
        {
            this.validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority)
        };
        Signal.prototype.remove = function(listener, context)
        {
            this.validateListener(listener, 'remove');
            var i = this._indexOfListener(listener, context);
            if (i !== -1)
            {
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1)
            }
            return listener
        };
        Signal.prototype.removeAll = function()
        {
            var n = this._bindings.length;
            while (n--)
            {
                this._bindings[n]._destroy()
            }
            this._bindings.length = 0
        };
        Signal.prototype.getNumListeners = function()
        {
            return this._bindings.length
        };
        Signal.prototype.halt = function()
        {
            this._shouldPropagate = false
        };
        Signal.prototype.dispatch = function()
        {
            var paramsArr = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++)
            {
                paramsArr[_i] = arguments[_i + 0]
            }
            if (!this.active)
            {
                return
            }
            var n = this._bindings.length;
            var bindings;
            if (this.memorize)
            {
                this._prevParams = paramsArr
            }
            if (!n)
            {
                return
            }
            bindings = this._bindings.slice(0);
            this._shouldPropagate = true;
            do
                n--;
            while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false)
        };
        Signal.prototype.forget = function()
        {
            this._prevParams = null
        };
        Signal.prototype.dispose = function()
        {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams
        };
        Signal.prototype.toString = function()
        {
            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']'
        };
        Signal.VERSION = '1.0.0';
        return Signal
    })();
;
var SignalBinding = (function()
    {
        function SignalBinding(signal, listener, isOnce, listenerContext, priority)
        {
            this.active = true;
            this.params = null;
            this._listener = listener;
            this._isOnce = isOnce;
            this.context = listenerContext;
            this._signal = signal;
            this.priority = priority || 0
        }
        SignalBinding.prototype.execute = function(paramsArr)
        {
            var handlerReturn;
            var params;
            if (this.active && !!this._listener)
            {
                params = this.params ? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce)
                {
                    this.detach()
                }
            }
            return handlerReturn
        };
        SignalBinding.prototype.detach = function()
        {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null
        };
        SignalBinding.prototype.isBound = function()
        {
            return (!!this._signal && !!this._listener)
        };
        SignalBinding.prototype.isOnce = function()
        {
            return this._isOnce
        };
        SignalBinding.prototype.getListener = function()
        {
            return this._listener
        };
        SignalBinding.prototype.getSignal = function()
        {
            return this._signal
        };
        SignalBinding.prototype._destroy = function()
        {
            delete this._signal;
            delete this._listener;
            delete this.context
        };
        SignalBinding.prototype.toString = function()
        {
            return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']'
        };
        return SignalBinding
    })();
;
var models;
(function(models)
{
    (function(simulations)
    {
        var Simulation = (function()
            {
                function Simulation(){}
                Simulation.prototype.update = function(elapsedTime){};
                Simulation.prototype.Add = function(entity)
                {
                    this.entities[entity.id] = entity;
                    this.entityAdded.dispatch(entity)
                };
                Simulation.prototype.Remove = function(entity)
                {
                    if (entity.id in this.entities)
                    {
                        delete this.entities[entity.id]
                    }
                };
                return Simulation
            })();
        simulations.Simulation = Simulation
    })(models.simulations || (models.simulations = {}));
    var simulations = models.simulations
})(models || (models = {}));
;
var views;
(function(views)
{
    (function(simulations)
    {
        var Simulation = (function()
            {
                function Simulation(canvas, datacontext)
                {
                    var _this = this;
                    this.onTick = function(tickEvent)
                    {
                        _this.datacontext.update(tickEvent.delta)
                    };
                    this.datacontext = datacontext;
                    this.stage = new createjs.Stage(canvas)
                }
                Simulation.prototype.activate = function()
                {
                    createjs.Ticker.addEventListener('tick', this.onTick)
                };
                Simulation.prototype.deactivate = function()
                {
                    createjs.Ticker.removeEventListener('tick', this.onTick)
                };
                return Simulation
            })();
        simulations.Simulation = Simulation
    })(views.simulations || (views.simulations = {}));
    var simulations = views.simulations
})(views || (views = {}));
;
var views;
(function(views)
{
    (function(states)
    {
        var Title = (function()
            {
                function Title(){}
                return Title
            })();
        states.Title = Title
    })(views.states || (views.states = {}));
    var states = views.states
})(views || (views = {}))