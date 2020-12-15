var input = [{capacity: 4, durability: -2, flavor: 0, texture: 0, calories: 5},
{capacity: 0, durability: 5, flavor: -1, texture: 0, calories: 8},
{capacity: -1, durability: 0, flavor: 5, texture: 0, calories: 6},
{Sugar: capacity: 0, durability: 0, flavor: -2, texture: 2, calories: 1}]

/*
Frosting: capacity 4, durability -2, flavor 0, texture 0, calories 5
Candy: capacity 0, durability 5, flavor -1, texture 0, calories 8
Butterscotch: capacity -1, durability 0, flavor 5, texture 0, calories 6
Sugar: capacity 0, durability 0, flavor -2, texture 2, calories 1

A frosting: c = 4, d = -2, f = 0, t = 0
B candy: c = 0, d = 5, f = -1, t = 0
C butter: c = -1, d = 0, f = 5, t = 0
D sugar: c = 0, d = 0, f = -2, t = 2

A + B + C + D   = 100

4*A - C         = c_tot

-2*A + 5*B      = d_tot

-B + 5*C -2*D   = f_tot

2*D             = t_tot

looikng for max c_tot * d_tot * f_tot * t_tot

c_tot > 0
d_tot > 0
f_tot > 0
t_tot > 0

=>

D > 0
A > 0 ( > D/4 )
B > 0 ( > A*2/5 )
C > 0 ( > (B+2*D)/5 )

calories = 5*A+8*B+6*C+D
*/