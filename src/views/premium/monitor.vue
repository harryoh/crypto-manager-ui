<template>
  <div class="premium-container">
    <currency-rate />
    <bybit-price />
    <upbit-price />
    <bithumb-price />

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
import { toTimeStrSimple } from '@/utils'

import CurrencyRate from './components/CurrencyRate'
import BybitPrice from './components/BybitPrice'
import UpbitPrice from './components/UpbitPrice'
import BithumbPrice from './components/BithumbPrice'

export default {
  name: 'Premium',
  components: { CurrencyRate, BybitPrice, UpbitPrice, BithumbPrice },
  data() {
    return {
      loop: true,
      alarmData: [],
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
  mounted() {
    this.fetchData()
  },
  destroyed() {
    this.loop = false
  },
  methods: {
    toTimeStrSimple,
    fetchData() {
      getPrice().then(response => {
        const prices = response.data
        for (const item in prices) {
          switch (item) {
            case 'Currency':
              // eslint-disable-next-line no-case-declarations
              const currency = prices[item].Price.find(x => x.Symbol === 'USD_KRW')
              currency.exchangeRate = currency.Price
              this.$store.dispatch('prices/setCurrency', currency)
              break
            case 'BybitPrice':
              this.$store.dispatch('prices/setPrice', {
                key: 'bybitPrice',
                value: {
                  'BTC': prices[item].Price.find(x => x.Symbol === 'BTC') || 0,
                  'ETH': prices[item].Price.find(x => x.Symbol === 'ETH') || 0,
                  'XRP': prices[item].Price.find(x => x.Symbol === 'XRP') || 0
                }
              })
              break
            case 'Rules':
              this.alarmData = prices[item]
          }
        }
        this.loop && setTimeout(this.fetchData, 10000)
      }).catch(err => {
        console.error(err)
        this.loop && setTimeout(this.fetchData, 3000)
      })
    },
    boolToStr(row) {
      return (row.Use) ? 'Y' : 'N'
    },
    timeStrToSec(timestr) {
      const sec = timestr.split(':').reduce((acc, time) => (60 * acc) + +time)
      return sec
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
