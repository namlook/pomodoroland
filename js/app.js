
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
        if (!JSON.parse(localStorage.getItem('settings')).parseKey) {
            App.ApplicationAdapter = DS.LSAdapter;
        } else {
            App.ApplicationAdapter = DS.ParseAdapter.extend({
                applicationId: '8fzGpo1z0od9jzGRL73tjSycywhXjJ3QdrnRodBI',
                restApiId: 'x1GySv7rY8P1eszs2C2ghMcSnmZOVLXmS2Ievjge',
                javascriptId: '35DWYmsUPhScAniTuOGoyWKdUtGhCKu1roeE2Up0'
            });
        }
    }
});


App.LSAdapter = DS.LSAdapter.extend({
    namespace: 'emberodoro'
});
