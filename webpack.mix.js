let mix = require('laravel-mix').mix;

// Setup project.
mix.setPublicPath('assets');
mix.disableSuccessNotifications();

mix.options({
  processCssUrls: false
});

// Complide scss and js
mix.sass('assets/sass/admin.scss', 'assets/css')
    .sass('assets/sass/theme.scss', 'assets/css')
    .sass('assets/sass/awebooking.scss', 'assets/css');

mix.js('assets/jssrc/admin/awebooking.js', 'assets/js/admin')
   .js('assets/jssrc/admin/edit-booking.js', 'assets/js/admin')
   .js('assets/jssrc/admin/edit-service.js', 'assets/js/admin')
   .js('assets/jssrc/admin/edit-room-type.js', 'assets/js/admin')
   .js('assets/jssrc/admin/manager-pricing.js', 'assets/js/admin')
   .js('assets/jssrc/admin/manager-availability.js', 'assets/js/admin')
   .js('assets/jssrc/admin/calendar/schedule-calendar.js', 'assets/js/admin');

mix.copy('./node_modules/sweetalert2/dist/sweetalert2.min.css', './assets/css/sweetalert2.min.css', false);
mix.copy('./node_modules/sweetalert2/dist/sweetalert2.min.js', './assets/js/sweetalert2/sweetalert2.min.js', false);
mix.extract(['vue', 'form-serialize', 'popper.js', 'tooltip.js']);

if (mix.inProduction()) {
  mix.version();
} else {
  mix.sourceMaps()
}

mix.browserSync({
  proxy: 'awebooking.local',
  files: [
    'inc/**/*.php',
    'templates/**/*.php',
    'assets/css/**/*.css',
    // 'assets/js/**/*.js',
  ]
});
