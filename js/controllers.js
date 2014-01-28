
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
                this._pomodoro = this.store.createRecord('pomodoro', {
                    userKey: App.settings.get('parseKey')
                });
                if (App.settings.get('multiProjects')) {
                    this.set('showProjectModal', true);
                } else {
                    this._pomodoro.set('project', null);
                    this._pomodoro.save();
                }
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
        },
        closeModal: function() {
            this.set('showProjectModal', false);
            this._pomodoro.set('project', this.get('projectName'));
            this._pomodoro.save();
        }
    }
});


App.TodayStatsController = Ember.ArrayController.extend({

    total: function() {
        return this.get('model.length');
    }.property('@each')

});

App.WeekStatsController = Ember.ArrayController.extend({

    total: function() {
        return this.get('model.length');
    }.property('@each'),

    data: function() {
        formatDate = function(date){
            return date.toDateString().split(' ').splice(0, 3).join(' ');
        };

        var columnNames = [],
            columnData = [],
            dataCount = {};

        var thisWeek = new Date().getWeek();

        this.get('model').forEach(function(obj){
            var objDate = new Date(obj.get('date'));
            var project = obj.get('project');
            if (objDate.getWeek() === thisWeek) {
                if (!dataCount[project]) {
                    dataCount[project] = {};
                }
                if (!dataCount[project][formatDate(objDate)]) {
                    dataCount[project][formatDate(objDate)] = 0;
                }
                dataCount[project][formatDate(objDate)] += 1;
            }
        });

        var todayString = formatDate(new Date());
        var yesterday = new Date();
        yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
        var yesterdayString = formatDate(yesterday);

        _.pairs(dataCount).forEach(function(projectPair) {
            var project = projectPair[0];
            var projectData = {name: project, data: []};
            _.pairs(projectPair[1]).forEach(function(datePair){
                var date = datePair[0];
                var count = datePair[1];
                columnNames.push(date);
                projectData.data.push(count);
            });
            columnData.push(projectData);
        });

        return {'columnNames': columnNames, 'columnData': columnData};

    }.property('@each.project'),

    columnNames: Ember.computed.alias('data.columnNames'),
    columnData: Ember.computed.alias('data.columnData')

});

App.MonthStatsController = Ember.ArrayController.extend({

    total: function() {
        return this.get('model.length');
    }.property('@each'),

    data: function() {
        formatWeek = function(date){
            return date.toDateString().split(' ').splice(0, 3).join(' ');
        };

        var columnNames = [],
            columnData = [],
            dataCount = {};

        var today = new Date();
        var thisMonth = today.getMonth();

        this.get('model').forEach(function(obj){
            var objDate = new Date(obj.get('date'));
            var project = obj.get('project');
            if (objDate.getMonth() === thisMonth) {
                if (!dataCount[project]) {
                    dataCount[project] = {};
                }
                var weekTitle = 'week '+objDate.getWeek();
                if (!dataCount[project][weekTitle]) {
                    dataCount[project][weekTitle] = 0;
                }
                dataCount[project][weekTitle] += 1;
            }
        });
        console.log(dataCount);
        _.pairs(dataCount).forEach(function(projectPair) {
            var project = projectPair[0];
            var projectData = {name: project, data: []};
            _.pairs(projectPair[1]).forEach(function(datePair){
                var date = datePair[0];
                var count = datePair[1];
                columnNames.push(date);
                projectData.data.push(count);
            });
            columnData.push(projectData);
        });
        console.log(columnNames, columnData);
        return {'columnNames': columnNames, 'columnData': columnData};

    }.property('@each.project'),

    columnNames: Ember.computed.alias('data.columnNames'),
    columnData: Ember.computed.alias('data.columnData')

});
