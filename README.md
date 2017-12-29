# Lexical Analyzer JS
A generic lightweight library(and web app) for lexical analysis. 

Demo: http://swastikroy.me/lexical-analyzer/

***What is Lexical Analysis?***
> Lambda calculus (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function abstraction and application using variable binding and substitution. It is a universal model of computation that can be used to simulate any Turing machine and was first introduced by mathematician Alonzo Church in the 1930s as part of his research of the foundations of mathematics. - Wikipedia([Source](https://en.wikipedia.org/wiki/Lexical_analysis))

**How to Use**

Steps:

1. Add regular expressions in the form <Regular Expression Name> = <Definition>

Eg.: 

- R1 = (a+b)*(b+d)e*
- digit = 1+2+3+4+5+6+7+8+9

2. Set the order of regular expressions added using the (up and down)arrow buttons. The precedence is from top to bottom.

3. Write input in the input box and hit 'Tokenize" button.

