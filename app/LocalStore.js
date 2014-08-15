var flexterNS = flexterNS || {};

flexterNS.LocalStore = (function (_, config) {

    'use strict';
    
    var LocalStore = function () { };

    LocalStore.prototype = _.extend(LocalStore.prototype, {
        get: function () {
            var lsData = localStorage.getItem(config.localStorageName);
            return JSON.parse(lsData);
        },
        save: function (key, jsData) {
            var lsData = this.get() || {};
            lsData[key] = jsData;
            localStorage.setItem(config.localStorageName, JSON.stringify(lsData));
        }
    });

    return LocalStore;

}(_, flexterNS.config));