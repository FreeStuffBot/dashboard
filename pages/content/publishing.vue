<template>
  <Container :class="{ 'loading-animation-queued': !loadingFinished }">
    <h1>Content Publishing</h1>
    <div class="shelf-box">
      <div class="box-header">
        <h2>New Announcement</h2>
        <Button
          text="Publish"
          :type="products.announcement.length ? 'green' : 'light'"
          @click="publish"
        />
      </div>
      <div
        class="card-shelf"
        data-shelf="announcement"
        :dragpage="!!currentlyDragging"
        :dragover="currentlyOver === 'announcement'"
        @dragover="groupDragOver"
        @dragleave="groupDragLeave"
      >
        <ProductCard
          v-for="product of products.announcement"
          :key="product.name"
          :data-id="product.id"
          :data-shelf="product._shelf"
          :data="product"
          :dragged="currentlyDragging == product.id"
          @dragstart="cardDragStart"
          @dragend="cardDragEnd"
          @moveannounce="moveCardToShelf(product.id, 'announcement', 'pending')"
        />
        <span v-if="!products.announcement.length">Drag Items Here</span>
      </div>
    </div>

    <div class="shelf-box">
      <div class="box-header">
        <h2>Pending</h2>
        <Button
          text="New"
          type="green"
          @click="newProduct"
        />
      </div>
      <div
        class="card-shelf"
        data-shelf="pending"
        :dragpage="!!currentlyDragging"
        :dragover="currentlyOver === 'pending'"
        @dragover="groupDragOver"
        @dragleave="groupDragLeave"
      >
        <ProductCard
          v-for="product of products.pending"
          :key="product.name"
          :data-id="product.id"
          :data-shelf="product._shelf"
          :data="product"
          :dragged="currentlyDragging == product.id"
          @dragstart="cardDragStart"
          @dragend="cardDragEnd"
          @moveannounce="moveCardToShelf(product.id, 'pending', 'announcement')"
        />
        <span v-if="!products.pending.length">Drag Items Here</span>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import { Popup, PopupType, openErrorModal, openConfirmDialogue, openInfoDialogue } from '../../lib/popups'
import ProductCard from '~/components/cards/ProductCard.vue'
import Container from '~/components/layout/Container.vue'
import Button from '~/components/entities/Button.vue'


export default Vue.extend({
  components: {
    ProductCard,
    Container,
    Button
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status } = await API.getProductList({ queryName: 'pending' })
    if (status !== 200) return // TODO SHOW ERROR

    for (const product of data)
      product._shelf = 'pending'

    this.products.announcement = []
    this.products.pending = data

    // eslint-disable-next-line nuxt/no-timing-in-fetch-data
    setTimeout(() => (this.loadingFinished = true), 10)
  },
  data() {
    return {
      lang: this.$store.state.lang,
      loadingFinished: false,
      dragSourceShelf: '',
      currentlyDragging: 0,
      currentlyOver: '',
      products: {
        announcement: [] as any[],
        pending: [] as any[]
      }
    }
  },
  methods: {
    cardDragStart(e: any) {
      if (!e.target) return
      const id = parseInt(e.target.getAttribute('data-id'))
      this.dragSourceShelf = e.target.getAttribute('data-shelf')
      setTimeout(() => (this.currentlyDragging = id), 20)
    },
    cardDragEnd() {
      if (!this.currentlyOver || this.currentlyOver === this.dragSourceShelf) {
        this.currentlyDragging = 0
        this.currentlyOver = ''
        return
      }

      this.moveCardToShelf(this.currentlyDragging, this.dragSourceShelf, this.currentlyOver)

      this.currentlyDragging = 0
      this.currentlyOver = ''
    },
    groupDragOver(e: any) {
      if (!this.currentlyDragging) return
      e.preventDefault()
      this.currentlyOver = e.target.getAttribute('data-shelf')
    },
    groupDragLeave(e: any) {
      if (this.currentlyOver === e.target.getAttribute('data-shelf'))
        this.currentlyOver = ''
    },
    async moveCardToShelf(cardId: number, src: string, dest: string) {
      const srcShelf = (this.products as any)[src]
      const destShelf = (this.products as any)[dest]
      const cardIndex = srcShelf.findIndex((i: any) => (i.id === cardId))
      const card = srcShelf[cardIndex]

      if (dest === 'announcement' && card.status !== 'approved') {
        const next = await openConfirmDialogue(this.$store, 'Hold up!', 'This product is not approved yet. Do you want to continue anyway?\n\nClicking on continue will mark the game as approved by you.')
        // TODO approve the game
        if (!next) return
      }

      const item = srcShelf?.splice(cardIndex, 1)[0]
      item._shelf = dest
      destShelf.push(item)
    },
    newProduct() {
      const callback = async (url: string) => {
        const { status, statusText, data } = await API.postProduct({ url })
        if (status !== 200)
          return openErrorModal(this.$store, status, statusText, data)

        this.$router.push(`/content/${data.id}`)
      }

      const popup: Popup<PopupType.NEW_PRODUCT> = {
        type: PopupType.NEW_PRODUCT,
        callback
      }

      this.$store.commit('openPopup', popup)
    },
    async publish() {
      const products = this.products.announcement
      if (!products.length) return

      const next = await openConfirmDialogue(
        this.$store,
        products.length === 1
          ? 'Publish this product?'
          : `Publish these ${products.length} products?`,
        products.map(p => p.data.title).join(', ')
      )
      if (!next) return

      const { status, statusText, data } = await API.postAnnouncement({
        products: products.map(p => p.id)
      })

      if (status === 200) {
        await openInfoDialogue(
          this.$store,
          'Success!',
          'Announcement Published!\nThanks and have a great day!'
        )
        this.$fetch()
        return
      }

      openInfoDialogue(
        this.$store,
        `Error http ${status}: ${statusText}`,
        data.message ?? 'no details'
      )
    }
  },
  head() {
    return {
      title: 'FreeStuff CMS'
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
.shelf-box {
  border-radius: $box-br;
  background-color: $bg-dark;
  display: block;
  padding-bottom: $content-padding;
  margin-bottom: $content-height;
  overflow: hidden;

  .box-header {
    background-color: $bg-darker;
    padding: $content-padding;
    height: $content-height;
    box-sizing: content-box;
    display: flex;
    align-items: center;

    h2 {
      margin: 0 0 0 $content-padding;
      flex-grow: 1;
    }
  }
}

.card-shelf {
  position: relative;
  min-height: 50pt;
  padding: $content-padding;
  border-radius: $content-br;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 2px dashed transparent;
  gap: $content-padding;
  margin: $content-padding $content-padding 0 $content-padding;
  transition:
    border-color .2s ease,
    background-color .1s ease;

  &[dragover] {
    background-color: $color-green-20;
    border-color: $color-green !important;

    * { pointer-events: none; }
  }

  &[dragpage] {
    border-color: $color-border;

    * { pointer-events: none; }
  }

  & > span {
    font-family: $font-regular;
    font-size: 11pt;
    position: absolute;
    color: $color-minor;
    display: block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media screen and (max-width: $res-tablet-width) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: $res-mobile-width) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
