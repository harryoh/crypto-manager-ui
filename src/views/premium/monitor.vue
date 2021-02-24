<template>
  <div class="premium-container">
    <el-row>
      <el-card class="box-card">
        <div>
          <el-table
            :data="currencyData"
            size="medium"
            style="width: 100%"
          >
            <el-table-column
              prop="item"
              label=""
              min-width="60px"
            />
            <el-table-column
              prop="fixExchangeRate"
              label="고정환율"
              min-width="60px"
            />
            <el-table-column
              prop="exchangeRate"
              label="현재환율"
              min-width="60px"
            />
            <el-table-column
              prop="timestamp"
              label="시간"
              min-width="50px"
              :formatter="toTimeStrSimple"
            />
          </el-table>
        </div>
      </el-card>
    </el-row>

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

    <el-row style="margin-top:5px;">
      <el-card class="box-card">
        <div class="clearfix">
          <strong>알람</strong>
        </div>
        <div>
          <el-table
            :data="alarmData"
            size="medium"
            style="width: 100%"
          >
            <el-table-column
              prop="Exchange"
              label="거래소"
              min-width="60px"
            />
            <el-table-column
              prop="Symbol"
              label="코인"
              min-width="60px"
            />
            <el-table-column
              prop="Use"
              label="사용여부"
              min-width="60px"
              :formatter="boolToStr"
            />
            <el-table-column
              prop="AlarmMin"
              label="최소P"
              min-width="60px"
            />
            <el-table-column
              prop="AlarmMax"
              label="최대P"
              min-width="60px"
            />
            <el-table-column
              label=""
              min-width="40px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="alarmEdit(scope.$index, scope.row)"
                >수정</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-row>
    <el-dialog title="Alarm Edit" :visible.sync="alarmFormVisible" width="60%">
      <el-form :model="alarmForm">
        <el-form-item label="사용">
          <el-radio-group v-model="alarmForm.Use">
            <el-radio :label="true">Y</el-radio>
            <el-radio :label="false">N</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-select v-model="alarmForm.Exchange" placeholder="거래소">
            <el-option
              v-for="item in exchangeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="alarmForm.Symbol" placeholder="코인">
            <el-option
              v-for="item in coinList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="최소P">
          <el-input-number
            v-model="alarmForm.AlarmMin"
            size="mini"
            :precision="1"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item label="최대P">
          <el-input-number
            v-model="alarmForm.AlarmMax"
            size="mini"
            :precision="1"
            :step="0.1"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alarmFormVisible = false">취소</el-button>
        <el-button type="primary" @click="onAlarmSubmit">저장</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPrice, updateAlarm } from '@/api/price'
import { Message } from 'element-ui'

export default {
  name: 'Premium',
  data() {
    return {
      loop: true,
      fixExchangeRate: 1200,
      currExchangeRate: 0,
      currencyData: [],
      bybitData: [],
      upbitData: [],
      bithumbData: [],
      alarmData: [],
      bybitPrice: {
        'BTC': {},
        'ETH': {},
        'XRP': {}
      },
      upbitPrice: {
        'BTC': {},
        'ETH': {},
        'XRP': {}
      },
      bithumbPrice: {
        'BTC': {},
        'ETH': {},
        'XRP': {}
      },
      fundingRate: 0,
      PredictedFundingRate: 0,
      bybitws: false,
      upbitws: false,
      bithumbws: false,
      alarmFormVisible: false,
      alarmForm: {},
      exchangeList: [{
        value: 'all',
        label: 'All'
      }, {
        value: 'bithumb',
        label: 'Bithumb'
      }, {
        value: 'upbit',
        label: 'Upbit'
      }],
      coinList: [{
        value: 'all',
        label: 'All'
      }, {
        value: 'BTC',
        label: 'BTC'
      }, {
        value: 'ETH',
        label: 'ETH'
      }]
    }
  },
  computed: {
    tz_kr() {
      return 9 * 60 * 60
    }
  },
  mounted() {
    this.fetchData()
    this.getBybitPrice()
    this.getUpbitPrice()
    this.getBithumbPrice()
  },
  destroyed() {
    this.loop = false
    this.bybitws && this.bybitws.close()
    this.upbitws && this.upbitws.close()
    this.bithumbws && this.bithumbws.close()
  },
  methods: {
    fetchData() {
      getPrice().then(response => {
        const data = response.data
        for (const item in data) {
          switch (item) {
            case 'Currency':
              this.setCurrencyPrice(data[item])
              break
            case 'BybitPrice':
              this.bybitPrice = {
                'BTC': data[item].Price.find(x => x.Symbol === 'BTC') || 0,
                'ETH': data[item].Price.find(x => x.Symbol === 'ETH') || 0,
                'XRP': data[item].Price.find(x => x.Symbol === 'XRP') || 0
              }
              break
            case 'Rules':
              this.alarmData = data[item]
          }
        }
        this.checkWebsocket(this.bybitws)
        this.checkWebsocket(this.upbitws)
        this.checkWebsocket(this.bithumbws)
        this.loop && setTimeout(this.fetchData, 10000)
      }).catch(err => {
        console.error(err)
        this.loop && setTimeout(this.fetchData, 3000)
      })
    },
    checkWebsocket(ws) {
      if (ws.readyState !== 1) {
        ws = new WebSocket(ws.url)
      }
    },
    getBybitPrice() {
      const wsurl = 'wss://stream.bybit.com/realtime'
      const ws = new WebSocket(wsurl)

      ws.onopen = () => {
        ws.send('{"op": "subscribe", "args": ["trade.BTCUSD|ETHUSD|XRPUSD"]}')
      }

      ws.onmessage = this.setBybitPrice

      ws.onerror = (err) => {
        console.error(err)
        this.checkWebsocket(ws)
      }

      this.bybitws = ws
    },
    getUpbitPrice() {
      const wsurl = 'wss://api.upbit.com/websocket/v1'
      const ws = new WebSocket(wsurl)

      ws.binaryType = 'arraybuffer'
      ws.onopen = () => {
        ws.send('[{"ticket":"UNIQUE_TICKET"},{"type":"trade","codes":["KRW-BTC","KRW-ETH","KRW-XRP"]}]')
      }

      ws.onmessage = this.setUpbitPrice

      ws.onerror = (err) => {
        console.error(err)
        this.checkWebsocket(ws)
      }

      this.upbitws = ws
    },
    getBithumbPrice() {
      const wsurl = 'wss://pubwss.bithumb.com/pub/ws'
      const ws = new WebSocket(wsurl)

      ws.binaryType = 'arraybuffer'
      ws.onopen = () => {
        ws.send('{"type":"transaction", "symbols":["BTC_KRW","ETH_KRW","XRP_KRW"]}')
      }

      ws.onmessage = this.setBithumbPrice

      ws.onerror = (err) => {
        console.error(err)
        this.checkWebsocket(ws)
      }

      this.bithumbws = ws
    },
    tableRowClassName({ row }) {
      const timestamp = row.timestamp || row.Timestamp
      const now = parseInt((+new Date() / 1000))
      return (timestamp + 5 < now) ? 'warning-row' : ''
    },
    toTimeStr(row) {
      const timestamp = row.timestamp || row.Timestamp
      const iso = new Date((Number(timestamp) + this.tz_kr) * 1000).toISOString()
      return iso.slice(-13, -5)
    },
    toTimeStrSimple(row) {
      const timestamp = row.timestamp || row.Timestamp
      if (!timestamp) return
      const iso = new Date((Number(timestamp) + this.tz_kr) * 1000).toISOString()
      return iso.slice(-10, -5)
    },
    numberWithCommas(row) {
      const price = row.Price
      if (!price || price < 1) return price || 0
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    boolToStr(row) {
      return (row.Use) ? 'Y' : 'N'
    },
    timeStrToSec(timestr) {
      const sec = timestr.split(':').reduce((acc, time) => (60 * acc) + +time)
      return sec
    },
    getPremium(symbol, price, rate) {
      const bybitPrice = this.bybitPrice[symbol]?.Price
      if (!bybitPrice) return 0
      return parseFloat((price - bybitPrice * rate) / price * 100).toFixed(3)
    },
    alarmEdit(index, row) {
      this.alarmForm = this.alarmData[index]
      this.alarmForm.index = index
      this.alarmFormVisible = true
    },
    onAlarmSubmit() {
      if (this.alarmForm.AlarmMin > this.alarmForm.AlarmMax) {
        Message({
          message: '최소값이 최대값보다 더 큽니다.',
          type: 'error',
          duration: 5 * 1000
        })
        return false
      }
      this.alarmData[this.alarmForm.index] = this.alarmForm
      updateAlarm(this.alarmData).then(response => {
        this.alarmFormVisible = false
      })
    },
    setCurrencyPrice(data) {
      const currency = data.Price.find(x => x.Symbol === 'USD_KRW')
      this.currExchangeRate = parseFloat(Number(currency.Price).toFixed(3))
      this.currencyData = [{
        'item': currency.Symbol,
        'fixExchangeRate': this.fixExchangeRate,
        'exchangeRate': this.currExchangeRate,
        'timestamp': currency.Timestamp
      }]
    },
    setBybitPrice(evt) {
      const res = JSON.parse(evt.data)
      if (!res.data) return
      const info = res.data[res.data.length - 1]
      const symbol = info.symbol.substring(0, 3)

      this.bybitPrice[symbol] = {
        ...this.bybitPrice[symbol],
        Symbol: symbol,
        Price: info.price,
        Timestamp: parseInt(info.trade_time_ms / 1000)
      }
      this.bybitData = Object.values(this.bybitPrice)
    },
    setBithumbPrice(evt) {
      const res = JSON.parse(evt.data)
      if (!res.content) return

      const info = res.content.list[res.content.list.length - 1]
      const symbol = info.symbol.substring(0, 3)
      const timestr = info.contDtm.replace(/ /, 'T')
      const time_ms = new Date(timestr).getTime()

      this.bithumbPrice[symbol] = {
        Symbol: symbol,
        Price: info.contPrice,
        Timestamp: parseInt(time_ms / 1000)
      }

      this.bithumbData = Object.values(this.bithumbPrice).map(o => {
        return {
          ...o,
          'FixPremium': this.getPremium(o.Symbol, o.Price, this.fixExchangeRate) + '%',
          'CurrPremium': this.getPremium(o.Symbol, o.Price, this.currExchangeRate) + '%'
        }
      })
    },
    setUpbitPrice(evt) {
      const enc = new TextDecoder('utf-8')
      const arr = new Uint8Array(evt.data)
      const info = JSON.parse(enc.decode(arr))
      const symbol = info.code.substring(4, 8)
      this.upbitPrice[symbol] = {
        Symbol: symbol,
        Price: info.trade_price,
        Timestamp: parseInt(info.trade_timestamp / 1000)
      }

      this.upbitData = Object.values(this.upbitPrice).map(o => {
        return {
          ...o,
          'FixPremium': this.getPremium(o.Symbol, o.Price, this.fixExchangeRate) + '%',
          'CurrPremium': this.getPremium(o.Symbol, o.Price, this.currExchangeRate) + '%'
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .premium-container {
    .el-table {
      .warning-row .dot {
        background-color: red;
      }
      th,td {
        padding: 2px 0;
      }
      .cell {
        padding-left: 1px;
        padding-right: 1px;
        font-size: 15px;
      }
    }
    .box-card {
      .el-card__body {
        padding: 10px;
        min-width: 10px;
      }
    }
    .el-button {
      padding: 5px 6px
    }
    .dot {
      height: 5px;
      width: 5px;
      background-color: green;
      border-radius: 50%;
      display: inline-block;
    }
  }
</style>

<style lang="scss" scoped>
  .premium-container {
    padding: 6px 6px;
  }
</style>
