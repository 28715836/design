$(function(){
				var access_token = sessionStorage.getItem("token")
				console.log(access_token);
				if (access_token) {
					$.ajax({
						type:"get",
						url:"http://101.132.194.204:9090/producer/user/userSelf?access_token="+access_token,
						async:false,
						success: function (data) {
							if (data) {
								$('.dropdown-toggle').html(data.name+"<b class='caret'></b>");
								$('.dropdown').removeClass("ng-hide");
								$('.log-reg').addClass("ng-hide");
			      				//这里设置缓存存储Token
			            		sessionStorage.setItem('user',data);
							}
						},
						error: function (retMsg) {
		//					$('.dropdown').addClass("ng-hide");
		//					$('.log-reg').removeClass("ng-hide");
							//window.location.href = "login.html";
							alert(retMsg)
						}
						});
				} else {
					window.location.href = "login.html";	
				}
	})
	function logout () {
		sessionStorage.removeItem("token","user");
		window.location.href = "login.html";
	}