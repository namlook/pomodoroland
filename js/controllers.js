
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
    dynamicTitle: Ember.computed.alias('App.settings.dynamicTitle'),
    updateTitle: function() {
        var title = 'Emberodoro';
        if (App.settings.get('dynamicTitle')) {
            title = this.get('duration');
        }
        $('title').text(title);
    }.observes('model.remainingSeconds', 'App.settings.dynamicTitle'),


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
        },
        close: function() {
            console.log('foooo');
        }
    }
});


