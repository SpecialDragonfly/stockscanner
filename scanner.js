$.widget("ui.stockscanner", {
    _create:function() {
        _.bindAll(this);
        this.element.append(ich.queryForm());

        this.startDate = this.element.find("#startDate");
        this.endDate = this.element.find("#endDate");
        this.quoteButton = this.element.find("#getQuote");
        this.granularity = this.element.find("#granularity");
        this.quoteButton.on('click', $.proxy(this._getQuotes, this));
        this.symbolsList = this.element.find("#symbols");

        var today = new Date();
        this.startDate.datepicker();
        this.endDate.datepicker();
        this.startDate.datepicker('setDate', "01/01/" + (today.getYear() + 1898));
        this.endDate.datepicker('setDate', today);

        this.riskFreeRate = 0.01;
    },
    _getQuotes: function() {
        var symbols = this.symbolsList.val().split(",");
        var self = this;
        for (var i = 0; i < symbols.length; i++) {
            self._getQuote(symbols[i].trim());
        }
    },
    _average: function(range) {
        return range.reduceRight(function(a, b) {
            return a + b;
        }, 0) / range.length;
    },
    _standardDev: function(range, average) {
        var xMinuxXBarSquared = range.reduceRight(function(a, b) {
            return a + Math.pow((b - average), 2);
        }, 0);
        return Math.sqrt(xMinuxXBarSquared/range.length);
    },
    _sharpe: function(range) {
	var k = Math.sqrt(range.length);
	var dailyReturns = $.map(range, function(element, index){
		return index == 0 ? 1 : (element/range[index-1])-1;
	});
    var average = this._average(dailyReturns);
	return k * (average / this._standardDev(dailyReturns, average));
    },
    _drawdowns: function(range) {
        var drawdowns = [];
        var maximumDrawDown = null;
        var peak = null;
        for (var i in range) {
            if (range[i] !== null) {
                if (range[i] > peak) {
                    peak = range[i];
                } else {
                    drawdowns.push(100 * (peak - range[i]) / peak);
                }
            }
        }

        return drawdowns;
    },
    _max: function(range) {
        return range.reduceRight(function(a, b){ return a > b ? a : b});
    },
    _getQuote: function(symbol) {
        var url = window.btoa(this._createUrl(symbol));
        var self = this;
        $.ajax({
            'type':'GET',
            'url':'/scanner_api.php?method=retrieve&url=' + url,
            'dataType':'json',
            'success':function(data) {
                var dates = data.dates;
                var prices = data.adjustedClose;
                var dailyPercentageReturns = data.dailyPercentageReturns;
                var excessReturn = [];
                for (var i = 0; i < dailyPercentageReturns.length; i++) {
                    excessReturn.push(dailyPercentageReturns[i] - self.riskFreeRate);
                }

                var drawdowns = self._drawdowns(prices);

                result = {
		    'startdate':dates[1],
		    'enddate':dates[dates.length - 1],
                    'symbol':symbol,
                    'sharpe':self._sharpe(excessReturn),
                    'drawdowns':drawdowns,
                    'maxdrawdown':self._max(drawdowns),
		    'averagedrawdown':self._average(drawdowns)
                };

                if (self.resultsTable === undefined) {
                    var resultsTable = $("<table>").addClass('results');
                    resultsTable.append(
                        $("<tr>").append(
			    $("<th>").addClass('start-date').html("Start")
			).append(
			    $("<th>").addClass('end-date').html("End")
			).append(
                            $("<th>").addClass('symbol').html("Symbol")
                        ).append(
                            $("<th>").addClass('sharpe').html("Sharpe")
                        ).append(
                            $("<th>").addClass('maxdrawdown').html("Maximum Draw Down")
                        ).append(
			    $("<th>").addClass('averagedrawdown').html("Average Draw Down")
			)
                    )
                    self.element.append(resultsTable);
                    self.resultsTable = self.element.find(".results");
                }
                self.resultsTable.append(ich.resultRow(result));
            }
        });

        return false;
    },
    _createUrl: function(symbol) {
        var first = new Date(this.startDate.datepicker('getDate'));
        var last = new Date(this.endDate.datepicker('getDate'));
        var start = 'http://ichart.finance.yahoo.com/table.csv?';
        start += 's=' + symbol + '&';
        start += 'b=' + first.getDate() + '&';
        start += 'e=' + last.getDate() + '&';
        start += 'a=' + first.getMonth() + '&';
        start += 'd=' + last.getMonth() + '&';
        start += 'c=' + (first.getYear() + 1900) + '&';
        start += 'f=' + (last.getYear() + 1900) + '&';
        start += 'g=' + this.granularity.val();
        start += '&ignore=.csv';

        return start;
    }
});
$(document).on('ready', function() {
    $(document).find("body").stockscanner();
});

//http://ichart.finance.yahoo.com/table.csv?
//s=BARC.L
//&d=1 - month end base 0
//&e=8 - day end
//&f=2013 - end year
//&g=d - granularity {d:daily, w:weekly, m:monthly, v:divonly}
//&a=6 - month start base 0
//&b=1 - day start
//&c=1988 - start year
//&ignore=.csv

//http://ichart.finance.yahoo.com/table.csv?
//s=BARC.L
//&a=06
//&b=1
//&c=1988
//&d=01
//&e=9
//&f=2013
//&g=d
//&ignore=.csv