
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

        var parseKey;
        if (App.settings.get('selectedStorage') === 'cloud') {
            parseKey = App.settings.get('parseKey');
        }
        App.storage = App.Storage(parseKey);
    }
});
