<?php

$start_time = time();

$handle = fopen(getcwd() . "/data/gtfs/stops.txt", "r");
$stop_times = fopen(getcwd() . "/data/gtfs/stop_times_trains.txt", "r");

$new_file = fopen(getcwd() . "/data/gtfs/stops_trains.txt", "w");

// first get array of stops from stop times?
$stops = array();
if ($stop_times) {
    // save line to pass on later...
    while(($line = fgets($stop_times)) !== FALSE) {

        $data = str_getcsv($line, ",");

        if (!in_array($data[3], $stops)) {
            $stops[] = $data[3];
        }

    }
}

echo "stops:\n";
print_r($stops);



if ($handle) {

    // save line to pass on later...
    while(($line = fgets($handle)) !== FALSE) {

        $data = str_getcsv($line, ",");

        if (in_array($data[0], $stops)) {
            // train stop, keep the line
            fwrite($new_file, $line);
        }

    }

}

fclose($handle);

$end_time = time();

echo "\nScript took " . ($end_time - $start_time) . " seconds.\n";