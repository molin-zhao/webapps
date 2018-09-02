import config from './config'

export function test() {
  console.log('test')
}
export function get(url) {
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
}

export function post(url, data) {
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
}

export function put(url, data) {
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
}
export function _delete_(url, data) {
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

export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

export function _getStudent(id) {
  var studentList = [{
      image: '/static/images/hou.png',
      name: '侯小刚',
      id: '76498653',
      description: '76498653',
      type: 0
    },
    {
      image: '/static/images/maozi.png',
      name: '毛子',
      id: '76032653',
      description: '76032653',
      type: 0
    },
    {
      image: '/static/images/xiaogang.png',
      name: '侯大刚',
      id: '76498487',
      description: '76498487',
      type: 0
    },
    {
      image: '/static/images/weiyingluo.png',
      name: '魏璎珞',
      id: '98798653',
      description: '98798653',
      type: 0
    },
    {
      image: '/static/images/mingyu.png',
      name: '明玉小可爱',
      id: '67598653',
      description: '67598653',
      type: 0
    }
  ]
  if (id === 'all') {
    return studentList
  } else {
    for (let i = 0; i < studentList.length; i++) {
      if (studentList[i].id === id) {
        return studentList[i]
      }
    }
  }
}
