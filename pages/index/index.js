//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    webUrl:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onReady: function () {
    var sessionKey = app.packGetStorage('sessionKey') || '';
    if (sessionKey) {
      this.setData({
        // webUrl: app.data.basePath + 'ewanapi/h5/index.html?sessionKey=' + sessionKey
        webUrl: 'https://www.baidu.com'
      });
    }
  },
})
