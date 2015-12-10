<?php

$seed = 'ckczppom';
$num = 0;
$started = microtime(true);

$hash = '';
// this is part a
//while (!preg_match('/^00000.+/', $hash)) {
// this is part 2
while (!preg_match('/^000000.+/', $hash)) {
    if ($num > 10000000) {
        echo 'too many passes:' . $num;
        die();
    }
    $hash = md5($seed . $num);
    echo $hash . "\n";
    $num++;
}
echo "\nanswer is: " . --$num;
echo "\nit took: " . round(microtime(true) - $started, 3) . " seconds";

