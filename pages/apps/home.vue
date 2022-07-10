<template>
  <Container>
    <Admonition v-if="error" type="error" :text="error" />
    <span v-else-if="!data">Loading...</span>
    <div v-else-if="data.none">
      <h1>Welcome!</h1>
      <p>Looks like you haven't created an application yet.</p>
      <br>
      <p>Click below to get started with using the FreeStuff API!</p>
      <br>
      <br>
      <Button
        type="green"
        text="Create Application"
        @click="createApp"
      />
    </div>
    <div v-else>
      <h1 v-text="data.type == 'partner' ? 'Your application [partner]' : 'Your application'" />
      <h2>About your app</h2>
      <p>Please describe your app in a few words. What are you using it for? Can you link some websites / social media for your project?</p>
      <Input
        v-model="newdesc"
        label="Description"
        :multiline="true"
        @blur="saveDesc"
      />

      <!-- <h2><Icon name="key" /> API Key</h2> -->
      <h2>API Key</h2>
      <div class="content-row">
        <div class="tokenbox">
          <span class="curtain">Hover to view</span>
          <span class="content" v-text="data.key" />
        </div>
        <button generic dark @click="resetApiKey">
          Regenerate
        </button>
      </div>
      <sub>Last regenerated {{ getLastChanged('key') }}</sub>

      <!-- <h2><Icon name="webhook" /> Event Webhook</h2> -->
      <h2>Event Webhooks</h2>
      <!-- <div class="spacer small" /> -->
      <Layout name="component-flow">
        <Input
          v-model="data.webhookUrl"
          :disabled="!webhookEdit"
          label="Webhook URL"
          placeholder="https://your-domain.com/webhooks/freestuff"
        />
        <Input
          v-model="data.webhookSecret"
          :disabled="!webhookEdit"
          label="Webhook Secret"
          placeholder="Secret"
        />
        <!-- <sub>Last changed {{ getLastChanged('webhook') }}</sub> -->

        <Layout name="inline">
          <Button
            type="light"
            :text="webhookEdit ? 'Save Changes' : 'Edit'"
            @click="updateWebhook"
          />
          <Button
            type="light"
            :text="webhookEdit ? 'Cancel' : 'Test Webhook'"
            @click="testWebhook"
          />
        </Layout>

        <div class="spacer small" />

        <Input
          v-model="data.webhookVersion"
          label="Webhook Version"
          :options="[
            { label: 'Version 1 — Default', value: '1' }
          ]"
        />
      <!-- <sub>Last changed {{ getLastChanged('webhookVersion') }}</sub> -->
      </Layout>


      <div v-if="data.webhookVersion == 2">
        <div class="spacer medium" />
        <span>New in version 2: Pick which data you want to receive</span>
        <div class="spacer small" />
        <span>TODO</span>
      </div>

      <!-- <h2><Icon name="analytics" /> API Usage</h2> -->
      <h2>API Usage</h2>
      <span>Coming soon&trade;</span>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import { openConfirmDialogue, openInfoDialogue } from '../../lib/popups'
import Admonition from '~/components/entities/Admonition.vue'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'
import Input from '~/components/entities/Input.vue'


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
    const info = await API.getAppData()

    if (info.status === 200) {
      this.data = info.data
      if (info.data.description)
        this.newdesc = info.data.description
      if (!info.data.webhookVersion)
        this.data.webhookVersion = '1'
    } else if (info.status === 404) {
      this.data = { none: true }
      this.error = ''
    } else {
      this.error = `An error occured: http ${info.status}: ${info.statusText}`
    }
  },
  data() {
    return {
      data: null as any,
      error: '',
      newdesc: '',
      webhookEdit: false
    }
  },
  fetchOnServer: false,
  methods: {
    getLastChanged(name: string) {
      const val = this.data['lc' + name[0].toUpperCase() + name.substring(1)]
      return val
        ? new Date(val * 1000).toLocaleString()
        : 'Unknown'
    },
    async createApp() {
      const yes = await openConfirmDialogue(
        this.$store,
        'Do you want to create an API application?',
        'By continuing, you agree to our API Terms of Service: https://freestuffbot.xyz/terms/'
      )

      if (!yes) return

      const res = await API.postAppCreate()
      if (res.status !== 200) {
        openInfoDialogue(
          this.$store,
          'Could not create your application.',
          (res.data.message ?? 'Perhaps it already exists? Please reload the page.') + ' If this error persists, please contact support!'
        )
        return
      }

      this.$fetch()
    },
    async resetApiKey() {
      const yes = await openConfirmDialogue(
        this.$store,
        'Regenerate API key?',
        'Your old key will be made invalid'
      )

      if (!yes) return

      const res = await API.postAppRegenKey()
      if (res.status !== 200) {
        openInfoDialogue(
          this.$store,
          'Uh oh...',
          res.data.message ?? 'Could not reset your token, please contact support!'
        )
        return
      }

      openInfoDialogue(
        this.$store,
        'Okie dokie',
        'Your api token was regenerated.'
      )
      this.$fetch()
    },
    async updateWebhook() {
      if (!this.webhookEdit) {
        this.webhookEdit = true
        return
      }
      const yes = await openConfirmDialogue(
        this.$store,
        'Save Webhook Settings?',
        'Just making sure...'
      )

      if (!yes) return

      const res = await API.patchAppWebhook(this.data.webhookUrl, this.data.webhookSecret)
      if (res.status !== 200) {
        openInfoDialogue(
          this.$store,
          'Uh oh...',
          res.data.message ?? 'Could update your webhook, please contact support!'
        )
        return
      }

      openInfoDialogue(
        this.$store,
        'Success!',
        'Your Webhook settings got updated!'
      )
      this.$fetch()
      this.webhookEdit = false
    },
    async testWebhook() {
      if (this.webhookEdit) {
        this.webhookEdit = false
        this.$fetch()
        return
      }

      await API.postAppWebhookTest(this.data.webhookUrl, this.data.webhookSecret)
      openInfoDialogue(
        this.$store,
        'Aaaaand out!',
        'Successfully sent test webhook event.\nMake sure to save your changes first before testing!'
      )
    },
    saveDesc() {
      if (this.data.description !== this.newdesc) {
        API.patchAppDescription(this.newdesc)
        this.data.description = this.newdesc
      }
    }
  },
  head() {
    return {
      title: 'FreeStuff API'
    }
  }
})
</script>

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;

  &[minor] { color: #888888; }
}

.content-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10pt;
}

.tokenbox {
  background-color: $bg-light;
  border-radius: $content-br;
  border: 1px solid $color-minor;
  padding: 10pt 15pt;
  flex-grow: 1;
  position: relative;

  &:not(:last-child) { margin-right: 10pt; }

  &:hover {
    span.curtain { opacity: 0; transition: opacity .2s ease; }
    span.content { opacity: 1; transition: opacity .2s ease .1s; }
  }

  span {
    color: $color-regular;
    font-family: monospace;
    font-size: 12pt;

    &.curtain { opacity: 1; transition: opacity .2s ease .1s; position: absolute; pointer-events: none; user-select: none; }
    &.content { opacity: 0; transition: opacity .2s ease; }
  }
}

input, textarea, select {
  background-color: $bg-light;
  border-radius: $content-br;
  border: none;
  padding: 10pt 15pt;
  flex-grow: 1;
  color: $color-regular;
  font-family: $font-regular;
  font-size: 12pt;

  &:is(select) { width: 100%; }
  &:not(:last-child) { margin-right: 10pt; }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
}

textarea {
  width: calc(100% - 30pt) !important;
  display: block;
  resize: vertical;
  margin-top: 10pt;
  min-height: 50px;
  height: 130px;
  max-height: 500px;
}

sub {
  color: #888888;
  font-family: $font-regular;
  font-size: 9pt;
  display: block;
  transform: translateY(-30%);
}

h2 .icon {
  height: 1.3em;
  width: 1.3em;
  margin: 0;
  display: inline-block;
  padding-right: 0.3em;
  transform: translateY(.3em);
}

.spacer {
  display: block;

  &.small { height: 10pt; }
  &.medium { height: 20pt; }
}
</style>
