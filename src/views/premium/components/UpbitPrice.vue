<template>
  <el-row style="margin-top:5px;">
    <el-card class="box-card">
      <div class="clearfix">
        <strong>업비트</strong>
      </div>
      <div>
        <el-table
          :data="upbitData"
          stripe
          style="width: 100%"
          size="medium"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="Symbol"
            label="코인"
            min-width="30px"
          />
          <el-table-column width="10px">
            <span class="dot" />
          </el-table-column>
          <el-table-column
            prop="Price"
            label="가격"
            min-width="60px"
            :formatter="numberWithCommas"
          />
          <el-table-column
            prop="FixPremium"
            label="고정P"
            min-width="60px"
          />
          <el-table-column
            prop="CurrPremium"
            label="현재P"
            min-width="60px"
          />
          <el-table-column
            prop="Timestamp"
            label="시간"
            min-width="30px"
            :formatter="toTimeStrSimple"
          />
        </el-table>
      </div>
    </el-card>
  </el-row>
</template>

<script>

import { mapGetters } from 'vuex'
import { toTimeStrSimple, tableRowClassName, numberWithCommas, getPremium } from '@/utils'

export default {
  data() {
    return {
      upbitData: [],
      ws: null
    }
  },
  computed: {
    ...mapGetters([
      'currencyRate',
      'bybitPrice',
      'upbitPrice'
    ])
  },
  mounted() {
    this.getPrice()
  },
  destroyed() {
    this.ws && this.ws.close()
  },
  methods: {
    toTimeStrSimple,
    tableRowClassName,
    numberWithCommas,
    getPremium,
    getPrice() {
      const wsurl = 'wss://api.upbit.com/websocket/v1'
      this.ws = new WebSocket(wsurl)

      this.ws.binaryType = 'arraybuffer'
      this.ws.onopen = () => {
        this.ws.send('[{"ticket":"UNIQUE_TICKET"},{"type":"trade","codes":["KRW-BTC","KRW-ETH","KRW-XRP"]}]')
      }

      this.ws.onmessage = this.setPrice

      this.ws.onerror = (err) => {
        console.error(err)
        setTimeout(this.getPrice, 1000)
      }
    },
    setPrice(evt) {
      const enc = new TextDecoder('utf-8')
      const arr = new Uint8Array(evt.data)
      const info = JSON.parse(enc.decode(arr))
      const symbol = info.code.substring(4, 8)

      this.$store.dispatch('prices/setCoin', {
        key: 'upbitPrice',
        coin: symbol,
        value: {
          Symbol: symbol,
          Price: info.trade_price,
          Timestamp: parseInt(info.trade_timestamp / 1000)
        }
      })
      if (Object.keys(this.bybitPrice).length < 3) return
      this.upbitData = Object.values(this.upbitPrice).map(o => {
        const bybit = this.bybitPrice[o.Symbol]?.Price
        return {
          ...o,
          'FixPremium': this.getPremium(bybit, o.Price, this.currencyRate.fixExchangeRate) + '%',
          'CurrPremium': this.getPremium(bybit, o.Price, this.currencyRate.exchangeRate) + '%'
        }
      })
    }
  }
}
</script>
