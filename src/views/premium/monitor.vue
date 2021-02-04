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
  </div>
</template>

<script>
import { getPrice } from '@/api/price'

export default {
  name: 'Premium',
  data() {
    return {
      fixExchangeRate: 1200,
      currencyData: [],
      bybitData: [],
      upbitData: [],
      bithumbData: [],
      bybitPrice: {
        'BTC': 0,
        'ETH': 0,
        'XRP': 0
      }
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
          }
        }
        setTimeout(this.fetchData, 1000 * 1)
      })
    },
    tableRowClassName({ row }) {
      const timestamp = row.timestamp || row.Timestamp
      return (timestamp + 10 < this.currTimestamp) ? 'warning-row' : ''
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
    timeStrToSec(timestr) {
      const sec = timestr.split(':').reduce((acc, time) => (60 * acc) + +time)
      return sec
    },
    getPremium(symbol, price, rate) {
      return parseFloat((price - this.bybitPrice[symbol] * rate) / price * 100).toFixed(3)
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
