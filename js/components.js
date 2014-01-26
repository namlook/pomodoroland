
App.ModalDialogComponent = Ember.Component.extend({
    classNames: ['reveal-modal'],
    attributeBindings: ['dataReveal:data-reveal'],
    dataReveal: true,

    classNameBindings: ['name'],
    name: 'modalDialog',

    actions: {
        closeModal: function() {
            return this.sendAction();
        }
    },

    didInsertElement: function() {
        $('.reveal-modal.'+this.get('name')).foundation('reveal', 'open');
    },

    willDestroyElement: function() {
        $('.reveal-modal.'+this.get('name')).foundation('reveal', 'close');
    }

});