<?php
namespace AweBooking\Http\Router;

use Exception;
use InvalidArgumentException;
use AweBooking\AweBooking;

/**
 *
 * @link https://github.com/mmghv/lumen-route-binding
 */
class Binding_Resolver {
	/**
	 * The awebooking instance.
	 *
	 * @var callable
	 */
	protected $awebooking;

	/**
	 * Explicit bindings.
	 *
	 * @var array
	 */
	protected $bindings = [];

	/**
	 * Composite wildcards bindings.
	 *
	 * @var array
	 */
	protected $composite_bindings = [];

	/**
	 * Constructor.
	 *
	 * @param AweBooking $awebooking The awebooking instance.
	 */
	public function __construct( AweBooking $awebooking ) {
		$this->awebooking = $awebooking;
	}

	/**
	 * Explicit bind a model (name or closure) to a wildcard key.
	 *
	 * @param  string          $key           The wildcard key.
	 * @param  string|callable $binder        The model name, Class_Name@method or resolver callable.
	 * @param  null|callable   $error_handler The handler to be called on exceptions (mostly ModelNotFoundException).
	 * @return void
	 */
	public function bind( $key, $binder, callable $error_handler = null ) {
		$this->bindings[ $key ] = [ $binder, $error_handler ];
	}

	/**
	 * Register a composite binding (more than one model) with a specific order
	 *
	 * @param  array                                                                                                          $keys          wildcards composite
	 * @param  string|callable binder         resolver callable or Class@method callable, will be passed the wildcards values
	 *                                        and should return an array of resolved values of the same count and order
	 * @param  null|callable                                                                                                  $error_handler  handler to be called on exceptions (which is thrown in the resolver callable)
	 *
	 * @throws InvalidArgumentException
	 *
	 * @example (bind 2 wildcards composite {oneToMany relation})
	 * ->compositeBind(['post', 'comment'], function($post, $comment) {
	 *     $post = \App\Post::findOrFail($post);
	 *     $comment = $post->comments()->findOrFail($comment);
	 *     return [$post, $comment];
	 * });
	 *
	 * @example (using Class@method callable style)
	 * ->compositeBind(['post', 'comment'], 'App\Managers\PostManager@findPostComment');
	 */
	public function composite_bind( $keys, $binder, callable $error_handler = null ) {
		if ( ! is_array( $keys ) ) {
			throw new InvalidArgumentException( 'Route-Model-Binding : Invalid $keys value, Expected array of wildcards names' );
		}

		if ( count( $keys ) < 2 ) {
			throw new InvalidArgumentException( 'Route-Model-Binding : Invalid $keys value, Expected array of more than one wildcard' );
		}

		if ( is_callable( $binder ) ) {
			// normal callable is acceptable
		} elseif ( is_string( $binder ) && strpos( $binder, '@' ) !== false ) {
			// Class@method callable is acceptable
		} else {
			throw new InvalidArgumentException( "Route-Model-Binding : Binder must be a callable or a 'Class@method' string" );
		}

		$this->composite_bindings[] = [ $keys, $binder, $error_handler ];
	}

	/**
	 * Resolve bindings for route parameters.
	 *
	 * @param  array $vars  The route parameters.
	 * @return array        Route parameters with bindings resolved.
	 */
	public function resolve_bindings( array $vars ) {
		// First check if the route $vars as a whole matches any registered composite binding.
		if ( count( $vars ) > 1 && ! empty( $this->composite_bindings ) ) {
			if ( $r = $this->resolve_composite_binding( $vars ) ) {
				return $r;
			}
		}

		// If no composite binding found, check for explicit bindings.
		if ( ! empty( $this->bindings ) ) {
			foreach ( $vars as $var => $value ) {
				$vars[ $var ] = $this->resolve_binding( $var, $value );
			}
		}

		return $vars;
	}

	/**
	 * Check for and resolve the composite bindings if a match found
	 *
	 * @param  array $vars  the wildcards array
	 * @return array|null   the wildcards array after been resolved, or NULL if no match found
	 */
	protected function resolve_composite_binding( array $vars ) {
		$keys = array_keys( $vars );

		foreach ( $this->composite_bindings as $binding ) {
			if ( $keys === $binding[0] ) {
				$binder = $binding[1];
				$error_handler = $binding[2];

				$callable = $this->get_binding_callable( $binder, null );
				$r = $this->call_binding_callable( $callable, $vars, $error_handler, true );

				if ( ! is_array( $r ) || count( $r ) !== count( $vars ) ) {
					throw new Exception( 'Route-Model-Binding (composite-bind) : Return value should be an array and should be of the same count as the wildcards!' );
				}

				// Combine the binding results with the keys.
				return array_combine( $keys, array_values( $r ) );
			}
		}
	}

	/**
	 * Resolve binding for the given wildcard.
	 *
	 * @param  string $key    The wildcard key.
	 * @param  string $value  The wildcard value.
	 * @return mixed
	 */
	protected function resolve_binding( $key, $value ) {
		// Handle binding if found.
		if ( isset( $this->bindings[ $key ] ) ) {
			list( $binder, $error_handler ) = $this->bindings[ $key ];

			return $this->call_the_binding( $binder, $value, $error_handler );
		}

		// Return the value unchanged if no binding found.
		return $value;
	}

	/**
	 * Get the callable for the binding.
	 *
	 * @param  mixed    $binder        The binder.
	 * @param  string   $value         The value.
	 * @param  callable $error_handler The error_handler.
	 * @return callable
	 *
	 * @throws \Exception
	 */
	protected function call_the_binding( $binder, $value, callable $error_handler = null ) {
		try {
			$resolved = $this->awebooking->make( $binder, [ $value ] );

			return $resolved;
		} catch ( \Exception $e ) {
			if ( ! is_null( $error_handler ) ) {
				return call_user_func( $error_handler, $e );
			} else {
				throw $e;
			}
		}
	}

	/**
	 * Get the default binding resolver callable
	 *
	 * @param  string $instance
	 * @param  string $value
	 *
	 * @return \Closure
	 */
	protected function call_default_binding( $instance, $value ) {
	}
}
