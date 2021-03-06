
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
    columnData: [{data: []}],

    didInsertElement: function() {
        this.$container = $('.bar-chart.'+this.get('name'));
        this._chart = new Highcharts.Chart(this.getConfig());
    },

    getConfig: function($container) {
        var config = {
            chart: {
                renderTo: this.$container[0],
                height: 300,
                type: 'column'
            },
            title: {
                text: this.get('title')
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
            credits: {
                enabled: false
            },
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
        };
        if (!this.get('columnData').length) {
            config.series = [{data:[]}];
        } else {
            config.series = this.get('columnData');
        }
        if (this.get('columnData.length') < 2) {
            config.legend = false;
            config.tooltip = false;
        }
        return config;
    },

    updateData: function() {
        var that = this;
        this.get('columnData').forEach(function(data, index) {
            if(!that._chart.series[index]) {
                that._chart = new Highcharts.Chart(that.getConfig());
            } else {
                that._chart.series[index].setData(data.data, false);
                that._chart.series[index].update({name:data.name}, false);
                that._chart.redraw();
            }
        });
    }.observes('columnData')
});


App.GaugeChartComponent = Ember.Component.extend({
    classNames: ['gauge-component'],
    classNameBindings: ['name'],

    didInsertElement: function() {
        var $container = $('.gauge-component.'+this.get('name'));
        var config = {
            chart: {
                renderTo: $container[0],
                height: 300,
                type: 'gauge'
            },

            title: false,

            pane: {
                startAngle: -150,
                endAngle: 150
            },

            // the value axis
            yAxis: {
                min: 0,
                max: 20,

                // minorTickInterval: 'auto',
                // minorTickWidth: 1,
                // minorTickLength: 10,
                // minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                // tickWidth: 2,
                // tickPosition: 'inside',
                // tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: 'pomodoros'
                },
                plotBands: [{
                    from: 8,
                    to: 12,
                    color: '#55BF3B' // green
                }, {
                    from: 0,
                    to: 8,
                    color: '#DDDF0D' // yellow
                }, {
                    from: 12,
                    to: 20,
                    color: '#DF5353' // red
                }]
            },

            credits: {
                enabled: false
            },
            tooltip: false,
            series: [{
                name: 'today',
                data: [this.get('value')],
                tooltip: {
                    valueSuffix: ' pomodoros'
                }
            }]
        };
        this._chart = new Highcharts.Chart(config);
    },

    updateValue: function() {
        this._chart.series[0].setData([this.get('value')]);
    }.observes('value')
});



App.PieChartComponent = Ember.Component.extend({
    classNames: ['pie-component'],
    classNameBindings: ['name'],

    didInsertElement: function() {
        var $container = $('.pie-component.'+this.get('name'));
        var config = {
            chart: {
                height: 350,
                renderTo: $container[0],
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: this.get('total')+"<br /> pomodoros",
                align: 'center',
                verticalAlign: 'middle',
                // y: 50
                y: 0
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        }
                    },
                    // startAngle: -90,
                    // endAngle: 90,
                    // center: ['50%', '75%']
                },
                area: {
                    tooltip: true
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'pie',
                name: 'pomodoros',
                innerSize: '50%',
                data: this.get('values')
            }]
        };
        this._chart = new Highcharts.Chart(config);
    },

    updateValues: function() {
        this._chart.series[0].setData(this.get('values'));
    }.observes('values'),

    updateTitle: function() {
        this._chart.setTitle({text: this.get('total')+'<br /> pomodoros'});
    }.observes('total')

});
