<template>
  <div class="container">
    <h1>
      Users
      <img
        id="reloadbutton"
        v-tippy="{delay: [500, 0], arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}"
        src="~/assets/icons/reload.svg"
        alt="Reload"
        content="Refresh Data"
        @click.prevent="$fetch()"
      >
    </h1>
    <div class="buttons">
      <input
        v-model="search"
        type="text"
      >
      <button
        generic
        small
        class="b3"
        @click="add()"
      >
        Add User
      </button>
    </div>
    <div class="list">
      <div
        v-for="user of users.filter(searchFilter)"
        :key="user._id"
        class="user"
      >
        <img
          :src="(user.data && user.data.avatar)
            ? `https://cdn.discordapp.com/avatars/${user.data.id}/${(user.data.avatar)}.png`
            : 'https://cdn.discordapp.com/embed/avatars/0.png'"
          alt="User Avatar"
        >
        <span class="name">
          {{ user.data.username ? (user.display === user.data.username ? user.display : `${user.data.username} (${user.display})`) : user.display }}
          <img
            id="editbutton"
            v-tippy="{delay: [500, 0], arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}"
            src="~/assets/icons/settings.svg"
            alt="Edit"
            content="Edit"
            @click.prevent="editUser(user._id)"
          >
          <img
            id="editbutton"
            v-tippy="{delay: [500, 0], arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}"
            src="~/assets/icons/ext_link.svg"
            alt="Geoloc"
            content="Geoloc"
            @click.prevent="geoloc(user._id)"
          >
        </span>
        <div class="scopes">
          <div
            v-for="scope in user.scope"
            :key="scope"
            class="scope"
            :style="`--color: ${(scope.split('.')[0].split('').reduce((prev, curr) => (prev + curr.charCodeAt(0)), 0) / Math.PI % 1) * 360}`"
            @click="search = scope.startsWith('translate') ? (langs[scope.split('.')[1]] || scope) : scope"
            v-text="scope"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const { data } = await API.adminGetUsers()
    this.users = data.sort((a:any, b:any) => b.scope.length - a.scope.length)
    const list = await API.getLanguageList()
    for (const lang of list.data)
      this.langs[lang._id] = lang.lang_name_en
  },
  data() {
    return {
      users: [],
      langs: {} as any,
      search: ''
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters['user/isAdmin']
    }
  },
  methods: {
    searchFilter(user: any) {
      if (this.search === '') return true
      if (user.display.toLowerCase().includes(this.search.toLowerCase())) return true
      if (user.scope.find((s: string) => s.toLowerCase().includes(this.search.toLowerCase()))) return true
      for (const key in this.langs) {
        if (this.langs[key].toLowerCase().includes(this.search.toLowerCase())) {
          if (user.scope.find((s: string) => s.toLowerCase().includes(`translate.${key}`.toLowerCase())))
            return true
        }
      }
      return false
    },
    async add() {
      const { value } = await Swal.fire({
        title: 'New User',
        html: `
          <label for="swal-input1">User ID</label>
          <input id="swal-input1" class="swal2-input" placeholder="123456789">
          <label for="swal-input2">Display Name</label>
          <input id="swal-input2" class="swal2-input" placeholder="FooBar">
          <label for="swal-input3">Scope</label>
          <input id="swal-input3" class="swal2-input" placeholder="scope1, translate.bruh, idk">
        `,
        preConfirm() {
          return [
            (document.getElementById('swal-input1') as HTMLInputElement).value,
            (document.getElementById('swal-input2') as HTMLInputElement).value,
            (document.getElementById('swal-input3') as HTMLInputElement).value.split(/(?: *, *)|(?: +,? *)|(?: *,? +)/)
          ]
        }
      })

      if (!value) return

      await API.adminPostUsers({
        id: value[0],
        display: value[1],
        scope: value[2]
      })

      this.$fetch()
      this.search = value[1] as string
    },
    async editUser(userid: string) {
      const user = this.users.find((u: any) => u._id === userid) as any
      if (!user) return
      const { value } = await Swal.fire({
        title: `Edit ${user.display}`,
        html: `
          <label for="swal-input1">Display Name</label>
          <input id="swal-input1" class="swal2-input" value="${user.display}">
          <label for="swal-input2">Scope</label>
          <input id="swal-input2" class="swal2-input" value="${user.scope.join(', ')}">
          <label for="swal-input3">Delete? Type "yes" below.</label>
          <input id="swal-input3" class="swal2-input" value="no">
        `,
        preConfirm() {
          return [
            (document.getElementById('swal-input1') as HTMLInputElement).value,
            (document.getElementById('swal-input2') as HTMLInputElement).value.split(/(?: *, *)|(?: +,? *)|(?: *,? +)/),
            (document.getElementById('swal-input3') as HTMLInputElement).value.toLowerCase() === 'yes'
          ]
        }
      })

      if (!value) return

      await API.adminPostUsers({
        id: userid,
        display: value[0],
        scope: value[1],
        delete: value[2]
      })

      this.$fetch()
    },
    geoloc(userid: string) {
      this.$router.push({ path: `/admin/geoloc/${userid}` })
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Users'
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

input {
  border-radius: $content-border-radius;
  background-color: $bg-bright;
  border: none;
  padding: 5pt 8pt;
  font-size: 11pt;
  font-family: $font-regular;
  color: $color-regular;
  margin-top: 10pt;
  margin-right: 5pt;
}

.user {
  background-color: $bg-bright;
  border-radius: $box-border-radius;
  margin-top: $box-padding / 2;
  padding: $box-padding;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "img name" "img scope";
  grid-column-gap: $box-padding;

  & > img {
    grid-area: img;
    width: 42pt;
    height: 42pt;
    border-radius: 999pt;
  }

  .name {
    font-size: 14pt;
    font-family: $font-major;
    color: $color-major;
    grid-area: name;

    img {
      height: 11pt;
      opacity: .4;
      padding: 0;
      margin: 0 0 0 0;
      cursor: pointer;

      &:hover { opacity: .7; }
    }
  }

  .scopes {
    margin-top: 5pt;
    grid-area: scope;

    .scope {
      display: inline-block;
      border-radius: 999pt;
      background-color: hsla(var(--color), 90%, 80%, .2);
      color: hsla(var(--color), 90%, 80%, 1);
      padding: 2pt 8pt;
      margin-top: 4pt;
      margin-right: 4pt;
      font-size: 11pt;
      font-family: $font-major;
      cursor: pointer;
    }
  }
}

.buttons {
  button {
    margin-right: 5pt;
    --bg: #{$bg-darker};
    --color: #{$color-major};

    &.b1 { --bg-hov: #{$bg-bright}; }
    &.b2 { --bg-hov: #{$warning-major}; }
    &.b3 { --bg-hov: #{$info-major}; }
    &.b4 { --bg-hov: #{$success-major}; }
  }
}

</style>
