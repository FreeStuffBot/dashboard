<template>
  <div class="container">
    <h1>Add Server</h1>
    <div v-if="guilds && guilds.length" class="guilds">
      <a v-for="guild in guilds" :key="guild.id" class="guild" href="" @click.prevent="addGuild(guild)">
        <div class="imgwrapper">
          <img class="o" src="~/assets/img/plus_overlay.svg" alt="Guild Icon">
          <img class="i" :src="guild.image" alt="Guild Icon">
        </div>
        <div class="text">
          <span class="gn" v-text="guild.name" />
          <span class="st" v-text="'Ayyy'" />
        </div>
      </a>
    </div>
    <div v-else-if="error" class="no-guilds">
      <span>An error occured and your guilds could not be fetched.</span>
      <a href="javascript:location.reload()">Try reloading the page</a>
    </div>
    <div v-else class="no-guilds">
      <span>You don't administrate any more guilds...</span>
      <a href="https://discord.com/template/WYAQmEzjw3Pj" target="_blank">Create one</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  transition: 'slide-down',
  data() {
    return {
      error: !this.$store.state.user.guilds,
      guilds: this.$store.state.user.guilds
        ?.filter((g: any) => !g.freestuff)
        .filter((g: any) => (g.permissions & (1 << 5)) !== 0 || (g.permissions & (1 << 3)) !== 0)
    }
  },
  methods: {
    addGuild(guild: any) {
      const url = this.$store.state.environment === 'production'
        ? `https://discord.com/oauth2/authorize?redirect_uri=https%3A%2F%2Ffreestuffbot.xyz%2Fcallback&client_id=672822334641537041&permissions=445504&scope=bot&guild_id=${guild.id}&response_type=code`
        : `https://discord.com/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%2Fserver%2Fcallback&client_id=574303680552108043&permissions=445504&scope=bot&guild_id=${guild.id}&response_type=code`
      const w = window.open(
        url,
        `Add the FreeStuff bot to ${guild.name}`,
        'width=500,height=700,location=no,toolbar=no,menuvar=no,status=no,left=-1000,top=-1000'
      )
      if (w) {
        let interval: any = null
        interval = setInterval(() => {
          if (!w || w.closed) {
            clearInterval(interval)
            setTimeout(async () => {
              const guildlist = (await axios.get('/data/guilds')).data
              this.$store.commit('user/updateGuilds', guildlist)
              if (guildlist.find((g: any) => g.id === guild.id).freestuff)
                this.$router.replace(`/server/${guild.id}`)
            }, 2000)
          }
        }, 1000)
      }
    }
  },
  head() {
    return {
      title: 'FreeStuff Add Server'
    }
  }
})
</script>

<style scoped lang="scss">
@import "~/assets/style/all.scss";

.guilds {
  margin-top: $box-padding;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: $box-padding;
  row-gap: $box-padding;
}

.guild {
  display: flex;
  min-width: 100px;
  background-color: $bg-dark;
  padding: $box-padding;
  border-radius: $box-br;
  text-decoration: none;
  cursor: pointer;
  transition: background-color .1s ease-out;

  &:hover {
    background-color: $bg-darker;

    img.i { opacity: .3 !important; }
    img.o { opacity: 1 !important; }
  }

  .imgwrapper {
    background-color: #00000044;
    height: 48pt;
    width: 48pt;
    border-radius: 99pt;
    margin-right: $box-padding;
    overflow: hidden;
    position: relative;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: opacity .1s ease-out;

      &.i { z-index: 10; }
      &.o { z-index: 11; opacity: 0; }
    }
  }

  .text {
    width: calc(100% - 48pt - #{$box-padding});
    display: flex;
    flex-direction: column;
    justify-content: center;

    .gn {
      color: $color-major;
      font-family: $font-major;
      font-size: 14pt;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .st {
      color: $color-sub;
      font-family: $font-sub;
      font-size: 12pt;
    }
  }

  a {
    color: $color-major;
    text-decoration: none;
    padding: 20pt;
  }
}

.no-guilds {
  span {
    display: block;
    margin-top: $box-padding;
    color: white;
    font-family: $font-regular;
    font-size: 11pt;
  }

  a {
    display: block;
    margin-top: $box-padding / 3;
    color: $primary-blue;
    font-family: $font-major;
    font-size: 11pt;
    text-decoration: none;
  }
}
</style>
