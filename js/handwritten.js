// function throttle(func, limit) {
//   let inThrottle;
//   return function (...args) {
//     const context = this;
//     if (inThrottle) return;
//     func.apply(context, args);
//     inThrottle = true;
//     setTimeout(() => (inThrottle = false), limit);
//   };
// }

function debounce(func, wait = 50) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

const throttle = (func, limit) => {
  let lastTime = 0;
  return function (...args) {
    let now = +new Date();
    if (now - lastTime > limit) {
      lastTime = now;
      func.apply(this, args);
    }
  };
};

// setInterval(
//   throttle(() => {
//     console.log(1);
//   }, 2000),
//   1
// );

// setInterval(
//   debounce(() => {
//     console.log(1);
//   }, 500),
//   600
// );

Function.prototype.myCall = function (context = global, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("error");
  }
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

Function.prototype.myApply = function (context = global, args) {
  if (typeof this !== "function") {
    throw new TypeError("error");
  }
  const fn = Symbol();
  context[fn] = this;
  let result;
  if (Array.isArray(args)) {
    result = context[fn](...args);
  } else {
    result = context[fn]();
  }
  delete context[fn];
  return result;
};

const obj = { a: 9 };
const f = function () {
  console.log(this.a);
  return this;
};
console.log(f() == global);
console.log(f.myCall(obj));
console.log(f.myApply(obj));

Function.prototype.myBind = function (context) {
  // 判断调研对象是否是函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 获取参数
  const args = [...arguments].slice(1),
    fn = this;
  return function Fn() {
    console.log("this instanceof Fn", this instanceof Fn);
    return fn.apply(
      this instanceof Fn ? new fn(...arguments) : context,
      args.concat(...arguments)
    );
  };
};

function fn(...args) {
  console.log(this, args);
}
// let obj = {
//   myname: "张三",
// };

// const bindFn = fn.myBind(obj); // this 也会变成传入的obj ，bind不是立即执行需要执行一次
// new bindFn(1, 2); // this指向obj
// fn.myBind(obj)(3); // this 也会变成传入的obj ，bind不是立即执行需要执行一次
// fn(1, 2); // this指向window

function myInstanceof(target, origin) {
  const proto = Object.getPrototypeOf(target);
  if (proto) {
    if (proto == origin.prototype) {
      return true;
    } else {
      return myInstanceof(proto, origin);
    }
  } else {
    return false;
  }
}

// function Car() {}
// const car = new Car();
// console.log(myInstanceof(car, Car));

function myNew(Func, ...args) {
  // 创建新对象
  const obj = {};
  // 执行构造函数对象
  obj.__proto__ = Func.prototype;
  // 构造函数的this指向新对象
  let result = Func.apply(obj, args);
  // 根据返回值判断
  return result instanceof Object ? result : obj;
}

// function Person(name) {
//   this.name = name;
// }
// const person = myNew(Person, "宋兴国");
// console.log(person);
