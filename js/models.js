
/*
 *  The application timer
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

