const compute = (arr, result = 0) => {
    for (let i = 1; i < arr.length; i++) if (arr[i] > arr[i-1]) result++;
    return result;
}

const map2Thrices = (arr, res = []) => {
    for (let i = 0; i < arr.length-2; i++) res[i] = arr[i]+arr[i+1]+arr[i+2];
    return res;
}

console.log(compute(input));
console.log(compute(map2Thrices(input)));