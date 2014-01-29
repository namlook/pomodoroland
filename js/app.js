
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

        // if parseKey is in localStorage, use parse.com to store the data
        var parseKey;
        try {
            parseKey = JSON.parse(localStorage.getItem('settings')).parseKey;
        }
        catch (e) {
            parseKey = null;
        }
        App.storage = App.Storage(parseKey);
    }
});
