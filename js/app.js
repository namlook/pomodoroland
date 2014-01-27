
App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    /*
     * Init the application
     *
     * Create the timer and the settings
     */
    ready: function() {
        if (!App.timer) {
            App.timer = new App.Timer();
        }

        if (!App.settings) {
            App.settings = new App.Settings();
        }
    }
});


App.LSAdapter = DS.LSAdapter.extend({
    namespace: 'emberodoro'
});

App.ApplicationAdapter = DS.LSAdapter;
// App.ApplicationAdapter = DS.FixtureAdapter;