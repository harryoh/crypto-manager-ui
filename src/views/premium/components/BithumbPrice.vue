<template>
  <el-row style="margin-top:5px;">
    <el-card class="box-card">
      <div class="clearfix">
        <strong>빗썸</strong>
      </div>
      <div>
        <el-table
          :data="bithumbData"
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
          <el-table-column width="10px">
            <span class="dot" />
          </el-table-column>
          <el-table-column
            prop="Timestamp"
            label="시간"
            min-width="30px"
            :formatter="toSecAgo"
          />
        </el-table>
      </div>
    </el-card>
  </el-row>
</template>

<script>

import { mapGetters } from 'vuex'
import {
  tableRowClassName, numberWithCommas, getPremium, toSecAgo
} from '@/utils'

export default {
  data() {
    return {
      bithumbData: [],
      ws: null
    }
  },
  computed: {
    ...mapGetters([
      'currencyRate',
      'bybitPrice',
      'bithumbPrice'
    ])
  },
  mounted() {
    this.getPrice()
  },
  destroyed() {
    this.ws && this.ws.close()
  },
  methods: {
    tableRowClassName,
    numberWithCommas,
    getPremium,
    toSecAgo,
    getPrice() {
      const wsurl = 'wss://pubwss.bithumb.com/pub/ws'
      this.ws = new WebSocket(wsurl)

      this.ws.binaryType = 'arraybuffer'
      this.ws.onopen = () => {
        this.ws.send('{"type":"transaction", "symbols":["BTC_KRW","ETH_KRW","XRP_KRW"]}')
      }

      this.ws.onmessage = this.setPrice

      this.ws.onerror = (err) => {
        console.error(err)
        setTimeout(this.getPrice, 1000)
      }
    },
    setPrice(evt) {
      const res = JSON.parse(evt.data)
      if (!res.content) return

      const info = res.content.list[res.content.list.length - 1]
      const symbol = info.symbol.substring(0, 3)
      const timestr = info.contDtm.replace(/ /, 'T')
      const time_ms = new Date(timestr).getTime()

      this.$store.dispatch('prices/setCoin', {
        key: 'bithumbPrice',
        coin: symbol,
        value: {
          Symbol: symbol,
          Price: info.contPrice,
          Timestamp: parseInt(time_ms / 1000)
        }
      })

      if (Object.keys(this.bybitPrice).length < 3) return

      this.bithumbData = Object.values(this.bithumbPrice).map(o => {
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
