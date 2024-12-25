Start by printing out `x`, `y` and `z` gates:

```
  4444443333333333222222222211111111110000000000
  5432109876543210987654321098765432109876543210

  0110000001100011011111101110011010001000111001 <- x
+ 0100001000011000110111111011100001111010101111 <- y
                                      ^
≠ 1010010001111100001111101001111011111011101000 <- z
```
Go bit by bit from LSB and check result, inspect expressions for faulty bits.

Notice, that the first faulty bit is `z09`.

By observing the expression tree for given `z` bits we've learnt how the expressions are constructed; they have always `XOR` on the top level of given `z` bit, where one of the input gates is `XOR` between `x` and `y` on the same level, and the other is an `OR` gate.

Important part of the expression tree for `z10` root:
```
     XOR
    /   \
  XOR    OR
 /   \   / \
x10 y10 .. ..
```

**This is enough to crack the whole puzzle.**

All the important expressions to solve `z09` are these:

```
cnk XOR hhp -> z09
x09 AND y09 -> cnk
gbf OR gnt -> hhp
x09 XOR y09 -> qwf
```

**Swap #1: to fix `z09` we need to swap `qwf` with `cnk`**. (let's do it then)

---

```
  4444443333333333222222222211111111110000000000
  5432109876543210987654321098765432109876543210

  0110000001100011011111101110011010001000111001
+ 0100001000011000110111111011100001111010101111
                                 ^              
≠ 1010010001111100001111101010000000000011101000
```

`z14` is faulty; checking its expression, it must be XOR of 2 sub-expressions, one of them must be `x14 XOR y14` (or `y14 XOR x14` of course)

```
y14 AND x14 -> z14
x14 XOR y14 -> rkm
ndq XOR rkm -> vhm
```

**Swap #2: `z14` with `vhm`** (let's do it then)

---

```
  4444443333333333222222222211111111110000000000
  5432109876543210987654321098765432109876543210

  0110000001100011011111101110011010001000111001
+ 0100001000011000110111111011100001111010101111
                    ^
≠ 1010010001111100001111101001111100000011101000
```

`z27` is faulty; same reason as above; it must be result of `XOR` operation with one of the operands being `x27 XOR y26`
```
snv OR jgq -> z27 
y27 XOR x27 -> kqw
kqw XOR kqj -> mps
```
**Swap #3: `z27` with `mps`** (let's do it then)

---

```
  4444443333333333222222222211111111110000000000
  5432109876543210987654321098765432109876543210

  0110000001100011011111101110011010001000111001
+ 0100001000011000110111111011100001111010101111
        ^
≠ 1010010001111100010111101001111100000011101000
```

`z39` is faulty; solved as above

```
trn AND gpm -> z39
y39 XOR x39 -> trn
gpm XOR trn -> msq
```
**Swap #4 `msq` with `z39`** (let's do it then)

---

```
  0110000001100011011111101110011010001000111001
+ 0100001000011000110111111011100001111010101111

= 1010001001111100010111101001111100000011101000
```

We're done; compile, sort and submit.

result:

`compileP2('z39,msq,z27,mps,z14,vhm,qwf,cnk')`

cnk,mps,msq,qwf,vhm,z14,z27,z39