/**
 * Created by Administrator on 2017-04-13.
 */
var login = {
    init : function(){
        this.bind();
    },

    bind : function(){
        var arr = [
            {userName : 'admin',passWord : '123456'},
            {userName : 'xny',passWord : '123456'},
            {userName : 'foton',passWord : '123456'}
        ];
        var len = arr.length;
        var userNameArr = [];
        var paddWordArr = [];
        for(var i=0;i<len;i++){
            userNameArr.push(arr[i].userName);
            paddWordArr.push(arr[i].passWord);
        }
        var func = function(){
            var userName = $('#userName').val();
            var passWord = $('#passWord').val();
            if($.trim(userName) == ''){
                alert('请输入用户名');
                return;
            }
            if($.trim(passWord) == ''){
                alert('密码不能为空');
                return;
            }
            var userNameIndex = userNameArr.indexOf(userName);
            if(userNameIndex > -1){
                if(passWord == arr[userNameIndex].passWord){
                    window.sessionStorage.setItem("userName",userName);
                    window.sessionStorage.setItem("passWord",passWord);
                    setTimeout(function(){
                        if(userName == 'xny'){
                            window.location.href = 'newindex.html?brandId=All';
                        }else{
                            window.location.href = 'index.html';
                        }
                    },500);
                }else{
                    alert('密码不正确');
                }
            }else{
                alert('账号不存在');
            }
        };
        $('#loginBtn').click(function(){
            func();
        });
        document.onkeydown=function(event){
            if(event.keyCode == 13){
                func();
            }
        }
    }
};

login.init();
