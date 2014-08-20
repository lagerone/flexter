var flexterNS = flexterNS || {};

flexterNS.Day = (function (_, ko, config, HighResolutionTimer, datacontext) {

    'use strict';

    var Day = function (data) {
        data = data || {};
        data.breakTime = data.breakTime || {};
        var m = moment(data.timestamp);
        this.timestamp = data.timestamp;
        this.date = m.format(config.formats.shortDate);
        this.formattedDate = m.format(config.formats.longDate);
        this.dayOfWeek = m.format(config.formats.dayOfWeek);
        this.currentTime = ko.observable();
        this.start = ko.observable(data.start);
        this.end = ko.observable(data.end);
        this.breakTime = {
            start: ko.observable(data.breakTime.start),
            end: ko.observable(data.breakTime.end)
        };
        this.balance = {};
        this.balance.minutes = 0;
        this.balance.text = ko.computed(this._getBalanceForDay, this);

        this.breakEvenText = ko.computed(this._getBreakEvenText, this);

        var timer = new HighResolutionTimer({ callback: this._timerCb.bind(this) }).run();

        this.startOrEndDayText = ko.computed(this._getStartOrEndDayText, this);
        this.canEndDay = ko.computed(this._calcCanEndDay, this);
        this.startOrEndBreakText = ko.computed(this._getStartOrEndBreakText, this);
        this.canHaveBreak = ko.computed(this._calcCanHaveBreak, this);

        return this;
    };

    Day.prototype = _.extend(Day.prototype, {
        _timerCb: function (response) {
            this.currentTime(moment(response.current_time).format(config.formats.currentTime));
        },
        _getBreakMinutes: function () {
            if (!this.breakTime.start() || !this.breakTime.end()) {
                return 0;
            }
            return moment(this.breakTime.end(), config.formats.shortTime).diff(moment(this.breakTime.start(), config.formats.shortTime), 'minutes');
        },
        _getBreakEvenText: function () {
            if (!this.start() || this.end()) {
                return '';
            }
            var breakEvenTime = moment(this.start(), config.formats.shortTime).add((480 + this._getBreakMinutes()), 'minutes').format('HH:mm');
            return moment(this.start(), config.formats.shortTime).add((480 + this._getBreakMinutes()), 'minutes').format('HH:mm');
        },
        _getStartOrEndDayText: function () {
            return (!this.start()) ? 'Start the day' : 'End the day';
        },
        _calcCanEndDay: function () {
            if (this.breakTime.start() && !this.breakTime.end()) {
                return false;
            }
            if (this.start() && this.end()) {
                return false;
            }
            return true;
        },
        _getStartOrEndBreakText: function () {
            return (!this.breakTime.start()) ? 'Start the break' : 'End the break';
        },
        _getShortTime: function (currTime) {
            return moment(currTime, config.formats.currentTime).format(config.formats.shortTime);
        },
        _calcCanHaveBreak: function () {
            if (this.breakTime.start() && this.breakTime.end()) {
                return false;
            }
            return this.start() && !this.end();
        },
        _getBalanceForDay: function () {
            if (!this.start() || !this.end()) {
                this.balance.minutes = 0;
                return 'unknown';
            }
            var worked_minutes = moment(this.end(), config.formats.shortTime).diff(moment(this.start(), config.formats.shortTime), 'minutes') - this._getBreakMinutes();
            this.balance.minutes = worked_minutes - 480;
            var minutes = this.balance.minutes % 60;
            var hours = (this.balance.minutes - minutes) / 60;
            return datacontext.getBalanceText((this.balance.minutes < 0), Math.abs(hours), Math.abs(minutes));
        },
        startOrEndDay: function () {
            var time = this._getShortTime(this.currentTime());
            if (this.start()) {
                this.end(time);
            } else {
                this.start(time);
            }
            datacontext.saveDay(this.date, ko.toJS(this));
            return this;
        },
        startOrEndBreak: function () {
            var time = this._getShortTime(this.currentTime());
            if (this.breakTime.start()) {
                this.breakTime.end(time);
            } else {
                this.breakTime.start(time);
            }
            return this;
        },
        save: function () {
            datacontext.saveDay(this.date, ko.toJS(this));
            return this;
        }
    });

    return Day;

}(_, ko, flexterNS.config, flexterNS.HighResolutionTimer, flexterNS.datacontext));