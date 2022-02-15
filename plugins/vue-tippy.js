import Vue from 'vue'

Vue.use(require('vue-tippy').default, {
  arrow: true,
  arrowType: 'round',
  animation: 'vertical',
  duration: 100,
  theme: 'black'
})
Vue.component('tippy', require('vue-tippy').TippyComponent)
