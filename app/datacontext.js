var flexterNS = flexterNS || {};

flexterNS.datacontext = (function (_, LocalStore) {

    'use strict';

    var dc = {},
        store = new LocalStore();

    dc.getDay = function (key) {
        var lsData = store.get();
        return (lsData) ? lsData[key] : undefined;
    };

    dc.saveDay = function (key, jsData) {
        store.save(key, jsData);
        dc.setTotalBalance();
    };

    dc.totalBalance = ko.observable();

    dc.setTotalBalance = function () {
        var balance = getTotalBalance();
        dc.totalBalance(balance);
    };

    dc.getBalanceText = function (isNegative, hours, minutes) {
        var prefix = isNegative ? '-' : '';
        return prefix + hours + ':' + forceTwoDigits(minutes) + ' hrs';
    };

    dc.setTotalBalance();
    
    return dc;

    function forceTwoDigits (int) {
        var len = (int + '').length;
        if (len === 1) {
            return '0' + int;
        }
        return int;
    }

    function getTotalBalance () {
        var lsData = store.get();
        if (!lsData) {
            return 'unknown';
        }
        var minutes = 0;
        _.each(lsData, function (day) {
            minutes += day.balance.minutes;
        });
        return getBalanceTextFromMinutes(minutes);
    }

    function setTotalBalance () {
        dc.totalBalance(getTotalBalance());
    }

    function getBalanceTextFromMinutes(minutes) {
        var isNegative = minutes < 0;
        var mins = (minutes % 60);
        var hours = (minutes - mins) / 60;
        return dc.getBalanceText(isNegative, Math.abs(hours), Math.abs(mins));
    }

}(_, flexterNS.LocalStore));