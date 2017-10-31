<?php

$route->get('/', function () {
	return [
		'name' => ':)',
	];
});

$route->post('/users', function () {
	return ':)';
});
