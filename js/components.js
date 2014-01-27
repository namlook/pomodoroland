
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


App.BarChartComponent = Ember.Component.extend({
    classNames: ['bar-chart'],
    classNameBindings: ['name'],
    name: 'modalDialog',

    columnNames: [],
    columnData: [],

    didInsertElement: function() {
        var config = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Last 7 days'
            },
            xAxis: {
                categories: this.get('columnNames')
            },
            yAxis: {
                min: 0,
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            // legend: {
            //     align: 'right',
            //     x: -70,
            //     verticalAlign: 'top',
            //     y: 20,
            //     floating: true
            // },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +'<br/>'+
                        'Total: '+ this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: this.get('columnData'),
            // [{
            //     name: 'John',
            //     data: [5, 3, 4, 7, 2, 0, 3]
            // }, {
            //     name: 'Jane',
            //     data: [2, 2, 3, 2, 1, 0, 4]
            // }, {
            //     name: 'Joe',
            //     data: [3, 4, 4, 2, 5, 3, 3]
            // }]
        };

        if (this.get('columnData.length') < 2) {
            config.legend = false;
            config.tooltip = false;
        }
        $('.bar-chart.'+this.get('name')).highcharts(config);
    }.observes('columnNames', 'columnData')
});
