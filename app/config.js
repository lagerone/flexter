var flexterNS = flexterNS || {};

flexterNS.config = (function () {

    'use strict';

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

    return config;

}());