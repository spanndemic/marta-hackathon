<?php

$start_time = time();

$handle = fopen(getcwd() . "/data/gtfs/stop_times_trains.txt", "r");

$last_id = 0;

$baseline = 0;
$offsets = [];

function convert_time($time) {
    $time_parts = explode(":", $time);
    $time_in_minutes = ($time_parts[0] * 60) + $time_parts[1];
    return $time_in_minutes;
}

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

        $time = convert_time($data[1]);

        if ($data[0] != $last_id) {

            // beginning
            echo $last_id . " ";
            echo "[" . implode(", ", $offsets) . "];\n";

            $offsets = [];

            $baseline = $time;


            $last_id = $data[0];
        }

        $offset = $time - $baseline;
        $offsets[] = $offset;
        

    }

}

fclose($handle);

$end_time = time();

echo "\nScript took " . ($end_time - $start_time) . " seconds.\n";