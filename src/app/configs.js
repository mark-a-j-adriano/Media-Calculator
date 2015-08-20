angular.module('app').config(["modelFormatConfig",
        function(modelFormatConfig) {
            modelFormatConfig["number"] = {
                "formatter": function(args) {
                    var modelValue = args.$modelValue,
                        filter = args.$filter;
                    return filter("number")(modelValue);
                },
                "parser": function(args) {
                    var val = parseInt(args.$viewValue.replace(/[^0-9\-]/g, ''), 10);
                    return isNaN(val) ? undefined : val;
                },
                "isEmpty": function(value) {
                    return !value.$modelValue;
                },
                "keyDown": function(args) {
                    var event = args.$event;

                    if (!(gobal.keyHelper.smallKeyBoard(event) || gobal.keyHelper.numberKeyBpoard(event) || gobal.keyHelper.functionKeyBoard(event) || minus(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }

            }
        }
    ]
);

angular.module('app').config(
    function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions(
            {
                colours: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
                responsive: true
            }
        );
        // Configure all doughnut charts
        ChartJsProvider.setOptions('Doughnut', 
            {
                animateScale: true
            }
        );
    }
);