
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


Date.prototype.getFirstWeekDay = function(){
    var now = new Date();
    var startDay = 1; // monday
    return new Date(now.valueOf() - (
        now.getDay()<=0 ? 7-startDay:now.getDay()-startDay)*86400000);
};



App.Storage = function(userkey) {
    $.parse.init({
        app_id : "8fzGpo1z0od9jzGRL73tjSycywhXjJ3QdrnRodBI",
        rest_key : "x1GySv7rY8P1eszs2C2ghMcSnmZOVLXmS2Ievjge"
    });

    var store = Ember.A([]);

    var getLocalStorage = function() {
        var store;
        try {
            store = JSON.parse(localStorage.getItem('Pomodoroland')).store;
        }
        catch (e){
            store = [];
        }
        return store;
    };

    var saveToLocalStorage = function(data) {
        localStorage.setItem('Pomodoroland', JSON.stringify({store:data}));
    };

    return {
        insert: function(type, item) {
            if (userkey) {
                item.userKey = App.settings.get('parseKey');
                $.parse.post(type, item);
            } else {
                var data = getLocalStorage();
                data.pushObject(item);
                saveToLocalStorage(data);
            }
        },
        find: function(type) {
            var results = Ember.A([]);
            var promise;
            if (userkey) {
                var userKey = App.settings.get('parseKey');
                promise = new Ember.RSVP.Promise(function(resolve) {
                    $.parse.get(type, {where: {userKey: userKey}, order: "createdAt"}, function(data){
                        data.results.forEach(function(item){
                            var obj = App[type.capitalize()].create(item);
                            results.pushObject(obj);
                        });
                        resolve(results);
                    });
                });
            } else {
                promise = new Ember.RSVP.Promise(function(resolve) {
                    Ember.run.later(function() {
                        var data = getLocalStorage();
                        data.forEach(function(item){
                            results.push(App.Pomodoro.create(item));
                        });
                        resolve(results);
                    });
                });
            }
            return promise;
        }
    };
};

