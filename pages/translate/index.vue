<template>
  <Container :class="{ 'loading-animation-queued': !loadingFinished }">
    <h1>Translating</h1>

    <Layout name="flow">
      <Layout name="inline">
        <Button text="Tutorial" icon="info" type="light" @click="howto()" />
        <Button text="Credits" icon="crown" type="light" @click="credits()" />
        <Button text="Keyboard Shortcuts" icon="keyboard" type="light" @click="keyboardShortcuts()" />
        <Button v-if="isAdmin" text="Add Line" icon="admin" type="green" @click="addline()" />
      </Layout>
      <Admonition
        v-if="adminAddLineInfo !== null"
        :type="adminAddLineInfo ? 'error' : 'success'"
        :text="adminAddLineInfo || 'Successfully added one line!'"
      />
      <Admonition
        type="info"
        text="Keyboard shortcuts are currently disabled. We are working on bringing them back asap!"
      />
    </Layout>

    <div v-if="isAdmin && pendingApplicationsCount">
      <h2>Applications</h2>
      <Pagelink
        :title="pendingApplicationsCount === 1 ? '1 Application' : `${pendingApplicationsCount} Applications`"
        text="Click here to review"
        icon="emojis/twemoji_news"
        to="/translate/applications"
      />
    </div>

    <h2 v-if="isAdmin">All Languages</h2>
    <h2 v-else>Your Languages</h2>
    <div class="langlist">
      <LanguageCard
        v-for="(e, i) of list"
        :key="e._id"
        :lang="e"
        :ia-margin="i"
        :max-progress="maxProgress"
      />
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'
import { openFormDialogue, Popup, PopupType } from '../../lib/popups'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'
import Admonition from '~/components/entities/Admonition.vue'
import LanguageCard from '~/components/cards/LanguageCard.vue'
import Pagelink from '../../components/entities/Pagelink.vue'

const popups: Record<string, Popup<PopupType.MODAL>> = {
  howto: {
    type: PopupType.MODAL,
    title: 'Hello, welcome to the translation page!',
    text: `
Once you're done reading all of this, you can close this popup to see a list of languages. Most of those are probably grayed out and only one (or sometimes more) are brighter and on the very top of the list. These are the languages you are able to translate.
Click it and you'll get to the translation page. Everything should be self-explainatory, but in case it isn't, you can always hover each button for a bit to see what it does or of course ask for help in our discord.
Here are some things to take care of:
**{something}** marks a variable. Don't translate the content within the brackets. This will get replaced by the bot with it's corresponding value. You may only use variables that the english version already had. If you want to use a new variable, feel free to ask!
**[foo](bar)** is a link that you can click on. "Foo" is the text, the second one is the url where the link goes to
When translating, you don't have to translate everything word by word. As long as the message has the same amount of actually useful information to it, everything is fine. Get creative! Don't be too formal, we're here for fun. The target audience are gamers who are usually aware of memes so yeah, just do what you think is appropriate ;)
With the keys I'd like to mention that when they end with _desc, they are a commands description that shows up on the help command, _1 is the first line in the response, keep this one short, _2 is the long answer, you can type more text here.
    `,
    buttons: [
      {
        type: 'green',
        text: 'Close',
        onClick: () => true
      }
    ]
  },
  credits: {
    type: PopupType.MODAL,
    title: 'You do hard work, we say thank you.',
    text: `
But not only that, you'll get yourself a nice place on the team page on our website (https://freestuffbot.xyz/team)
To get your name there, please send the following information in the translators discord channel:
- Your name
- A url of your choice. This can be social media, a stupid meme or literally everything else as long as it's sfw.
- An image. Please make sure you have the rights to use the image. If you want to use your discord pfp, please send this in the channel as an image too, makes things a lot easier, thanks. Oh and the image has to be quadratic or else...
- A color for the button that leads to your website/url. Either just something like "blue" or "desaturated yellow", or a full out hex code if you know what that is. But please make sure it's not too contrasty. You may even have a subtle gradient. But seriously only subtle, nothing super eye-catching.
        `,
    buttons: [
      {
        type: 'green',
        text: 'Close',
        onClick: () => true
      }
    ]
  },
  shortcuts: {
    type: PopupType.MODAL,
    title: 'More faster want now.',
    text: `
Yes, that headline completely incorrect on purpose, thanks for letting me know.
If you have the same energy though and want to be super duper quick as f*ck, here are some keyboard shortcuts for you to master this translation website.

While editing a translation:
**Ctrl+Enter** moves you forward to the next line.
**Ctrl+Shift+Enter** moves you backward to the last line.
**Ctrl+S** saves your progress. Press enter when the popup appears so you don't have to use your mouse.
**Ctrl+D** moves forward to the next line to review.
**Ctrl+Z** undo.
**Ctrl+B** clears your translation.
**Ctrl+Q** copies the english text into your translation.
        `,
    buttons: [
      {
        type: 'green',
        text: 'Close',
        onClick: () => true
      }
    ]
  }
}

export default Vue.extend({
  components: {
    Container,
    Layout,
    Input,
    Button,
    LanguageCard,
    Admonition,
    Pagelink
},
  transition: 'slide-down',
  async fetch() {
    const editable = this.$store.getters['user/languagesInTranslationScope']
    const info = await API.getLanguageList()
    this.list = info.data
      .map((e: any) => {
        if (e._index === 0) this.maxProgress = e._meta_progress

        const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
        e._display_text = `${upper(e.lang_name_en)} (${e._id})`
        e._editable = editable.includes('*') || editable.includes(e._id)

        if (e._index === -1) {
          e._display_text = '[Metadata] lang descriptions'
          e.lang_name_en = '[Metadata] lang descriptions'
          e.lang_name = '[Metadata] lang descriptions'
        }
        return e
      })
      .filter((e: any) => this.isAdmin || e._index >= 0)
      .filter((e: any) => this.isAdmin || e._editable)
      .sort((a: any, b: any) => ((a._index + 1) * (a._editable ? 1 : 100)) - (b._index + 1) * (b._editable ? 1 : 100))

    if (this.isAdmin) {
      const { data, status } = await API.getTranslateApplications({ countOnly: true })
      if (status === 200)
        this.pendingApplicationsCount = data.count
    }

    // eslint-disable-next-line nuxt/no-timing-in-fetch-data
    setTimeout(() => (this.loadingFinished = true), 10)
  },
  data() {
    return {
      lang: this.$store.state.lang,
      pendingApplicationsCount: 0,
      list: [] as any[],
      maxProgress: 0,
      loadingFinished: false,
      adminAddLineInfo: null
    }
  },
  computed: {
    isAdmin(): boolean {
      return this.$store.getters['user/isAdmin']
    },
    isTranslator(): boolean {
      return this.$store.getters['user/isTranslator']
    }
  },
  methods: {
    howto() {
      this.$store.commit('openPopup', popups.howto)
    },
    credits() {
      this.$store.commit('openPopup', popups.credits)
    },
    keyboardShortcuts() {
      this.$store.commit('openPopup', popups.shortcuts)
    },
    async addline() {
      const data = await openFormDialogue(this.$store, {
        title: 'Add line',
        inputs: [
          { id: 'key', type: 'text', label: 'key', placeholder: 'line_key_format' },
          { id: 'english', type: 'text', label: 'English Translation', placeholder: 'This is cool' },
          { id: 'description', type: 'text', label: 'Description (optional)', placeholder: 'It is not!' }
        ]
      })
      if (!data?.key) return
      
      const { data: resData, status, statusText } = await API.postLanguageLine(data)
      if (status === 200) this.adminAddLineInfo = false
      else this.adminAddLineInfo = `http ${status} (${statusText}): ${JSON.stringify(resData)}`
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

<style lang="scss" scoped>
.langlist {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: $content-padding;
}
</style>
