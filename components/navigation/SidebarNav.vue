<template>
  <nav>
    <div v-for="link of navlinks" :key="link.name" class="wrapper">
      <div v-if="link.type == 'header'" class="inner header">
        <label v-text="link.name" />
      </div>

      <div v-if="link.type == 'page'" class="inner page" :active="isActive(link)">
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
          </div>
          <div class="text-wrapper">
            <span v-text="link.name" />
            <img src="~/assets/icons/ext_link.svg" alt="ext" title="External Link">
          </div>
        </a>
        <NuxtLink v-else :to="link.url" class="link" :subpages="link.url !== '/'">
          <div class="icon-wrapper">
            <img
              class="i"
              :src="link.icon"
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
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      navlinks: [
        {
          type: 'header',
          name: 'Welcome!'
        },
        {
          type: 'page',
          name: this.$store.state.user.username,
          secret: 'Nice pfp, bro',
          url: '/',
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
          name: 'Your Application',
          secret: 'Manage your api project',
          url: '/apps/home',
          icon: '/assets/img/peepobusiness.png'
        },
        {
          type: this.$store.getters['user/apiAccess'] ? 'none' : 'page',
          name: 'Get Access',
          secret: 'A FreeStuff API key is a very good investment!',
          url: '/apps/api-info',
          icon: '/assets/img/peepobusiness.png'
        },
        // {
        //   type: this.$store.getters['user/apiAccess'] ? 'page' : 'none',
        //   name: 'Payment',
        //   secret: 'Money time. Big cash.',
        //   url: '/apps/payment',
        //   icon: '/assets/img/peepocard.png'
        // },
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
          url: '/admin',
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
nav {
  display: block;
}

a {
  text-decoration: none;
}

.wrapper {
  display: block;
  margin-bottom: 0pt;
}

.inner {
  display: block;

  &.header {
    margin: 32pt 0 8pt 0;

    label {
      text-transform: uppercase;
      color: $color-minor;
      font-family: $font-major;
      font-size: 10pt;
      padding: 0 0 0 $content-padding;

      @media screen and (max-width: $res-sidebar-collapse-width) {
        display: none;
      }
    }
  }

  &.page, &.add {
    .link {
      position: relative;
      border-radius: $content-br;
      padding: $content-padding;
      display: flex;
      gap: $content-padding;
      align-items: center;
      transform: scale(1);
      transition: transform .1s ease-out;

      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: $bg-light;
        border-radius: $content-br;
        background-color: #00000000;
        transform: translateX(-$content-padding) scale(0.8);
        transition:
          background-color .1s ease-out,
          transform .1s ease-out;
      }

      &:not(.nuxt-link-exact-active):not([subpages].nuxt-link-active):hover::before {
        transform: translateX(-$content-padding) scale(1);
        background-color: $bg-light;
      }

      &.nuxt-link-exact-active, &[subpages].nuxt-link-active {
        background-color: $bg-lighter;
        span { color: $color-major !important; }

        img.a { visibility: visible !important; }
        img.h { visibility: hidden; }

        &::after { transition: none; }
      }

      &:active {
        transform: scale(0.97);
        transition: transform .02s ease-out;
      }

      .icon-wrapper {
        flex-shrink: 0;
        width: 27px;
        height: 27px;
        border-radius: 99pt;
        overflow: hidden;
        position: relative;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          user-select: none;
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
          font-family: $font-major;
          text-decoration: none;
          font-size: 12pt;
          display: inline-block;
          flex-grow: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color .1s ease-out;

          @media screen and (max-width: $res-tablet-width) {
            font-size: 10pt;
            height: $box-padding / 2;
          }

          @media screen and (max-width: $res-sidebar-collapse-width) {
            display: none;
          }
        }

        img {
          opacity: .2;
          height: .6em;
          width: .6em;
          padding-left: .4em;
          transform: translateY(-30%);
        }
      }
    }
  }
}

</style>
