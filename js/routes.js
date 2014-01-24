
App.Router.map(function() {
    this.route('today', {path: '/today'});
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
            this.transitionTo('today');
        }
    }
});

App.IndexRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo('today');
    },
});

App.TodayRoute = Ember.Route.extend({
    model: function() {
        return App.stats;
    }
});

App.SettingsRoute = Ember.Route.extend({
    model: function() {
        return App.settings;
    }
});