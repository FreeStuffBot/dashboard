<template>
  <Container>
    <h1>{{ greeting }}, {{ global_name }} 👋</h1>

    <!-- <h2>Your Subscription:</h2>
    <SubBox
      color="#E74D40"
      title="Patreon"
      extName="view on patreon.com"
      extHref="https://patreon.com/maanex"
      :hints="[
        { name: 'Tier', value: 'NAME', details: 'Which Patreon tier you are subscribed to' },
        { name: 'Per Month', value: '5€', details: 'How much you pay per month' },
        { name: 'Renews On', value: '5/1/20', details: 'Next time you get charged is TODO' },
        { name: 'Plus Servers', value: '3', details: 'You can provide TODO guilds with premium features' },
      ]"
    />
    <SubBox
      color="#40BBE7"
      title="Gift Code"
      :hints="[
        { name: 'Valid Until', value: '8/17/20', details: 'This gift code expires on TODO' },
        { name: 'Plus Servers', value: '1', details: 'You can provide TODO guilds with premium features' },
        { },
        { },
      ]"
    /> -->

    <AccountInfoBox
      :dispname="global_name"
      :username="username"
      :subtext="email || 'yo'"
      :imgurl="avatarUrl"
    />

    <h2 v-if="allNotifications.length">Notifications</h2>
    <NotificationsListBox
      v-if="allNotifications.length"
      :notifications="allNotifications"
    />
    
    <h2>What to do</h2>
    <Layout name="3static">
      <Pagelink
        v-if="$store.getters['user/isTranslator']"
        title="Translations"
        text="Welcome back! Click here to drive right into the translations page!"
        icon="emojis/twemoji_speaking_head"
        to="/translate"
      />
      <Pagelink
        v-else        
        title="Translations"
        text="Want to help translating the bot? You've come to the right place!"
        icon="emojis/twemoji_speaking_head"
        to="/translate/apply"
      />
      <Pagelink
        v-if="$store.getters['user/apiAccess']"
        title="FreeStuff API"
        text="View and edit your API app"
        icon="emojis/twemoji_electric_plug"
        to="/apps/home"
      />
      <Pagelink
        v-else
        title="FreeStuff API"
        text="Get access to an API for all things free games"
        icon="emojis/twemoji_electric_plug"
        to="/apps/api-info"
      />
      <Pagelink
        v-if="$store.getters['user/isContentMod']"
        title="Content Moderation"
        text="You know it, we know it. Thank you <3"
        icon="emojis/twemoji_mega"
        to="/content/publishing"
      />
    </Layout>

    <h2>Bottom text</h2>
    <p>
      <a href="https://freestuffbot.xyz/privacy" target="_blank">Privacy Policy</a>
      <a href="https://freestuffbot.xyz/terms" target="_blank">Terms of Service</a>
      <a href="https://freestuffbot.xyz/licenses" target="_blank">Software Licenses</a>
    </p>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import Admonition from '~/components/entities/Admonition.vue'
import AccountInfoBox from '~/components/boxes/AccountInfoBox.vue'
import Pagelink from '../components/entities/Pagelink.vue'
import Layout from '../components/layout/Layout.vue'
import NotificationsListBox from '../components/boxes/NotificationsListBox.vue'

export default Vue.extend({
  components: {
    Container,
    Admonition,
    AccountInfoBox,
    Pagelink,
    Layout,
    NotificationsListBox
},
  transition: 'slide-down',
  data() {
    return {
      ...this.$store.state.user
    }
  },
  computed: {
    greeting() {
      const hour = new Date().getHours()
      if (hour < 5) return 'Hey There'
      if (hour < 11) return 'Good Morning'
      if (hour < 14) return 'Welcome Back'
      if (hour < 18) return 'Good Afternoon'
      if (hour < 21) return 'Good Evening'
      return 'Ayoooo'
    }
  },
  head() {
    return {
      title: 'FreeStuff Management'
    }
  }
})
</script>
