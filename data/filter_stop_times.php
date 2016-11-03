<?php

$start_time = time();

$handle = fopen(getcwd() . "/data/gtfs/stop_times.txt", "r");

$new_file = fopen(getcwd() . "/data/gtfs/stop_times_trains.txt", "w");

if ($handle) {

    // save line to pass on later...
    while(($line = fgets($handle)) !== FALSE) {

        if (substr($line, 0, 2) == "24") {
            // train stop, keep the line
            fwrite($new_file, $line);
        }

    }

}

fclose($handle);

$end_time = time();

echo "\nScript took " . ($end_time - $start_time) . " seconds.\n";