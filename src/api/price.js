import request from '@/utils/request'

export function getPrice() {
  return request({
    url: '/prices',
    method: 'get'
  })
}
