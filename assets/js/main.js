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
        <v-card-actions>
          <v-btn @click="remove">Cancel</v-btn>
          <v-btn color="primary" @click="clockOut">Clock Out</v-btn>
        </v-card-actions>
      </div>
    `
})

const app = new Vue({
  el: '#app',
  data: {
    users: [],
    newUser: { name: '', clockIn: null },
    dark: false
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
    }
  },
  watch: {
    // TODO: Find a better way to do this??
    users(_, state) {
      this.saveData();
    }
  },
  computed: {
    hasClockedIn() {
      return !!this.state.clockIn;
    }
  },
  methods: {
    saveData() {
      localStorage.setItem('clock-state', JSON.stringify({
        users: this.users,
        dark: this.dark
      }));
    },
    toggleDark() {
      this.dark = !this.dark;
      this.saveData();
    },
    clockIn() {
      this.newUser.clockIn = Date.now();
      this.users.push(this.newUser);

      // reset
      this.newUser = { name: '', clockIn: null };
    },
    clockOut(index) {
      let user = this.users[index];

      user.clockOut = Date.now();

      const diff = user.clockOut - user.clockIn;
      // SEND TO SPREADSHEET
      console.log(diff);

      let seconds = diff / 1000;
      let minutes = seconds / 60;
      seconds %= 60;
      let hours = minutes / 60;
      minutes %= 60;

      let name = user.name;

      alert(`${name} was clocked in for ${hours.toFixed(0)}h${minutes.toFixed(0)}m${seconds.toFixed(0)}s`);

      this.remove(index);
    },
    remove(index) {
      this.users.splice(index, 1);
    }
  }
});