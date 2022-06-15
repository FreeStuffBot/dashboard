<template>
  <div v-if="data" class="container">
    <h1 v-if="data._index == -1">
      Editing language descriptions
    </h1>
    <h1 v-else>
      Translating {{ data.lang_name_en.charAt(0).toUpperCase() + data.lang_name_en.slice(1) }}
    </h1>
    <div v-if="!editable" class="readonly">
      Readonly View
    </div>
    <div class="progress">
      <span class="title">Progress: {{ Math.round(progress / dataEn._lines.length * 100) }}%</span>
      <span v-if="progress != dataEn._lines.length" class="desc">{{ progress }} / {{ dataEn._lines.length }} lines done!</span>
      <span v-else class="desc">WOHOOO! YOU'RE DONE!</span>
      <div class="bar">
        <div class="inner" :style="`--progress: ${progress / dataEn._lines.length * 100}%`" />
      </div>
    </div>
    <div class="editor">
      <div class="top">
        <button v-tippy="{delay: [500, 0]}" content="Moves back one line<br>Ctrl + Shift + Enter" @click="editorMove(-1)">
          Previous
        </button>
        <input v-model="editor.cursor" type="number" min="0">
        <select v-model="editor.cursor">
          <option
            v-for="(key, i) of dataEn._lines"
            :key="i"
            :value="i"
            v-text="key"
          />
        </select>
        <button v-tippy="{delay: [500, 0]}" :class="{approved}" content="Moves forward one line<br>Ctrl + Enter" @click="editorMove(1)">
          Next
        </button>
      </div>
      <div class="description" v-text="dataDescriptions[currentKey] || 'No description provided.'" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="orgtext" v-html="dataEn[currentKey] && dataEn[currentKey].split('<').join('&lt;&ZeroWidthSpace;').split('>').join('&ZeroWidthSpace;&gt;').split('\n').join('<span pilcrow>&#182;</span><br>') || ''" />
      <textarea
        id="lang-editor-input"
        v-model="data[currentKey]"
        class="translation"
        type="text"
        :disabled="!editable"
        :style="`direction: ${editor.rtl ? 'rtl' : 'ltr'}`"
        @keyup.ctrl.shift.enter.exact.prevent="editorMove(-1)"
        @keyup.ctrl.enter.exact.prevent="editorMove(1)"
        @keydown.ctrl.s.exact.prevent="submitChanges()"
        @keydown.ctrl.q.exact.prevent="clone()"
        @keydown.ctrl.z.exact.prevent="undo()"
        @keydown.ctrl.b.exact.prevent="clear()"
        @keydown.ctrl.d.exact.prevent="skipToNextUnfinished()"
      />
      <div class="buttons">
        <span v-if="issues[currentKey]" class="issues present" v-text="issues[currentKey]" />
        <span v-else-if="Object.keys(issues).length" class="issues found" @click="skipToNextUnfinished(true)" v-text="Object.keys(issues).length + (Object.keys(issues).length == 1 ? ' issue.' : ' issues.')" />
        <span v-else class="issues">No issues.</span>

        <button v-if="data[currentKey] != dataOrg[currentKey]" v-tippy="{delay: [500, 0]}" content="Reverts your changes to<br>the last saved ones<br>Ctrl + Z" :disabled="!editable" @click="undo()">
          Undo
        </button>
        <button v-tippy="{delay: [500, 0]}" content="Copies the English text<br>Ctrl + Q" :disabled="!editable" @click="clone()">
          Clone
        </button>
        <button v-tippy="{delay: [500, 0]}" content="Clears the translation<br>Ctrl + B" :disabled="!editable" @click="clear()">
          Clear
        </button>
        <span class="div">&bull;</span>
        <button v-tippy="{delay: [500, 0]}" content="Toggles between LTR and RTL" @click="editor.rtl = !editor.rtl" v-text="editor.rtl ? 'LTR' : 'RTL'" />
        <button v-tippy="{delay: [500, 0]}" content="Skips forward to the next<br>untranslated or flawed line<br>Ctrl + D" @click="skipToNextUnfinished()">
          Forward
        </button>
      </div>
    </div>
    <div v-if="editable" class="box">
      <button v-tippy="{delay: [500, 0]}" generic small content="Press this to save your changes.<br>Please don't spam this button, you don't need to press this after every single line!<br>(Like seriously. Don't spam pls, thx.)<br>Ctrl + S" @click="submitChanges()">
        Submit Changes
      </button>
    </div>
  </div>
  <div v-else>
    <span>Loading or language not found!</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const data = (await API.getLanguage(this.$route.params.lang)).data as { [key: string]: string }
    const dataEn = (await API.getLanguage('en-US')).data as { [key: string]: string }
    const dataDescriptions = (await API.getLanguage('descriptions')).data as { [key: string]: string }

    if (data._id) {
      this.data = JSON.parse(JSON.stringify(data))
      this.dataOrg = JSON.parse(JSON.stringify(data))
    }
    if (dataEn._id) {
      this.dataEn = dataEn
      this.dataEn._lines = Object.keys(dataEn).filter((k: string) => {
        if (k.startsWith('_')) return false
        if (data._id.startsWith('en')) return true
        return !dataDescriptions[k]?.startsWith('NO_TRANSLATION')
      })
    }
    if (dataDescriptions._id)
      this.dataDescriptions = dataDescriptions

    this.findIssues()
  },
  data() {
    return {
      data: undefined as any,
      dataOrg: undefined as any,
      dataEn: undefined as any,
      dataDescriptions: undefined as any,
      issues: {} as {[key: string]: string},
      editor: {
        cursor: 0,
        rtl: false
      }
    }
  },
  computed: {
    currentKey() {
      // @ts-ignore
      return this.dataEn._lines[this.editor.cursor] || ''
    },
    approved() {
      // @ts-ignore
      return !!this.data[this.currentKey] // && this.data[this.currentKey] != this.dataEn[this.currentKey];
    },
    progress() {
      // @ts-ignore
      return this.dataEn._lines.filter((key: string) => this.data[key]).length
    },
    editable() {
      const editable = this.$store.getters['user/languagesInTranslationScope']
      return editable.includes('*') || editable.includes(this.$route.params.lang)
    }
  },
  methods: {
    editorMove(direction: number) {
      this.editor.cursor = parseInt(this.editor.cursor + '', 10) + direction
      const max = this.dataEn._lines.length
      while (this.editor.cursor < 0) this.editor.cursor += max
      while (this.editor.cursor >= max) this.editor.cursor -= max
      // eslint-disable-next-line no-unused-expressions
      document.getElementById('lang-editor-input')?.focus()
      this.findIssues()
    },
    undo() {
      Vue.set(this.data, this.currentKey, this.dataOrg[this.currentKey])
    },
    clone() {
      Vue.set(this.data, this.currentKey, this.dataEn[this.currentKey])
    },
    clear() {
      Vue.set(this.data, this.currentKey, '')
    },
    skipToNextUnfinished(issuesOnly = false) {
      this.findIssues()
      const found = (position: number) => {
        this.editor.cursor = position
        // eslint-disable-next-line no-unused-expressions
        document.getElementById('lang-editor-input')?.focus()
      }
      for (let i = 1; i <= this.dataEn._lines.length; i++) {
        let position = parseInt(this.editor.cursor + '', 10) + i
        if (position >= this.dataEn._lines.length) position -= this.dataEn._lines.length
        if (this.issues[this.dataEn._lines[position]]) return found(position)
        if (issuesOnly) continue
        if (this.dataEn._lines[position] && !this.data[this.dataEn._lines[position]]) return found(position)
      }
    },
    async submitChanges() {
      try { this.findIssues() } catch (ex) { console.error(ex) }
      const payload = {} as any
      for (const key of this.dataEn._lines) {
        if (this.data[key] !== this.dataOrg[key])
          payload[key] = this.data[key].split('​').join('') // replace zwd with nothing
      }

      if (!Object.keys(payload).length) {
        Swal.fire({
          title: 'Oh.',
          text: 'No changes found.',
          icon: 'info',
          confirmButtonColor: '#3e9e71',
          confirmButtonText: 'Okay'
        })
        return
      }

      const doIt = await Swal.fire({
        title: 'Submit changes?',
        text: "If your language is already approved and visible within the bot's settings, your changes might go live at any point in time.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3e9e71',
        confirmButtonText: 'Submit'
      })

      if (doIt.value) {
        const { data } = await API.patchLanguage(this.data._id, payload)
        console.log(data)
        this.$fetch()
      }
    },
    findIssues() {
      const issuesAt: {[key: string]: string} = {}
      const variablesTest = (str: string, org: string) => {
        const variablesUsed = Array.from(str.matchAll(/{\w+}/g)).map(e => e[0])
        if (variablesUsed.filter(e => !org.includes(e)).length) console.log(str)
        return !!variablesUsed.filter(e => !org.includes(e)).length
      };
      (Object.values(this.dataEn._lines) as string[]).forEach((key) => {
        const value = this.data[key]
        if (/  +/.test(value)) issuesAt[key] = 'Double Space'
        else if (variablesTest(value + '', this.dataEn[key])) issuesAt[key] = 'Invalid Variable'
        else if (/\] \(/.test(value)) issuesAt[key] = 'Invalid Space Between Link URL & Text'
      })
      this.issues = issuesAt
      return issuesAt
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
}

h1 {
  margin-bottom: $box-padding;
}

.progress {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "text1 text2" "bar bar";
  row-gap: calc($box-padding / 2);
  background: $bg-light;
  padding: $box-padding;
  border-radius: $box-br;
  margin-bottom: $box-padding;

  .title { grid-area: text1; }

  .desc {
    grid-area: text2;
    text-align: right;
  }

  .bar {
    grid-area: bar;
    width: 100%;
    height: 12pt;
    margin-bottom: 2pt;
    background-color: #00000044;
    border-radius: 99px;
    overflow: hidden;

    .inner {
      height: 100%;
      width: var(--progress);
      border-radius: 99px;
      background-image: linear-gradient(90deg, #9833ac, #6c96fe);
    }
  }
}

.editor {
  display: flex;
  flex-direction: column;
  background: #393f55;
  padding: $box-padding;
  border-radius: $box-br;
  margin-bottom: $box-padding;

  & > div {
    display: block;
  }

  .top {
    display: grid;
    grid-template-columns: 1fr 1fr 4fr 1fr;
    column-gap: 10pt;
    padding-bottom: $box-padding;
    margin-bottom: calc(#{$box-padding} / 2);
    border-bottom: 1px solid #00000044;

    button {
      padding: 8pt;
      border-radius: calc($box-br / 3);
      border: none;
      background-color: #7e89b1;
      color: $color-header;
      font-family: $font-major;
      cursor: pointer;

      &:hover { background-color: #919eca; }

      &.approved {
        background-color: #48a270;

        &:hover { background-color: #5cb484; }
      }
    }

    input {
      display: inline-block;
      width: calc(100% - 20pt);
      margin: 0;
      padding: 8pt 10pt;
      border-radius: calc($box-br / 3);
      border: none;
      font-family: monospace;
      font-size: 12pt;
      color: $color-regular;
      background-color: #00000022;
    }

    select {
      padding: 8pt 10pt;
      border-radius: calc($box-br / 3);
      border: none;
      font-family: monospace;
      font-size: 12pt;
      color: $color-regular;
      background-color: #00000022;
      width: 370px;

      option { background-color: #31374a; }
    }
  }

  & > .description {
    margin-top: calc(#{$box-padding} / 2);
    padding: 0 5pt 10pt 5pt;
      border-radius: calc($box-br / 3);
    border: none;
    font-family: $font-regular;
    font-size: 11pt;
    color: $color-regular;
    // background-color: #00000022;
  }

  & > .orgtext {
    margin-top: calc(#{$box-padding} / 2);
    padding: 8pt 10pt;
      border-radius: calc($box-br / 3);
    border: none;
    font-family: $font-regular;
    font-size: 12pt;
    color: $color-regular;
    background-color: #00000022;
  }

  & > textarea {
    margin-top: calc(#{$box-padding} / 2);
    padding: 8pt 10pt;
      border-radius: calc($box-br / 3);
    border: none;
    font-family: $font-major;
    font-size: 12pt;
    color: #151515;
    background-color: #e4d7e4;
    box-shadow: 0 5px 7px -6px black;
    resize: vertical;
    min-height: 14pt;
    max-height: 200pt;

    &:disabled {
      cursor: not-allowed;
      box-shadow: none;
      color: #434343;
    }
  }

  .buttons {
    margin-top: $box-padding;
    width: 100%;
    display: flex;
    align-items: center;

    span.issues {
      flex-grow: 1;
      opacity: .4;

      &.present {
        opacity: 1;
        color: $warning-major;
        font-family: $font-major;
      }

      &.found {
        opacity: .6;
        cursor: pointer;
      }
    }

    span.div {
      margin-left: 6pt;
      font-size: 26pt;
      opacity: .2;
      line-height: 14pt;
      transform: translateY(-1pt);
    }

    button {
      padding: 6pt 10pt;
      border-radius: calc($box-br / 3);
      border: none;
      background-color: #7e89b1;
      color: $color-header;
      font-family: $font-major;
      cursor: pointer;
      margin-left: 6pt;

      &:hover {
        background-color: #919eca;
      }

      &:disabled {
        pointer-events: none;
        opacity: .5;
      }
    }
  }
}

.box {
  // background: $bg-light;
  // padding: $box-padding;
  // border-radius: $box-br;
  margin-top: 50px;

  button {
    --bg: #{$bg-darker};
    --bg-hov: #{$success-major};
    --color: #{$color-major};
  }
}

.readonly {
  background: #d6d4462a;
  border: 1px solid #d6d446;
  padding: $box-padding;
  border-radius: $box-br;
  margin-bottom: $box-padding;
  font-family: $font-major;
  color: #d6d446;
}

</style>
<style>
.orgtext span[pilcrow] {
  display: inline;
  margin-left: 5px;
  user-select: none;
  opacity: .3;
}
.orgtext br::selection { background-color: transparent; }
</style>
