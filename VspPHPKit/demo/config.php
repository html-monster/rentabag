<?php
defined('DEMO_PATH') || exit('No direct script access.');
/**
 * Database connection configuration file
 */
return array(
    'hostname' => 'localhost',
//    'username' => 'rentabag-magento',
    'username' => 'test',
    'password' => '22',
    'database' => 'test',
//    'database' => 'vh11072_p-rentabag',

	//the functionality below is currently not supported and left out for future use
    'admins' => array(
        array(
			'username' => 'admin',
			'password' => 'd033e22ae348aeb5660fc2140aec35850c4da997'
		),
    )
);
