//app.js
App({
  data: {
    basePath: "http://localhost:8080/mayapi/"
  },
  // 当小程序初始化完成时，会触发onLaunch，全局只触发一次
  onLaunch: function () {
    this.login();
  },
  // 调用wx.login登录，返回用户的code
  login:function() {
    wx.login({
      success: res => { //返回值 res 的第一种写法
        console.log(res);
        this.globalData.code = res.code;
      },
      fail: function(res) { //返回值 res 的第二种写法
        console.log('login fail: ' + res.errMsg);
      }
    })
  },
  // 获取用户信息
  getUserInfo: function (code, encryptedData, iv, userInfo, callback, completeCallback) {
    var that = this;
    wx.request({
      url: that.data.basePath + 'api/login/wxGetUserInfo',
      data: {
        "code": code,
        "encryptedData": encryptedData,
        "iv": iv,
        "userInfo": userInfo
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        completeCallback && completeCallback();
        //console.log(res.data.result.sessionId)
        // 全局保存返回过来的sessionId
        that.packSetStorage('sessionId', res.data.result.sessionId);
        callback && callback();
      },
      fail: function () {
        completeCallback && completeCallback();
      }
    });
  },
  // 向服务器获取手机号
  getPhoneNumber: function (code, encryptedData, iv, callback, completeCallback) {
    var that = this;
    var datas = {
      code: code,
      encryptedData: encryptedData,
      iv: iv
    };
    var sessionId = that.packGetStorage("sessionId");
    wx.request({
      url: that.data.basePath + 'api/login/wxGetPhoneNum',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'cookie': "JSESSIONID=" + sessionId
      },
      data: datas,
      success: function (res) {
        console.log(res);
        if (res.data.retStatus === '1') {
          console.log('设置sessionKey');
          that.packSetStorage('sessionKey', res.data.result.sessionKey);
          callback && callback();
        } else {
          console.log('获取手机号码失败');
        }
        completeCallback && completeCallback();
      },
      fail: function (res) {
        completeCallback && completeCallback();
        console.log('sendCode fail');
      },
      complete: function (res) {

      }
    })
  },
  globalData: {
    code: null,
    userInfo: null
  },
  
  packSetStorage: function (keyStr, valueStr, asyncBoo) {
    if (asyncBoo == "" || asyncBoo == undefined || asyncBoo == true) {
      wx.setStorageSync(keyStr, valueStr)
    } else {
      //将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。wx.setStorageSync 同步接口
      wx.setStorage({ 
        key: keyStr,
        data: valueStr
      })
    }
  },
  packGetStorage: function (keyStr) {
    return wx.getStorageSync(keyStr);
  },
  packRemoveStorage: function (keyStr) {
    wx.removeStorageSync(keyStr)
  }
})