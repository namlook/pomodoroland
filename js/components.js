
App.ModalDialogComponent = Ember.Component.extend({
    actions: {
        closeModal: function() {
            return this.sendAction();
        }
    },

    didInsertElement: function(elem) {
        $('#modalDialog').foundation('reveal', 'open');
    },

    willDestroyElement: function() {
        $('#modalDialog').foundation('reveal', 'close');
    }

});