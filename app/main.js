var flexterNS = flexterNS || {};

(function (ko, ViewModel) {

    'use strict';

    ko.applyBindings(new ViewModel(), document.getElementById('app'));

}(ko, flexterNS.ViewModel));