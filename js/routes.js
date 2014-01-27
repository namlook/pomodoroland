
App.Router.map(function() {
    this.route('today-stats', {path: '/'});
    this.route('week-stats', {path: '/week'});
    this.route('settings', {path: '/settings'});
});

App.ApplicationRoute = Ember.Route.extend({

    model: function() {
        return App.timer;
    },


    actions: {
        reset: function() {
            App.stats.clear();
        },
        closeModal: function() {
            this.transitionTo('today-stats');
        }
    }
});

App.IndexRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo('today-stats');
    },
});

App.TodayStatsRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('pomodoro');
    }
});

App.WeekStatsRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('pomodoro');
    }
});

App.TodayOldRoute = Ember.Route.extend({
    model: function() {
        return App.stats;
    }
});

App.SettingsRoute = Ember.Route.extend({
    model: function() {
        return App.settings;
    }
});