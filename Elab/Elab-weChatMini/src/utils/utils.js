import config from './config'

module.exports = {
  get: function (url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.host + url,
        success: function (res) {
          if (res.statusCode === 200 || res.statusCode === 301) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }
      })
    })
  },
  post: function (url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.host + url,
        data: data,
        method: 'POST',
        success: function (res) {
          if (res.statusCode === 200 || res.statusCode === 301) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }
      })
    })
  },
  put: function (url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.host + url,
        data: data,
        method: 'PUT',
        success: function (res) {
          if (res.statusCode === 200 || res.statusCode === 301) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }
      })
    })
  },
  delete: function (url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.host + url,
        data: data,
        method: 'DELETE',
        success: function (res) {
          if (res.statusCode === 200 || res.statusCode === 301) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }
      })
    })
  }
}
