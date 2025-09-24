<?php
/**
 * Rainbow Relax Widget WordPress Integration Example
 * 
 * This file demonstrates how to integrate the Rainbow Relax widget
 * into a WordPress site using a shortcode.
 */

/**
 * Register the Rainbow Relax Widget shortcode
 * 
 * Usage: [rainbow_relax width="500px" height="500px"]
 */
function rainbow_relax_shortcode($atts) {
    // Default attributes
    $attributes = shortcode_atts(
        array(
            'width' => '500px',
            'height' => '500px',
            'container_id' => 'rainbow-relax-container-' . uniqid(),
            'cdn_base' => 'https://cdn.example.com/widget/',
            'audio_enabled' => 'true',
            'show_quick_exit' => 'false',
            'donate_url' => 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW',
            'get_help_url' => 'https://www.thetrevorproject.mx/ayuda/'
        ),
        $atts
    );
    
    // Convert string boolean values to actual booleans for JavaScript
    $audio_enabled = $attributes['audio_enabled'] === 'true' ? 'true' : 'false';
    $show_quick_exit = $attributes['show_quick_exit'] === 'true' ? 'true' : 'false';
    
    // Build the widget container and script
    $output = '<div id="' . esc_attr($attributes['container_id']) . '" style="width: ' . esc_attr($attributes['width']) . '; height: ' . esc_attr($attributes['height']) . ';"></div>';
    
    $output .= '<script>
        (function(w, d, s, src, id) {
            if (d.getElementById(id)) return;
            var js = d.createElement(s);
            js.id = id;
            js.src = src;
            js.async = true;
            d.head.appendChild(js);
        })(window, document, "script", "' . esc_url($attributes['cdn_base'] . 'rainbowRelax.js') . '", "rainbow-relax-' . esc_attr($attributes['container_id']) . '");

        window.myWidgetConfig = {
            showQuickExit: ' . $show_quick_exit . ',
            donateURL: "' . esc_url($attributes['donate_url']) . '",
            getHelpURL: "' . esc_url($attributes['get_help_url']) . '",
            width: "' . esc_attr($attributes['width']) . '",
            height: "' . esc_attr($attributes['height']) . '",
            containerId: "' . esc_attr($attributes['container_id']) . '",
            cdnBase: "' . esc_url($attributes['cdn_base'] . 'sounds/') . '",
            audioEnabled: ' . $audio_enabled . '
        };
    </script>';
    
    // Add the CSS file
    wp_enqueue_style('rainbow-relax-css', $attributes['cdn_base'] . 'rainbow-relax.css');
    
    return $output;
}
add_shortcode('rainbow_relax', 'rainbow_relax_shortcode');

/**
 * Register a WordPress widget for Rainbow Relax
 */
class Rainbow_Relax_Widget extends WP_Widget {
    
    public function __construct() {
        parent::__construct(
            'rainbow_relax_widget',
            'Rainbow Relax Widget',
            array('description' => 'Add the Rainbow Relax breathing exercise widget to your sidebar')
        );
    }
    
    public function widget($args, $instance) {
        echo $args['before_widget'];
        
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }
        
        // Create shortcode attributes from widget settings
        $shortcode_atts = array(
            'width' => !empty($instance['width']) ? $instance['width'] : '100%',
            'height' => !empty($instance['height']) ? $instance['height'] : '400px',
            'cdn_base' => !empty($instance['cdn_base']) ? $instance['cdn_base'] : 'https://cdn.example.com/widget/',
            'audio_enabled' => !empty($instance['audio_enabled']) ? 'true' : 'false',
            'show_quick_exit' => !empty($instance['show_quick_exit']) ? 'true' : 'false'
        );
        
        // Output the widget using the shortcode function
        echo rainbow_relax_shortcode($shortcode_atts);
        
        echo $args['after_widget'];
    }
    
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : '';
        $width = !empty($instance['width']) ? $instance['width'] : '100%';
        $height = !empty($instance['height']) ? $instance['height'] : '400px';
        $cdn_base = !empty($instance['cdn_base']) ? $instance['cdn_base'] : 'https://cdn.example.com/widget/';
        $audio_enabled = !empty($instance['audio_enabled']) ? $instance['audio_enabled'] : true;
        $show_quick_exit = !empty($instance['show_quick_exit']) ? $instance['show_quick_exit'] : false;
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>">Title:</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('width')); ?>">Width:</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('width')); ?>" name="<?php echo esc_attr($this->get_field_name('width')); ?>" type="text" value="<?php echo esc_attr($width); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('height')); ?>">Height:</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('height')); ?>" name="<?php echo esc_attr($this->get_field_name('height')); ?>" type="text" value="<?php echo esc_attr($height); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('cdn_base')); ?>">CDN Base URL:</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('cdn_base')); ?>" name="<?php echo esc_attr($this->get_field_name('cdn_base')); ?>" type="text" value="<?php echo esc_attr($cdn_base); ?>">
        </p>
        <p>
            <input class="checkbox" type="checkbox" <?php checked($audio_enabled); ?> id="<?php echo esc_attr($this->get_field_id('audio_enabled')); ?>" name="<?php echo esc_attr($this->get_field_name('audio_enabled')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('audio_enabled')); ?>">Enable Audio</label>
        </p>
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_quick_exit); ?> id="<?php echo esc_attr($this->get_field_id('show_quick_exit')); ?>" name="<?php echo esc_attr($this->get_field_name('show_quick_exit')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_quick_exit')); ?>">Show Quick Exit Button</label>
        </p>
        <?php
    }
    
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';
        $instance['width'] = (!empty($new_instance['width'])) ? sanitize_text_field($new_instance['width']) : '100%';
        $instance['height'] = (!empty($new_instance['height'])) ? sanitize_text_field($new_instance['height']) : '400px';
        $instance['cdn_base'] = (!empty($new_instance['cdn_base'])) ? esc_url_raw($new_instance['cdn_base']) : 'https://cdn.example.com/widget/';
        $instance['audio_enabled'] = (!empty($new_instance['audio_enabled'])) ? 1 : 0;
        $instance['show_quick_exit'] = (!empty($new_instance['show_quick_exit'])) ? 1 : 0;
        
        return $instance;
    }
}

/**
 * Register the widget with WordPress
 */
function register_rainbow_relax_widget() {
    register_widget('Rainbow_Relax_Widget');
}
add_action('widgets_init', 'register_rainbow_relax_widget');

/**
 * Add a WordPress admin page for Rainbow Relax settings
 */
function rainbow_relax_admin_menu() {
    add_options_page(
        'Rainbow Relax Settings',
        'Rainbow Relax',
        'manage_options',
        'rainbow-relax-settings',
        'rainbow_relax_settings_page'
    );
}
add_action('admin_menu', 'rainbow_relax_admin_menu');

/**
 * Display the settings page content
 */
function rainbow_relax_settings_page() {
    ?>
    <div class="wrap">
        <h1>Rainbow Relax Widget Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('rainbow_relax_options');
            do_settings_sections('rainbow-relax-settings');
            submit_button();
            ?>
        </form>
        
        <h2>Shortcode Usage</h2>
        <p>Use the following shortcode to add the Rainbow Relax widget to your posts or pages:</p>
        <pre>[rainbow_relax width="500px" height="500px"]</pre>
        
        <h2>Available Parameters</h2>
        <ul>
            <li><code>width</code> - Width of the widget (default: 500px)</li>
            <li><code>height</code> - Height of the widget (default: 500px)</li>
            <li><code>cdn_base</code> - Base URL for widget files (default: https://cdn.example.com/widget/)</li>
            <li><code>audio_enabled</code> - Enable audio (true/false, default: true)</li>
            <li><code>show_quick_exit</code> - Show quick exit button (true/false, default: false)</li>
            <li><code>donate_url</code> - URL for the donate button</li>
            <li><code>get_help_url</code> - URL for getting help</li>
        </ul>
        
        <h2>Example</h2>
        <pre>[rainbow_relax width="100%" height="600px" audio_enabled="true" show_quick_exit="true"]</pre>
    </div>
    <?php
}

/**
 * Register settings
 */
function rainbow_relax_register_settings() {
    register_setting('rainbow_relax_options', 'rainbow_relax_cdn_base');
    register_setting('rainbow_relax_options', 'rainbow_relax_default_width');
    register_setting('rainbow_relax_options', 'rainbow_relax_default_height');
    register_setting('rainbow_relax_options', 'rainbow_relax_audio_enabled');
    register_setting('rainbow_relax_options', 'rainbow_relax_show_quick_exit');
    register_setting('rainbow_relax_options', 'rainbow_relax_donate_url');
    register_setting('rainbow_relax_options', 'rainbow_relax_get_help_url');
    
    add_settings_section(
        'rainbow_relax_settings_section',
        'Global Settings',
        'rainbow_relax_settings_section_callback',
        'rainbow-relax-settings'
    );
    
    add_settings_field(
        'rainbow_relax_cdn_base',
        'CDN Base URL',
        'rainbow_relax_cdn_base_callback',
        'rainbow-relax-settings',
        'rainbow_relax_settings_section'
    );
    
    add_settings_field(
        'rainbow_relax_default_width',
        'Default Width',
        'rainbow_relax_default_width_callback',
        'rainbow-relax-settings',
        'rainbow_relax_settings_section'
    );
    
    add_settings_field(
        'rainbow_relax_default_height',
        'Default Height',
        'rainbow_relax_default_height_callback',
        'rainbow-relax-settings',
        'rainbow_relax_settings_section'
    );
    
    add_settings_field(
        'rainbow_relax_audio_enabled',
        'Enable Audio',
        'rainbow_relax_audio_enabled_callback',
        'rainbow-relax-settings',
        'rainbow_relax_settings_section'
    );
    
    add_settings_field(
        'rainbow_relax_show_quick_exit',
        'Show Quick Exit Button',
        'rainbow_relax_show_quick_exit_callback',
        'rainbow-relax-settings',
        'rainbow_relax_settings_section'
    );
    
    add_settings_field(
        'rainbow_relax_donate_url',
        'Donate URL',
        'rainbow_relax_donate_url_callback',
        'rainbow-relax-settings',
        'rainbow_relax_settings_section'
    );
    
    add_settings_field(
        'rainbow_relax_get_help_url',
        'Get Help URL',
        'rainbow_relax_get_help_url_callback',
        'rainbow-relax-settings',
        'rainbow_relax_settings_section'
    );
}
add_action('admin_init', 'rainbow_relax_register_settings');

/**
 * Settings section callback
 */
function rainbow_relax_settings_section_callback() {
    echo '<p>Configure the default settings for the Rainbow Relax widget.</p>';
}

/**
 * CDN Base URL field callback
 */
function rainbow_relax_cdn_base_callback() {
    $cdn_base = get_option('rainbow_relax_cdn_base', 'https://cdn.example.com/widget/');
    echo '<input type="text" class="regular-text" name="rainbow_relax_cdn_base" value="' . esc_attr($cdn_base) . '" />';
    echo '<p class="description">The base URL for the widget files (must end with a slash).</p>';
}

/**
 * Default Width field callback
 */
function rainbow_relax_default_width_callback() {
    $default_width = get_option('rainbow_relax_default_width', '500px');
    echo '<input type="text" name="rainbow_relax_default_width" value="' . esc_attr($default_width) . '" />';
    echo '<p class="description">Default width for the widget (e.g., 500px, 100%).</p>';
}

/**
 * Default Height field callback
 */
function rainbow_relax_default_height_callback() {
    $default_height = get_option('rainbow_relax_default_height', '500px');
    echo '<input type="text" name="rainbow_relax_default_height" value="' . esc_attr($default_height) . '" />';
    echo '<p class="description">Default height for the widget (e.g., 500px, 600px).</p>';
}

/**
 * Enable Audio field callback
 */
function rainbow_relax_audio_enabled_callback() {
    $audio_enabled = get_option('rainbow_relax_audio_enabled', true);
    echo '<input type="checkbox" name="rainbow_relax_audio_enabled" ' . checked($audio_enabled, true, false) . ' />';
    echo '<p class="description">Enable audio for the widget by default.</p>';
}

/**
 * Show Quick Exit Button field callback
 */
function rainbow_relax_show_quick_exit_callback() {
    $show_quick_exit = get_option('rainbow_relax_show_quick_exit', false);
    echo '<input type="checkbox" name="rainbow_relax_show_quick_exit" ' . checked($show_quick_exit, true, false) . ' />';
    echo '<p class="description">Show the quick exit button by default.</p>';
}

/**
 * Donate URL field callback
 */
function rainbow_relax_donate_url_callback() {
    $donate_url = get_option('rainbow_relax_donate_url', 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW');
    echo '<input type="text" class="regular-text" name="rainbow_relax_donate_url" value="' . esc_attr($donate_url) . '" />';
    echo '<p class="description">URL for the donate button.</p>';
}

/**
 * Get Help URL field callback
 */
function rainbow_relax_get_help_url_callback() {
    $get_help_url = get_option('rainbow_relax_get_help_url', 'https://www.thetrevorproject.mx/ayuda/');
    echo '<input type="text" class="regular-text" name="rainbow_relax_get_help_url" value="' . esc_attr($get_help_url) . '" />';
    echo '<p class="description">URL for getting help.</p>';
}

/**
 * Example usage in a WordPress template
 */
function rainbow_relax_example_usage() {
    // Example 1: Using the shortcode
    echo do_shortcode('[rainbow_relax width="100%" height="500px"]');
    
    // Example 2: Using the function directly
    echo rainbow_relax_shortcode(array(
        'width' => '500px',
        'height' => '500px',
        'audio_enabled' => 'true',
        'show_quick_exit' => 'false'
    ));
}
