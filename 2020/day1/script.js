for (i1 = 0; i1 < arr.length; i1++) {
    for (i2 = i1+1; i2 < arr.length; i2++) {
        if (arr[i1]+arr[i2] == 2020) console.log('part 1', arr[i1]*arr[i2]);
        for (i3 = i2+1; i3 < arr.length; i3++) {
            if (arr[i1]+arr[i2]+arr[i3] == 2020) console.log('part 2', arr[i1]*arr[i2]*arr[i3]);
        }
    }
}
