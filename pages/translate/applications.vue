<template>
  <Container>
    <h1>Translation Applications</h1>
    <Admonition
      v-if="error"
      type="error"
      :text="error"
    />
    
    <h2>Pending</h2>
    <p v-if="!applications">Loading...</p>
    <p v-else-if="!applications.length">None left! 🎉</p>
    <Layout v-else name="flow">
      <div
        v-for="app of applications"
        :key="app.id"
        class="card"
      >
        <div class="header">
          <img :src="app.user.icon" alt="">
          <p v-text="app.user.name" />
          <Layout name="inline" class="buttons">
            <Button
              text="Accept"
              type="green"
              @click="accept(app)"
            />
            <Button
              text="Decline"
              type="red"
              @click="decline(app)"
            />
            <Button
              text="X"
              type="light"
              @click="dismiss(app)"
            />
          </Layout>
        </div>
        <div>
          <label>Language</label>
          <p v-text="`${lang['lang_' + app.language]} (${app.language})`" />
        </div>
        <div>
          <label>How did you end here</label>
          <p v-text="app.whereFrom" />
        </div>
        <div>
          <label>Using FreeStuff since</label>
          <p v-text="app.userSince" />
        </div>
        <div>
          <label>Discord Account Age</label>
          <p v-text="getAccountAge(app)" />
        </div>
        <div>
          <label>Why you</label>
          <p v-text="app.whyThem" />
        </div>
        <div>
          <label>Discord User Id</label>
          <p v-text="app.id" />
        </div>
      </div>
    </Layout>
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
import { openInfoDialogue, openQuestionDialogue } from '../../lib/popups'

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
    const res = await API.getTranslateApplications({})
    if (res.status === 200)
      this.applications = res.data
    else
      this.error = res.status
  },
  data() {
    return {
      lang: this.$store.state.lang,
      error: '',
      applications: null
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
    },
    getAccountAge(app: any): string {
      try {
        return new Date(Number(BigInt(app.id) >> 22n) + 1420070400000).toLocaleDateString()
      } catch (ex) {
        return 'unknown'
      }
    },
    async accept(app: any) {
      await API.patchTranslateApplication(app.id, { action: 'accept' })
      this.$fetch()
    },
    async decline(app: any) {
      const reason = await openQuestionDialogue(
        this.$store,
        `Decline ${app.user.name}?`,
        'They will not be able to apply again.',
        'Decline reason (optional)',
        'You stinky, sorry :/'
      )
      if (reason === null) return
      await API.patchTranslateApplication(app.id, { action: 'decline', reason })
      this.$fetch()
    },
    async dismiss(app: any) {
      await API.patchTranslateApplication(app.id, { action: 'dismiss' })
      this.$fetch()
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

<style scoped lang="scss">
.card {
  @include box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $box-padding;

  .header {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    align-items: center;
    gap: $content-padding;
    grid-area: auto / span 2;

    p {
      font-size: 14pt;
      color: $color-header;
      font-family: $font-header;
      flex-grow: 1;
    }

    img {
      width: $content-height;
      height: $content-height;
      border-radius: 999pt;
    }

    .buttons {
      width: fit-content;
    }
  }

  label {
    margin: 0;
  }

  p {
    margin: 0;
    color: $color-major;
  }
}
</style>
