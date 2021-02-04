const Mock = require('mockjs')

const price = Mock.mock({
  'Currency': {
    'Name': 'currency',
    'Price': [
      {
        'Symbol': 'USD_KRW',
        'Price': 1115.52963,
        'FundingRate': 0,
        'PredictedFundingRate': 0,
        'Timestamp': 1612410157
      }
    ],
    'Timestamp': 1612410157
  },
  'BybitPrice': {
    'Name': 'bybit',
    'Price': [
      {
        'Symbol': 'BTC',
        'Price': 37800,
        'FundingRate': 0.0009,
        'PredictedFundingRate': 0.001136,
        'Timestamp': 1612413178
      },
      {
        'Symbol': 'ETH',
        'Price': 1663.35,
        'FundingRate': 0.002798,
        'PredictedFundingRate': 0.002283,
        'Timestamp': 1612413178
      },
      {
        'Symbol': 'XRP',
        'Price': 0.3877,
        'FundingRate': 0.000786,
        'PredictedFundingRate': 0.000925,
        'Timestamp': 1612413178
      }
    ],
    'Timestamp': 1612413178
  },
  'UpbitPrice': {
    'Name': 'upbit',
    'Price': [
      {
        'Symbol': 'BTC',
        'Price': 40286000,
        'FundingRate': 0,
        'PredictedFundingRate': 0,
        'Timestamp': 1612413177
      },
      {
        'Symbol': 'ETH',
        'Price': 1773500,
        'FundingRate': 0,
        'PredictedFundingRate': 0,
        'Timestamp': 1612413176
      },
      {
        'Symbol': 'XRP',
        'Price': 413,
        'FundingRate': 0,
        'PredictedFundingRate': 0,
        'Timestamp': 1612413174
      }
    ],
    'Timestamp': 1612413178
  },
  'BithumbPrice': {
    'Name': 'bithumb',
    'Price': [
      {
        'Symbol': 'BTC',
        'Price': 40288000,
        'FundingRate': 0,
        'PredictedFundingRate': 0,
        'Timestamp': 1612413175
      },
      {
        'Symbol': 'ETH',
        'Price': 1774000,
        'FundingRate': 0,
        'PredictedFundingRate': 0,
        'Timestamp': 1612413174
      },
      {
        'Symbol': 'XRP',
        'Price': 413.3,
        'FundingRate': 0,
        'PredictedFundingRate': 0,
        'Timestamp': 1612413168
      }
    ],
    'Timestamp': 1612413178
  },
  'Rule': {
    'Use': true,
    'AlarmMax': -10,
    'AlarmMin': -20
  },
  'CreatedAt': 1612413178
})

module.exports = [
  {
    url: '/prices',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: price
      }
    }
  }
]

