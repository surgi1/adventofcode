let sentence = '1113222113';
let iterations = 50;

const lookAndSay = s => {
    let last = s[0], count = 1, result = '';
    for (let i = 1; i < s.length; i++) {
        if (s[i] != last) {
            result += count + last;
            count = 0;
            last = s[i];
        }
        count++;
    }
    return result + count + last;
}

for (let i = 1; i <= iterations; i++) sentence = lookAndSay(sentence);

console.log(sentence.length);