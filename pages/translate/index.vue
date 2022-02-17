<template>
  <Container :class="{ 'loading-animation-queued': !loadingFinished }">
    <h1>Translating</h1>

    <Layout name="inline">
      <Button text="Tutorial" icon="info" type="light" @click="howto()" />
      <Button text="Credits" icon="crown" type="light" @click="credits()" />
      <Button text="Keyboard Shortcuts" icon="keyboard" type="light" @click="keyboardShortcuts()" />
      <Button text="Add Language" icon="admin" type="green" @click="addLanguage()" />
    </Layout>

    <h2>Languages:</h2>
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
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'
import LanguageCard from '~/components/LanguageCard.vue'

const popups = {
  howto: {
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
    Button,
    LanguageCard
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
      .filter((e: any) => e._index >= 0)
      .sort((a: any, b: any) => ((a._index + 1) * (a._editable ? 1 : 100)) - (b._index + 1) * (b._editable ? 1 : 100))

    // eslint-disable-next-line nuxt/no-timing-in-fetch-data
    setTimeout(() => (this.loadingFinished = true), 10)
  },
  data() {
    return {
      lang: this.$store.state.lang,
      list: [] as any[],
      maxProgress: 0,
      loadingFinished: false
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters['user/isAdmin']
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
    async addLanguage() {
      const { value } = await Swal.fire({
        title: 'Insert Language',
        html: `
          <label for="swal-input1">Lang Code</label>
          <input id="swal-input1" class="swal2-input" placeholder="en-US">
          <label for="swal-input2">English Name</label>
          <input id="swal-input2" class="swal2-input" value="">
        `,
        preConfirm() {
          return [
            (document.getElementById('swal-input1') as HTMLInputElement).value,
            (document.getElementById('swal-input2') as HTMLInputElement).value
          ]
        }
      })
      if (!value) return

      const { data } = await API.putLanguage(value[0], { name: value[1] })
      this.$fetch()
      Swal.fire({ text: data })
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
