//获取应用实例
const app = getApp();

Page({
  data: {
    // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 默认隐藏自定义弹窗
    showDialog: false
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 查看是否授权，若用户已经授权过，直接获取用户信息
  onLoad: function () {
    //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);        
            }
          })
        }
      }
    })
  },
  // 点击授权按钮，获取用户信息
  bindGetUserInfo: function (e) {
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        showDialog: true
      });
      return;
    }
    //用户按了允许授权按钮
    if (e.detail.userInfo) {
      console.log(e);
      app.globalData.userInfo = e.detail.userInfo;
      var userInfo = app.globalData.userInfo;
      var code = app.globalData.code;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;

      wx.showLoading({
        title: '授权中'
      });

      app.getUserInfo(code, encryptedData, iv, userInfo, function () {
        that.setData({
          showDialog: true
        });
      }, function () {
        wx.hideLoading();
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    var that = this;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    var code = app.globalData.code;

    that.setData({
      showDialog: false
    });

    if (encryptedData) {
      wx.showLoading({
        title: '授权中'
      });

      app.getPhoneNumber(code, encryptedData, iv, function () {
        //授权成功后，跳转进入小程序首页
        wx.redirectTo({
          url: '/pages/index/index'
        });
      }, function () {
        wx.hideLoading();
      });
    } else {
      that.hideDialog();
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      });
    }
  },
  hideDialog: function () {
    this.setData({
      showDialog: false
    });
  }
})
