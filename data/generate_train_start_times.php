<?php

$start_time = time();

$baseline = 0;
$offsets = [];

function convert_time($time) {
    $time_parts = explode(":", $time);
    $time_in_minutes = ($time_parts[0] * 60) + $time_parts[1];
    return $time_in_minutes * 60;
}

$routes = ["GOLD_NB", "GOLD_SB", "RED_NB", "RED_SB", "GREEN_EB", "GREEN_WB", "BLUE_EB", "BLUE_WB"];

$route_trips = array();

foreach($routes as $route) {
    $route_trips[$route] = array();
}

$handle = fopen(getcwd() . "/data/gtfs/trips_trains.txt", "r");
if ($handle) {

    // save line to pass on later...
    $count = 0;
    while(($line = fgets($handle)) !== FALSE) {

        $count++;
            
        if ($count == 1) {
            // column headers
            continue;
        }

        $data = str_getcsv($line, ",");

        if ($data[1] != 5) {
            // only include weekdays (service ID = 5)
            continue;
        }

        if (!isset($route_trips[$data[0]])) {
            $route_trips[$data[0]] = array();
        }

        if (!isset($route_trips[$data[0]][$data[4]])) {
            $route_trips[$data[0]][$data[4]] = array();
        }

        if ($data[4] == 0) { // north or east
            switch($data[0]) {
                case 8746: // gold
                    $route_trips["GOLD_NB"][] = $data[2];
                    break;
                case 8747: // red
                    $route_trips["RED_NB"][] = $data[2];
                    break;
                case 8748: // green
                    $route_trips["GREEN_EB"][] = $data[2];
                    break;
                case 8766: // blue
                    $route_trips["BLUE_EB"][] = $data[2];
                    break;
            }
        } else { // south or west
            switch($data[0]) {
                case 8746: // gold
                    $route_trips["GOLD_SB"][] = $data[2];
                    break;
                case 8747: // red
                    $route_trips["RED_SB"][] = $data[2];
                    break;
                case 8748: // green
                    $route_trips["GREEN_WB"][] = $data[2];
                    break;
                case 8766: // blue
                    $route_trips["BLUE_WB"][] = $data[2];
                    break;
            }
        }

    }

}
fclose($handle);

$last_id = 0;

$start_times = array();

foreach($routes as $route) {
    $start_times[$route . "_AM"] = array();
    $start_times[$route . "_PM"] = array();
}

$handle = fopen(getcwd() . "/data/gtfs/stop_times_trains.txt", "r");
if ($handle) {

    // save line to pass on later...
    $count = 0;
    while(($line = fgets($handle)) !== FALSE) {

        $count++;

        $data = str_getcsv($line, ",");
            
        if ($count == 1 || $data[4] != 1) {
            // column headers or not first stop
            continue;
        }

        $time = convert_time($data[1]);

        $trip_id = $data[0];

        foreach($routes as $route) {

            if (in_array($trip_id, $route_trips[$route])) {

                if ($time >= 21600 && $time <= 32400) {
                    // AM rush hour, write data to 
                    //$start_times[$route . "_AM"][] = $time;
                } else if ($time >= 57600 && $time <= 64800) {
                    // PM rush hour
                    $start_times[$route . "_PM"][] = $time;
                }

            }

        }

    }

}
fclose($handle);

function format_time($seconds) {

    $hours = floor($seconds / 3600);
    $minutes = floor($seconds / 60) - ($hours * 60);
    $am_pm = "AM";
    if ($hours > 12) {
        $hours -= 12;
        $am_pm = "PM";
    }

    return $hours . ":" . str_pad($minutes, 2, "0", STR_PAD_LEFT) . " " . $am_pm;
}

foreach($start_times as $route => $times) {

    asort($times);
    echo $route . "\t[" . implode(", ", $times) . "]\n";
    foreach($times as $time) {
        echo format_time($time) . " ";
    }
    echo "\n\n";
}


$end_time = time();

echo "\nScript took " . ($end_time - $start_time) . " seconds.\n";