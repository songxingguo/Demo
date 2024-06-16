// 先进后出
class Stack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    this.items.pop();
  }
  // 只返回不移除
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  clear() {
    this.items = [];
  }
  size() {
    return this.items.length;
  }
}

// const stack = new Stack();
// stack.push(1);
// stack.push(2);
// stack.pop();
// stack.push(3);
// stack.peek();
// stack.size();
// console.log(stack.size());

// 先进先出
// class Queue {
//   constructor() {
//     this.list = [];
//     this.fIndex = 0;
//     this.tIndex = this.list.length - 1;
//   }
//   enqueue() {
//     this.list[this.tIndex++] = item;
//   }
//   unqueue() {
//     const item = this.list[this.fIndex];
//     this.fIndex++;
//     return item;
//   }
// }

class Queue {
  constructor(size) {
    this.size = size + 1; // 长度需要限制, 来达到空间的利用, 代表空间的长度
    this.list = [];
    this.font = 0; // 指向首元素
    this.rear = 0; // 指向准备插入元素的位置
  }
  enQueue(value) {
    if (this.isFull() == true) {
      return false;
    }
    this.list[this.rear] = value;
    this.rear = (this.rear + 1) % this.size;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) {
      return false;
    }
    this.font = (this.font + 1) % this.size;
    return true;
  }
  isEmpty() {
    return this.font === this.rear;
  }
  isFull() {
    return (this.rear + 1) % this.size === this.font;
  }
  toString() {
    console.log(this.list.slice(this.font, this.rear));
  }
}

const queue = new Queue(5);
queue.enQueue(1);
queue.enQueue(3);
queue.toString();
