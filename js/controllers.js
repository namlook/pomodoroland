
/*
 * Settings Controller
 */
App.SettingsController = Ember.Controller.extend({
    storageLayers: ['localStorage', 'cloud'],

    useCloud: Ember.computed.equal('model.selectedStorage', 'cloud'),
    parseKey: Ember.computed.alias('model.parseKey'),

    resetStorageLayer: function(){
        var parseKey = null;
        if (this.get('useCloud')) {
            parseKey = this.get('parseKey');
        }
        App.storage.setUserKey(parseKey);
    }.observes('useCloud', 'parseKey')
});


/*
 * Application controller.
 *
 * This is basically the timer and all the stuff around it
 */

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

        var today = new Date();

        var columnNames = [];
        var date = new Date();
        for (var i=6; i>-1; i--) {
            date.setTime(today.getTime() - i * 24 * 60 * 60 * 1000);
            if (columnNames.indexOf(date.toDateString()) === -1) {
                columnNames.push(date.toDateString());
            }
        }

        var projectsCount = {};
        this.get('model').forEach(function(obj){
            var objDate = new Date(obj.get('date'));
            var project = obj.get('project');
            if (project === null) {
                project = 'undefined';
            }
            var index = columnNames.indexOf(objDate.toDateString());
            if (index > -1) {
                if (!projectsCount[project]) {
                    projectsCount[project] = [];
                }
                if (projectsCount[project][index] === undefined) {
                    projectsCount[project][index] = 0;
                }
                projectsCount[project][index]++;
            }
        });

        columnData = [];
        _.pairs(projectsCount).forEach(function(projectPair) {
            var numbers = projectPair[1];
            for (var i=0; i<numbers.length; i++) {
                if (numbers[i] === undefined) {
                    numbers[i] = 0;
                }
            }
            columnData.push({name: projectPair[0], data: numbers});
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

        var today = new Date();
        var thisWeek = today.getWeek();
        var thisYear = today.getFullYear();

        var columnNames = [];
        for (var i=3; i>-1; i--) {
            if (thisWeek - i >= 0) {
                var key = thisYear+'-'+(thisWeek-i);
                if (columnNames.indexOf(key) === -1) {
                    columnNames.push(key);
                }
            }
        }

        var projectsCount = {};
        this.get('model').forEach(function(obj){
            var objDate = new Date(obj.get('date'));
            var project = obj.get('project');
            if (project === null) {
                project = 'undefined';
            }
            var index = columnNames.indexOf(objDate.getFullYear()+'-'+objDate.getWeek());
            if (index > -1) {
                if (!projectsCount[project]) {
                    projectsCount[project] = [];
                }
                if (projectsCount[project][index] === undefined) {
                    projectsCount[project][index] = 0;
                }
                projectsCount[project][index]++;
            }
        });

        columnData = [];
        _.pairs(projectsCount).forEach(function(projectPair) {
            var numbers = projectPair[1];
            for (var i=0; i<numbers.length; i++) {
                if (numbers[i] === undefined) {
                    numbers[i] = 0;
                }
            }
            columnData.push({name: projectPair[0], data: numbers});
        });

        return {'columnNames': columnNames, 'columnData': columnData};

    }.property('@each.project'),

    columnNames: Ember.computed.alias('data.columnNames'),
    columnData: Ember.computed.alias('data.columnData')

});
