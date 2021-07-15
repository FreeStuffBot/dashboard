<template>
  <nav>
    <div v-for="link of navlinks" :key="link.name" class="el-wrapper">
      <div v-if="link.type == 'header'" class="el-inner header">
        <label v-text="link.name" />
      </div>
      <div v-if="link.type == 'page'" class="el-inner page" :active="isActive(link)">
        <a v-if="link.url.startsWith('http')" :href="link.url" class="link" target="_blank">
          <div class="icon-wrapper">
            <img
              class="i"
              :class="{h:!!link.iconHover}"
              :src="link.icon"
              alt="icon"
              draggable="false"
              :title="link.secret"
            >
            <img
              v-if="link.iconHover"
              class="a"
              :src="link.iconHover"
              alt="icon"
              draggable="false"
              :title="link.secret"
            >
          </div>
          <div class="text-wrapper">
            <span v-text="link.name" />
            <img src="~/assets/icons/ext_link.svg" alt="ext" title="External Link" class="visonhov">
          </div>
        </a>
        <NuxtLink v-else :to="link.url" class="link">
          <div class="icon-wrapper">
            <img
              class="i"
              :class="{h:!!link.iconHover}"
              :src="link.icon"
              alt="icon"
              draggable="false"
              :title="link.secret"
            >
            <img
              v-if="link.iconHover"
              class="a"
              :src="link.iconHover"
              alt="icon"
              draggable="false"
              :title="link.secret"
            >
          </div>
          <div class="text-wrapper">
            <span v-text="link.name" />
          </div>
        </NuxtLink>
      </div>
      <div v-if="link.type == 'add'" class="el-inner add" :active="isActive(link)">
        <NuxtLink to="/server/add" class="link">
          <div class="text-wrapper">
            <span v-text="'+ ' + link.name" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    navlinks() {
      return [
        {
          type: 'header',
          name: 'Welcome!'
        },
        {
          type: 'page',
          name: this.$store.state.user.username,
          secret: 'Nice pfp, bro',
          url: '/me',
          icon: this.$store.state.user.avatarUrl
        },
        {
          type: this.$store.getters['user/isContributor'] ? 'header' : 'none',
          name: 'Contributing'
        },
        {
          type: this.$store.getters['user/isTranslator'] ? 'page' : 'none',
          name: 'Translating',
          secret: 'You are amazing! Thank you to the moon and back <3',
          url: '/translate',
          icon: '/assets/img/peepolang.png'
        },
        // {
        //   type: this.$store.getters['user/isContentMod'] ? 'page' : 'none',
        //   name: 'Documents',
        //   secret: 'All sorts of documents and stuff ya know.',
        //   url: '/documents',
        //   icon: '/assets/img/peepodetective.png'
        // },
        {
          type: this.$store.getters['user/isContentMod'] ? 'page' : 'none',
          name: 'Content Moderation',
          secret: 'Thank you <3',
          url: '/content',
          icon: '/assets/img/peepolove.png'
        },
        {
          type: this.$store.getters['user/isContributor'] ? 'page' : 'none',
          name: 'Stats',
          secret: 'Stonks',
          url: '/stats',
          icon: '/assets/img/peepograph.png'
        },
        {
          type: 'header',
          name: 'FreeStuff API'
        },
        {
          type: this.$store.getters['user/apiAccess'] ? 'page' : 'none',
          name: 'Your application',
          secret: 'Manage your api project',
          url: '/application/home',
          icon: '/assets/img/peepobusiness.png'
        },
        {
          type: this.$store.getters['user/apiAccess'] ? 'none' : 'page',
          name: 'Get Access',
          secret: 'A FreeStuff API key is a very good investment!',
          url: '/api-info',
          icon: '/assets/img/peepobusiness.png'
        },
        {
          type: 'page',
          name: 'Documentation',
          secret: 'How to use the api',
          url: 'https://docs.freestuffbot.xyz/',
          icon: '/assets/img/peepostudy.png'
        },
        {
          type: this.$store.getters['user/isAdmin'] ? 'header' : 'none',
          name: 'Administration'
        },
        {
          type: this.$store.getters['user/isAdmin'] ? 'page' : 'none',
          name: 'Admin Panel',
          secret: 'Business Time',
          url: '/admin/panel',
          icon: '/assets/img/peepocool.png'
        }
        // {
        //   type: this.$store.getters['user/isAdmin'] ? 'page' : 'none',
        //   name: 'Users',
        //   secret: 'Hehe',
        //   url: '/admin/users',
        //   icon: '/assets/img/peepoking.png'
        // },
        // {
        //   type: this.$store.getters['user/apiAccess'] ? 'page' : 'none',
        //   name: 'Usage',
        //   secret: 'Your api usage',
        //   url: '/application/stats',
        //   icon: '/assets/img/peepobusiness.png'
        // },
        // {
        //   type: 'header',
        //   name: 'Your servers'
        // },
        // ...this.$store.state.user.guilds
        //   ? this.$store.state.user.guilds
        //     .filter((g: any) => g.freestuff)
        //     .sort((a: any, b: any) => {
        //       let out = 0;
        //       if (a.freestuff.premium) out++;
        //       if (b.freestuff.premium) out--;
        //       // if (a.freestuff.premium.by == this.$store.state.user.id) out++;
        //       // if (b.freestuff.premium.by == this.$store.state.user.id) out--;
        //       return out;
        //     })
        //     .map((g: any) => { return {
        //       type: 'page',
        //       name: g.name,
        //       url: `/server/${g.id}`,
        //       icon: g.image,
        //       iconHover: g.imageHover
        //     }})
        //   : [],
        // {
        //   type: 'add',
        //   name: 'Add Server'
        // }
      ]
    }
  },
  methods: {
    isActive(element: any) {
      if (element.type !== 'page') return false
      return true
    }
  }
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

nav {
  display: block;

  a {
    text-decoration: none;
  }
}

.el-wrapper {
  display: block;
  margin-bottom: 4pt;
}

.el-inner {
  display: block;

  &.header {
    margin: 32pt 0 0 0;

    label {
      text-transform: uppercase;
      color: $color-sub;
      font-family: $font-major;
      font-size: 12pt;
    }
  }

  &.page, &.add {
    .link {
      $element-padding: 10pt;

      position: relative;
      display: block;
      border-radius: $box-border-radius;
      padding: $element-padding;
      display: flex;
      align-items: center;
      background-color: #00000033;
      transition: background-color .1s ease-out;

      &:hover {
        background-color: #00000099;

        img.a { visibility: visible !important; }
        img.h { visibility: hidden; }
        .visonhov { opacity: var(--opacity, 1); }
      }

      &[class*="active"] {
        background-color: #000000;
        span { color: $color-major !important; }

        img.a { visibility: visible !important; }
        img.h { visibility: hidden; }
      }

      .visonhov {
        opacity: 0;
        transition: opacity .1s ease;
      }

      .icon-wrapper {
        flex-shrink: 0;
        width: 28pt;
        height: 28pt;
        border-radius: 99pt;
        overflow: hidden;
        margin-right: $element-padding;
        position: relative;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          user-select: none;

          &.a { visibility: hidden; }
        }
      }

      .text-wrapper {
        flex-grow: 0;
        width: calc(100% - 38pt);
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        span {
          color: $color-sub;
          font-family: $font-regular;
          text-decoration: none;
          font-size: 14pt;
          display: inline-block;
          flex-grow: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color .1s ease-out;
        }

        img {
          --opacity: .3;
          height: .6em;
          width: .6em;
          padding-left: .4em;
          transform: translateY(-30%);
        }
      }
    }
  }

  &.add {
    .text-wrapper {
      height: 28pt;
      width: 100% !important;
      display: flex;
      align-items: center;

      span {
        width: 100%;
        text-align: center;
        font-size: 10pt !important;
        color: $color-minor !important;
      }
    }

    .link:hover span { color: $color-regular !important; }
  }
}

</style>
