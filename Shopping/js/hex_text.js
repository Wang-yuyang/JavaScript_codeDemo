window.onload = function(){
	var table = document.getElementById("cartTable");//获取表格
	var checkInput = document.getElementsByClassName('check');//所有勾选框
	var checkAllInput = document.getElementsByClassName('check-all');//两个全选勾选框
	var tr = table.children[1].rows;//商品rows
	// console.log(tr);
	
	var selectedTotal= document.getElementById("selectedTotal");//总件数
	var priceTotal = document.getElementById("priceTotal");//总价数
	
	var selected = document.getElementById("selected");//已选商品
	var selectedViewList = document.getElementById("selectedViewList");//浮层图list
	var foot = document.getElementById("foot");//表页脚
	
	var subtotal = document.getElementsByClassName('subtotal');//小计
	var deleteAll = document.getElementById("deleteAll");
	
	//商品单选、总件数、总价
	function getTotal(){
		var selected = 0 ; //记录件数
		var price = 0 ; //记总价
		var htmlString = '';
		
		for(var i = 0 ; i < tr.length ; i ++){
			if(tr[i].getElementsByTagName('input')[0].checked){ //单选功能核心
				tr[i].className = 'on';
				// 计价、计数核心
				selected += parseInt(tr[i].getElementsByTagName('input')[1].value);
				price += parseFloat(tr[i].getElementsByTagName('td')[4].innerText);
				// console.log(selected)
				// 添加浮层图片
				// <div><img src="images/1.jpg" ><span>取消选择</span></div>
				htmlString += '<div><img src="'+ tr[i].getElementsByTagName('img')[0].src +'" /><span class="del" index="'+ i +'">取消选择</span></div>';
				// console.log(htmlString);
			} else {
				tr[i].className = '';
			}
			selectedTotal.innerHTML = parseInt(selected);
			priceTotal.innerHTML = parseFloat(price) ; 
			selectedViewList.innerHTML = htmlString ;
			if(selected == 0 ){//商品为0 hide
				foot.className = 'foot';
			}
		}
	}
	// 小计
	function Subtotal(tr){
		// var td = tr.cells;
		var price = parseFloat(tr.getElementsByTagName('td')[2].innerText);
		var count = parseInt(tr.getElementsByTagName('input')[1].value);
		// console.log(price,count)
		// 改
		var sum = parseFloat( price * count) ;
		tr.getElementsByTagName('td')[4].innerHTML = sum.toFixed(2);
		getTotal();
	}
	
	//预览图片浮层事件
	selected.onclick = function() {
		if(foot.className == 'foot'){
			if(selectedTotal.innerHTML != 0 ){
				foot.className = 'foot show';
			}
		} else {
			foot.className = 'foot';
		}
	}
	
	//取消选择的事件代理
	selectedViewList.onclick = function(e) {//将事件绑定到父元素上
		var e = e || window.event ; 
		var el = e.srcElement ; //返回鼠标点击的子元素html
		// console.log(el);
		if(el.className == 'del'){//确定取消选择子元素
			var index = el.getAttribute("index");//返回自定义属性value
			var input = tr[index].getElementsByTagName('input')[0];
			input.checked = false;
			getTotal();
		}
	}
	
	//商品的数量增加、减少、删除
	// 利用事件代理的方式代理到tr中，鼠标事件与add/reduce两个class属性锁定后switch
	for(var i = 0 ; i < tr.length ; i++){
		tr[i].onclick = function(e) {
			var e = e || window.event ; 
			var el = e.srcElement ; 
			var cls = el.className ; 
			var count = this.getElementsByTagName('input')[1];
			var val = parseInt(count.value);//数
			var reduce = this.getElementsByTagName('span')[1];
			
			
			switch(cls){
				case 'add':
					count.value = val + 1 ; 
					reduce.innerHTML = '-' ; 
					Subtotal(this);//计算小计，并把当前行传给subtotal()
					break;
				case 'reduce':
					if(val <= 1 ){
						reduce.innerHTML = '';
					}
					if(val > 1 ){
						count.value = val - 1 ; 
					}
					Subtotal(this);
					break;
				case 'delete':
					var conf = confirm("确认删除");
					if(conf){
						this.remove();
					}
					break;
			}
			getTotal();
		}
		//键盘输入
		tr[i].getElementsByTagName('input')[1].onkeyup = function() {
			//this == tr[i].getElementsByTagName('input')[1]
			var val = parseInt(this.value);
			var tr = this.parentNode.parentNode;
			console.log(tr);
			var reduce = tr.getElementsByTagName('span')[1];//减号
			
			if(isNaN(val) || val < 1){//处理非法字符的输入
				val = 1 ; 
			}
			if( val > 1 ){//处理减符号
				reduce.innerHTML = '-';
			} else {
				reduce.innerHTML = '';
			}
			this.value = val ; 
			Subtotal(tr);
			getTotal();
		}
	}
	//多行删除
	deleteAll.onclick = function() {
		if(selectedTotal != 0 ){ //确定是否存在商品
			var conf = confirm("确认删除已选商品?")
			if(conf){
				for (var i = 0; i < tr.length; i++) {
					var checkbox = tr[i].getElementsByTagName('input')[0];
					if(checkbox.checked == true){
						tr[i].remove();
						i-- ; 
					}
				}
			}
		} else {
			alert("没有选择商品")
		}
		getTotal();
	}
	
	
	//勾选框点击事件
	for (var i = 0; i < checkInput.length; i++) {
		checkInput[i].onclick = function(){
			if(this.className === 'check-all check'){//确认是否为全选勾选
				for(var j = 0 ; j < checkInput.length ; j++){//是全勾选框则执行
					checkInput[j].checked = this.checked ; //所有勾选框与全勾选框同一状态
				}
			}
			if(this.checked == false){
				for(var k = 0 ; k < checkAllInput.length ; k++){//若有一个勾选框杯取消则取消全选框的勾选
					checkAllInput[k].checked = false ; 
				}
			}
			getTotal();
		}
	}
	
}