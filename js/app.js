
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

