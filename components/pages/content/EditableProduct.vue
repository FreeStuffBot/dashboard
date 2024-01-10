<template>
  <div v-if="processing">
    <h1>Processing...</h1>
    <Admonition type="info" icon="animated/loading_processing" text="This product is being processed, please wait a few seconds." />
    <h2>What does this mean?</h2>
    <p>The product info is currently getting populated with additional information such as generated thumbnails, proxy urls and other currencies.</p>
  </div>
  <div v-else-if="prod" :data-editdisabled="!editable">
    <h1 v-text="prod.data.title || ':)'" />

    <Layout name="inline">
      <Button
        type="light"
        text="Fetch Manually"
        @click="fetchManually()"
        :disabled="!editable"
      />
    </Layout>

    <h2>General Information</h2>
    <Layout name="flow">
      <Input v-model="prod.data.title" label="Title" :error="!prod.data.title" :disabled="!editable" />
      <Input v-model="broker.url" label="URL" :error="!broker.url" :disabled="!editable" />
      <Layout name="2static">
        <Input v-model="broker.until" type="datetime-local" :label="broker.until ? 'Until' : 'Until (hidden)'" :num-min="new Date().toISOString().split('T')[0]+'T00:00'" :num-step="60" :disabled="!editable" />
        <Input v-model="prod.data.kind" label="Kind (Don't use)" :options="dropdowns.kind" :error="prod.data.kind === 'other'" :disabled="!editable" />
      </Layout>
      <Radio
        label="Type"
        :disabled="!editable"
        :options="dropdowns.type"
        v-model="prod.data.type"
      />
    </Layout>

    <!--  -->

    <h2>Product Details</h2>
    <Layout name="flow">
      <Input v-model="prod.data.description" label="Description" :multiline="true" :error="!prod.data.description" :disabled="!editable" />
      <Layout name="2static">
        <Input v-model="prod.data.store" label="Store" :options="storeOptions" :disabled="!editable" />
        <Input v-model="broker.rating" label="Rating (0-100)" type="number" :num-min="0" :num-max="100" :disabled="!editable" />
      </Layout>
      <Input v-model="broker.tags" label="Tags (Comma Separated)" placeholder="Single Player, Co-Op, wait that doesnt make sense" :disabled="!editable" />
      <Input v-model="prod.data.copyright" label="Copyright" placeholder="Some Company Inc." :disabled="!editable" />
    </Layout>

    <!--  -->

    <h2>Pricing</h2>
    <Layout name="1221" :tight="true">
      <label>Currency</label>
      <label>Old Price</label>
      <label>New Price</label>
    </Layout>
    <Layout name="flow">
      <Layout name="flow" :tight="true">
        <Layout v-for="(price, index) of broker.prices" :key="index" name="1221" :tight="true">
          <Input v-model="price.currency" :options="currencyOptions" :disabled="!editable" />
          <Input v-model="price.oldValue" type="number" :num-min="0" :num-step="0.01" :disabled="!editable" />
          <Input v-model="price.newValue" type="number" :num-min="0" :num-step="0.01" :disabled="!editable" />
          <Button
            type="light"
            text="Remove"
            @click="clickRemovePrice(index)"
            :disabled="!editable"
          />
        </Layout>
      </Layout>

      <Layout name="inline">
        <Button
          type="green"
          text="Add Currency"
          @click="clickAddPrice()"
          :disabled="!editable"
        />
      </Layout>
    </Layout>

    <!--  -->

    <h2>Assets</h2>
    <Layout name="flow">
      <Input v-model="broker.thumbnail" label="Thumbnail" placeholder="https://cdn.akamai.steamstatic.com/steam/apps/1172050/header.jpg" :error="!broker.thumbnail" :disabled="!editable">
        <template #preview>
          <div class="thumbnail-preview" :style="`background-image: url('${broker.thumbnail}')`" />
        </template>
      </Input>
    </Layout>

    <!--  -->

    <h2>Metadata</h2>
    <Layout name="flow">
      <div>
        <label>Flags</label>
        <Layout name="3static" :tight="true">
          <Input v-model="broker.flagTrash" type="toggle" placeholder="Trash Game" :disabled="!editable" />
          <Input v-model="broker.flagThirdparty" type="toggle" placeholder="Third Party Provider" :disabled="!editable" />
          <Input v-model="broker.flagPermanent" type="toggle" placeholder="Permanent Change" :disabled="!editable" />
          <Input v-model="broker.flagStaffPick" type="toggle" placeholder="Staff Pick" :disabled="!editable" />
        </Layout>
      </div>

      <div>
        <label>Meta Entries</label>
        <Layout name="flow" :tight="true">
          <Layout v-for="(kv, index) of prod.data.meta" :key="index" name="241" :tight="true">
            <Input v-model="kv.key" type="string" placeholder="steam.subids" :disabled="!editable" />
            <Input v-model="kv.value" type="string" placeholder="1234, 15231, 4881" :disabled="!editable" />
            <Button
              type="light"
              text="Remove"
              @click="prod.data.meta.splice(index, 1)"
              :disabled="!editable"
            />
          </Layout>
        </Layout>
      </div>

      <Layout name="inline">
        <Button
          type="green"
          text="Add Entry"
          @click="prod.data.meta.push({ key: '', value: '' })"
          :disabled="!editable"
        />
      </Layout>

      <Input v-model="prod.data.notice" label="Notice (Optional)" :multiline="true" :disabled="!editable" />
    </Layout>

    <!--  -->

    <div v-if="prod.status === 'pending'" class="bottom">
      <Button
        type="green"
        text="Save as Approved"
        @click="clickSaveAndApprove"
      />
      <Button
        type="light"
        text="Save as Pending"
        @click="clickSaveDraft"
      />
      <Button
        type="red"
        text="Decline"
        @click="clickDecline"
      />
    </div>
    <div v-else-if="prod.status === 'approved'" class="bottom">
      <p>This product is approved. Mark as Pending to edit.</p>
      <Button
        type="light"
        text="Mark as Pending"
        @click="clickSaveDraft(true)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../../lib/api'
import Dismissables from '../../../lib/dismissables'
import { openDismissableModal, openErrorModal, openModal, Popup, PopupType } from '../../../lib/popups'
import Layout from '~/components/layout/Layout.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'
import Admonition from '../../entities/Admonition.vue'
import Radio from '../../entities/Radio.vue'

const dropdowns = {
  kind: [
    { value: 'game', label: 'Game' },
    { value: 'dlc', label: 'DLC' },
    { value: 'loot', label: 'Loot (Ingame Content)' },
    { value: 'software', label: 'General Software' },
    { value: 'art', label: 'Artwork (Digital)' },
    { value: 'ost', label: 'OST / Soundtrack' },
    { value: 'book', label: 'Book / EBook' },
    { value: 'other', label: 'Other' }
  ],
  type: [
    { value: 'keep', label: 'Free to keep / 100% off' },
    { value: 'timed', label: 'Free to play / weekend (timed)' },
    { value: 'other', label: 'DLCs and More (other)' },
    { value: 'prime', label: 'Included in Prime' },
    { value: 'gamepass', label: 'Included in GamePass' },
    { value: 'debug', label: 'Debug (Don\'t use)' }
  ]
}

export default Vue.extend({
  components: {
    Layout,
    Input,
    Button,
    Admonition,
    Radio,
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      prod: null as any,
      broker: {
        until: '',
        flagTrash: false,
        flagThirdparty: false,
        flagPermanent: false,
        flagStaffPick: false,
        tags: '',
        rating: 0,
        prices: [] as any[],
        thumbnail: '',
        url: ''
      },
      dropdowns,
      processing: false
    }
  },
  computed: {
    storeOptions(): any[] {
      return this.$store.state.content.platforms.map((plat: any) => ({
        value: plat.code,
        label: plat.name
      }))
    },
    currencyOptions(): any[] {
      return this.$store.state.content.currencies.map((curr: any) => ({
        value: curr.code,
        label: curr.code?.toUpperCase()
      }))
    },
    editable(): boolean {
      return this.prod.status === 'pending'
    }
  },
  watch: {
    product: {
      deep: true,
      handler(val: any) {
        this.sync(val)
      }
    }
  },
  mounted() {
    this.sync(this.product)
  },
  methods: {
    sync(data: any) {
      this.prod = JSON.parse(JSON.stringify(data))
      if (!data) return

      if (!this.prod.data.until) {
        this.broker.until = ''
      } else {
        const d = new Date(this.prod.data.until)
        this.broker.until = `${d.toISOString().split('T')[0]}T${(d.getHours() + '').padStart(2, '0')}:${(d.getMinutes() + '').padStart(2, '0')}`
      }
      this.broker.flagTrash = !!(this.prod.data.flags & 1)
      this.broker.flagThirdparty = !!(this.prod.data.flags & 2)
      this.broker.flagPermanent = !!(this.prod.data.flags & 4)
      this.broker.flagStaffPick = !!(this.prod.data.flags & 8)
      this.broker.tags = this.prod.data.tags.join(', ') || ''
      this.broker.rating = ~~((this.prod.data.rating || 0) * 100)
      this.broker.prices = this.prod.data.prices
      this.broker.thumbnail = this.prod.data.images.find(i => (i.flags & 16))?.url
      this.broker.url = this.prod.data.urls.find(i => (i.flags & 1))?.url

      for (const price of this.broker.prices) {
        price.oldValue = (price.oldValue / 100)
        price.newValue = (price.newValue / 100)
      }
    },
    clickAddPrice(): void {
      this.prod.data.prices.push({
        currency: '',
        oldValue: 9.99,
        newValue: 0,
        converted: false
      })
      console.log(this.broker.prices[0].oldValue, typeof this.broker.prices[0].oldValue)
      console.log(this.broker.prices[0].newValue, typeof this.broker.prices[0].newValue)
    },
    compileChanges(): any {
      const data = { ...this.prod.data }

      data.until = this.broker.until
        ? new Date(this.broker.until).getTime()
        : null
      data.tags = this.broker.tags.split(',').map(s => s.trim()).filter(s => !!s)
      data.rating = this.broker.rating / 100
      data.flags = 0
      if (this.broker.flagTrash) data.flags |= (1 << 0)
      if (this.broker.flagThirdparty) data.flags |= (1 << 1)
      if (this.broker.flagPermanent) data.flags |= (1 << 2)
      if (this.broker.flagStaffPick) data.flags |= (1 << 3)
      data.prices = this.broker.prices
      for (const price of this.broker.prices) {
        price.oldValue = Math.round(parseFloat(price.oldValue + '') * 100)
        price.newValue = Math.round(parseFloat(price.newValue + '') * 100)
      }
      const thumbnailImage = this.prod.data.images.find(i => (i.flags & 16))
      if (thumbnailImage) thumbnailImage.url = this.broker.thumbnail
      else this.prod.data.images.push({ url: this.broker.thumbnail, flags: 16, priority: 10 })
      const orgUrl = this.prod.data.urls.find(i => (i.flags & 1))
      if (orgUrl) orgUrl.url = this.broker.url
      else this.prod.data.urls.push({ url: this.broker.url, flags: 1, priority: 10 })
      
      return { data }
    },
    clickRemovePrice(index: number): void {
      this.prod.data.prices.splice(index, 1)
    },
    clickSaveAndApprove(): void {
      openDismissableModal(
        this.$store,
        {
          title: 'Save and Approve?',
          text: 'This will save the changes and mark the data as correct. This will **NOT** publish the product anywhere. Please only approve the changes if the product is ready to be published in it\'s current form, other content moderators shall be able to rely on the "approved" stamp.\nPressing continue will dismiss this popup and never show it again.'
        },
        Dismissables.CMS_SAVE_AND_APPROVE_INFO,
        this.saveAndApprove
      )
    },
    async saveAndApprove(): Promise<void> {
      const payload = this.compileChanges()
      payload.status = 'approved'
      this.processing = true
      const { status, statusText, data } = await API.patchProduct(this.$route.params.id, payload)
      if (status === 200) {
        this.$router.push('/content/publishing')
      } else {
        openErrorModal(this.$store, status, statusText, data)
        this.processing = false
      }
    },
    clickSaveDraft(stayOnPage = false): void {
      openDismissableModal(
        this.$store,
        {
          title: 'Save as draft?',
          text: 'This will save the changes and mark the product as pending. This way other content mods will know to look over the data before publishing it.\nPressing continue will dismiss this popup and never show it again.'
        },
        Dismissables.CMS_SAVE_DRAFT_INFO,
        () => this.saveDraft(stayOnPage)
      )
    },
    async saveDraft(stayOnPage = false): Promise<void> {
      const payload = this.compileChanges()
      payload.status = 'pending'
      const { status, statusText, data } = await API.patchProduct(this.$route.params.id, payload)
      if (status === 200) {
        if (stayOnPage)
          this.$emit('fetch')
        else
          this.$router.push('/content/publishing')
      }
      else {
        openErrorModal(this.$store, status, statusText, data)
      }
    },
    clickDecline(): void {
      const clickOkay = () => {
        this.decline()
        return true
      }

      openModal(this.$store, {
        title: 'Decline this Product?',
        text: 'Only decline a product if you are sure we will not announce it in the near future. If it is only about invalid information, correct that info and approve the product.',
        buttons: [
          {
            type: 'red',
            text: 'Decline',
            onClick: clickOkay
          },
          {
            type: 'light',
            text: 'Cancel',
            onClick: () => true
          }
        ]
      })
    },
    async decline(): Promise<void> {
      const payload = { status: 'declined' }
      const { status, statusText, data } = await API.patchProduct(this.$route.params.id, payload)
      if (status === 200)
        this.$router.push('/content/publishing')
      else
        openErrorModal(this.$store, status, statusText, data)
    },
    fetchManually(): void {
      const callback = async (url: string, merge: boolean) => {
        const { status, statusText, data } = await API.postProductRefetch(this.$route.params.id, { url, merge })
        if (status !== 200)
          return openErrorModal(this.$store, status, statusText, data)

        this.$emit('fetch')
      }

      const popup: Popup<PopupType.NEW_PRODUCT> = {
        type: PopupType.NEW_PRODUCT,
        allowMerge: true,
        callback
      }

      this.$store.commit('openPopup', popup)
    }
  }
})
</script>

<style scoped lang="scss">
.thumbnail-preview {
  display: block;
  height: 200pt;
  width: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.bottom {
  position: sticky;
  bottom: 0;
  background-color: #000000cc;
  backdrop-filter: blur(10px);
  color: white;
  width: calc(100% + $box-padding * 2);
  margin-top: $box-padding;
  padding: $box-padding;
  box-sizing: border-box;
  border-radius: $box-br;
  border: 1px solid $bg-light;
  transform: translate(calc($box-padding * -1), $box-padding);
  display: flex;
  gap: $content-padding;

  .spacer {
    flex-grow: 1;
  }

  .usericons {
    width: $content-height;
    flex-shrink: 0;
  }

  p {
    flex-grow: 1;
    font-family: $font-major;
    text-align: center;
  }
}
</style>
