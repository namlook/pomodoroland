
App.Router.map(function() {
    this.resource('index', {path: '/'}, function() {
        this.route('today');
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
        }
    }
});

App.IndexTodayRoute = Ember.Route.extend({
    model: function() {
        return App.stats;
    }
});
