
App.SettingsController = Ember.Controller.extend({
    storageLayers: ['localStorage', 'cloud'],

    useCloud: Ember.computed.equal('model.selectedStorage', 'cloud'),

    resetStorageLayer: function(){
        Ember.run.next(function() {
            App.reset();
        });
    }.observes('useCloud')
});


App.ApplicationController = Ember.Controller.extend({
    needs: ['pomodoros'],

    pomodoros: Ember.computed.alias('controllers.pomodoros'),

    savePomodoro: function(projectName) {
        projectName = projectName || 'undefined';
        var pomodoro = {
            date: Date.now(),
            project: projectName
        };
        this.set('savedPomodoro', pomodoro);
        App.storage.insert('pomodoro', pomodoro);
        this.set('savedPomodoro', null);
    },

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
        var title = 'Pomodoroland';
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
                if (App.settings.get('multiProjects')) {
                    this.set('showProjectModal', true);
                } else {
                    this.savePomodoro();
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
            this.savePomodoro(this.get('projectName'));
        }
    }
});


/*
 * This mixin updates the pomodoros model each time a new pomodoro is finished
 */
App.PomodorosMixinController = Ember.Mixin.create({
    needs: ['application'],

    onPomodoroSaved: function() {
        var pomodoro = this.get('controllers.application.savedPomodoro');
        if (pomodoro) {
            this.get('model').pushObject(App.Pomodoro.create(pomodoro));
        }
    }.observes('controllers.application.savedPomodoro'),

});

/*
 * This controller doesn't display much but deals with the model
 */
App.PomodorosController = Ember.ArrayController.extend(App.PomodorosMixinController, {});


/*
 * Statistics of the day
 */
App.PomodorosTodayStatsController = Ember.ArrayController.extend(App.PomodorosMixinController, {

    total: Ember.computed.alias('model.length'),

    projects: Ember.computed(function(){
        return this.get('model').getEach('project').uniq();
    }).property('@each.project'),

    nbProjects: Ember.computed.alias('projects.length'),
    hasMultiProjects: Ember.computed.gt('nbProjects', 1),

    /*
     * If there is multi project during the day, display the data as a pie chart
     */
    pieData: function() {
        var data = {};
        this.get('model').getEach('project').forEach(function(project) {
            if (project === '' || project === null) {
                project = 'undefined';
            }
            if (!data[project]) {
                data[project] = 0;
            }
            data[project] += 1;
        });
        return _.pairs(data);
    }.property('@each.project')

});


/*
 * Statistics of the week
 */
App.PomodorosWeekStatsController = Ember.ArrayController.extend(App.PomodorosMixinController, {

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

        var today = new Date();
        var thisWeek = today.getWeek();

        this.get('model').forEach(function(obj){
            var objDate = new Date(obj.get('date'));
            var project = obj.get('project');
            if (project === null) {
                project = 'undefined';
            }
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
        var yesterday = new Date(today.toDateString());
        yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
        var yesterdayString = formatDate(yesterday);

        _.pairs(dataCount).forEach(function(projectPair) {
            var project = projectPair[0];
            var projectData = {name: project, data: []};
            _.pairs(projectPair[1]).forEach(function(datePair){
                var date = datePair[0];
                var count = datePair[1];
                if (date === todayString) {
                    date = 'today';
                } else if (date === yesterdayString) {
                    date = 'yesterday';
                }
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


/*
 * Statistics of the month
 */
App.PomodorosMonthStatsController = Ember.ArrayController.extend(App.PomodorosMixinController, {

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
            if (project === null) {
                project = 'undefined';
            }
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
