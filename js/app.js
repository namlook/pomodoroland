
App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    /*
     * Init the application
     *
     * This initialization loads the bell and configure the `timer.onFinished()` hook
     */
    ready: function() {

        // setup the bell
        var audio = new Audio();
        audio.src = 'audio/bong.wav';
        audio.type = 'audio/wave';

        if (!App.timer) {
            App.timer = new App.Timer();
        }

        if (!App.stats) {
            App.stats = new App.Stats();
        }

        if (!App.settings) {
            App.settings = new App.Settings();
        }

        App.timer.onFinished = function(name) {
            if (name === 'pomodoro') {
                App.stats.add();
                App.notify('Pomodoro finished !', {body: 'time for a break'});
            }
            else {
                App.notify("Break's over", {body: 'get back to work !'});
            }
            audio.play();
        };
    }
});

