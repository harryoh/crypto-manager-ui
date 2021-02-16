import { getRules } from '@/api/alarm-rule'

const state = {
  rules: []
}

const mutations = {
  SET_RULES: (state, rules) => {
    state.rules = rules
  }
}

const actions = {
  // get alarm rules
  alarmRules({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRules(state.token).then(response => {
        const { data } = response
        commit('SET_RULES', data.rules)
        resolve(data.rules)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
