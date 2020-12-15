var sentence = '1113222113';
var iterations = 50;

function lookAndSay(s) {
    var last = s[0], count = 1, result = '';
    for (var i = 1; i < s.length; i++) {
        if (s[i] != last) {
            result += count + last;
            count = 0;
            last = s[i];
        }
        count++;
    }
    return result + count + last;
}

for (var i = 1; i <= iterations; i++) sentence = lookAndSay(sentence);

console.log(sentence.length);