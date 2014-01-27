
/*
 *  The application timer
 */

App.Timer = Ember.Object.extend({

    init: function() {
        var storedTimer = JSON.parse(localStorage.getItem('timer'));
        if (storedTimer) {
            var delta = (Date.now() - storedTimer.startedAt) / 1000;
            if (storedTimer.duration - delta > 0) {
                var newDuration = parseInt(storedTimer.duration - delta, 10);
                this.start({duration: newDuration, name: storedTimer.name});
            }
        }
    },

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
        this.delete();
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

        this.save();

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

    // store the timer into the localStorage so we can check if
    // it is already running when reloading the page
    save: function() {
        localStorage.setItem('timer', JSON.stringify({
            startedAt: Date.now(),
            duration: this.get('duration'),
            name: this.get('name')
        }));
    },

    delete: function() {
        localStorage.removeItem('timer');
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
App.Stats = Ember.Object.extend({

    init: function() {
        // setup the pomodors
        var nbPomodoros = parseInt(localStorage.getItem('stats'), 10);
        if (nbPomodoros > 0) {
            this.set('total', nbPomodoros);
        }
    },

    total: 0,

    /*
     * Clear the number of pomodoros and update localStorage
     */
    clear: function() {
        this.set('total', 0);
    },

    /*
     * Increment the number of pomodoros and update localStorage
     */
    add: function() {
        this.incrementProperty('total');
    },

    save: function() {
        localStorage.setItem('stats', this.get('total'));
    }.observes('total'),
});


/*
 * User settings
 */
App.Settings = Ember.Object.extend({
    init: function() {
        var settings = JSON.parse(localStorage.getItem('settings'));
        if (settings) {
            this.setProperties(settings);
        }
    },

    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    dynamicTitle: true,


    save: function() {
        properties = this.getProperties(
            'pomodoroDuration',
            'shortBreakDuration',
            'longBreakDuration',
            'dynamicTitle'
        );
        localStorage.setItem('settings', JSON.stringify(properties));
    }
});

