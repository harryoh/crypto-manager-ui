<template>
  <el-row style="margin-top:5px;">
    <el-card class="box-card">
      <div class="clearfix">
        <strong>바이빗</strong>
      </div>
      <div>
        <el-table
          :data="bybitData"
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
            prop="FundingRate"
            label="펀딩비용"
            min-width="60px"
          />
          <el-table-column
            prop="PredictedFundingRate"
            label="N펀딩비용"
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
import { toTimeStrSimple, tableRowClassName, numberWithCommas } from '@/utils'

export default {
  data() {
    return {
      bybitData: [],
      ws: null
    }
  },
  computed: {
    ...mapGetters([
      'bybitPrice'
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
    getPrice() {
      const wsurl = 'wss://stream.bybit.com/realtime'
      this.ws = new WebSocket(wsurl)

      this.ws.onopen = () => {
        this.ws.send('{"op": "subscribe", "args": ["trade.BTCUSD|ETHUSD|XRPUSD"]}')
      }

      this.ws.onmessage = this.setPrice

      this.ws.onerror = (err) => {
        console.error(err)
        setTimeout(this.getPrice, 1000)
      }
    },
    setPrice(evt) {
      const res = JSON.parse(evt.data)
      if (!res.data) return
      const info = res.data[res.data.length - 1]
      const symbol = info.symbol.substring(0, 3)

      this.$store.dispatch('prices/setCoin', {
        key: 'bybitPrice',
        coin: symbol,
        value: {
          ...this.bybitPrice[symbol],
          Symbol: symbol,
          Price: info.price,
          Timestamp: parseInt(info.trade_time_ms / 1000)
        }
      })
      this.bybitData = Object.values(this.bybitPrice)
    }
  }
}
</script>
