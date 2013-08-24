/// <reference path="libs/typings/requirejs/require.d.ts"/>
require.config({
    paths: {
        'jquery': 'libs/jquery.min',
        'easel': 'libs/createjs-min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        easel: {
            exports: 'createjs'
        }
    }
});
//# sourceMappingURL=main.js.map
