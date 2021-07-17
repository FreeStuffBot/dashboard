<template>
  <div class="container">
    <span v-if="!data">Loading...</span>
    <div v-else-if="data.none">
      <h1>Welcome!</h1>
      <span>Looks like you haven't created an application yet.</span>
      <br>
      <span>Click below to get started with using the FreeStuff API!</span>
      <br>
      <br>
      <button generic dark @click="createApp">
        Create Application
      </button>
    </div>
    <div v-else>
      <h1 v-text="data.type == 'partner' ? 'Your application [partner]:' : 'Your application:'" />
      <h2>About your app:</h2>
      <span>Please describe your app in a few words. What are you using it for? Can you link some websites / social media for your project?</span>
      <textarea v-model="newdesc" maxlength="2048" @blur="saveDesc" />
      <h2>API Key:</h2>
      <div class="input-button-pair">
        <div class="tokenbox">
          <span class="curtain">Hover to view</span>
          <span class="content" v-text="data.key" />
        </div>
        <button generic dark @click="resetApiKey">
          Regenerate
        </button>
      </div>
      <h2>Event Webhook:</h2>
      <div class="input-button-pair">
        <input v-model="data.webhook" :disabled="!webhookEdit" type="text" placeholder="https://your-domain.com/webhooks/freestuff">
      </div>
      <div class="input-button-pair">
        <input v-model="data.webhooksecret" :disabled="!webhookEdit" type="text" placeholder="Webhook Secret">
        <button generic dark style="margin-right: 10pt" @click="updateWebhook">
          {{ webhookEdit ? 'Save Changes' : 'Edit' }}
        </button>
        <button generic dark @click="testWebhook">
          {{ webhookEdit ? 'Cancel' : 'Test Webhook' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'


export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const info = await API.getAppData()
    this.data = info.data
    if (info.data.description)
      this.newdesc = info.data.description
  },
  data() {
    return {
      data: null as any,
      newdesc: '',
      webhookEdit: false
    }
  },
  fetchOnServer: false,
  methods: {
    async createApp() {
      const data = await Swal.fire({
        title: 'Do you want to create an API application?',
        html: 'By continuing, you agree to our <a href="https://freestuffbot.xyz/terms/" target="_blank">API Terms of Service</a>.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3e9e71',
        confirmButtonText: 'Yes'
      })

      if (data.value) {
        const success = await API.postAppCreate()
        if (success.data.success) { this.$fetch() } else {
          Swal.fire({
            title: 'Oh noes!',
            text: 'Could not create your application. Perhaps it already exists? Please reload the page. If this error persists, please contact support!'
          })
        }
      }
    },
    async resetApiKey() {
      const data = await Swal.fire({
        title: 'Regenerate API key?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3e9e71',
        confirmButtonText: 'Yes'
      })

      if (data.value) {
        const res = await API.postAppRegenKey()
        Swal.fire({
          title: res.data.success ? 'Okie dokie' : 'Uh oh...',
          text: res.data.success ? 'Your api token was regenerated.' : 'Could not reset your token, please contact support!'
        })
        if (res.data.success) this.$fetch()
      }
    },
    async updateWebhook() {
      if (!this.webhookEdit) {
        this.webhookEdit = true
        return
      }

      const data = await Swal.fire({
        title: 'Save Webhook Settings?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3e9e71',
        confirmButtonText: 'Yes'
      })

      if (data.value) {
        const res = await API.patchAppWebhook(this.data.webhook, this.data.webhooksecret)
        Swal.fire({
          title: res.data.success ? 'Success!' : 'Uh oh...',
          text: res.data.success ? 'Your Webhook settings got updated!' : res.data.message
        })
        if (res.data.success) {
          this.$fetch()
          this.webhookEdit = false
        }
      }
    },
    async testWebhook() {
      if (this.webhookEdit) {
        this.webhookEdit = false
        this.$fetch()
        return
      }

      await API.postAppWebhookTest(this.data.webhook, this.data.webhooksecret)
      Swal.fire({
        title: 'Aaaaand out!',
        text: 'Successfully sent test webhook event.<br>Make sure to save your changes first before testing!'
      })
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

.input-button-pair {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10pt;
}

.tokenbox {
  background-color: $bg-bright;
  border-radius: $content-border-radius;
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

input, textarea {
  background-color: $bg-bright;
  border-radius: $content-border-radius;
  border: none;
  padding: 10pt 15pt;
  flex-grow: 1;
  color: $color-regular;
  font-family: $font-regular;
  font-size: 12pt;

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
</style>
