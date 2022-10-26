<template>
  <Container>
    <Admonition v-if="error" type="error" v-text="error" />
    <p v-else-if="!dataLang" v-text="'Loading...'" />
    <Layout name="flow" v-else class="container">
      <h1 v-text="(dataLang._index === -1)
        ? 'Editing language descriptions'
        : `Translating ${dataLang.lang_name_en.charAt(0).toUpperCase() + dataLang.lang_name_en.slice(1)}`"
      />

      <Admonition v-if="!editable" type="warning" text="Readonly View" />

      <Layout name="$1141">
        <Button
          type="light"
          text="Back"
          @click="editorMove(-1)"
        />
        <Input
          type="number"
          v-model="editor.cursor"
          :numMin="0"
          :numMax="keys.length - 1"
        />
        <Input
          type="select"
          :options="keys.map((label, value) => ({ value, label }))"
          v-model="editor.cursor"
        />
        <Button
          type="green"
          text="Next"
          @click="editorMove(1)"
        />
      </Layout>

      <Layout name="flow" class="context">
        <label>Original Text</label>
        <div class="org">
          <span
            v-for="line, i of currentOrg.split('\n')"
            :key="i"
            v-text="line"
          />
        </div>
        <div class="descr">
          <span v-text="dataDescr[currentKey] || '(No description provided)'" />
        </div>
        <hr>
        <label>Current Translation</label>
        <div class="lang">
          <span
            v-for="line, i of currentLang.split('\n')"
            :key="i"
            v-text="line"
          />
        </div>
      </Layout>

      <div class="comments-wrapper">
        <div class="comments-ghost" :visible="!currentSuggestions" />
        <Layout name="flow" class="comments" :visible="!!currentSuggestions">
          <label>Your Suggestion</label>
          <Input
            type=""
            :multiline="true"
            :placeholder="currentLang"
            v-model="dataCurrent[currentKey]"
          />
          <Layout name="2dynamic">
            <Layout name="inline">
              <Button
                type="blue" icon="material/download"
                v-tippy content="Copy Original Text"
                :disabled="currentOrg === dataCurrent[currentKey]"
                @click="cloneOrg()"
              />
              <Button
                type="blue" icon="material/content_copy"
                v-tippy content="Copy Current Translation"
                :disabled="currentLang === dataCurrent[currentKey]"
                @click="cloneLang()"
              />
              <Button
                type="blue" icon="material/delete"
                v-tippy content="Clear Input"
                :disabled="!dataCurrent[currentKey]"
                @click="clear()"
              />
            </Layout>

            <Button
              type="green"
              text="Submit"
            />
          </Layout>

          <div
            v-for="suggestion of currentSuggestions"
            class="suggestion"
          >
            <div class="inner" :data-active="suggestion.active">
              <div class="vote">
                <div :data-upvote="suggestion.selfUpvoted" @click="voteComment(suggestion, 1)">
                  <Icon name="material/arrow_up" />
                </div>
                <div :data-downvote="suggestion.selfDownvoted" @click="voteComment(suggestion, -1)">
                  <Icon name="material/arrow_down" />
                </div>
              </div>
              <div class="information">
                <img :src="suggestion.user.icon" alt="">
                <span v-if="suggestion.upvotes === undefined" class="user" v-text="suggestion.user.name" />
                <span v-else class="user" v-text="`${suggestion.user.name} (${suggestion.upvotes}/-${suggestion.downvotes})`" />
                <div class="text">
                  <span
                    v-for="line, i of suggestion.text.split('\n')"
                    :key="i"
                    v-text="line"
                  />
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import Admonition from '../../components/entities/Admonition.vue'
import Container from '../../components/layout/Container.vue'
import Layout from '../../components/layout/Layout.vue'
import Button from '../../components/entities/Button.vue'
import Input from '../../components/entities/Input.vue'
import { throwStatement } from '@babel/types'

export default Vue.extend({
  components: {
    Admonition,
    Container,
    Layout,
    Button,
    Input
},
  transition: 'slide-down',
  async fetch() {
    const res = await Promise.all([
      API.getLanguage(this.$route.params.lang),
      API.getLanguage('@origin'),
      API.getLanguage('@descriptions')
    ])
    for (const r of res) {
      if (r.status === 200) continue
      this.error = `Error http ${r.status} (${r.statusText}): ${r.data?.message}`
      return
    }

    const dataLang: Record<string, string> = res[0].data
    const dataOrg: Record<string, string> = res[1].data
    const dataDescr: Record<string, string> = res[2].data

    this.dataLang = JSON.parse(JSON.stringify(dataLang))
    this.dataOrg = dataOrg
    this.dataDescr = dataDescr
    this.keys = Object.keys(dataOrg).filter((k: string) => {
      if (k.startsWith('_')) return false
      if (dataLang._id.startsWith('en')) return true
      if (dataDescr[k]?.startsWith('NO_TRANSLATION')) return false
      return true
    })

    this.loadSuggestions()
  },
  data() {
    return {
      error: '',
      dataLang: undefined as any,
      dataOrg: {},
      dataDescr: {},
      dataCurrent: {},
      suggestions: {},
      keys: [],
      editor: {
        cursor: 0,
        rtl: false
      }
    }
  },
  computed: {
    currentKey() {
      return this.keys[this.editor.cursor] || ''
    },
    currentOrg() {
      return this.dataOrg[this.currentKey] || ''
    },
    currentLang() {
      return this.dataLang[this.currentKey] || ''
    },
    currentSuggestions() {
      return this.suggestions[this.currentKey] || null
    },
    approved() {
      return !!this.dataLang[this.currentKey] // && this.data[this.currentKey] != this.dataOrg[this.currentKey];
    },
    progress() {
      return this.keys.filter((key: string) => this.dataLang[key]).length
    },
    editable() {
      const editable = this.$store.getters['user/languagesInTranslationScope']
      return editable.includes('*') || editable.includes(this.$route.params.lang)
    }
  },
  watch: {
    'editor.cursor'(val: number) {
      if (this.suggestions[this.currentKey]) return
      setTimeout((self) => {
        if (self.editor.cursor !== val) return
        this.loadSuggestions()
      }, 600, this)
    }
  },
  methods: {
    editorMove(direction: number) {
      this.editor.cursor = parseInt(this.editor.cursor + '', 10) + direction
      const max = this.keys.length
      while (this.editor.cursor < 0) this.editor.cursor += max
      while (this.editor.cursor >= max) this.editor.cursor -= max
      // eslint-disable-next-line no-unused-expressions
      document.getElementById('lang-editor-input')?.focus()
    },
    cloneLang() {
      Vue.set(this.dataCurrent, this.currentKey, this.dataLang[this.currentKey])
    },
    cloneOrg() {
      Vue.set(this.dataCurrent, this.currentKey, this.dataOrg[this.currentKey])
    },
    clear() {
      Vue.set(this.dataCurrent, this.currentKey, '')
    },
    async loadSuggestions() {
      const res = await API.getTranslationComments(this.$route.params.lang, this.currentKey)
      if (res.status === 200)
        Vue.set(this.suggestions, this.currentKey, res.data)
    },
    async voteComment(suggestion: any, value: number) {
      if (value > 0 && suggestion.selfUpvoted) value = 0
      else if (value < 0 && suggestion.selfDownvoted) value = 0

      const res = await API.patchTranslationCommentVote(suggestion.id, value)
      if (res.status !== 200) return console.error(res)

      suggestion.selfUpvoted = (value > 0)
      suggestion.selfDownvoted = (value < 0)
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
.context, .comments {
  @include box;

  .descr span {
    font-family: $font-major;
    font-size: 10pt;
    color: $color-major;
  }

  label {
    margin-bottom: calc($content-padding * -1);
  }

  .org, .lang {
    padding: $box-padding;
    border-radius: $content-br;
    background-color: $bg-lighter;
    display: flex;
    flex-direction: column;
    border: none;
    outline: none;
    font-family: $font-regular;
    font-size: 11pt;
    color: $color-major;
    resize: vertical;
    counter-reset: lineNr 0;

    span {
      font-family: $font-regular;
      font-size: 11pt;
      color: $color-major;

      &:not(:first-child:last-child)::before {
        counter-increment: lineNr;
        content: counter(lineNr);
        color: $color-minor;
        font-family: monospace;
        padding-right: 1em;
      }
    }
  }
}

.comments-wrapper {
  display: grid;

  & > * { grid-area: 1 / 1; }
}

.comments-ghost {
  position: relative;
  width: 100%;
  height: 300px;
  opacity: 0;
  border-radius: $box-br;
  background-color: #ffffff05;
  border: 1px solid #ffffff03;
  transition: opacity .4s ease;
  overflow: hidden;
  pointer-events: none;

  &[visible] {
    opacity: 1;
    transition: opacity 0s linear;
  }

  &::after {
    content: '';
    position: absolute;
    top: -100%;
    right: 0;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 300%;
    transform: translateX(-100%) rotate(20deg);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.02) 20%,
      rgba(#fff, 0.08) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.comments {
  @include box;
  opacity: 0;
  transition: opacity 0s linear;
  margin-bottom: 10vh;
  
  &[visible] {
    opacity: 1;
    transition: opacity .4s ease;
  }

  .suggestion {
    margin: calc(-1 * $box-padding);
    margin-top: 0;
    padding: calc($box-padding / 3);
    border-top: 1px solid $color-border;
    
    .inner {
      display: flex;
      padding: calc($box-padding / 3 * 2);
      gap: $box-padding;
      border-radius: $content-br;
      border: 2px solid transparent;

      &[data-active] {
        border-color: $color-green;
      }
    }

    .vote {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: -4pt;

      & > div {
        width: 18pt;
        height: 18pt;
        color: $color-regular;
        cursor: pointer;
        padding: 4pt;
        background-color: #ffffff00;
        transition: background-color .1s ease;
        border-radius: 3pt;

        &[data-upvote] {
          color: $color-green;
          background-color: $color-green-20;
        }

        &[data-downvote] {
          color: $color-orange;
          background-color: $color-orange-20;
        }

        &:hover {
          background-color: $bg-lighter;
        }

        & > * {
          width: 18pt;
          height: 18pt;
          color: inherit;
        }
      }
    }

    .information {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 4pt;
      row-gap: 6pt;
      align-items: center;

      img {
        grid-area: 1 / 1;
        width: 18pt;
        height: 18pt;
        border-radius: 999pt;
      }

      .user {
        grid-area: 1 / 2;
        font-family: $font-major;
        font-size: 9pt;
        color: $color-major;
      }

      .text {
        grid-area: 2 / 1 / 2 / span 2;
        font-family: $font-regular;
        font-size: 11pt;
        color: $color-regular;

        span {
          display: block;
          min-height: 1em;
        }
      }
    }
  }
}

hr {
  background-color: $color-border;
  width: calc(100% + 2 * $box-padding);
  height: 1px;
  display: block;
  border: none;
  margin: 0 0 0 calc($box-padding * -1);
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
