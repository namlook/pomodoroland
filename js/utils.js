
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
