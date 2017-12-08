<?php
namespace AweBooking\Admin\Metaboxes;

use AweBooking\AweBooking;
use AweBooking\Model\Room;
use AweBooking\Model\Room_Type;

class Room_Type_Metabox extends Post_Type_Metabox {
	/**
	 * Post type ID to register meta-boxes.
	 *
	 * @var string
	 */
	protected $post_type = 'room_type';

	/**
	 * Constructor of class.
	 */
	public function __construct() {
		parent::__construct();

		$this->register_main_metabox();
		$this->register_description_metabox();
		$this->register_gallery_metabox();

		add_action( 'edit_form_top', [ $this, 'setup_room_type' ] );
		add_action( 'admin_menu', array( $this, 'remove_meta_box' ) );
	}

	/**
	 * Unset `hotel_extra_service` metabox.
	 */
	public function remove_meta_box() {
		remove_meta_box( 'hotel_extra_servicediv', $this->post_type, 'side' );
	}

	/**
	 * Setup room type object.
	 *
	 * @access private
	 * @see wp-admin/edit-form-advanced.php
	 *
	 * @param WP_Post $post Post object.
	 */
	public function setup_room_type( $post ) {
		if ( $this->is_current_screen() ) {
			global $room_type;
			$room_type = new Room_Type( $post->ID );
		}
	}

	/**
	 * Save CPT metadata when a custom post is saved.
	 *
	 * @access private
	 *
	 * @param int  $post_id The post ID.
	 * @param post $post    The post object.
	 * @param bool $update  Whether this is an existing post being updated or not.
	 */
	public function doing_save( $post_id, $post, $update ) {
		// If this is just a revision, don't do anything.
		if ( wp_is_post_revision( $post_id ) ) {
			return;
		}

		$room_type = new Room_Type( $post_id );

		if ( isset( $_POST['abkng_rooms'] ) && is_array( $_POST['abkng_rooms'] ) ) {
			$request_rooms = wp_unslash( $_POST['abkng_rooms'] );
			$room_type->bulk_sync_rooms( $request_rooms );
		}

		if ( isset( $_POST['awebooking_services'] ) && is_array( $_POST['awebooking_services'] ) ) {
			$services = array_unique(
				array_map( 'intval', $_POST['awebooking_services'] )
			);

			$term_taxonomy_ids = wp_set_object_terms(
				$post_id, $services, AweBooking::HOTEL_SERVICE, false
			);
		} else {
			wp_delete_object_term_relationships( $post_id, AweBooking::HOTEL_SERVICE );
		}
	}

	/**
	 * Register gallery metabox.
	 *
	 * @access private
	 *
	 * @return void
	 */
	public function register_gallery_metabox() {
		$metabox = $this->create_metabox( 'room_type_gallery', [
			'title'    => esc_html__( 'Room Type Gallery', 'awebooking' ),
			'context'  => 'side',
			'priority' => 'default',
		]);

		$metabox->add_field([
			'id'         => 'gallery',
			'type'       => 'file_list',
			'query_args' => [ 'type' => 'image' ],
			'text'       => [
				'add_upload_files_text' => esc_html__( 'Set room type gallery', 'awebooking' ),
			],
		]);
	}

	/**
	 * Register description metabox.
	 *
	 * @access private
	 *
	 * @return void
	 */
	public function register_description_metabox() {
		$metabox = $this->create_metabox( 'room_type_description', [
			'title'    => esc_html__( 'Short Description', 'awebooking' ),
			'context'  => 'advanced',
			'priority' => 'default',
		]);

		$metabox->add_field( array(
			'id'          => 'excerpt',
			'type'        => 'wysiwyg',
			'save_field'  => false,
			'escape_cb'   => false,
			'default_cb'  => function() {
				return get_post_field( 'post_excerpt', get_the_ID() );
			},
			'options'     => array(
				// 'tinymce'       => false,
				// 'media_buttons' => false,
				'textarea_rows' => 7,
			),
		));
	}

	/**
	 * Add meta boxes to this post type.
	 *
	 * @access private
	 *
	 * @return void
	 */
	public function register_main_metabox() {
		$metabox = $this->create_metabox( 'room_type', [
			'title'         => esc_html__( 'Room Type Data', 'awebooking' ),
			'context'       => 'advanced',
			'priority'      => 'low',
			'vertical_tabs' => true,
		]);

		$currency = awebooking()->make( 'currency' );

		// Register Metabox Sections.
		$general = $metabox->add_section( 'general', array(
			'title' => esc_html__( 'General', 'awebooking' ),
		));

		$general->add_field( array(
			'id'         => 'base_price',
			'type'       => 'text_small',
			'name'       => sprintf( esc_html__( 'Starting price (%s)', 'awebooking' ), esc_html( $currency->get_symbol() ) ),
			'validate'   => 'required|price',
			'sanitization_cb' => 'awebooking_sanitize_price',
			'before'     => '<div class="skeleton-input-group">',
			'after'      => '<span class="skeleton-input-group__addon">' . esc_html__( 'per night', 'awebooking' ) . '</span></div>',
		));

		$general->add_field( array(
			'id'         => 'number_adults',
			'type'       => 'text_small',
			'name'       => esc_html__( 'And capacity for', 'awebooking' ),
			'default'    => 2,
			'sanitization_cb' => 'absint',
			'validate'   => 'required|numeric|min:0',
			'render_field_cb'   => array( $this, '_room_field_callback' ),
		));

		if ( awebooking( 'setting' )->get_children_bookable() ) {
			$general->add_field( array(
				'id'         => 'number_children',
				'type'       => 'text_small',
				'name'       => esc_html__( 'Number children', 'awebooking' ),
				'default'    => 2,
				'sanitization_cb' => 'absint',
				'validate'   => 'required|numeric|min:0',
				'show_on_cb' => '__return_false', // NOTE: We'll handler display in "number_adults".
			));
		}

		if ( awebooking( 'setting' )->get_infants_bookable() ) {
			$general->add_field( array(
				'id'         => 'number_infants',
				'type'       => 'text_small',
				'name'       => esc_html__( 'Number infants', 'awebooking' ),
				'default'    => 2,
				'sanitization_cb' => 'absint',
				'validate'   => 'required|numeric|min:0',
				'show_on_cb' => '__return_false', // NOTE: We'll handler display in "number_adults".
			));
		}

		$general->add_field( array(
			'id'         => 'max_adults',
			'type'       => 'text_small',
			'name'       => esc_html__( 'Allow extra capacity for', 'awebooking' ),
			'default'    => 0,
			'sanitization_cb' => 'absint',
			'validate'   => 'required|numeric|min:0',
			'render_field_cb'   => array( $this, '_room_max_field_callback' ),
		));

		if ( awebooking( 'setting' )->get_children_bookable() ) {
			$general->add_field( array(
				'id'         => 'max_children',
				'type'       => 'text_small',
				'name'       => esc_html__( 'Number children', 'awebooking' ),
				'default'    => 0,
				'validate'   => 'required|numeric|min:0',
				'sanitization_cb' => 'absint',
				'show_on_cb' => '__return_false',
			));
		}

		if ( awebooking( 'setting' )->get_infants_bookable() ) {
			$general->add_field( array(
				'id'         => 'max_infants',
				'type'       => 'text_small',
				'name'       => esc_html__( 'Number infants', 'awebooking' ),
				'default'    => 0,
				'validate'   => 'required|numeric|min:0',
				'sanitization_cb' => 'absint',
				'show_on_cb' => '__return_false',
			));
		}

		$general->add_field( array(
			'id'         => 'minimum_night',
			'type'       => 'text_small',
			'name'       => esc_html__( 'Minimum night(s) required', 'awebooking' ),
			'default'    => 1,
			'sanitization_cb' => 'absint',
			'validate'   => 'required|numeric|min:1',
			'before'     => '<div class="skeleton-input-group">',
			'after'      => '<span class="skeleton-input-group__addon">' . esc_html__( 'night(s)', 'awebooking' ) . '</span></div>',
		));

		$general->add_field( array(
			'id'         => '__rooms_numbers__',
			'type'       => 'title',
			'name'       => esc_html__( 'Number of rooms', 'awebooking' ),
			'show_on_cb' => [ $this, '_render_rooms_callback' ],
		));

		$general->add_field( array(
			'id'         => '__additional_price__',
			'type'       => 'title',
			'name'       => esc_html__( 'Additional price', 'awebooking' ),
			'show_on_cb' => [ $this, '_render_additional_price_callback' ],
		));

		$general->add_field( array(
			'name'       => esc_html__( 'Area size', 'awebooking' ),
			'id'         => 'area_size',
			'type'       => 'text_small',
			'validate'   => 'numeric|min:1',
			'before'     => '<div class="skeleton-input-group">',
			'after'      => '<span class="skeleton-input-group__addon">' . awebooking( 'setting' )->get( 'measure_unit', 'm2' ) . '</span></div>',
		));

		$general->add_field( array(
			'name'    => esc_html__( 'View', 'awebooking' ),
			'id'      => 'view',
			'type'    => 'text_medium',
			'attributes' => array(
				'list' => 'view_list',
			),
			'render_field_cb' => array( __CLASS__, '_view_field_callback' ),
		) );

		$general->add_field( array(
			'name'    => esc_html__( 'Bed', 'awebooking' ),
			'id'      => 'bed',
			'type'    => 'text_small',
			'default'    => 1,
			'sanitization_cb' => 'absint',
			'validate'   => 'required|numeric|min:0',
			'render_field_cb'   => array( __CLASS__, '_bed_field_callback' ),
		) );

		$general->add_field( array(
			'id'         => 'bed_style',
			'type'       => 'text_medium',
			'name'       => esc_html__( 'Bed style', 'awebooking' ),
			'show_on_cb' => '__return_false',
			'attributes' => array(
				'list' => 'bed_style_list',
			),
		));

		$general->add_field( array(
			'id'         => 'smoking_policy',
			'type'       => 'checkbox',
			'name'       => esc_html__( 'Smoking policy', 'awebooking' ),
		));

		// ---
		$extra_service = $metabox->add_section( 'extra_service', array(
			'title' => esc_html__( 'Extra Services', 'awebooking' ),
		));

		$extra_service->add_field( array(
			'id'         => '__extra_services__',
			'type'       => 'title',
			'name'       => esc_html__( 'Extra Services', 'awebooking' ),
			'show_on_cb' => [ $this, '_render_extra_services_callback' ],
		));

		do_action( 'awebooking/register_metabox/room_type', $metabox );
	}

	/**
	 * Render rooms callback.
	 *
	 * @return void
	 */
	public function _render_rooms_callback( $field ) {
		include trailingslashit( __DIR__ ) . 'views/html-room-type-rooms.php';
	}

	/**
	 * Render service callback.
	 *
	 * @return void
	 */
	public function _render_extra_services_callback( $field ) {
		include trailingslashit( __DIR__ ) . 'views/html-room-type-services.php';
	}

	/**
	 * Render additional price callback.
	 *
	 * @return void
	 */
	public function _render_additional_price_callback( $field ) {
		include trailingslashit( __DIR__ ) . 'views/html-room-type-additional-price.php';
	}

	/**
	 * Render rooms callback.
	 *
	 * @return void
	 */
	public function _room_field_callback( $field_args, $field ) {
		$cmb2 = $field->get_cmb();

		echo '<div class="skeleton-input-group">';
		skeleton_render_field( $field );
		echo '<span class="skeleton-input-group__addon">' . esc_html__( 'adults', 'awebooking' ) . '</span>';
		echo '</div>';

		if ( awebooking( 'setting' )->get_children_bookable() ) {
			$number_children_field = $cmb2->get_field( 'number_children' );

			echo '<div class="skeleton-input-group">';
			skeleton_render_field( $number_children_field );
			echo '<span class="skeleton-input-group__addon">' . esc_html__( 'children', 'awebooking' ) . '</span>';
			echo '</div>';

			skeleton_display_field_errors( $number_children_field );
		}

		if ( awebooking( 'setting' )->get_infants_bookable() ) {
			$number_infants_field   = $cmb2->get_field( 'number_infants' );

			echo '<div class="skeleton-input-group">';
			skeleton_render_field( $number_infants_field );
			echo '<span class="skeleton-input-group__addon">' . esc_html__( 'infants', 'awebooking' ) . '</span>';
			echo '</div>';

			skeleton_display_field_errors( $number_infants_field );
		}
	}

	/**
	 * Render rooms callback.
	 *
	 * @return void
	 */
	public function _room_max_field_callback( $field_args, $field ) {
		$cmb2 = $field->get_cmb();

		echo '<div class="skeleton-input-group">';
		skeleton_render_field( $field );
		echo '<span class="skeleton-input-group__addon">' . esc_html__( 'adults', 'awebooking' ) . '</span>';
		echo '</div>';

		if ( awebooking( 'setting' )->get_children_bookable() ) {
			$max_children_field = $cmb2->get_field( 'max_children' );

			echo '<div class="skeleton-input-group">';
			skeleton_render_field( $max_children_field );
			echo '<span class="skeleton-input-group__addon">' . esc_html__( 'children', 'awebooking' ) . '</span>';
			echo '</div>';

			skeleton_display_field_errors( $max_children_field );
		}

		if ( awebooking( 'setting' )->get_infants_bookable() ) {
			$max_infants_field   = $cmb2->get_field( 'max_infants' );

			echo '<div class="skeleton-input-group">';
			skeleton_render_field( $max_infants_field );
			echo '<span class="skeleton-input-group__addon">' . esc_html__( 'infants', 'awebooking' ) . '</span>';
			echo '</div>';

			skeleton_display_field_errors( $max_infants_field );
		}
	}

	/**
	 * Render bed callback.
	 *
	 * @return void
	 */
	public static function _bed_field_callback( $field_args, $field ) {
		$cmb2 = $field->get_cmb();
		$bed_style = $cmb2->get_field( 'bed_style' );

		echo '<div class="skeleton-input-group">';
		skeleton_render_field( $field );
		echo '</div>';

		echo '<div class="skeleton-input-group">';
		skeleton_render_field( $bed_style );

		echo '<datalist id="bed_style_list">
			  	<option value="' . esc_html__( 'Single bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Double bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Queen bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'King bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Twin bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Super King bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Futon bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Murphy bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Sofa bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Tatami Mats bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Run of the House', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Dorm bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Roll-Away bed', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Crib', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Unspecified bed', 'awebooking' ) . '">
			</datalist>';
		echo '</div>';

		skeleton_display_field_errors( $bed_style );
	}

	/**
	 * Render view callback.
	 *
	 * @return void
	 */
	public static function _view_field_callback( $field_args, $field ) {
		echo '<div class="skeleton-input-group">';

		skeleton_render_field( $field );

		echo '<datalist id="view_list">
			  	<option value="' . esc_html__( 'Airport view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Bay view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'City view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Courtyard view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Golf view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Harbor view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Intercoastal view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Lake view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Marina view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Mountain view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Ocean view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Pool view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'River view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Water view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Beach view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Garden view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Park view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Forest view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Rain forest view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Various views', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Limited view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Slope view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Strip view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Countryside view', 'awebooking' ) . '">
			  	<option value="' . esc_html__( 'Sea view', 'awebooking' ) . '">
			</datalist>';
		echo '</div>';

		skeleton_display_field_errors( $field );
	}
}
