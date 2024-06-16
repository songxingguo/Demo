/**
 * 冒泡排序：两两比较，每次都交换
 * @param {*} arr
 * @returns
 */
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0, stop = len - 1 - i; j < stop; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

let arr = [1, 5, 4, 3, 6, 8];
console.log("原数组", arr);
bubbleSort(arr);
console.log("冒泡排序：", arr);
console.log("---");

/**
 * 选择排序：两两比较，找出最大（小）值，最后交换
 * @param {*} arr
 * @returns
 */
function selectionSort(arr) {
  let len = arr.length,
    min;
  for (let i = 0; i < len; i++) {
    // 设置当前位置为最小值
    min = i;
    //检查其余部分是否有更小的
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    // 如果当前位置不是最小的就进行交换
    if (i != min) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  return arr;
}

let arr1 = [1, 5, 4, 3, 6, 8];
console.log("原数组", arr1);
selectionSort(arr1);
console.log("选择排序：", arr1);
console.log("---");

function insertionSort(arr) {
  let len = arr.length,
    value,
    j;
  for (let i = 0; i < len; i++) {
    value = arr[i];
    // 已排序元素当前元素大于value，就将当前元素向后移动
    for (j = i - 1; j >= 0 && arr[j] > value; j--) {
      arr[j + 1] = arr[j];
    }
    arr[j + 1] = value;
  }
  return arr;
}
const arr2 = [1, 5, 4, 3, 6, 8];
console.log("原数组", arr2);
insertionSort(arr2);
console.log("插入排序：", arr2);
console.log("---");

/**
 * 归并排序：先分后合
 * @param {*} arr
 * @returns
 */
function mergeSort(arr) {
  if (arr.length < 2) return arr;
  let midddle = parseInt(arr.length / 2);
  const left = arr.slice(0, midddle);
  const right = arr.slice(midddle);
  return merge(mergeSort(left), mergeSort(right));
}
const merge = (left, right) => {
  let result = [];
  //两两比较数组开头元素
  while (left.length && right.length) {
    left[0] <= right[0]
      ? result.push(left.shift())
      : result.push(right.shift());
  }
  // 将剩余元素放入结果中
  while (left.length) result.push(left.shift());
  while (right.length) result.push(right.shift());
  return result;
};

let arr3 = [1, 5, 4, 3, 6, 8];
console.log("原数组", arr3);
arr3 = mergeSort(arr3);
console.log("归并排序：", arr3);
console.log("---");

/**
 * 快速排序
 * @param {*} arr
 * @returns
 */
function quicksort(arr) {
  if (arr.length <= 1) return arr;
  let pivot = Math.floor((arr.length - 1) / 2);
  let val = arr[pivot],
    less = [],
    more = [];
  arr.splice(pivot, 1);
  // 小的放左边，大的放右边
  arr.forEach((e) => {
    e < val ? less.push(e) : more.push(e);
  });
  return quicksort(less).concat([val], quicksort(more));
}

let arr4 = [1, 5, 4, 3, 6, 8];
console.log("原数组", arr4);
arr4 = quicksort(arr4);
console.log("快速排序：", arr4);
