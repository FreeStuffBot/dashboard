<template>
  <Container>
    <h1>{{ greeting }}, {{ username }} 👋</h1>

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

    <Admonition
      type="info"
      text="This dashboard is still in development. Please report any bugs over on our Discord Server."
    />

    <h2>Your Account</h2>
    <AccountInfoBox
      :username="username"
      :discrim="`#${discriminator}`"
      :subtext="email || 'yo'"
      :imgurl="avatarUrl"
    />

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
import AccountInfoBox from '~/components/boxes/AccountInfoBox.vue'

export default Vue.extend({
  components: {
    Container,
    AccountInfoBox
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
