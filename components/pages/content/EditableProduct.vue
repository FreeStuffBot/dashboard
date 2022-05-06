<template>
  <div v-if="prod">
    <h1 v-text="prod.data.title || ':)'" />
    <h2>General Information</h2>
    <Layout name="component-flow">
      <Input v-model="prod.data.title" label="Title" :error="!prod.data.title" />
      <Input v-model="prod.data.urls.org" label="URL" :error="!prod.data.urls.org" />
      <Layout name="2static">
        <Input v-model="prod.data.type" label="Type" :options="dropdowns.type" :error="prod.data.type === 'unknown'" />
        <Input v-model="prod.data.kind" label="Kind" :options="dropdowns.kind" :error="prod.data.kind === 'other'" />
      </Layout>
      <Layout name="2static">
        <Input v-model="broker.until" type="datetime-local" :label="broker.until ? 'Until' : 'Until (hidden)'" :num-min="new Date().toISOString().split('T')[0]+'T00:00'" :num-step="60" />
      </Layout>
    </Layout>

    <!--  -->

    <h2>Product Details</h2>
    <Layout name="component-flow">
      <Input v-model="prod.data.description" label="Description" :multiline="true" :error="!prod.data.description" />
      <Layout name="2static">
        <Input v-model="prod.data.platform" label="Platform" :options="platformOptions" />
        <Input v-model="broker.rating" label="Rating (0-100)" type="number" :num-min="0" :num-max="100" />
      </Layout>
      <Input v-model="broker.tags" label="Tags (Comma Separated)" placeholder="Single Player, Co-Op, wait that doesnt make sense" />
    </Layout>

    <!--  -->

    <h2>Pricing</h2>
    <Layout name="$1221" :tight="true">
      <label>Currency</label>
      <label>Old Price</label>
      <label>New Price</label>
    </Layout>
    <Layout name="component-flow">
      <Layout name="component-flow" :tight="true">
        <Layout v-for="(price, index) of broker.prices" :key="index" name="$1221" :tight="true">
          <Input v-model="price.currency" :options="currencyOptions" />
          <Input v-model="price.oldValue" type="number" :num-min="0" :num-step="0.01" />
          <Input v-model="price.newValue" type="number" :num-min="0" :num-step="0.01" />
          <Button
            type="light"
            text="Remove"
            @click="clickRemovePrice(index)"
          />
        </Layout>
      </Layout>

      <Layout name="inline">
        <Button
          type="green"
          text="Add Currency"
          @click="clickAddPrice()"
        />
      </Layout>
    </Layout>

    <!--  -->

    <h2>Assets</h2>
    <Layout name="component-flow">
      <Input v-model="prod.data.thumbnails.org" label="Thumbnail" placeholder="https://cdn.akamai.steamstatic.com/steam/apps/1172050/header.jpg" :error="!prod.data.thumbnails.org">
        <template #preview>
          <div class="thumbnail-preview" :style="`background-image: url('${prod.data.thumbnails.org}')`" />
        </template>
      </Input>
    </Layout>

    <!--  -->

    <h2>Metadata</h2>
    <label>Flags</label>
    <Layout name="component-flow">
      <Layout name="3static" :tight="true">
        <Input v-model="broker.flagTrash" type="toggle" placeholder="Trash Game" />
        <Input v-model="broker.flagThirdParty" type="toggle" placeholder="Third Party Provider" />
        <Input v-model="broker.flagPermanent" type="toggle" placeholder="Permanent Change" />
        <Input v-model="broker.flagStaffPick" type="toggle" placeholder="Staff Pick" />
      </Layout>
      <Input v-model="prod.data.notice" label="Notice (Optional)" :multiline="true" />
      <div v-if="prod.data.platform === 'steam'">
        <Input v-model="prod.data.platformMeta.steamSubids" label="Steam Subids (Comma Separated)" placeholder="12345, 6789" />
      </div>
    </Layout>

    <!--  -->

    <h2>The Bottom</h2>
    <Layout name="inline">
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
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../../lib/api'
import Dismissables from '../../../lib/dismissables'
import { openDismissableModal, openErrorModal, openModal } from '../../../lib/popups'
import Layout from '~/components/layout/Layout.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'

const dropdowns = {
  kind: [
    { value: 'game', label: 'Game' },
    { value: 'dlc', label: 'DLC' },
    { value: 'software', label: 'General Software' },
    { value: 'art', label: 'Artwork (Digital)' },
    { value: 'ost', label: 'OST / Soundtrack' },
    { value: 'book', label: 'Book / EBook' },
    { value: 'other', label: 'Other' }
  ],
  type: [
    { value: 'keep', label: 'Free to keep' },
    { value: 'timed', label: 'Free to play (weekend)' },
    { value: 'prime', label: 'Included in Prime' },
    { value: 'gamepass', label: 'Included in GamePass' },
    { value: 'other', label: 'Other' }
  ]
}

export default Vue.extend({
  components: {
    Layout,
    Input,
    Button
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
        prices: [] as any[]
      },
      dropdowns
    }
  },
  computed: {
    platformOptions(): any[] {
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
      data.tags = this.broker.tags.split(',').map(s => s.trim())
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
      const { status, statusText, data } = await API.patchProduct(this.$route.params.id, payload)
      if (status === 200)
        this.$router.push('/content')
      else
        openErrorModal(this.$store, status, statusText, data)
    },
    clickSaveDraft(): void {
      openDismissableModal(
        this.$store,
        {
          title: 'Save as draft?',
          text: 'This will save the changes and mark the product as pending. This way other content mods will know to look over the data before publishing it.\nPressing continue will dismiss this popup and never show it again.'
        },
        Dismissables.CMS_SAVE_DRAFT_INFO,
        this.saveDraft
      )
    },
    async saveDraft(): Promise<void> {
      const payload = this.compileChanges()
      payload.status = 'pending'
      const { status, statusText, data } = await API.patchProduct(this.$route.params.id, payload)
      if (status === 200)
        this.$router.push('/content')
      else
        openErrorModal(this.$store, status, statusText, data)
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
        this.$router.push('/content')
      else
        openErrorModal(this.$store, status, statusText, data)
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
</style>
