console.log(Math.max(...data));

let root = $('#root');

data.forEach(d => {
    let row = d >> 3;
    let col = d & 0b0000000111;
    console.log('seat', d, ', row:', row, ', column:', col);
    let el = $('<div class="seat" style="width:50px;height:15px;background-color:green;position:absolute;top:'+row*15+'px;left:'+col*50+'px;">').html(d);
    root.append(el);
})