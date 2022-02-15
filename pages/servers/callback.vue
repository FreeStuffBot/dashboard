<template>
  <div />
</template>

<script>
export default {
  layout: 'fullscreen',
  mounted() {
    const daddy = window.self
    daddy.opener = window.self
    daddy.close()
  }
}
</script>
