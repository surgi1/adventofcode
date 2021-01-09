console.log('part 1', Math.max(...data));

let root = $('#root');
data.map(d => {
    let row = d >> 3, col = d & 0b0000000111;
    let el = $('<div class="seat" style="width:50px;height:15px;background-color:green;position:absolute;top:'+row*15+'px;left:'+col*50+'px;">').html(d);
    root.append(el);
})