import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Base Vuetify styles
// import '@mdi/font/css/materialdesignicons.css'; // Optional, for icons

let darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
let hasDarkMode = localStorage.getItem('darkModeEnabled')
if (!hasDarkMode && darkMediaQuery) {
    localStorage.setItem('darkModeEnabled', 'dark')
}

const vuetify = createVuetify({
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        dark: false,
        themes: {
            light: {
                primary: '#047EFB', //blue
                secondary: '#7BBCFF', //light blue
                accent: '#FCF25E', //yellow
                error: '#FF5555', //red
                warning: '#FF9100', //orange
                info: '#313BCF', //dark blue
                success: '#4caf50',
                background: '#eeeeee',
                text: '#FFFFFF'
            },
            dark: {
                primary: '#047EFB', //blue
                secondary: '#7BBCFF', //light blue
                accent: '#FCF25E', //yellow
                error: '#FF5555', //red
                warning: '#FF9100', //orange
                info: '#313BCF', //dark blue
                success: '#4caf50',
                background: '#3a3b3c'
            }
        }
    }
})

export default vuetify;