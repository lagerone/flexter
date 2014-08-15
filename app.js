(function () {

    var config = {
        formats: {
            currentTime: 'HH:mm:ss',
            shortTime: 'HH:mm',
            shortDate: 'YYYY-MM-DD',
            dayOfWeek: 'ddd',
            longDate: 'MMM DD, YYYY'
        },
        localStorageName: 'Flexter'
    };

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
        this.balance = {
            day: ko.computed(this._getBalanceForDay, this),
            week: ko.computed(this._getBalanceForWeek, this),
            total: ko.computed(this._getBalanceTotal, this)
        };

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
                return 'unknown';
            }
            var break_mins = moment(this.breakTime.end(), config.formats.shortTime).diff(moment(this.breakTime.start(), config.formats.shortTime), 'minutes');
            var mins = moment(this.end(), config.formats.shortTime).diff(moment(this.start(), config.formats.shortTime), 'minutes') - break_mins;
            var minutes = mins % 60;
            var hours = (mins > minutes) ? ((mins - minutes) / 60) : 0;
            return (hours - 8) + ' hrs ' + minutes + ' min';
        },
        _getBalanceForWeek: function () {
            return 'unknown';
        },
        _getBalanceTotal: function () {
            return 'unknown';
        },
        _store: new LocalStore(),
        startOrEndDay: function () {
            var time = this._getShortTime(this.currentTime());
            if (this.start()) {
                this.end(time)
            } else {
                this.start(time);
            }
            this._store.save(this.date, ko.toJS(this));
            return this;
        },
        startOrEndBreak: function () {
            var time = this._getShortTime(this.currentTime());
            if (this.breakTime.start()) {
                this.breakTime.end(time)
            } else {
                this.breakTime.start(time);
            }
            return this;
        },
        save: function () {
            this._store.save(this.date, ko.toJS(this));
            return this;
        }
    });

    var ViewModel = function () {
        this.day = ko.observable();
        this.getToday();
        return this;
    };

    ViewModel.prototype = _.extend(ViewModel.prototype, {
        _store: new LocalStore(),
        _getDayData: function (key) {
            var lsData = this._store.get();
            return (lsData) ? lsData[key] : null;
        },
        _setDay: function (m) {
            var key = m.format(config.formats.shortDate);
            var data = this._getDayData(key) || { timestamp: m.unix() * 1000 };
            this.day(new Day(data));
        },
        getToday: function () {
            this._setDay(moment());
        },
        getPrevDay: function () {
            this._setDay(moment(this.day().date, config.formats.shortDate).subtract('days', 1));
        },
        getNextDay: function () {
            this._setDay(moment(this.day().date).add('days', 1));
        }
    });

    ko.applyBindings(new ViewModel(), document.getElementById('app'));

}());