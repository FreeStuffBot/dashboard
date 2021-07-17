<template>
  <div :class="{ container: true, 'loading-animation-queued': !loadingFinished }">
    <h1>Translating</h1>
    <div class="actions">
      <button generic small @click="howto()">
        Tutorial
      </button>
      <button generic small @click="credits()">
        Credits
      </button>
      <button generic small @click="keyboardShortcuts()">
        Keyboard Shortcuts
      </button>
      <div v-if="isAdmin" style="display: inline;">
        <div class="divider">
          &bull;
        </div>
        <button generic small @click="addLanguage()">
          Add Language
        </button>
      </div>
    </div>
    <h2>Languages:</h2>
    <NuxtLink
      v-for="(e, i) of list"
      :key="e._id"
      class="box"
      :editable="e._editable"
      :to="e._editable ? `/translate/${e._id}` : ''"
      :ia-margin="i"
    >
      <div>
        <span class="title" v-text="e._display_text + (e._enabled ? '' : ' •')" />
        <span class="desc" v-text="(lang[e._meta_last_editor] || 'Unknown') + ' • ' + (new Date(parseInt(e._meta_last_edit, 10)).toLocaleString())" />
      </div>
      <div>
        <div class="progress">
          <div class="inner lang-box-progess-inner" :class="{done: e._meta_progress >= maxProgress}" :style="`--progress: ${e._meta_progress / maxProgress * 100}%`" />
        </div>
        <span class="desc center">Progress: {{ e._meta_progress }} / {{ maxProgress }} &bull; {{ e._ranking > 0 ? `${e._ranking} guilds` : 'unreleased' }}</span>
      </div>
      <div>
        <div class="users">
          <UserIcons
            v-if="e._meta_responsible"
            :users="e._meta_responsible"
            :max="4"
          />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'
import UserIcons from '~/components/UserIcons.vue'

export default Vue.extend({
  components: {
    UserIcons
  },
  transition: 'slide-down',
  async fetch() {
    const editable = this.$store.getters['user/languagesInTranslationScope']
    const info = await API.getLanguageList()
    this.list = info.data
    this.list.map((e) => {
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
    this.list = this.list.filter(e => e._index >= 0 || e._editable)
    this.list.sort((a, b) => ((a._index + 1) * (a._editable ? 1 : 100)) - (b._index + 1) * (b._editable ? 1 : 100))

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
      Swal.fire({
        title: 'Hello, welcome to the translation page!',
        html: `
          <span>Once you're done reading all of this, you can close this popup to see a list of languages. Most of those are probably grayed out and only one (or sometimes more) are brighter and on the very top of the list. These are the languages you are able to translate.</span>
          <span>Click it and you'll get to the translation page. Everything should be self-explainatory, but in case it isn't, you can always hover each button for a bit to see what it does or of course ask for help in our discord.</span>
          <span>Here are some things to take care of:</span>
          <span><code>\\n</code> marks a line break</span>
          <span><code>{something}</code> marks a variable. Don't translate the content within the brackets. This will get replaced by the bot with it's corresponding value. You may only use variables that the english version already had. If you want to use a new variable, feel free to ask!</span>
          <span><code>[foo](bar)</code> is a link that you can click on. "Foo" is the text, the second one is the url where the link goes to</span>
          <span>When translating, you don't have to translate everything word by word. As long as the message has the same amount of actually useful information to it, everything is fine. Get creative! Don't be too formal, we're here for fun. The target audience are gamers who are usually aware of memes so yeah, just do what you think is appropriate ;)</span>
          <span>With the keys I'd like to mention that when they end with _desc, they are a commands description that shows up on the help command, _1 is the first line in the response, keep this one short, _2 is the long answer, you can type more text here.</span>
        `
      })
    },
    credits() {
      Swal.fire({
        title: 'You do hard work, we say thank you.',
        html: `
          <span>But not only that, you'll get yourself a nice place on the team page on our website <a href="https://freestuffbot.xyz/team">freestuffbot.xyz/team</a></span>
          <span>To get your name there, please send the following information in the translators discord channel:</span>
          <span>- Your name</span>
          <span>- A url of your choice. This can be social media, a stupid meme or literally everything else as long as it's sfw.</span>
          <span>- An image. Please make sure you have the rights to use the image. If you want to use your discord pfp, please send this in the channel as an image too, makes things a lot easier, thanks. Oh and the image has to be quadratic or else...</span>
          <span>- A color for the button that leads to your website/url. Either just something like "blue" or "desaturated yellow", or a full out hex code if you know what that is. But please make sure it's not too contrasty. You may even have a subtle gradient. But seriously only subtle, nothing super eye-catching.</span>
        `
      })
    },
    keyboardShortcuts() {
      Swal.fire({
        title: 'More faster want now.',
        html: `
          <span>Yes, that headline completely incorrect on purpose, thanks for letting me know.</span>
          <span>If you have the same energy though and want to be super duper quick as f*ck, here are some keyboard shortcuts for you to master this translation website.</span>
          <span><b>While editing a translation:</b></span>
          <span><code>Ctrl+Enter</code> moves you forward to the next line.</span>
          <span><code>Ctrl+Shift+Enter</code> moves you backward to the last line.</span>
          <span><code>Ctrl+S</code> saves your progress. Press enter when the popup appears so you don't have to use your mouse.</span>
          <span><code>Ctrl+D</code> moves forward to the next line to review.</span>
          <span><code>Ctrl+Z</code> undo.</span>
          <span><code>Ctrl+B</code> clears your translation.</span>
          <span><code>Ctrl+Q</code> copies the english text into your translation.</span>
        `
      })
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

      const { data } = await API.putLanguage(value[0], {
        name: value[1]
      })

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

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &.title {
    color: $color-major;
    font-family: $font-major;
    font-size: 12pt;
  }

  &.desc {
    color: $color-sub;
    font-family: $font-sub;
    font-size: 11pt;
  }

  &.center {
    display: block;
    text-align: center;
  }
}

.actions {
  margin-top: $box-padding;

  button {
    margin-right: 5pt;
    --bg: #{$bg-darker};
    --bg-hov: #{$success-major};
    --color: #{$color-major};
  }
}

.box {
  position: relative;
  display: grid;
  background-color: $bg-bright;
  padding: $box-padding;
  border-radius: $box-border-radius;
  margin-bottom: $box-padding / 2;
  overflow: hidden;
  box-shadow: 0 0px 6px #00000000;
  text-decoration: none;
  grid-template-columns: minmax(0, 2fr) minmax(0, 2fr) minmax(0, 1fr);
  column-gap: 5pt;
  cursor: pointer;

  &[editable]:hover { filter: brightness(0.9); }

  &:not([editable]) {
    pointer-events: none;
    opacity: .5;
  }
}

.progress {
  width: 100%;
  height: 12pt;
  margin-bottom: 2pt;
  background-color: $bg-brighter;
  border-radius: 99px;
  overflow: hidden;

  .inner {
    height: 100%;
    width: var(--progress);
    border-radius: 99px;
    background-color: $info-major;
    transition: width .6s $ease-out-quart;

    &.done { background-color: $success-major; }
  }
}

.users {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.divider {
  display: inline-block;
  width: 20px;
  margin-right: 5px;
  text-align: center;
  color: #ffffff80;
}

</style>
<style scoped lang="scss">
.loading-animation-queued .lang-box-progess-inner {
  width: calc(var(--progress) / 2);
}
</style>
