
App = Ember.Application.create({

    /*
     * Init the application
     *
     * This initialization loads the bell, fetch the timer and the stats from
     * the localStorage and configure the `timer.onFinished()` hook
     */
    ready: function() {
        var audio, timer, stats;

        // setup the bell
        audio = new Audio();
        audio.src = 'audio/bong.wav';
        audio.type = 'audio/wave';


        // setup the timer and fetch the localStorage to see if there
        // is no pomodoro already running
        var storedTimer = JSON.parse(localStorage.getItem('timer'));
        if (storedTimer) {
            var delta = (Date.now() - storedTimer.startedAt) / 1000;
            if (storedTimer.duration - delta > 0) {
                var newDuration = parseInt(storedTimer.duration - delta, 10);
                App.timer.start({duration: newDuration, name: storedTimer.name});
            }
        }

        App.timer.onFinished = function(name) {
            if (name === 'pomodoro') {
                App.stats.add();
                App.notify('Pomodoro finished !', {body: 'time for a break'});
            }
            else {
                App.notify("Break's over", {body: 'get back to work !'});
            }
            audio.play();
        };

        // setup the pomodors
        var nbPomodoros = parseInt(localStorage.getItem('stats'), 10);
        if (nbPomodoros > 0) {
            App.stats.total = nbPomodoros;
        }
    }
});


/*
 *  A timer model
 */

App.timer = Ember.Object.create({
    duration: 0,
    remainingSeconds: 0,
    isStarted: false,
    name: null,


    /*
     * Stop the timer and reset all values
     */
    stop: function(){
        clearInterval(this._interval);
        this._interval = null;
        this.set('duration', 0);
        this.set('remainingSeconds', 0);
        this.set('isStarted', false);
        this.set('name', null);
    },

    /*
     * Start a timer with the corresponding duration.
     *
     * When the timer is finished, the `onFinished` method is triggered
     *
     * options:
     *      - duration: the number of seconds the timer will last
     *      - name: the name of the timer (ie 'pomodoro', 'shortBreak')
     */
    start: function(options){
        options = options || {};
        this.set('duration', options.duration);
        this.set('remainingSeconds', options.duration);
        this.set('name', options.name);
        this.set('isStarted', true);

        // store the timer into the localStorage so we can check if
        // it is already running when reloading the page
        localStorage.setItem('timer', JSON.stringify({
            startedAt: Date.now(),
            duration: options.duration,
            name: options.name
        }));

        clearInterval(this._interval);
        var that = this;
        this._interval = setInterval(function() {
            var remainingSeconds = that.get('remainingSeconds');
            if (remainingSeconds > 0) {
                that.decrementProperty('remainingSeconds');
            }
            else {
                that.onFinished(that.get('name'));
                that.stop();
            }
        }, 1000);
    },


    /*
     * Hook to apply some logic when the timer is over.
     * The name of the timer is passed.
     */
    onFinished: function(name){}
});

/*
 * Statistics model
 *
 * Stores the total of pomodoros since the last reset
 *
 */
App.stats = Ember.Object.create({
    total: 0,

    /*
     * Clear the number of pomodoros and update localStorage
     */
    clear: function() {
        this.set('total', 0);
        localStorage.removeItem('stats');
    },


    /*
     * Increment the number of pomodoros and update localStorage
     */
    add: function() {
        this.incrementProperty('total');
        localStorage.setItem('stats', this.get('total'));
    }
});

App.Router.map(function() {
    this.resource('index', {path: '/'}, function() {
        this.route('today');
    });
});

App.IndexRoute = Ember.Route.extend({

    redirect: function(){
        this.transitionTo('index.today');
    },

    model: function() {
        return App.timer;
    },

    actions: {
        reset: function() {
            App.stats.clear();
        }
    }
});

App.IndexTodayRoute = Ember.Route.extend({
    model: function() {
        return App.stats;
    }
});

App.IndexController = Ember.Controller.extend({
    /*
     * Pretty display the remaining seconds
     */
    duration: function() {
        var duration, minutes, seconds;
        duration = this.get('model').get('remainingSeconds');
        minutes = parseInt(duration/60, 10);
        minutes = _.str.pad(minutes, 2, '0');
        seconds = _.str.pad(duration % 60, 2, '0');
        return [minutes, seconds].join(':');
    }.property('model.remainingSeconds'),


    /*
     * Allow the title to display the duration in real time
     */
    dynamicTitle: true,
    updateTitle: function() {
        var title = 'Emberodoro';
        if (this.get('dynamicTitle')) {
            title = this.get('duration');
        }
        $('title').text(title);
    }.observes('model.remainingSeconds', 'dynamicTitle'),


    /*
     * Is the timer started ?
     */
    isStarted: Ember.computed.alias('model.isStarted'),
    isStopped: Ember.computed.not('model.isStarted'),

    /*
     * Some actions when we clicked on buttons
     */
    actions: {
        start: function() {
            this.get('model').start({duration: 3, name: 'pomodoro'});
        },
        shortBreak: function() {
            this.get('model').start({duration: 5 * 60, name: 'shortBreak'});
        },
        longBreak: function() {
            this.get('model').start({duration: 15 * 60, name: 'longBreak'});
        },
        stop: function() {
            this.get('model').stop();
        }
    }
});


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




