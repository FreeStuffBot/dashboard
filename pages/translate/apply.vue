<template>
  <Container>
    <h1>Translating FreeStuff</h1>
    <p>Hey you! Are you interested in translating FreeStuff into your native language? Please apply below and we'll get back to you in no time!</p>
    <p>Your native language is not shown? Contact us and we'll be happy to add it. Please note that we are currently only hosting languages that Discord itself supports.</p>

    <Admonition
      text="Please make sure to join our Discord server prior to applying. We use this space for communication between translators and the team. If you are not part of our Discord server your application will be denied. https://freestuffbot.xyz/discord"
      type="info"
    />
    
    <h2>Your Application</h2>
    <div v-if="applied === null">
      <p>Loading...</p>
    </div>
    <div v-else-if="applied === true">
      <p v-if="!applicationDeclined">Your application was received but we did not have time to review it yet, please check back later!</p>
      <Admonition
        v-else
        :text="`Your application was declined for the following reason: ${applicationDeclined}`"
        type="error"
      />
    </div>
    <div v-else>
      <Layout name="flow">
        <Pick
          label="Your Native Language"
          :options="languageSelection"
          v-model="appLanguage"
        />
        <Input
          label="For how long are you using FreeStuff?"
          placeholder="3 Months"
          v-model="appUsedFor"
        />
        <Input
          label="Why do you want to help translating?"
          placeholder="Don't waste too much time with this question :)"
          v-model="appWhyMe"
        />
        <Input
          label="How did you find out about this?"
          placeholder="A friend told me / I found it on your website / etc"
          v-model="appSource"
        />
        <Layout name="inline">
          <Button
            text="Apply"
            type="green"
            :disabled="!canApply"
            @click="apply()"
          />
          <Button
            v-if="!canApply"
            text="Fill out the form above"
            type="red"
            :lite="true"
            :disabled="true"
          />
        </Layout>
      </Layout>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'
import Admonition from '~/components/entities/Admonition.vue'
import LanguageCard from '~/components/cards/LanguageCard.vue'
import InputEnum from '../../components/entities/InputEnum.vue'
import Pick from '../../components/entities/Pick.vue'
import API from '../../lib/api'
import { openInfoDialogue } from '../../lib/popups'

export default Vue.extend({
  components: {
    Container,
    Layout,
    Input,
    Button,
    LanguageCard,
    Admonition,
    InputEnum,
    Pick
},
  transition: 'slide-down',
  async fetch() {
    const [ langsRes, appRes ] = await Promise.all([
      API.getLanguagesPreview(),
      API.getTranslateApplicationStatus()
    ])

    if (langsRes.status === 200) {
      this.languages = langsRes.data
      this.languageSelection = langsRes.data.map(l => ({ value: l._id, label: l.lang_name }))
    }

    if (appRes.status === 404) {
      this.applied = false
    } else {
      this.applied = true
      if (appRes.status !== 200)
        this.applicationDeclined = appRes.data.message
    }
  },
  data() {
    return {
      applied: null,
      applicationDeclined: '',
      languages: [],
      languageSelection: [],
      appLanguage: '',
      appUsedFor: '',
      appWhyMe: '',
      appSource: '',
    }
  },
  methods: {
    async apply() {
      if (!this.canApply) return
      if (this.appLanguage.startsWith('en'))
        return openInfoDialogue(this.$store, 'Hey there!', 'Thanks for your interest in translating FreeStuff, unfortunately we are only accepting native speakers as of right now. We will let you know once this changes!\nPlease do not re-apply pretending to be a native speaker in a different language.')

      const { status } = await API.postTranslateApplication({
        language: this.appLanguage,
        userSince: this.appUsedFor,
        whyThem: this.appWhyMe,
        whereFrom: this.appSource
      })

      if (status === 200) {
        openInfoDialogue(this.$store, 'Awesome!', 'Thanks for your application! We\'ll check it out and get back to you soon!\nPlease do not ask team members about the status of your application, this does not speed anything up.')
        this.applied = true
        return
      }
    }
  },
  computed: {
    canApply(): boolean {
      return this.appLanguage && this.appUsedFor && this.appWhyMe && this.appSource
    }
  },
  head() {
    return {
      title: 'FreeStuff Translating'
    }
  },
  fetchOnServer: false
})
</script>
