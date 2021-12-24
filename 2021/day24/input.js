// the same code executed 14x with variables

inp w
mul x 0         
add x z       
mod x 26              
div z 1  // par1 = 1
add x 13  // par2 = 13
eql x w  
eql x 0  if ((z % 26 + par2) == digits[0]) x = 0; else x = 1;
mul y 0
add y 25 
mul y x              
add y 1
mul z y  z = z*(25*x+1)
mul y 0
add y w
add y 8  // par3 = 8
mul y x 
add z y  z = z + (digits[0]+par3)*x 

...

inp w
mul x 0
add x z
mod x 26  
div z 26   // par1 = 26
add x -11  // par2 = -11
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 12 // par3
mul y x
add z y


// pseudo code:
if (par1 == 1) {
    /*if ((z % 26) + par2 != digits[0]) { // this is always true for par1 = 1 as those have par2 > 9
        z = z*26+digits[0]+par3;
    }*/
    z = z*26+digits[i]+par3;
} else {
    // par1 = 26
    digits[i] = (z % 26) + par1
    z = math.floor(z/26);
}

// derived params

[1, 13, 8],
[1, 12, 13],
[1, 12, 8],
[1, 10, 10],
[26, -11, 12],
[26, -13, 1],
[1, 15, 13],
[1, 10, 5],
[26, -2, 10],
[26, -6, 3],
[1, 14, 2],
[26, 0, 2],
[26, -15, 12],
[26, -4, 7],

// actual input with derived params inline

inp w
mul x 0
add x z 
mod x 26
div z 1
add x 13
eql x w 
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 8
mul y x
add z y

[1, 13, 8]

inp w
mul x 0
add x z
mod x 26
div z 1
add x 12
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 13
mul y x
add z y

[1, 12, 13]

inp w
mul x 0
add x z
mod x 26
div z 1
add x 12
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 8
mul y x
add z y

[1, 12, 8]

inp w
mul x 0
add x z
mod x 26
div z 1
add x 10
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 10
mul y x
add z y

[1, 10, 10]

inp w
mul x 0
add x z
mod x 26
div z 26
add x -11
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 12
mul y x
add z y

[26, -11, 12]

inp w
mul x 0
add x z
mod x 26
div z 26
add x -13
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 1
mul y x
add z y

[26, -13, 1]

inp w
mul x 0
add x z
mod x 26
div z 1
add x 15
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 13
mul y x
add z y

[1, 15, 13]

inp w
mul x 0
add x z
mod x 26
div z 1
add x 10
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 5
mul y x
add z y

[1, 10, 5]

inp w
mul x 0
add x z
mod x 26
div z 26
add x -2
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 10
mul y x
add z y

[26, -2, 10]

inp w
mul x 0
add x z
mod x 26
div z 26
add x -6
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 3
mul y x
add z y

[26, -6, 3]

inp w
mul x 0
add x z
mod x 26
div z 1
add x 14
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 2
mul y x
add z y

[1, 14, 2]

inp w
mul x 0
add x z
mod x 26
div z 26
add x 0
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 2
mul y x
add z y

[26, 0, 2]

inp w
mul x 0
add x z
mod x 26
div z 26
add x -15
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 12
mul y x
add z y

[26, -15, 12]

inp w
mul x 0
add x z
mod x 26
div z 26
add x -4
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 7
mul y x
add z y

[26, -4, 7]