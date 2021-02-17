<template>
  <div class="app-container">
    <div v-if="user">
      <account :user="user" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Account from './components/Account'

export default {
  name: 'Setting',
  components: { Account },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name
      }
    }
  }
}
</script>
