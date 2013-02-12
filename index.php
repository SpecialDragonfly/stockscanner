<html>
    <head>
        <title>
            Stock Scanner
        </title>
        <link rel="stylesheet/less" type='text/css' href='scanner.less' />
        <link rel="stylesheet" type='text/css' href='/bootstrap/css/bootstrap.min.css' />
        <link rel="stylesheet" type='text/css' href='http://code.jquery.com/ui/1.10.0/themes/black-tie/jquery-ui.css' />

        <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js'></script>
        <script type='text/javascript' src='http://code.jquery.com/ui/1.10.0/jquery-ui.min.js'></script>
        <script type='text/javascript' src='/bootstrap/js/bootstrap.min.js'></script>
        <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js'></script>
        <script type='text/javascript'>
            less = {
                env:'development'
            };
        </script>
        <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js'></script>
        <script type='text/javascript' src='ICanHaz.min.js'></script>
        <script type='text/javascript' src='scanner.js'></script>
    </head>
    <body>
        <script type='text/html' id='queryForm'>
            <div class='controls'>
                <label>Start Date</label>
                <input type='text' id='startDate' />
                <label>End Date</label>
                <input type='text' id='endDate' />
                <label>Granularity</label>
                <select id='granularity'>
                    <option value='d'>Daily</option>
                    <option value='m'>Monthly</option>
                    <option value='y'>Yearly</option>
                </select>
                <label>Symbols</label>
                <input type='text' id='symbols' />
                <button id='getQuote'>Get</button>
            </div>
        </script>
        <script type='text/html' id='resultRow'>
            <tr data-symbol='{{symbol}}' data-sharpe='{{sharpe}}' data-drawdown='{{maxdrawdown}}'>
                <td class='start-date'>
                    {{startdate}}
                </td>
                <td class='end-date'>
                    {{enddate}}
                </td>
                <td class='symbol'>
                    {{symbol}}
                </td>
                <td class='sharpe'>
                    {{sharpe}}
                </td>
                <td class='maxdrawdown'>
                    {{maxdrawdown}}
                    <div class='drawdowns'>
                        {{#drawdowns}}
                            <span>{{.}}</span>
                        {{/drawdowns}}
                    </div>
                </td>
                <td class='averagedrawdown'>
                    {{averagedrawdown}}
                </td>
            </tr>
        </script>
    </body>
</html>