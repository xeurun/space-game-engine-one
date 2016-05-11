#!/usr/bin/env php
<?php

set_time_limit(0);

require __DIR__ . '/../vendor/autoload.php';

$application = new \Symfony\Component\Console\Application();
$application->add(new \SpaceRangersOnline\Command\StartServerCommand());
$application->run();