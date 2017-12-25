/*
 * Copyright (C) Swastik Roy, 2018
 */

Token = function(lexeme, type, lineNo){
    return {
        lexeme: lexeme,
        type: type,
        lineNo: lineNo
    };
    
}


regexChars = ['+', '(', ")", ".", "*", "|"];

PreProcessError = function(str){
    return {
        err: true,
        message: str
    }
}


RegularExpression = function(value, name){
    return {
        value: value,
        name:name
    }
}