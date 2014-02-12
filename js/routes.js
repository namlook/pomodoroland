
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
        return App.storage.find('pomodoro');
    }
});

App.PomodorosTodayStatsRoute = Ember.Route.extend({
    model: function() {
        var today = new Date(new Date().toDateString());
        return this.modelFor('pomodoros').filter(function(item) {
            return new Date(item.get('date')) > today;
        });
    }
});

App.PomodorosWeekStatsRoute = Ember.Route.extend({
    model: function() {
        var today = new Date();
        var dayLastWeek = new Date(today.toDateString());
        dayLastWeek.setTime(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return this.modelFor('pomodoros').filter(function(item){
            var date = new Date(item.get('date'));
            return date >= dayLastWeek;
        });
    }
});

App.PomodorosMonthStatsRoute = Ember.Route.extend({
    model: function() {
        var today = new Date();
        var theMonth = today.getMonth() - 1;
        if (theMonth < 0) {
            theMonth = 0;
        }
        var firstMonthDay = new Date(today.getFullYear(), theMonth, 1);
        return this.modelFor('pomodoros').filter(function(item){
            var date = new Date(item.get('date'));
            return date >= firstMonthDay;
        });
    }
});

App.SettingsRoute = Ember.Route.extend({
    model: function() {
        return App.settings;
    }
});