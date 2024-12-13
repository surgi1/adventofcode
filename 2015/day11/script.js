const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const ai = l => alphabet.indexOf(l)
const hasStraight = arr => arr.some((v, i) => i < arr.length-2 && ai(v)+1 == ai(arr[i+1]) && ai(v)+2 == ai(arr[i+2]));
const noConfusing = arr => !arr.some(l => ['i', 'o', 'l'].includes(l));
const hasPairs = arr => arr.join('').match(/(.)\1/g)?.length > 1;

const inc = arr => {
    let pos = arr.length-1,
        done = false;

    while (!done) {
        arr[pos] = alphabet[(ai(arr[pos]) + 1) % 26];
        if (ai(arr[pos]) > 0) {
            done = true;
            break;
        }
        pos--;
        if (pos < 0) {
            arr.unshift('a');
            done = true;
        }
    }

    return arr;
}

let input = 'vzbxkghb';
let base = input.split('');

const run = () => {
    base = inc(base);
    while (!(hasStraight(base) && noConfusing(base) && hasPairs(base))) base = inc(base);
}

run();
console.log('p1', base.join(''));

run();
console.log('p2', base.join(''));