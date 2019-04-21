Vue.use(Vuetify);

Vue.component('minimal-toolbar', {
    template: `
        <v-toolbar>
            <v-toolbar-title>Clock System</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat href="index.html">Back</v-button>
            </v-toolbar-items>
        </v-toolbar>
    `
});

const app = new Vue({
    el: '#app',
    data: {
        dark: false
    },
    mounted() {
        let settings;
        try {
            settings = JSON.parse(localStorage.getItem('clock-state'))
        } catch (ignore) { console.log('Failed to parse!') }

        this.dark = settings.dark;
    }
});