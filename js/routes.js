
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
            var date = new Date(item.get('date'));
            return date > today;
        });
    }
});

App.PomodorosWeekStatsRoute = Ember.Route.extend({
    model: function() {
        var firstWeekDay = new Date().getFirstWeekDay();
        return this.modelFor('pomodoros').filter(function(item){
            var date = new Date(item.get('date'));
            return date >= firstWeekDay;
        });
    }
});

App.PomodorosMonthStatsRoute = Ember.Route.extend({
    model: function() {
        var today = new Date();
        var firstMonthDay = new Date(today.getFullYear(), today.getMonth(), 1);
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