<?php
    $response = array();

    if (isset($_GET['method'])) {
        $method = $_GET['method'];
        if ($method == 'retrieve') {
            if (isset($_GET['url'])) {
                $url = base64_decode($_GET['url']);
                $results = file_get_contents($url);
                $results = explode("\n", trim($results));
                $dates = array();
                $adjustedClose = array();
                $dailyPercentageReturns = array();
                $lastReturn = 0;
                for ($i = count($results) - 1; $i > 0; $i--) {
                    $row = explode(",", $results[$i]);
                    $dates[] = $row[0];
                    $adjustedClose[] = $row[6];
                    if ($lastReturn !== null && $lastReturn !== 0) {
                        $percent = (($row[6] - $lastReturn) / $lastReturn);
                        $dailyPercentageReturns[] = $percent * 100;
                    }
                    $lastReturn = $row[6];
                }
                $response['dates'] = $dates;
                $response['adjustedClose'] = $adjustedClose;
                $response['dailyPercentageReturns'] = $dailyPercentageReturns;
            }
        }
    }

    die(json_encode($response));
?>