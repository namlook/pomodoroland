
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
        this.set('isStarted', false);
        this.set('remainingSeconds', 0);
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
    }
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
    multiProjects: true,
    parseKey: null,


    save: function() {
        properties = this.getProperties(
            'pomodoroDuration',
            'shortBreakDuration',
            'longBreakDuration',
            'dynamicTitle',
            'multiProjects',
            'parseKey'
        );
        localStorage.setItem('settings', JSON.stringify(properties));
    }
});



/*
 * Pomodoros
 */
App.Pomodoro = DS.ParseModel.extend({

    project: DS.attr('string'),
    userKey: DS.attr('string'),
    date: DS.attr('string', {
      defaultValue: function() { return new Date(); }
    })
});


