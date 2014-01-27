
App.SettingsController = Ember.Controller.extend({
    actions: {
        save: function() {
            this.get('model').save();
            App.reset();
        }
    }
});


App.ApplicationController = Ember.Controller.extend({
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
    updateTitle: function() {
        var title = 'Emberodoro';
        if (App.settings.get('dynamicTitle')) {
            title = this.get('duration');
        }
        $('title').text(title);
    }.observes('model.remainingSeconds', 'App.settings.dynamicTitle'),


    /*
     * Listen to the timer an trigger this function when the timer is over
     */
    onTimerFinished: function() {
        var model = this.get('model');
        if(model.get('isStarted') && model.get('remainingSeconds') === 0) {
            if (model.get('name') === 'pomodoro') {
                var pomodoro = this.store.createRecord('pomodoro', {
                    userKey: App.settings.get('parseKey')
                });
                pomodoro.save();
                App.notify('Pomodoro finished !', {body: 'time for a break'});
            }
            else {
                App.notify("Break's over", {body: 'get back to work !'});
            }
            App.bell.play();
        }
    }.observes('model.remainingSeconds'),


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
            this.get('model').start({
                duration: App.settings.get('pomodoroDuration') * 60,
                name: 'pomodoro'
            });
        },
        shortBreak: function() {
            this.get('model').start({
                duration: App.settings.get('shortBreakDuration') * 60,
                name: 'shortBreak'
            });
        },
        longBreak: function() {
            this.get('model').start({
                duration: App.settings.get('longBreakDuration') * 60,
                name: 'longBreak'
            });
        },
        stop: function() {
            this.get('model').stop();
        }
    }
});


App.TodayStatsController = Ember.ArrayController.extend({

    total: function() {
        return this.get('model.length');
    }.property('@each')

});

App.WeekStatsController = Ember.ArrayController.extend({

    data: function() {
        formatDate = function(date){
            return date.toDateString().split(' ').splice(0, 3).join(' ');
        };

        var columnNames = [],
            columnData = [],
            dataCount = {};

        for (var i=6; i>-1; i--) {
            var date = new Date();
            date.setTime(date.getTime() - i * 24 * 60 * 60 * 1000);
            dataCount[formatDate(date)] = 0;
        }

        this.get('model').forEach(function(obj){
            var date = new Date(obj.get('date'));
            dataCount[formatDate(date)] += 1;
        });

        var today = formatDate(new Date());
        var yesterday = new Date();
        yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
        yesterday = formatDate(yesterday);

        _.pairs(dataCount).forEach(function(pair) {
            if (pair[0] === today){
                columnNames.push('today');
            } else if (pair[0] === yesterday) {
                columnNames.push('yesterday');
            } else {
                columnNames.push(pair[0]);
            }
            columnData.push(pair[1]);
        });
        columnData = [{data: columnData}];

        return {'columnNames': columnNames, 'columnData': columnData};

    }.property('@each'),

    columnNames: Ember.computed.alias('data.columnNames'),
    columnData: Ember.computed.alias('data.columnData')

});
