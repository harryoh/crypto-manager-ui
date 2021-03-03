const state = {
  currencyRate: {},
  bybitPrice: {},
  upbitPrice: {},
  bithumbPrice: {}
}

const mutations = {
  SET_PRICE: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_CURRENCY: (state, value) => {
    // state[key] = Object.assign(state[key], value)
    value.fixExchangeRate = 1200
    state.currencyRate = value
  }
}

const actions = {
  setPrice({ commit }, data) {
    commit('SET_PRICE', data)
  },
  setCurrency({ commit }, data) {
    commit('SET_CURRENCY', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
