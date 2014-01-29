
App.Router.map(function() {
    this.resource('pomodoros', {path: '/'}, function() {
        this.route('today-stats', {path: '/'});
        this.route('week-stats', {path: '/week'});
        this.route('month-stats', {path: '/month'});
    });
    this.route('settings', {path: '/settings'});
});

App.ApplicationRoute = Ember.Route.extend({
    model: function() {
        return App.timer;
    }
});

App.IndexRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo('pomodoros.today-stats');
    },
});

App.PomodorosRoute = Ember.Route.extend({
    model: function() {
        // var models = [];
        // var data = JSON.parse(localStorage.getItem('Emberodoro')).store;
        // data.forEach(function(item){
        //     models.push(App.Pomodoro.create(item));
        // });
        // return models;
        return App.storage.find('pomodoro');
    }
});

App.PomodorosTodayStatsRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('pomodoros');
            // var now = new Date();
            // var today = new Date(now.toDateString());
            // var r = App.store.find('pomodoro', {date: {$gt: today.getTime()}});
            // console.log(r);
    }
});

App.PomodorosWeekStatsRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('pomodoros');
        // return this.modelFor('pomodoros');
        // var firstWeekDay = new Date().getFirstWeekDay();
        // return App.store.find('pomodoro', {date: {$gt: firstWeekDay.getTime()}});
    }
});

App.PomodorosMonthStatsRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('pomodoros');
        return [];
            var today = new Date();
            var firstMonthDay = new Date(today.getFullYear(), today.getMonth(), 1);
            return App.store.find('pomodoro', {date: {$gt: firstMonthDay.getTime()}});

    }
});

App.SettingsRoute = Ember.Route.extend({
    model: function() {
        return App.settings;
    }
});