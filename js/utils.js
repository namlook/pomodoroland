
App.notify = function(title, options) {
    var _notify = function() {
        new Notification(title, options);
    };
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (Notification) {
        var permission = Notification.permission;
        if (permission === "granted") {
            _notify();
        }
        else if (permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if(!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                if (permission === "granted") {
                    _notify();
                }
            });
        }
    }
};

App.bell = (function() {
    // setup the bell
    var audio = new Audio();
    audio.src = 'audio/bong.wav';
    audio.type = 'audio/wave';

    return {
        play: function() {
            audio.play();
        }
    };
})();


Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

