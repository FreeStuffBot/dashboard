<template>
  <div class="container">
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

    <h2>Please notice:</h2>
    <span>This dashboard is still in development. Please report any bugs over on our Discord <p v-tippy style="display: inline;" content="Oh shit that's a typo">Sewer!</p></span>

    <h2>Your Account:</h2>
    <AccountInfoBox
      :username="username"
      :discrim="`#${discriminator}`"
      :subtext="email || 'yo'"
      :imgurl="avatarUrl"
    />

    <h2>Bottom text:</h2>
    <a class="pretty" href="https://freestuffbot.xyz/privacy" target="_blank">Privacy Policy</a>
    <a class="pretty" href="https://freestuffbot.xyz/terms" target="_blank">Terms of Service</a>
    <a class="pretty" href="" @click.prevent="openAcknowledgements()">Acknowledgements</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import AccountInfoBox from '~/components/AccountInfoBox.vue'

export default Vue.extend({
  components: {
    AccountInfoBox
  },
  transition: 'slide-down',
  data() {
    return {
      ...this.$store.state.user
    }
  },
  head() {
    return {
      title: 'FreeStuff Management'
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
  methods: {
    openAcknowledgements() {
      Swal.fire({
        title: 'Acknowledgements',
        html: `Made possible thanks to the following libraries and services:
        
<a target="_blank" href="https://vuejs.org/">Vue.JS</a>
<a target="_blank" href="https://nuxtjs.org/">Nuxt.JS</a>
<a target="_blank" href="https://www.typescriptlang.org/">TypeScript</a>
<a target="_blank" href="https://github.com/axios/axios">Axios</a>
<a target="_blank" href="https://github.com/chalk/chalk">Chalk</a>
<a target="_blank" href="https://www.chartjs.org/">Chart.js</a>
<a target="_blank" href="https://expressjs.com/">Express</a>
<a target="_blank" href="https://helmetjs.github.io/">Helmet</a>
<a target="_blank" href="https://github.com/expressjs/morgan">Morgan</a>
<a target="_blank" href="https://www.mongodb.com/">MongoDB</a>
<a target="_blank" href="https://pptr.dev/">Puppeteer</a>
<a target="_blank" href="https://sweetalert2.github.io/">SweetAlert2</a>
<a target="_blank" href="https://kabbouchi.github.io/vue-tippy/">Vue-Tippy</a>
<a target="_blank" href="https://fontawesome.com/license">FontAwesome</a>`.split('\n').join('<br>'),
        confirmButtonText: 'Close'
      })
    }
  }
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;

  &[minor] { color: #888888; }
}

</style>
