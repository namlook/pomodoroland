
App.Router.map(function() {
    this.resource('index', {path: '/'}, function() {
        this.route('today');
        this.route('settings');
    });
});

App.IndexRoute = Ember.Route.extend({

    redirect: function(){
        this.transitionTo('index.today');
    },

    model: function() {
        return App.timer;
    },

    actions: {
        reset: function() {
            App.stats.clear();
        },
        closeModal: function() {
            this.transitionTo('index.today');
        }
    }
});

App.IndexTodayRoute = Ember.Route.extend({
    model: function() {
        return App.stats;
    }
});

App.IndexSettingsRoute = Ember.Route.extend({
    model: function() {
        return App.settings;
    }
});