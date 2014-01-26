
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



App.ConfirmButtonComponent = Ember.Component.extend({
    tagName: 'button',
    classNameBindings: ['buttonType'],
    buttonType: '',

    inConfirmationMode: false,

    confirmTitle: 'click again to confirm',

    click: function() {
        if (this.get('inConfirmationMode')) {
            this.sendAction('action', this.get('param'));
        }
        else {
            this.set('inConfirmationMode', true);
            this.set('buttonType', 'alert');
        }
    }
});

