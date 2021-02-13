<template>
  <div class="premium-container">
    <el-row>
      <el-card class="box-card">
        <div>
          <el-table
            :data="currencyData"
            size="small"
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
              label="직접입력"
              min-width="60px"
            />
            <el-table-column
              prop="timestamp"
              label="시간"
              min-width="60px"
              :formatter="toTimeStr"
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
            size="small"
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
              min-width="60px"
              :formatter="toTimeStr"
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
            size="small"
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
            <el-table-column
              prop="Timestamp"
              label="시간"
              min-width="60px"
              :formatter="toTimeStr"
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
            size="small"
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
            <el-table-column
              prop="Timestamp"
              label="시간"
              min-width="60px"
              :formatter="toTimeStr"
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
            size="small"
            style="width: 100%"
          >
            <el-table-column
              prop="coin"
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
              min-width="60px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="alarmEdit(scope.$index, scope.row)"
                >Edit</el-button>
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
      fixExchangeRate: 1200,
      currencyData: [],
      bybitData: [],
      upbitData: [],
      bithumbData: [],
      alarmData: [],
      bybitPrice: {
        'BTC': 0,
        'ETH': 0,
        'XRP': 0
      },
      alarmFormVisible: false,
      alarmForm: {}
    }
  },
  computed: {
    tz_kr() {
      return 9 * 60 * 60
    },
    currTimestamp() {
      return parseInt((+new Date() / 1000))
    },
    currExchangeRate() {
      return this.currencyData[0].exchangeRate
    }
  },
  mounted() {
    this.fetchData()
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
              this.setBybitPrice(data[item])
              break
            case 'UpbitPrice':
              this.setUpbitPrice(data[item])
              break
            case 'BithumbPrice':
              this.setBithumbPrice(data[item])
              break
            case 'Rule':
              this.alarmData = []
              this.alarmData.push({
                ...data[item],
                'coin': 'ALL'
              })
          }
        }
        setTimeout(this.fetchData, 1000)
      }).catch(err => {
        console.error(err)
        setTimeout(this.fetchData, 1000)
      })
    },
    tableRowClassName({ row }) {
      const timestamp = row.timestamp || row.Timestamp
      return (timestamp + 5 < this.currTimestamp) ? 'warning-row' : ''
    },
    toTimeStr(row) {
      const timestamp = row.timestamp || row.Timestamp
      const iso = new Date((Number(timestamp) + this.tz_kr) * 1000).toISOString()
      return iso.slice(-13, -5)
    },
    numberWithCommas(row) {
      const price = row.Price
      if (price < 1) return price
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
      return parseFloat((price - this.bybitPrice[symbol] * rate) / price * 100).toFixed(3)
    },
    alarmEdit(index, row) {
      this.alarmForm = this.alarmData[0]
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
      updateAlarm(this.alarmForm).then(response => {
        this.alarmFormVisible = false
      })
    },
    setCurrencyPrice(data) {
      const currency = data.Price.find(x => x.Symbol === 'USD_KRW')
      this.currencyData = [{
        'item': currency.Symbol,
        'fixExchangeRate': this.fixExchangeRate,
        'exchangeRate': parseFloat(Number(currency.Price).toFixed(3)),
        'timestamp': currency.Timestamp
      }]
    },
    setBybitPrice(data) {
      this.bybitData = data.Price
      this.bybitPrice = {
        'BTC': data.Price.find(x => x.Symbol === 'BTC').Price || 0,
        'ETH': data.Price.find(x => x.Symbol === 'ETH').Price || 0,
        'XRP': data.Price.find(x => x.Symbol === 'XRP').Price || 0
      }
    },
    makeRow(info) {
      return {
        'Symbol': info.Symbol,
        'Price': info.Price,
        'FixPremium': this.getPremium(info.Symbol, info.Price, this.fixExchangeRate) + '%',
        'CurrPremium': this.getPremium(info.Symbol, info.Price, this.currExchangeRate) + '%',
        'Timestamp': info.Timestamp
      }
    },
    setUpbitPrice(data) {
      this.upbitData = []
      for (const coin of ['BTC', 'ETH', 'XRP']) {
        const info = data.Price.find(x => x.Symbol === coin)
        this.upbitData.push(this.makeRow(info))
      }
    },
    setBithumbPrice(data) {
      this.bithumbData = []
      for (const coin of ['BTC', 'ETH', 'XRP']) {
        const info = data.Price.find(x => x.Symbol === coin)
        this.bithumbData.push(this.makeRow(info))
      }
    }
  }
}
</script>

<style lang="scss">
  .premium-container {
    .el-table {
      .warning-row {
        background-color: LightPink;
      }
      th,td {
        padding: 2px 0;
      }
      .cell {
        padding-left: 3px;
        padding-right: 3px;
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
  }
</style>

<style lang="scss" scoped>
  .premium-container {
    padding: 10px 20px;
    strong {
      font-size: 13px;
    }
  }
</style>
