<template>
  <div class="container">
    <h1 v-text="user.display" />
    <div id="map" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import API from '../../../lib/api'


export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const { data } = await API.adminGetUser(this.$route.params.id)
    this.user = data
    if (this.map)
      this.mountMarkers()
  },
  data() {
    return {
      map: null as any,
      user: {} as any
    }
  },
  mounted() {
    setTimeout(() => this.createMap(), 500)
  },
  methods: {
    createMap() {
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFhbmV4IiwiYSI6ImNranZvaDk2cjBhdzgycXJ2cHk1dHM1MjcifQ.ve_koo1QnKg9jY9MU_9IQg'
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 2,
        center: [ 0, 0 ]
      })

      if (this.user.logins)
        this.mountMarkers()
    },
    mountMarkers() {
      const logins = this.user.logins || []
      logins.forEach((l: any) => {
        new mapboxgl.Marker()
          .setLngLat([ l.lo, l.la ])
          .addTo(this.map)
      })
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Users'
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
h1 {
  position: relative;
  z-index: 100;
  text-shadow: 0 1px 3px #00000044;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  outline: none !important;
  overflow: none;
}
</style>
