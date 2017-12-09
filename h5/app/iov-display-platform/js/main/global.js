/**
 * Created by Administrator on 2017-02-08.
 */
var global = {

  ajaxUrl: 'http://' + window.location.host + '/',

  VehicleBrandID: 'All',

  /**
   * 获取参数
   * */
  getUrlParam: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
      href = window.location.search,
      r = href.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return '';
  },

  /**绑定点击事件*/
  bind: function() {
    $('.brand_warp').hover(function() {
      $('.brand').addClass('active');
      $('.nav').stop(false, true).slideDown();
    }, function() {
      $('.brand').removeClass('active');
      $('.nav').stop(false, true).slideUp();
    });
  },

  /**数字显示组装*/
  nums: function(max, obj) {
    var prev = [];
    var next = [];
    var func = function(data) {
      var da = typeof data == 'number' ? JSON.stringify(data) : data;
      next = da.split('');
      var len = next.length;
      var $obj = $(obj);
      //if(prev.length != len){
      $obj.find('li').removeClass('count10');
      //}
      for (var i = 0; i < max; i++) {
        if (i < len) {
          if (prev.length > 0) {
            if (next[i] == '.') {
              $obj.find('li').eq(i).addClass('active').removeClass('count10');
            } else {
              $obj.find('li').eq(i).addClass('active').removeClass('count' + prev[i]);
            }
          }
          if (next[i] == '.') {
            $obj.find('li').eq(i).addClass('active').addClass('count10');
          } else {
            $obj.find('li').eq(i).addClass('active').addClass('count' + next[i]);
          }
        } else {
          $obj.find('li').eq(i).removeClass('active');
        }
        if (next[len - 1]) {
          $obj.find('li').eq(len - 1).addClass('active').removeClass('count10');
        }
      }
      for (var i = 0; i < len; i++) {
        prev[i] = next[i];
      }
    };
    return {
      init: function(data) {
        func(data);
      }
    };
  },

  /**获取所有品牌*/
  allBrand: function() {

    var _this = this;
    ZBase.CallServer.request("queryVehicleBand", null, function(data) {
      if (data.code == '10001') {
        var da = data.data;
        func(da);
        window[window.CURRENT_MODULE].init();
      } else {

      }
    });

    var func = function(data) {
      var href = window.location.href,
        src = href.substring(0, href.indexOf('?')),
        host = 'http://' + window.location.host + '/',
        pathname = window.location.pathname,
        page = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.lastIndexOf('.'));
      if (page.indexOf('new') > -1) {
        var newSrc = src;
        src = src.substring(0, src.indexOf('new')) + src.substring(src.indexOf('new') + 3, src.length);
      } else {
        var newSrc = host + 'show/html/new' + page + '.html';
      }

      var html = '<li class="list brandIdAll"><a class="" data-VehicleBrandID="All" href="' + src + '?brandId=All">全部</a></li>',
        len = data.length;
      for (var i = 0; i < len; i++) {
        var p = data[i];
        if (p.id == '1035') {
          p.name = '时代';
        }
        if (p.id == global.VehicleBrandID) {
          //$('.brandName').html(p.name);
        }
        html += '<li class="list brandId' + p.id + '"><a class="" data-VehicleBrandID="' + p.id + '" href="' + src + '?brandId=' + p.id + '">' + p.name + '</a></li>'
      }
      var params = global.getUrlParam('brandId');
      //if(params != '1075' && params != '1076'){
      // html += '<li class="list brandId1076"><a class="" data-VehicleBrandID="1076" href="' + src + '?brandId=1076">欧辉</a></li>' +
      //   '<li class="list brandId1075"><a class="" data-VehicleBrandID="1075" href="' + src + '?brandId=1075">雷萨</a></li>' +
      //   '<li class="list brandId1077"><a class="" data-VehicleBrandID="1077" href="' + newSrc + '?brandId=All">新能源</a></li>';
      //}
      if (params == '1075') {
        //$('.brandName').html('雷萨');
      }
      if (params == '1076') {
        //$('.brandName').html('欧辉');
      }
      if (params == '1077') {
        //$('.brandName').html('新能源');
      }
      $('.brandNav').html(html);
      $(".brandName").html(ZBase.Brand.get(global.getUrlParam("brandId")))
    };
  },

  nav: function(index) {
    var brandId = this.getUrlParam('brandId');
    var brandName = ZBase.Brand.get(brandId);
    if (brandId == '1075' || brandName == '欧辉' || brandId == '1077') {
      var allPageIndex = 1;
      $('.brandB').hide();
    } else {
      var allPageIndex = 5;
      $('.brandB').show();
    }
    this.VehicleBrandID = brandId ? brandId : 'All';
    var navArr = ['monitor.html', 'index.html', 'addedValue.html', 'lifeCycle.html', 'dealer.html', 'service.html'];
    var $footerNav = $('.footerNav');
    var len = $footerNav.find('a').length;
    for (var i = 0; i < len; i++) {
      if (this.VehicleBrandID == 1077) {
        $footerNav.find('a').eq(i).attr('href', 'new' + navArr[i]);
      } else {
        $footerNav.find('a').eq(i).attr('href', navArr[i] + '?brandId=' + this.VehicleBrandID);
      }
    }
    window.document.onkeydown = function(event) {
      var event = event || window.event;
      var code = event.keyCode;
      if (code == 37) {
        index = index > 0 ? --index : allPageIndex;
        if (this.VehicleBrandID == 1077) {
          window.location.href = 'new' + navArr[index] + '?brandId=' + global.VehicleBrandID;
        } else {
          window.location.href = navArr[index] + '?brandId=' + global.VehicleBrandID;
        }
      }
      if (code == 39) {
        index = index < allPageIndex ? ++index : 0;
        if (this.VehicleBrandID == 1077) {
          window.location.href = 'new' + navArr[index] + '?brandId=' + global.VehicleBrandID;
        } else {
          window.location.href = navArr[index] + '?brandId=' + global.VehicleBrandID;
        }
      }
    };
  },

  appMove: function(index) {
    var startX,
      endX,
      move;
    var brandId = this.getUrlParam('brandId');
    brandId = brandId ? brandId : 'All';
    if (brandId == '1075' || brandId == '1076' || brandId == '1077') {
      var allPageIndex = 1;
    } else {
      var allPageIndex = 5;
    }
    var arrPage = ['monitor.html', 'index.html', 'addedValue.html', 'lifeCycle.html', 'dealer.html', 'service.html'];
    var trouchStart = function(event) {
      var event = event || window.event;
      startX = event.touches[0].clientX;
    };
    var trouchMove = function(event) {
      var event = event || window.event;
      //endX = event.touches[0].clientX;

    };
    var trouchEnd = function(event) {
      var event = event || window.event;
      endX = event.changedTouches[0].clientX;
      move = endX - startX;
      if (move > 100) {
        if (index == allPageIndex) {
          index = 0;
        } else {
          index++;
        }
        window.location.href = arrPage[index] + '?brandId=' + brandId;
      } else if (move < -100) {
        if (index == 0) {
          index = allPageIndex;
        } else {
          index--;
        }
        window.location.href = arrPage[index] + '?brandId=' + brandId;
      }
    };
    document.addEventListener('touchstart', trouchStart, false);
    document.addEventListener('touchstart', trouchMove, false);
    document.addEventListener('touchend', trouchEnd, false);
  },

  dubbleClick: function() {
    // $('body').dblclick(function() {
    //   /*var brandId = global.getUrlParam('brandId');
    //   brandId = brandId ? brandId : 'All';*/
    //   if (global.VehicleBrandID == 1076) {
    //     window.location.href = 'http://ov.ifoton.com.cn/security/login!loginByOpenUrl.do?username=view&password=123&companyNo=E004-01';
    //   } else if (global.VehicleBrandID == 1075) {
    //     window.location.href = 'http://ov.ifoton.com.cn/security/login!loginByOpenUrl.do?username=view&password=123&companyNo=E002-01 ';
    //   } else {
    //     window.location.href = 'http://bfda.ifoton.com.cn/open/sso/loginSystemUrl.html?brandId=' + global.VehicleBrandID;
    //   }
    // });
  },

  /**登录*/
  login: function() {
    var getName = window.sessionStorage.getItem('name');
    if (!getName) {
      var href = window.location.href;
      if (href.indexOf('?QAZ3EDC6YH8N8LKJ') > -1) {
        var name = href.substring(href.indexOf('?') + 1, href.length);
        if (name.indexOf('?') > -1) {
          //alert('登录已过期，请重新登录');
          window.location.href = 'login.html';
        } else {
          if (name == 'QAZ3EDC6YH8N8LKJ') {
            window.sessionStorage.setItem('name', 'QAZ3EDC6YH8N8LKJ');
            return;
          } else {
            //alert('登录已过期，请重新登录');
            window.location.href = 'login.html';
          }
        }
      } else {
        var arr = [
          { userName: 'admin', passWord: '123456' },
          { userName: 'xny', passWord: '123456' },
          { userName: 'foton', passWord: '123456' }
        ];
        var userNameArr = [];
        var paddWordArr = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
          userNameArr.push(arr[i].userName);
          paddWordArr.push(arr[i].passWord);
        }
        var userName = window.sessionStorage.getItem('userName');
        var passWord = window.sessionStorage.getItem('passWord');
        var userNameIndex = userNameArr.indexOf(userName);
        if (userNameIndex > -1) {
          if (passWord != arr[userNameIndex].passWord) {
            //alert('登录已过期，请重新登录');
            //setTimeout(function(){
            window.location.href = 'login.html';
            //},1000);
          }
        } else {
          //alert('登录已过期，请重新登录');
          //setTimeout(function(){
          window.location.href = 'login.html';
          //},1000);
        }
      }
    }
  }
};
/*global.baiDuMapH()*/
;
global.login();
global.allBrand();
global.dubbleClick();