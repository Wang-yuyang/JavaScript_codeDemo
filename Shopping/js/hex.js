window.onload = function() { //页面自动加载
	var table = document.getElementById("cartTable"); //获取购物车表格
	var checkInput = document.getElementsByClassName("check"); //获取所有checkbox
	var checkAllInput = document.getElementsByClassName("check-all"); //获取所有checkbox-all全选框
	var tr = table.children[1].rows; //children[*]:获取所有子元素 ； rows:获取单元行
	var selectedTotal = document.getElementById("selectedTotal"); //获取已选商品合计数
	var priceTotal = document.getElementById("priceTotal"); //获取合计数
	var selectedViewList = document.getElementById("selectedViewList"); //hide的展示页面
	var selecredView = document.getElementsByClassName('selected-view'); //hide展示
	var selecteds = document.getElementById("selected"); //已选商品
	var foot = document.getElementById("foot"); //获取表页脚
	var deleteAll = document.getElementById("deleteAll");//多行删除

	// 更新总数和总价格
	function getTotal() {
		var selected = 0;
		var price = 0;
		var htmlStr = ''; //字符串变量，用于添加hide页面的展示图片

		for (var i = 0; i < tr.length; i++) {
			if (tr[i].getElementsByTagName('input')[0].checked == true) { //判断是否被选中
				tr[i].className = 'on'; //添加.on样式（底色变）
				selected += parseInt(tr[i].getElementsByTagName('input')[1].value); //计算数目
				price += parseFloat(tr[i].getElementsByTagName('td')[4].innerHTML); //计算价格
				// -- html结构 --
				// <div>
				// 	<img src="images/1.jpg" >
				// 	<span>取消选择</span>
				// </div>
				// -- 添加功能 --
				htmlStr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"><span class="del" index="' + i +
					'">取消选择</span></div>'; //ok--good
			} else {
				tr[i].className = '';
			}
		}

		//返回已选商品的总价、总数
		selectedTotal.innerHTML = selected;
		priceTotal.innerHTML = price.toFixed(2);

		selectedViewList.innerHTML = htmlStr; // ok-good
		if (selected == 0) {
			foot.className = 'foot'; // ok-good
		}
	}
	
	//hide页面事件
	selecteds.onclick = function() {//**!!**/

		console.log(selecteds);
		if (foot.className == 'foot') {
			console.log(foot.className);
			if (selectedTotal.innerHTML != 0) {
				foot.className = 'foot show';
				console.log(foot.className);
			}
		} else {
			foot.className = 'foot';
		}
	}
	//取消选择事件
	selectedViewList.onclick = function(e){
		var e = e || window.event;//IE兼容
		var el = e.srcElement;//window.event.srcElement
		if(el.className == 'del'){//确认
			var index = el.getAttribute('index');//取得索引
			var input = tr[index].getElementsByTagName('input')[0];//获取checkbox选择框
			input.checked = false ; //取消选中
			input.onclick();
			//getTotal();//更新
		}
	}
	//小计 
	function getSubTotal(tr){
		var tds = tr.cells;//获取行内单元格
		var price = parseFloat(tds[2].innerText);//单价
		console.log(tds[2].innerext)
		var count = parseInt(tr.getElementsByTagName('input')[1].value);//件数
		var subTotal = parseFloat(price*count);
		tds[4].innerHTML = subTotal.toFixed(2);
	}
	
	//商品数量增减
	for(var i = 0 ; i < tr.length ; i++){
		tr[i].onclick = function(e) {
//事件代理(委托)，即将点击事件绑定在父元素，不需在给每个字元素绑定事件，
//事件代理之后，会依靠鼠标的事件响应返回e(即鼠标点击信息)
			var e = e || window.event;
			// console.log(e);
			var el = e.srcElement;
			// e.srcElement：则会返回响应位置的子元素
			// console.log(el)
			var cls = el.className ; 
			var input = this.getElementsByTagName('input')[1];//获取
			var val = parseInt(input.value);//获取具体数
			var reduce = this.getElementsByTagName('span')[1];//减号
			switch(cls){
				case 'add':
					input.value = val+1;
					reduce.innerHTML = '-';
					getSubTotal(this);//刷新小计
					break;
				case 'reduce':
					if(val > 1){
						input.value = val-1;
					}
					if(val <= 1){
						reduce.innerHTML = '';
					}
					getSubTotal(this);//刷新小计
					break;
				case 'delete':
					var conf = confirm("是否确认删除当前选择行?");//确认窗
					if(conf){
						this.remove();
					}
					break;
			}
			getTotal();//刷新
		}
		//键盘输入数量
		tr[i].getElementsByTagName('input')[1].onkeyup = function(){//绑定键盘事件
			var val = parseInt(this.value);
			var tr = this.parentNode.parentNode;//获取当前行单元
			var reduce = tr.getElementsByTagName('span')[1];
			if(isNaN(val) || val < 1){
				val = 1 ;
			}
			this.value = val;
			
			if(val <= 1){
				reduce.innerHTML = '';
			} else {//为否则表示val大于1
				reduce.innerHTML = '-';
			}
			getSubTotal(tr);
			getTotal();
		}
	}
	
	//多行删除
	deleteAll.onclick = function() {
		if(selectedTotal.innerHTML != 0 ){
			var conf = confirm("是否确认删除当前选择的所有行?");
			if(conf){
				for(var i = 0 ; i < tr.length ; i ++){
					if(tr[i].getElementsByTagName('input')[0].checked) { //判断是否勾选
						tr[i].remove();
						i--;//回退下标，因为删除第一行的时候，tr总长度发生变化即第二行变成了第一行
					}
				}
			}
		} else {
			alert("请选择需要删除的商品！");
		}
		getTotal();
	}

	//check事件
	for (var i = 0; i < checkInput.length; i++) {
		checkInput[i].onclick = function() {
			if (this.className === 'check-all check') { //确认是否为全选框被触发
				for (var j = 0; j < checkInput.length; j++) { //其它所有选项框与check-all同checked状态
					checkInput[j].checked = this.checked;
				}
			}
			if (this.checked == false) { //checked出现false,则取消全选框被选中的状态
				for (var k = 0; k < checkAllInput.length; k++) {
					checkAllInput[k].checked = false; //取消选中状态
				}
			}
			getTotal();
		}
	}
}
