// TAKE 1
// plan of action
// 1. input -> tree
// 2. ???
// 3. profit!

var tree = [{
    id: 0,
    parent: false,
    data: '',
    mode: 'AND',
    childs: []
}];

function getOrs(s) {
    var ors = [], depth = 0;
    for (var i = 0; i < s.length; i++) {
        if (s[i] == '(') depth++;
        if (s[i] == ')') depth--;
        if (depth == 0 && s[i] == '|') ors.push(i);
    }
    return ors;
}

function newNode(parentNode, mode) {
    var newNodeId = tree.length;
    var node = {
        data: '',
        id: newNodeId,
        mode: mode,
        parentId: parentNode && parentNode.id,
        childs: []
    };
    tree.push(node);
    if (parentNode) {
        parentNode.childs.push(newNodeId);
    }
    return node;
}

function getCators(s, ors) {
    // return array of ors.length+1 strings
    var arr = [];
    for (var i = 0; i <= ors.length; i++) {
        var start = 0;
        if (i > 0) start = ors[i-1]+1;
        var end = s.length;
        if (i < ors.length) end = ors[i];
        arr.push(s.slice(start, end));
    }
    return arr;
}

function getTopLevelBrackets(s) {
    var arr = [], depth = 0;
    for (var i = 0; i < s.length; i++) {
        if (s[i] == ')') depth--;
        if (depth == 0 && (s[i] == '(' || s[i] == ')')) arr.push(i);
        if (s[i] == '(') depth++;
    }
    return arr;
}

// 1. is "|" on given level? split into OR-parts subnodes
// 2. is "()" on given level? primitive otherwise
//    - if yes, split A(B)C(D)(E) na AND-parts subnodes
function parseNew(data, parentNode) {
    var ors = getOrs(data);
    if (ors.length > 0) {
        var cutOrs = getCators(data, ors);
        var node = newNode(parentNode, 'OR');
        cutOrs.map(s => {
            parseNew(s, node); // empty strings accepted
        })
        return;
    }

    if (data.indexOf('(') > -1) {
        var ands = getTopLevelBrackets(data);
        var cutAnds = getCators(data, ands);
        var node = newNode(parentNode, 'AND');
        cutAnds.map(s => {
            if (s.length > 0) parseNew(s, node); // empoty strings not accepted
        })
        return;
    }

    var node = newNode(parentNode, ''); // leaf
    node.data = data;

}

var root = $('#root');
var pre = $('<pre>');
root.append(pre);

function renderMap() {
    pre.empty();

    for (var y=0;y<mapSize;y++) {
        var line = '';
        for (var x=0;x<mapSize;x++) {
            line = line+(map[y][x] ? (map[y][x] == '?' ? '#' : map[y][x]) : ' ');
        }
        pre.append(line);
        pre.append('<br>');
    }
}

parseNew(input, tree[0]);
console.log(tree);

var map = [], mapSize = 500; //[y][x]
for (var y=0;y<mapSize;y++) {
    map[y] = [];
}

var startX = mapSize/2, startY=mapSize/2;
map[startY][startX] = 'X';

var minx = 0,miny = 0,maxx = 0,maxy = 0;

function drawNode(node,x,y) {
    minx = Math.min(minx,x);
    miny = Math.min(miny,y);
    maxx = Math.max(maxx,x);
    maxy = Math.max(maxy,y);
    console.log('drawing node', node);
    //console.log('boundaries', minx, miny, maxx, maxy); // -29, -19000 9545 125 asi je neco spatne
    for (var i=0;i<node.data.length;i++) {
        var ch = node.data[i];
        if (ch == '^') continue;
        if (ch == '$') continue;
        if (ch == 'N') {
            y--;
            map[y][x] = '-';
            map[y][x-1] = '#';map[y][x+1] = '#';
            y--;
        }
        if (ch == 'S') {
            y++;
            map[y][x] = '-';
            map[y][x-1] = '#';map[y][x+1] = '#';
            y++;
        }
        if (ch == 'E') {
            x++;
            map[y][x] = '|';
            map[y-1][x] = '#';map[y+1][x] = '#';
            x++;
        }
        if (ch == 'W') {
            x--;
            map[y][x] = '|';
            map[y-1][x] = '#';map[y+1][x] = '#';
            x--;
        }
        map[y][x] = '.';
    }

    if (node.mode == 'AND') {
        for (n = 0; n < node.childs.length;n++) {
            var a = drawNode(tree[node.childs[n]],x,y);
            x = a[0];y = a[1];
        }
    } else if (node.mode == 'OR') {
        node.childs.map(nId => {
            drawNode(tree[nId], x, y);
        })
    }
    return [x,y];
}

function tree2string(s, node) {
    s = s + node.data;
    if (node.childs.length > 0) {
        var subs = [];
        node.childs.map(nId => {
            subs.push(tree2string('', tree[nId]));
        })
        var ss = subs.join( (node.mode == 'OR' ? '|' : '') );
        if (node.mode == 'OR') s = s + '(' + ss + ')';
        else s = s + ss;
    }
    return s;
}

function cmpStrings(s1, s2) {

    console.log('lengths', s1.length, s2.length, s1.length == s2.length);
    var matched = 0;firstMismatch = false;
    for (var i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] == s2[i]) matched++;
        if (s1[i] != s2[i]) {
            if (!firstMismatch) firstMismatch = i;
        }
    }

    console.log('matching characters count', matched, 'firstMismatch', firstMismatch);
}

var output = tree2string('', tree[0]);
pre.html(output);

cmpStrings(input, output);

//drawNode(tree[0], startX, startY);
//console.log('boundaries', minx, miny, maxx, maxy); // -29, -19000 9545 125 asi je neco spatne
//renderMap();