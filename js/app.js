
App = Ember.Application.create({

    /*
     * Init the application
     *
     * This initialization loads the bell, fetch the timer and the stats from
     * the localStorage and configure the `timer.onFinished()` hook
     */
    ready: function() {
        var audio, timer, stats;

        // setup the bell
        audio = new Audio();
        audio.src = 'audio/bong.wav';
        audio.type = 'audio/wave';


        // setup the timer and fetch the localStorage to see if there
        // is no pomodoro already running
        var storedTimer = JSON.parse(localStorage.getItem('timer'));
        if (storedTimer) {
            var delta = (Date.now() - storedTimer.startedAt) / 1000;
            if (storedTimer.duration - delta > 0) {
                var newDuration = parseInt(storedTimer.duration - delta, 10);
                App.timer.start({duration: newDuration, name: storedTimer.name});
            }
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

        // setup the pomodors
        var nbPomodoros = parseInt(localStorage.getItem('stats'), 10);
        if (nbPomodoros > 0) {
            App.stats.total = nbPomodoros;
        }
    }
});

