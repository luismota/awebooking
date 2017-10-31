<?php

use AweBooking\Installer;

class Test_Installer extends WP_UnitTestCase {
	public function setUp() {
		parent::setUp();
		$this->installer = awebooking()->make( Installer::class );
	}

	public function testIsNewInstall() {
		$this->setVersion( null, null );

		$this->assertNull($this->installer->get_current_version());
		$this->assertNull($this->installer->get_current_db_version());
		$this->assertTrue($this->installer->is_new_install());
	}

	public function testNeedUpdate() {
		$this->setVersion('3.0.0-beta9', '3.0.0-beta9');
		$this->assertTrue($this->installer->needs_db_update());
	}

	public function testDontNeedUpdate() {
		$this->setVersion('3.0.0-beta10', '3.0.0-beta10');
		// $this->setVersion(awebooking()->version(), awebooking()->version());
		$this->assertFalse($this->installer->needs_db_update());
	}

	protected function setVersion( $version = null, $db_version = null ) {
		delete_option( 'awebooking_version' );
		delete_option( 'awebooking_db_version' );

		add_option( 'awebooking_version', $version );
		add_option( 'awebooking_db_version', $db_version );
	}
}
