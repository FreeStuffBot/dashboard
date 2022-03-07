<template>
  <Container :class="{ 'loading-animation-queued': !loadingFinished }">
    <h1>Content Moderation</h1>
    <div class="shelf-box">
      <div class="box-header">
        <h2>Announcement</h2>
        <Button
          text="Publish"
          type="green"
        />
      </div>
      <div
        class="card-shelf"
        data-shelf="announcement"
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
          @rightclick="moveCardToShelf(product.id, 'announcement', 'pending')"
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
          @rightclick="moveCardToShelf(product.id, 'pending', 'announcement')"
        />
        <span v-if="!products.pending.length">Drag Items Here</span>
      </div>
    </div>

    <Layout name="3static">
      <Pagelink
        title="View Published"
        text="Show a list of all published products."
        icon="emojis/twemoji_news"
        to="/content/history"
      />
      <Pagelink
        title="Edit Platforms"
        text="Change names, assets, meta info, and more"
        icon="emojis/twemoji_shopping_cart"
        to="/content/platforms"
      />
      <Pagelink
        title="Edit Currencies"
        text="Change names, assets, and more"
        icon="emojis/twemoji_coin"
        to="/content/currencies"
      />
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'
import { Popup, PopupType, openErrorModal, openConfirmDialogue } from '../../lib/popups'
import ProductCard from '~/components/ProductCard.vue'
import Container from '~/components/layout/Container.vue'
import Button from '~/components/entities/Button.vue'
import Pagelink from '~/components/entities/Pagelink.vue'


export default Vue.extend({
  components: {
    ProductCard,
    Container,
    Button,
    Pagelink
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status } = await API.getProductList({ queryName: 'pending' })
    if (status !== 200) return // TODO SHOW ERROR

    for (const product of data)
      product._shelf = 'pending'

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
        announcement: [],
        pending: []
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
        const next = await openConfirmDialogue(this.$store, 'Hold up!', 'This product is not approved yet. Do you want to continue anyway?')
        console.log(next)
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
    async action(type: string) {
      if (type === 'new_url') {
        const { value: url } = await Swal.fire({
          input: 'url',
          inputPlaceholder: 'Enter the URL'
        })

        if (url) {
          Swal.fire({
            title: 'Fetching Information!',
            html: 'Please hold on...',
            timerProgressBar: true
          })
          Swal.showLoading()

          const game = await API.postNewUrl(url)
          if (game.data.error) {
            Swal.fire({
              title: game.data.error,
              icon: 'error'
            })
          } else if (game.data._id) {
            Swal.close()
            this.$router.replace(`/content/${game.data._id}`)
          } else {
            Swal.fire({
              title: 'Failed to fetch data.',
              icon: 'error'
            })
          }
        }
      }
      if (type === 'new_scratch') {
        const data = await Swal.fire({
          title: 'New Announcement?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3e9e71',
          confirmButtonText: 'Yea'
        })

        if (data.value) {
          const game = await API.postNewScratch()
          this.$router.replace(`/content/${game.data._id}`)
        }
      }
      if (type === 'scrape_store') {
        const { value: store } = await Swal.fire({
          title: 'Which store would you like to get scraped?',
          text: 'CURRENTLY BROKEN .... REEEE',
          input: 'select',
          inputOptions: {
            steam: 'Steam',
            epic: 'Epic Games Store'
          },
          inputPlaceholder: 'Select a store',
          showCancelButton: true
        })

        if (store) {
          Swal.fire({
            title: `Scraping ${this.lang[store]}...`,
            html: 'Please hold on...',
            timerProgressBar: true
          })
          Swal.showLoading()

          const res = await API.postScrapeStore(store)
          if (res.data.success) {
            Swal.close()
            Swal.fire({
              title: 'Success!',
              text: 'Found something, take a look!',
              icon: 'success'
            })
            this.$fetch()
          } else {
            Swal.fire({
              title: 'Failed to fetch data.',
              text: `Here's why:\n${res.data.error}`,
              icon: 'error'
            })
          }
        }
      }
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
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;

  &[minor] { color: #888888; }
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

h1 img {
  height: 11pt;
  opacity: .4;
  padding: 3px;
  margin: 0 0 0 3px;
  cursor: pointer;

  &:hover { opacity: .7; }
}

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
  gap: $content-padding;
  // border: 2px dashed #565656;
  margin: $content-padding $content-padding 0 $content-padding;

  &[dragover] {
    border-color: $color-green;
    background-color: $color-green-20;

    * { pointer-events: none; }
  }

  & > span {
    position: absolute;
    color: $color-minor;
    display: block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
