Vue.use(Vuetify);

Vue.component('user', {
    props: ['state', 'index'],
    methods: {
        remove() {
            this.$emit('remove', this.index);
        },
        clockOut() {
            this.$emit('clock-out', this.index);
        }
    },
    computed: {
        localeTime() {
            return new Date(this.state.clockIn).toLocaleTimeString();
        }
    },
    template: `
        <v-card>
            <v-card-title primary-title>
                <h3 class="headline">{{state.name}}</h3>
            </v-card-title>
            <v-card-text>Clocked in since {{localeTime}}</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn @click="remove">Cancel</v-btn>
                <v-btn color="primary" @click="clockOut">Clock Out</v-btn>
            </v-card-actions>
        </v-card>
    `
});

Vue.component('user-picker', {
    props: ['users'],
    methods: {
        select(index) {
            this.$emit('select', index);
        }
    },
    template: `
        <v-card v-if="users.length">
            <v-card-title class="headline">Already clocked in?</v-card-title>
            <v-card-text>
                <v-layout flex>
                    <v-btn outline xs6 sm3 md2 v-for="(user, index) in users" @click="select(index)">{{user.name}}</v-btn>
                </v-layout>
            </v-card-text>
        </v-card>
    `
})

Vue.component('settings', {
    props: ['scriptID', 'authKey'],
    data() {
        return {
            dialog: false,
            scriptID: '',
            authKey: ''
        }
    },
    template: `
        <v-dialog v-model="dialog" width="600">
            <template v-slot:activator = "{ on }">
                <v-list-tile color="red lighten-2" v-on="on">
                    <v-list-tile-title>Settings</v-list-tile-title>
                </v-list-tile>
            </template>

            <v-card>
                <v-card-title class="headline">
                    Settings
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                    <v-text-field label="Script ID" v-model="scriptID"></v-text-field>
                </v-card-text>
                
                <v-card-text>
                    <v-text-field label="Auth Key" v-model="authKey"></v-text-field>
                </v-card-text>


                <v-card-text>
                    Script ID: {{ scriptID }} | Auth Key: {{ authKey }}
                </v-card-text>

                <v-card-actions>
                    <v-btn flat @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    `
});

const app = new Vue({
    el: '#app',
    data: {
        users: [],
        newUser: { name: '', clockIn: null },
        dark: false,
        currentUser: -1,
        scriptID: '',
        authKey: '',
        notification: {
            clockOutSuccess: false,
            clockOutError: false
        }
    },
    mounted() {
        let settings;
        try {
            settings = JSON.parse(localStorage.getItem('clock-state'))
        } catch (ignore) { console.log('Failed to parse!') }

        if (settings && settings.users) {
            // Manually handle
            this.users = settings.users;
            this.dark = settings.dark;
            this.spreadsheet = settings.scriptID || '';
            this.authKey = settings.authKey || '';
        }
    },
    watch: {
        users(_, state) {
            this.saveData();
        }
    },
    methods: {
        saveData() {
            console.log('Saving data!');
            
            localStorage.setItem('clock-state', JSON.stringify({
                users: this.users,
                dark: this.dark,
                scriptID: this.scriptID,
                authKey: this.authKey
            }));
        },
        toggleDark() {
            this.dark = !this.dark;
            this.saveData();
        },
        clockIn() {
            if (!this.newUser.name) {
                return;
            }

            this.newUser.clockIn = Date.now();
            this.users.push(this.newUser);
            this.currentUser = this.users.length - 1;

            // reset
            this.newUser = { name: '', clockIn: null };
        },
        clockOut(index) {
            let user = this.users[index];

            user.clockOut = Date.now();

            fetch(`https://script.google.com/macros/s/${this.scriptID}/exec?auth=${this.authKey}`, {
                body: user
            }).then(res => {
                this.remove(index);
                this.notification.clockOutSuccess = true;
            }).catch(error => {
                console.error(error);
                this.notification.clockOutError = true;
            });
        },
        setCurrentUser(index) {
            this.currentUser = index;
        },
        remove(index) {
            this.users.splice(index, 1);
            this.currentUser = -1;
        }
    }
});