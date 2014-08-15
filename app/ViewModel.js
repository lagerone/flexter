var flexterNS = flexterNS || {};

flexterNS.ViewModel = (function (_, ko, config, datacontext, Day) {

    'use strict';

    var ViewModel = function () {
        this.day = ko.observable();
        this.totalBalance = datacontext.totalBalance;
        this.getToday();
        return this;
    };

    ViewModel.prototype = _.extend(ViewModel.prototype, {
        _setDay: function (m) {
            var key = m.format(config.formats.shortDate);
            var data = datacontext.getDay(key) || { timestamp: m.unix() * 1000 };
            this.day(new Day(data));
        },
        getToday: function () {
            this._setDay(moment());
        },
        getPrevDay: function () {
            this._setDay(moment(this.day().date, config.formats.shortDate).subtract(1, 'days'));
        },
        getNextDay: function () {
            this._setDay(moment(this.day().date).add(1, 'days'));
        }
    });

    return ViewModel;

}(_, ko, flexterNS.config, flexterNS.datacontext, flexterNS.Day));