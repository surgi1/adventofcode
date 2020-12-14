console.log(Math.max(...data));

var root = $('#root');

data.forEach(d => {
    var row = d >> 3;
    var col = d & 0b0000000111;
    console.log('seat', d, ', row:', row, ', column:', col);
    var el = $('<div class="seat" style="width:50px;height:15px;background-color:green;position:absolute;top:'+row*15+'px;left:'+col*50+'px;">').html(d);
    root.append(el);
})