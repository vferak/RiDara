import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: ['light', 'dark'],
    },
    theme: {
        container: {
            padding: {
                lg: '5rem',
            }
        }
    }
}
