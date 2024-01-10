<template>
  <Container>
    <h1>Users</h1>

    <Layout v-if="users" name="flow">
      <Admonition v-if="error" type="error" :text="error" />

      <Layout name="31">
        <Input v-model="search" type="text" placeholder="Search" />
        <Button type="green" text="Add User" @click="add()" />
      </Layout>

      <div class="list">
        <div
          v-for="user of users.filter(searchFilter)"
          :key="user._id"
          class="user"
          @click.self="clickUser(user)"
        >
          <img :src="user.avatar" alt="User Avatar" >
          <span class="name">{{user.name}}</span>
          <div class="scopes">
            <span
              v-for="scope of user.scope"
              :key="scope"
              :style="`--color: ${(scope.split('.')[0].split('').reduce((prev, curr) => (prev + curr.charCodeAt(0)), 0) / Math.PI % 1) * 360}`"
              @click="search = scope.startsWith('translate') ? (langs[scope.split('.')[1]] || scope) : scope"
              v-text="scope"
            />
          </div>
        </div>
      </div>
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'
import { openFormDialogue } from '../../lib/popups'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Admonition from '~/components/entities/Admonition.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Container,
    Layout,
    Admonition,
    Input,
    Button
},
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
      search: '',
      error: ''
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
      if (user.name.toLowerCase().includes(this.search.toLowerCase())) return true
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
    async clickUser(user: any) {
      if (!user) return

      const data = await openFormDialogue(this.$store, {
        title: `Edit ${user.name}`,
        inputs: [
          {
            id: 'display',
            label: 'Display Name',
            type: 'text',
            initial: user.display
          },
          {
            id: 'scope',
            label: 'Scope (comma seperated)',
            type: 'text',
            initial: user.scope.join(', ')
          }
        ]
      })

      if (!data) return

      await API.adminPatchUser(user.id, {
        display: data.data || undefined,
        scope: data.scope ? data.scope.split(',').map(s => s.trim()) : undefined
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
.list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: $box-padding;
}

.user {
  @include box;
  display: flex;
  flex-direction: column;
  gap: $content-padding;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: $bg-lighter;
  }

  img {
    width: 32pt;
    height: 32pt;
    border-radius: 99pt;
    background-color: $bg-lighter;
    overflow: hidden;
    pointer-events: none;
  }

  .name {
    color: $color-major;
    font-family: $font-major;
    font-size: 11pt;
    text-align: center;
    width: 140pt;
    overflow: hidden;
    word-break: break-all;
    pointer-events: none;
  }

  .scopes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3pt;

    span {
      font-size: 8pt;
      text-transform: uppercase;
      border-radius: 999pt;
      background-color: hsla(var(--color), 90%, 80%, .2);
      color: hsla(var(--color), 90%, 80%, 1);
      padding: 3pt 8pt;
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

    &.b1 { --bg-hov: #{$bg-light}; }
    &.b2 { --bg-hov: #{$warning-major}; }
    &.b3 { --bg-hov: #{$info-major}; }
    &.b4 { --bg-hov: #{$success-major}; }
  }
}

@media screen and (max-width: $res-mobile-width) {
  .list {
    grid-template-columns: 1fr;
  }  
}
</style>
