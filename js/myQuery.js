function $(id) {
  return document.getElementById(id);
}

function getStyle(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return getComputedStyle(obj)[attr];
  }
}

function Go(obj, step, target, attr, endFn) {
  //对象  每次移动的距离  目标点  改变的属性  回调函数
  clearInterval(obj.timer);
  obj.timer = setInterval(function () {
    var Distance = parseInt(getStyle(obj, attr)) + step;
    //				step 可能是负数或者正数
    if ((Distance > target && step > 0) || (Distance < target && step < 0)) {
      //与判断  与  或判断并行时的执行方式？
      Distance = target;
    }
    //		判断即将移动的距离,精确控制目标点
    obj.style[attr] = Distance + "px";
    if (Distance == target) {
      clearInterval(obj.timer);
      if (endFn) {
        //巧妇难为无米之炊，判断当你传入了函数之后再去调用
        endFn();
      }
    }
  }, 10);
}

function dispear(obj, step, endFn) {
  var n;
  step > 0 ? (n = 0) : (n = 1);
  obj.op = setInterval(function () {
    n = n + step;
    obj.style.opacity = n;
    if (n <= 0 || n >= 1) {
      clearInterval(obj.op);
      if (endFn) {
        endFn();
      }
    }
  }, 20);
}
//将时间中的个位数，前面放0 比如 9：00-->09：00
function DoubleFn(n) {
  n < 10 ? (n = "0" + n) : n;
  return n;
}

//obj 需要震动的对象  attr 震动的方向  control 能否（true/false）被震动
//endFn 震动之后执行的函数
function shake(obj, attr, control, endFn) {
  if (control) {
    obj.s = false;
    var pos = parseInt(getStyle(obj, attr));
    var arr = [];
    for (var i = 20; i >= 0; i -= 2) {
      arr.push(i, -i);
    }
    var num = 0;
    obj.shake = setInterval(function () {
      obj.style[attr] = pos + arr[num] + "px";
      num++;
      if (num == arr.length) {
        clearInterval(obj.shake);
        obj.s = true;
        if (endFn) {
          endFn();
        }
      }
    }, 40);
  }
}
//function dispear(obj,step,endFn){
//	var n=1;
//	if(step>0){n=0;}
//	obj.op = setInterval(function(){
//		n=n+step;
//		obj.style.opacity=n;
//		if(n<=0 || n>=1){
//			clearInterval(obj.op);
//			if(endFn){
//				endFn();
//			}
//		}
//	},40)
//}
//dispear(oBox,-0.06);
//dispear(oBox,0.06);

//function show(obj,endFn){
//	var n=0;
//	obj.opS = setInterval(function(){
//		n=n+0.06;
//		obj.style.opacity=n;
//		if(n>=1){
//			clearInterval(obj.opS);
//			if(endFn){
//				endFn();
//			}
//		}
////		console.log(n);
//	},40)
//}
//getStyle(oBox,'width');
//function getStyle(obj,attr){
//	if(oBox.currentStyle){
//		return oBox.currentStyle.width;
//	}else{
//		return getComputedStyle(oBox).width;
//	}
//}
//jqurey
