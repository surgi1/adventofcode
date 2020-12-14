var input = ['#ip 4',
'addi 4 16 4',// i:0  | velky odskok na instukci 17
'seti 1 4 3', // i:1  | nastavi [3] (pomaly iterator) na 1, init slow loopu
'seti 1 3 5', // i:2  | nastavi [5] (rychly iterator) na 1, init fast loopu
'mulr 3 5 1', // i:3  | [1] = pomaly iter * rychly iter
'eqrr 1 2 1', // i:4  | pokud pomaly iterator * rychly iterator == cile iteratoru, nastav pres i:7 pricti cislo (uff)
'addr 1 4 4', //        
'addi 4 1 4', //        
'addr 3 0 0', // i:7  | prida obsah [3] (pomaly iterator) do [0] <-- zakopany pes je zde ~a ve 2 radcich ^~ (z tech to neni!)
'addi 5 1 5', // i:8    maly iterator++
'gtrr 5 2 1', // i:9    ukoncovaci podminka maleho iteratoru
'addr 4 1 4', // i:10 | pokud maly iter doiteroval, preskoc na i:12, jinak zpet na i:3
'seti 2 9 4', // odskok na i:3
'addi 3 1 3', // i:12 | velky iterator++
'gtrr 3 2 1', // i:13 | pokud je [3] > [2] => [1]=1, jinak [1]=0, ukoncovaci podminka velkeho iteratoru (pokud velky iter doiteroval => END, jinak i:2)
'addr 1 4 4', // i:14 | pokud je [1]=0, odskok i:2 pres i:15, pokud je [1]=1, END pres i:16
'seti 1 6 4', // i:15 | odskok na i:2
'mulr 4 4 4', // i:16 | odskok na 16x16+1 = 257 -> END
'addi 2 2 2', // i:17 | [2] = 2
'mulr 2 2 2', //        [2] = 4
'mulr 4 2 2', // i:19   [2] = 19*4 = 76
'muli 2 11 2',// i:20   [2] = 76*11 = 836
'addi 1 2 1', // i:21   [1] = [1]+2 = 2 ?
'mulr 1 4 1', // i:22   [1] = 2*22 = 44
'addi 1 7 1', // i:23   [1] = 44+7 = 51
'addr 2 1 2', // i:24 | [2] = 836+51 = 887; // hodnota cile iteratoru pro fazi 1
'addr 4 0 4', // i:25 | zde se uplatni pocatecni [0]=1, odskok na i:27
'seti 0 8 4', //        skok na i:1 | v pripade pocatecniho [0]=0 konec smycky pocitajici cil iteratoru
'setr 4 3 1', // i:27 | [1] = 27
'mulr 1 4 1', // i:28 | [1] = 27*28=756
'addr 4 1 1', // i:29 | [1] = [1]+29 = 756+29 = 785
'mulr 4 1 1', // i:30 | [1] = 785*30 = 23550
'muli 1 14 1',// i:31 | [1] = 23550*14 = 329700
'mulr 1 4 1', // i:32 | [1] = 329700*32 = 10550400
'addr 2 1 2', // i:33 | [2] = 10550400+887 = 10551287 // finalni hodnota cile iteratoru pro fazi 2
'seti 0 3 0', // i:34 | nastavi [0] na 0, dealt with vstup [0] = 1
'seti 0 6 4'] // skok na i:1
