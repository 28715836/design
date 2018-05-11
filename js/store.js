$(function(){
	var Request = requestURL();
	$(".commentfilter-item").click(function () {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			var evaluate = $(this).text();
			if (evaluate == '全部') {
				selectComment (Request["storeId"],'')
			} else if (evaluate == '好评') {
				selectComment (Request["storeId"],'highOpinion')
			} else if (evaluate == '中评') {
				selectComment (Request["storeId"],'middleOpinion')
			} else if (evaluate == '差评') {
				selectComment (Request["storeId"],'weakOpinion')
			}
		})
});
    function requestURL () {
    	var url=location.search;
		var Request = new Object();
		if(url.indexOf("?")!=-1){
			var str = url.substr(1);strs = str.split("&");
		    strs = str.split("&");
			for(var i=0;i<strs.length;i++)
				Request[strs[i].split("=")[0]]=unescape(strs[ i].split("=")[1]);
		}
		return Request;
    }
//    店铺信息
	function storeDetail (storeId) {
		$.ajax({
			type:"get",
			url:"http://101.132.194.204:9090/producer/store/selectStoreDetail/"+storeId,
			async:false,
			success: function (data) {
				$(".shopguide-info-wrapper").children().find("h1").html(data.storeName);
				$(".address").html(data.address);
				$(".contactPhone").html(data.contactPhone);
				$(".shopguide-server").html('<span ng-hide="shop.id == 656683" class=""><em>起送价</em> <em class="shopguide-server-value ng-binding">'+data.send+'元</em></span>'+
					'<span>'+
						'<em>配送费</em>'+
						'<em class="shopguide-server-value ng-binding">'+data.distribution+'元</em>'+
					'</span>'+
					'<span>'+
						'<em>平均到达速度</em>'+
						'<em class="shopguide-server-value ng-binding">'+data.deliveryTime+'分钟</em>'+
					'</span>');
				$(".star-score").css({"width":75*data.score/5});
				$(".total-width").css({"width":150*data.score/5});
				$(".total").text(data.score);
				$('.shopguide-info').find("img").attr('src',data.logoImgUrl);
				$('.comment').attr('href','comment.html?storeId='+data.id);
				$('.store').attr('href','store.html?storeId='+data.id);
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
			});
	}
	//判断该店铺是否被用户收藏
	function isFavorByUserId (userId, storeId) {
		$.ajax({
			type:"get",
			url:"http://101.132.194.204:9090/producer/favor/isFavorByUserId/"+userId+"?storeId="+storeId,
			async:false,
			success: function (data) {
				if (data) {
					$(".isFavorShop").html("取消收藏");
					$(".shopguide-favor").attr('href','javascript:deleteFavorShop(' +userId+ ',' +storeId+ ',' +0+')');
				} else {
					$(".isFavorShop").html("收藏");
					$(".shopguide-favor").attr('href','javascript:addFavorShop(' +userId+ ',' +storeId+ ')');
				}
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
			});
	}
	//取消收藏
	function deleteFavorShop (userId,storeId,flag) {
		$.ajax({
			type:"post",
			url:"http://101.132.194.204:9090/producer/favor/deleteFavorByUserId/"+userId+"?storeId="+storeId,
			async:false,
			success: function (data) {
				if (data) {
					if (flag == 0) {
						isFavorByUserId (userId, storeId);
					} else {
						selectFavorByUserId(userId);
					}
				}
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
			});
	}
	//添加收藏
	function addFavorShop (userId,storeId) {
		$.ajax({
			type:"post",
			url:"http://101.132.194.204:9090/producer/favor/addFavorByUserId/"+userId+"?storeId="+storeId,
			async:false,
			success: function (data) {
				if (data) {
					isFavorByUserId (userId, storeId);
				}
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
			});
	}
	//店铺商品分类
	function selectCategoryByStoreId (storeId) {
		$.ajax({
			type:"get",
			url:"http://101.132.194.204:9090/producer/category/selectCategoryByStoreId/"+storeId,
			async:false,
			success: function (data) {
				if (data) {
					var categoryList = [];
					data.forEach(function(item) {
						categoryList.push('<a href="#" class="ng-binding ng-scope">'+item.categoryName+'</a>')
					})
					$(".shopmenu-nav").html(categoryList);
					selectAllGoodsById(storeId);
				}
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
			});
	}
	//商品列表
	function selectAllGoodsById (storeId) {
		$.ajax({
			type:"get",
			url:"http://101.132.194.204:9090/producer/store/selectAllGoodsById/"+storeId,
			async:false,
			success: function (data) {
				var categories = data.categories;
				var goodsList = [];
				if (categories) {
					categories.forEach(function(item){
						var goodsLists = goods(storeId,item.goodsList);
						goodsList.push('<div class="shopmenu-list clearfix ng-scope">'+
								'<h3 class="shopmenu-title">'+item.categoryName+''+
								'</h3>'+goodsLists+'</div>');
					})
				}
				$(".shopmenu-main").html(goodsList);
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
			});
	}
	function goods (storeId,goods) {
		var goodsLists = "";
		goods.forEach(function(item){
			var imgUrl = item.files !=0?item.files[0].imgUrl:'';
			goodsLists = goodsLists +(
				'<div class="shopmenu-food ng-isolate-scope">'+
						'<span>'+
							'<a href="#">'+
								'<img src="'+imgUrl+'" />'+
							'</a>'+
						'</span>'+
						'<div>'+
						'	<h3 class="shopmenu-food-name ui-ellipsis ng-binding">'+item.name+'</h3>'+
						'	<p class="color-mute ui-ellipsis ng-binding">'+(item.detail!=null?item.detail:'')+'</p>'+
						'</div>'+
						'<span class="col-3 shopmenu-food-price color-stress ng-binding">'+item.price+'</span>'+
						'<span>'+
							'<div class="menuFood">'+
								'<button class="shop-cartbutton ng-binding ng-scope" onclick="addShopCar(this,'+storeId+','+ JSON.stringify(item).replace(/"/g, '&quot;') + ')">加入购物车</button>'+
//'<div class="shop-cartctrl ng-scope">'+
//		'	<button class="ctrl minus" onclick="deleteFoodsNum(this)">-</button>'+
//		'	<span class="ctrl quantity ng-pristine ng-valid">1</span>'+
//			'<button class="ctrl plus" onclick="addFoodsNum(this)">+</button>'+
//		'</div>'+
							'</div>'+
						'</span>'+
					'</div>');
		});
		return goodsLists;
	}
	//评论信息
function selectComment (storeId,evaluate) {
			var u = evaluate ==''?("?id="+storeId):("?id="+storeId+"&evaluate="+evaluate)
			$.ajax({
				type:"get",
				url:"http://101.132.194.204:9090/producer/comment/selectComment"+u,
				async:false,
				success: function (data) {
					if (data) {
						var commentList = [];
						
						data.forEach(function(item) {
							var reply = '';
							if (item.comment != null) {
								reply = ('<div class="bizz-reply"><div class="bizz-replay-title">商家回复：</div><div class="bizz-replay-content">'+item.comment.content+'</div></div>');
							}
							var opinion = '';
							if (item.score < 2) {
								opinion = "差评";
							} else if (item.score>=2 && item.score <4) {
								opinion = "中评";
							} else {
								opinion = "好评";
							}
							commentList.push('<li class="reply-field">'+
								'<div class="reply-user-avatar">'+
								'	<img src="'+(item.user.headPic!=null?item.user.headPic:'')+'" />'+
								'</div>'+
								'<div class="info clearfix">'+
								'	<span class="fr time">'+item.creationDate+'</span>'+
								'	<span class="name">'+item.user.name+'</span>'+
								'	<span class="star-ranking">'+
								'		<span class="star-score" style="width: '+(75*item.score/5)+'px"></span>       '+
								'	</span>'+
								'	<span class="feel">'+opinion+'</span>'+
								'</div>'+
								'<div class="user-reply">'+item.content+'</div>'+reply+'</li>')
						})
						$(".commentlist").html(commentList);
					}
				},
				error: function (retMsg) {
					console.log(retMsg)
				}
				});
		}

    //评价分布
	function commentDistribute (storeId) {
		$.ajax({
			type:"get",
			url:"http://101.132.194.204:9090/producer/comment/commentDistribute/"+storeId,
			async:false,
			success: function (data) {
				var commentDistribute = [];
				var score = 1;
				if (data) {
					data.forEach(function(item){
						commentDistribute.push('<div class="field clearfix">'+
						       ' <span class="fl score-num">'+
						           ' '+(score++)+'分'+
						       ' </span>'+
						        '<span class="fl bar"><i class="five" style="width: '+(item*100)+'%;"></i></span>'+
						        '<span class="fr percent">'+(item*100)+'%</span>'+
						     ' </div>');
					})
				}
				$(".detail").html(commentDistribute);
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
			});
	}
	//查询当前登录用户信息
    function querySelf (access_token) {
	  	var user = null;
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
	            		localStorage.setItem('user',JSON.stringify(data));
//	            		console.log(JSON.parse(sessionStorage.getItem('user')));
	            		user = data;
					}
				},
				error: function (retMsg) {
					$('.dropdown').addClass("ng-hide");
					$('.log-reg').removeClass("ng-hide");
					console.log(retMsg)
				}
			});
		return user;
	}
    //登出
	function logout () {
		localStorage.removeItem("token");
		location.reload();
	}
	//店铺列表
	function selectStore (lng,lat,name,categoryId) {
		$.ajax({
				type:"get",
				url:"http://101.132.194.204:9090/producer/store/selectStore?longitude="+lng+"&latitude="+lat+"&name="+name+"&categoryId="+categoryId,
				async:false,
				success: function (data) {
					var storeList = [];
					var index = 1;
					if (data) {
						if (data.length == 0) {
							$('.clearfix').addClass("ng-hide");
							$('.place-rstbox-nodata').removeClass("ng-hide");
							return;
						}
						data.forEach(function(item) {
							storeList.push(
							'<li class="fl rest-li">'+
								'<div class="j-rest-outer rest-outer transition">'+
									'<div class="restaurant">'+
										'<a class="rest-atag" href="./store.html?storeId='+item.id+'">'+
											'<div class="top-content">'+
												'<div class="preview">'+
													'<img class="scroll-loading" src="'+item.logoImgUrl+'"/>'+
												   ' <div class="rest-tags"></div>'+
												'</div>'+
												'<div class="content">'+
													'<div class="name"><span>'+item.storeName+'</span></div>'+
													'<div class="rank clearfix">'+
														'<span class="star-ranking fl">'+
														'	<span class="star-score" style="width: '+(72*item.score/5)+'px;"></span>'+
														'</span>'+
														'<span class="score-num fl">'+item.score+'分</span>'+
													'</div>'+
													'<div class="price">'+
														'<span class="start-price">起送:￥'+item.send+'</span>'+
			                							'<span class="send-price"> 配送费:￥'+item.distribution+'</span>'+
										               ' <span class="send-time">'+
										                	'<i class="icon i-poi-timer"></i>'+
										                    '  '+item.deliveryTime+'分钟'+
										               ' </span>'+
													'</div>'+
												'</div>'+
												'<div class="clear"></div>'+
											'</div>'+
										'</a>'+
										'<a href="javascript:;" class="un-favorite j-save-up" data-poiid="144764012999299884" title="收藏商家">'+
								          '  <i class="icon i-poi-fav1"></i>'+
								        '</a>'+
									'</div>'+
								'</div>'+
							'</li>');
							if (index % 4 == 0) {
								storeList.push('<li class="rest-separate j-rest-separate"></li>');
							}
							index ++;
						})
						$('.clearfix').removeClass("ng-hide");
						$('.place-rstbox-nodata').addClass("ng-hide");
						$('.clearfix').html(storeList);
					} else {
						$('.clearfix').addClass("ng-hide");
							$('.place-rstbox-nodata').removeClass("ng-hide");
							return;
					}
				},
				error: function (retMsg) {
					console.log(retMsg)
				}
			});
	}
	
    //查询收藏
    function selectFavorByUserId (userId) {
	  	var user = null;
		$.ajax({
				type:"get",
				url:"http://101.132.194.204:9090/producer/favor/selectFavorByUserId/"+userId,
				async:false,
				success: function (data) {
					var favorList = [];
					if (data) {
						data.forEach(function(item){
							console.log(item)
							favorList.push('<div class="favor-rstblock">'+
										'<div class="favor-rstblock-header">'+
										'	<div class="favor-rstblock-headerbg" style="background-image: url(&quot;//shadow.elemecdn.com/faas/desktop/media/img/favor-rst-bg1.804470.jpg&quot;);"></div>'+
										 '   <a class="favor-rstblock-name ng-binding">'+(item.store.storeName)+'</a>'+
										'</div>'+
										'<a href="store.html?storeId='+item.store.id+'"><img class="favor-rstblock-logo" src="'+item.store.logoImgUrl+'"/></a>'+
										'<div class="favor-rstblock-starrating icon-star">'+
										'	<span class="star-ranking">'+
            							'		<span class="star-score" style="width: '+(72*item.store.score/5)+'px"></span>'+
       									'	</span>'+
										'</div>'+
										'<div class="favor-rstblock-content">'+
										'	<div class="favor-rstblock-item">'+
												'<p>起送价</p>'+
											'	<p class="value icon-yen ng-binding">'+(item.store.send)+'</p>'+
											'</div>'+
											'<div class="favor-rstblock-item">'+
												'<p>送餐时间</p>'+
												'<p class="value icon-yen ng-binding">'+(item.store.deliveryTime)+'</p>'+
											'</div>'+
										'</div>'+
										'<div class="favor-rstblock-activity">'+
											'<i class="favor-rstblock-cancel icon ion-trash-a"></i>'+
										'</div>'+
										'<div class="favor-rstblock-mask hide">'+
											'<p class="tip">取消收藏该商家？</p>'+
											'<p><button class="btn-confirm" onclick="deleteFavorShop('+item.userId+','+item.storeId+','+1+')">取消</button><button class="btn-cancel">不取消</button></p>'+
										'</div>'+
									'</div>');
						})
					}
					$(".favor-restaurants").find(".clearfix").html(favorList);
				},
				error: function (retMsg) {
					console.log(retMsg)
				}
			});
		return user;
	}
    function order (id,status,recently) {
    	var url = '';
    	if (recently == '') {
    		url = id+"?status="+status;
    	} else {
    		url = id+"?recently=true&status="+status;
    	}
    	$.ajax({
				type:"get",
				url:"http://101.132.194.204:9090/producer/order/selectByUserId/"+url,
				async:false,
				success: function (data) {
					var orderList = [];
					if (data) {
						data.forEach(function(item){
							var orderTotals = orderTotal(item.goodsOrderList);
							var status = '';
							if (item.status == 0) {
								status = "未付款";
							}
							 else if (item.status == 1) {
								status = "未接单";
							} else if (item.status == 2) {
								status = "已接单";
							} else if (item.status == 3) {
								status = "拒绝接单";
							} else if (item.status == 4) {
								status = "已完成";
							}
							orderList.push('<div class="orderblock ng-isolate-scope">'+
							'<div class="orderblock-item orderblock-rstinfo clearfix">'+
								'<a class="logo" href="store.html?storeId='+item.store.id+'">'+
									'<img alt="商家 LOGO" src="'+item.store.logoImgUrl+'"></a>'+
									'<h3 class="name">'+
										'<a class="inherit ng-binding" href="store.html?storeId='+item.store.id+'">'+item.store.storeName+'</a>'+
									'</h3>'+
									'<p class="product ng-binding">'+orderTotals[1]+'</p>'+
									'<a class="productnum" href="orderDetail.html?orderNum='+item.orderNum+'">共<i class="count ng-binding">'+orderTotals[2]+'</i>个菜品&gt;</a>'+
							'</div>'+
							'<div class="orderblock-item orderblock-time ng-binding">'+item.creationDate+'<br></div>'+
							'<div class="orderblock-item orderblock-price">'+
								'<p class="total ng-binding">¥'+orderTotals[0]+'</p>'+
								'<span class="ng-binding"></span>'+
							'</div>'+
							'<div class="orderblock-item orderblock-status">'+
								'<p class="status ng-binding end">'+status+'</p>'+
								'<a class="statuslink ng-binding" href="orderDetail.html?orderNum='+item.orderNum+'">订单详情</a>'+
							'</div>'+
						'</div>');
						})
						
					}
					$(".profile-order-content").html(orderList);
				},
				error: function (retMsg) {
					console.log(retMsg)
				}
			});
    }
    
    function orderTotal (goodsOrderList) {
    	var orderList = [];
    	var priceTotal = 0.00;
    	var goodsList = '';
    	var goodsTotal = 0;
    	for (var i = 0; i<goodsOrderList.length;i++) {
    		priceTotal += (goodsOrderList[i].goodsNum)*(goodsOrderList[i].goodsPrice);
    		goodsList += (goodsOrderList[i].goodsList[0].name)+goodsOrderList[i].goodsNum+"份"
    		if (i+1 < goodsOrderList.length) {
    			goodsList += " / ";
    		}
    		goodsTotal += goodsOrderList[i].goodsNum;
    	}
    	orderList.push(priceTotal.toFixed(2));
    	orderList.push(goodsList);
    	orderList.push(goodsTotal);
    	return orderList;
    }
	function orderDetail (orderNum) {
		$.ajax({
			type:"get",
			url:"http://101.132.194.204:9090/producer/order/orderDetail?orderNum="+orderNum,
			async:false,
			success: function (data) {
				console.log()
				if (data) {
					if (data.status == 0) {
						$(".orderprogress-statustitle").text("未付款");
						$(".orderprogress-statusdesc").text(data.lastUpdateDate);
					}
					else if (data.status == 1) {
						$(".orderprogress-topcard").find("li").eq(0).addClass("active");
						$(".orderprogress-statustitle").text("订单已提交");
						$(".orderprogress-statusdesc").text(data.lastUpdateDate);
					} else if (data.status == 2) {
						$(".orderprogress-topcard").find("li").eq(1).addClass("active");
						$(".orderprogress-statustitle").text("商家已接单");
						$(".orderprogress-statusdesc").text(data.lastUpdateDate);
					}
					else if (data.status == 3) {
						$(".orderprogress-topcard").find("li").eq(1).addClass("active").html("商家已拒绝").css({"color":"red"});
						$(".orderprogress-statustitle").text("商家已拒绝");
						$(".orderprogress-statusdesc").text(data.lastUpdateDate);
					} else if(data.status == 4){
						$(".orderprogress-topcard").find("li").eq(2).addClass("active");
						$(".orderprogress-statustitle").text("订单完成");
						$(".orderprogress-statusdesc").text(data.lastUpdateDate);
					} 
					$(".orderprogress-statustitle").html();
					$(".inherit").html(data.store.storeName);
					$(".orderprogress-rstextra").find("span").eq(0).html("订单号："+data.orderNum);
					$(".orderprogress-rstextra").find("span").eq(1).html("商家电话："+data.store.contactPhone);
					$(".orderprogress-rstimg").attr('src',data.store.logoImgUrl);
					var delivery_info = [];
					delivery_info.push('<p>'+
											'<span class="orderprogress-deliverykey">联 系 人：</span>'+
											'<span class="ng-binding">'+data.contactPeople+'('+(data.sex ==1 ?"先生":"女士")+')</span>'+
											'</p>'+
											'<p>'+
												'<span class="orderprogress-deliverykey">联系电话：</span> '+
												'<span class="ng-binding">'+data.contactPhone+'</span>'+
											'</p>'+
											'<p>'+
												'<span class="orderprogress-deliverykey">收货地址：</span> '+
												'<span class="ng-binding">'+data.contactAddress+'</span>'+
										'</p>');
				}
				$(".orderprogress-deliverygroup").eq(1).html(delivery_info);
				$(".tail").html('<p>'+
									'<span class="orderprogress-deliverykey">备 注：</span> '+
									'<span class="ng-binding">'+(data.remake == null?"无备注":data.remake)+'</span>'+
								'</p>');
				var goods = goodsList(data.goodsOrderList);
				var total = orderPriceTotal(data.goodsOrderList);
				$(".orderprogress-total").html('<div class="orderprogress-totalrow orderprogress-totaltitle">'+
											'<span class="cell name">菜品</span> '+
											'<span class="cell quantity">数量</span> '+
											'<span class="cell price">小计（元）</span>'+
										'</div>'+
										goods+
											'<div class="ng-scope">'+
												'<div class="orderprogress-baseline ng-scope"></div>'+
											'</div>'+
											'<div class="orderprogress-totalactual">'+
												'实际支付：<span class="ng-binding">'+total+'</span>'+
											'</div>');
			},
			error: function (retMsg) {
				console.log(retMsg)
			}
		});
	}
	function goodsList (goods) {
		var goodsLists = [];
		goods.forEach(function(item){
			goodsLists.push('<div class="ng-scope">'+
							'<div class="orderprogress-totalrow ng-scope">'+
								'<span class="cell name ng-binding" >'+item.goodsList[0].name+'</span> '+
								'<span class="cell quantity ng-binding">'+item.goodsNum+'</span>'+
								'<span class="cell price ng-binding">'+(item.goodsNum*item.goodsPrice).toFixed(2)+'</span>'+
							'</div>'+
						'</div>');
		});
		return goodsLists;
	}
	function orderPriceTotal (goods) {
		var priceTotal = 0;
		for (var i = 0; i<goods.length;i++) {
			priceTotal += (goods[i].goodsNum)*(goods[i].goodsPrice);
		}
		return priceTotal.toFixed(2);
	}