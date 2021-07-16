<template>
  <div class="container">
    <h1>
      Admin
    </h1>

    <h2>Overview:</h2>
    <span v-if="git">Running Commit #{{ git.shortHash }} ({{ git.subject }} :: {{ git.author.name }}) from {{ git.time }}</span>
    <span v-else>Running unknown Commit (no admin permission?)</span>
    <br>
    <h2>Pages</h2>
    <div class="pages">
      <nuxt-link to="./users">
        <span class="emoji">🧘‍♂️</span>
        Users
      </nuxt-link>
      <nuxt-link to="./topclients">
        <span class="emoji">📈</span>
        Top Clients
      </nuxt-link>
      <nuxt-link to="./experiments">
        <span class="emoji">🧪</span>
        Experiments
      </nuxt-link>
      <nuxt-link to="./apiapps">
        <span class="emoji">🤖</span>
        API Apps
      </nuxt-link>
      <nuxt-link to="./network">
        <span class="emoji">📡</span>
        Network
      </nuxt-link>
      <nuxt-link to="./config">
        <span class="emoji">⚙️</span>
        Configuration
      </nuxt-link>
      <nuxt-link to="./logs">
        <span class="emoji">🗃️</span>
        Logs
      </nuxt-link>
    </div>
    <h2>Actions</h2>
    <div class="actions">
      <button generic small class="b4 r" @click="action('resend_to_guild')">
        Resend an announcement
      </button>
      <button generic small class="b4 r" @click="action('check_guild')">
        Check guild
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import axios from 'axios'
// import Swal from 'sweetalert2'

export default Vue.extend({
  transition: 'slide-down',
  data() {
    return {
      git: 'TODO'
    }
  },
  methods: {
    /* async */ action(type: string) {
      alert('temporarily disabled')
      // let title = 'Error'
      // let inputdata = ''
      // let targets = []
      switch (type) {
        case 'resend_to_guild':
          // inputdata = prompt('Guild ids with comma seperated please') as string
          // title = 'Send to these guilds?\n' + inputdata
          // targets = this.services.map(s => s.uid)
          // if (!inputdata) return
          break
        case 'check_guild':
          // inputdata = prompt('Guild id?') as string
          // /* eslint-disable no-undef */
          // /* eslint-disable no-case-declarations */
          // const guild = await axios.get('/admin/guildsapi/' + inputdata)
          // const asId = BigInt(inputdata || 0)
          // const shard = ((asId >> BigInt(22)) % BigInt(this.discordShardCount || 1)).toString()
          // const server = this.services.find(s => s.service === 'discord' && (s.suid + '') === shard)?.server
          // Swal.fire({
          //   title: inputdata,
          //   html: `Shard: ${shard}\nServer: ${server}\nData: ${JSON.stringify(guild.data, null, 4)}`.replaceAll(' ', '&nbsp;').split('\n').map(s => `<span align="left" style="padding:0">${s}</span>`).join(''),
          //   icon: 'success',
          //   confirmButtonColor: '#3e9e71',
          //   confirmButtonText: 'Awesome!'
          // })
          // return
      }

      // const data = await Swal.fire({
      //   title,
      //   icon: 'question',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3e9e71',
      //   confirmButtonText: 'Yes'
      // })

      // if (data.value) {
      //   await axios.post('/admin/message', { // THIS ENDPOINT WAS REMOVED
      //     targets,
      //     command: type,
      //     args: inputdata ? inputdata.split(/, */) : [ ]
      //   })
      //   Swal.fire({
      //     title: 'Done',
      //     icon: 'success',
      //     confirmButtonColor: '#3e9e71',
      //     confirmButtonText: 'Awesome!'
      //   })
      // }
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;

  &.warn {
    color: $warning-major;
    font-family: $font-header;
  }
}

h1 img {
  height: 11pt;
  opacity: .4;
  padding: 3px;
  margin: 0 0 0 3px;
  cursor: pointer;

  &:hover { opacity: .7; }
}

.serviceContainer {
  margin: $box-padding 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-column-gap: $box-padding;
  row-gap: $box-padding;
  width: 100%;
}

.pages {
  display: grid;
  grid-template-columns: repeat(auto-fit, 150px);
  gap: $box-padding/2;

  a {
    background-color: $bg-dark;
    padding: $box-padding;
    border-radius: $box-border-radius;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: $color-major;
    font-family: $font-major;
    font-size: 11pt;
    transition: background-color .1s ease
              , color .1s ease
              , transform .1s ease;

    &:hover {
      background-color: $bg-darker;
      color: $color-header;
      transform: translateY(-2px);
    }

    .emoji {
      font-size: 16pt;
      margin-bottom: 10pt;
    }
  }
}

.actions {
  margin-top: $box-padding;

  button, a[button] {
    margin-right: 5pt;
    --bg: #{$bg-darker};
    --bg-hov: #{$success-major};
    --color: #{$color-major};

    &.r {
      --bg-hov: #{$warning-minor};
    }
  }
}

.divider {
  display: inline-block;
  width: 20px;
  margin-right: 5px;
  text-align: center;
  color: #ffffff80;
}

</style>
