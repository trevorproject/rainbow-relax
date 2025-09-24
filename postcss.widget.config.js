import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss({
      config: './tailwind.widget.config.js'
    }),
    autoprefixer,
  ],
}
