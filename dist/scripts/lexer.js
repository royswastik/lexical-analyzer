/*
 * Copyright (C) Swastik Roy, 2018
 */

InputReader = (function(){
    function readRegex(str){
        for(var i = 0; i < str.length; i++){
            if(str[i]== '='){
                return {
                    name: str.substring(0,i).trim(),
                    value: str.substring(i+1, str.length).trim()
                }
            }
        }
        return false;
    }

    function readRegexArray(arr){
        var result = [];
        for(var i = 0; i < arr.length; i++){
            result.push(readRegex(arr[i]));
        }
        return result;
    }

    return {
        readRegex: readRegex,
        readRegexArray: readRegexArray
    }
})();
/*
 * Copyright (C) Swastik Roy, 2018
 */

Lexer = (function(){
    var regularExpressionsInput = [];
    var inputString = "";
    var potentialSet = [];
    var regexPattArr = [];
    var inputBuffer = [];

    function init(inputStringArg, regularExpressionsInputArg){
        inputString = inputStringArg;
        var regArrCopy = JSON.parse(JSON.stringify(regularExpressionsInputArg));
        var preprocessed = RegPreprocessor.preProcess(regArrCopy);
        if(preprocessed.err)return preprocessed;    //Return Error 
        // regularExpressionsInputArg = InputReader.readRegexArray(regularExpressionsInputArg);
        regexPattArr = RegexMatcher.getRegexPatternArray(preprocessed);
        potentialSet = regexPattArr;
        return 1;
    }

    function GetToken(errCallback){
        if(!errCallback)errCallback = function(err){};
        if(inputBuffer.length != 0){
            return arr.splice(-1,1);
        }
        else{
            return nextToken(errCallback);
        }
    }

    function nextToken(errCallback){
        var prefix = "";
        var maximalToken = false;

        if(inputString.length == 0){
            return {eof: true};
        }

        for(var i = 0;i <inputString.length; i++){
            var curr = inputString[i];
            prefix += curr;
            var potential = RegexMatcher.getPotentialSet(prefix,potentialSet);
            var matched = RegexMatcher.matchRegex(prefix, potential);
            if(matched){
                maximalToken = Token(prefix, matched);
                maximalToken["index"] = i;
            }

            if(potential.length == 0){
                break;
            }
        }


        if(!maximalToken){
            //Lexical Error
            errCallback("Lexical Error");
            return false;
        }
        else{
            inputString = inputString.substring(maximalToken.index+1, inputString.length);
            delete maximalToken["index"];
            return maximalToken;
        }
    }

    function UnGetToken(str){
        inputBuffer.push(str);
    }

    return {
        init: init,
        GetToken: GetToken,
        UnGetToken: UnGetToken
    };
})();







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
/*
 * Copyright (C) Swastik Roy, 2018
 */


RegPreprocessor = (function(){
    function preProcess(regexArr){
        var preprocessed = regexArr;
        for(var i = 0; i< regexArr.length; i++){
            var curr = regexArr[i];
            var change = true;

            while(change){
                change = false;
                for(var j = 0; j < regexArr.length; j++){
                    var replaceRegex = new RegExp(regexArr[j].name);
                    if(replaceRegex.test(curr.value)){
                        if(i==j){
                            return PreProcessError("Error: Recursive definition for "+regexArr[j].name);
                        };
                        curr.value = curr.value.replace(replaceRegex, "("+regexArr[j].value+")");
                        change = true;
                        preprocessed[i] = RegularExpression(curr.value,curr.name);
                    }
                }
            }
        }
        return preprocessed;
    }
    return {
        preProcess: preProcess
    }
})();
/*
 * Copyright (C) Swastik Roy, 2018
 */

RegexMatcher = (function(){

    /**
     * Checks if a string is a potential match for the regex pattern(which is passed as argument for RegExp())
     */
    function isPotential(str, regexPattern){
        var newStr = str;
        for(var i =0; i <regexChars.length; i++){
            var curr = regexChars[i];
            newStr = newStr.replace(new RegExp("\\"+curr),"\\"+curr);
        }

        var regNew = new RegExp(regexPattern);
        var partialMatchRegex = new RegExp('^'+regNew.toPartialMatchRegex().source+'$', 'i');
        var matches = str.match(partialMatchRegex);
        var matching = false;



        if(!matches)return false;
        for(var i = 0; i< matches.length; i++){
            var match = matches[i];
            if(match && match.length != 0 && str.startsWith(match)){
                matching = true;
            }
        }
        return matching;
    }

    function getPotentialSet(str, regexPatternArray){
        var potentialSet = [];
        for(var i =0; i <regexPatternArray.length; i++){
            if(isPotential(str,regexPatternArray[i].value)){
                potentialSet.push(regexPatternArray[i]);
            }
        }
        return potentialSet;
    }

    function isMatch(str, regexPattern){
        return isFullMatch(str, regexPattern);
    }

    function isFullMatch(str, regexPattern){
        var newRegex = new RegExp(regexPattern);
        //Check match is entire string
        var matches = str.match(newRegex);
        var fullLenMatch = false;
        if(!matches){
            return;
        }
        for(var i = 0; i<matches.length; i++){
            if(matches[i] == str){
                fullLenMatch = true;
            }
        }
        return fullLenMatch;
    }

    function matchRegex(str, regexPatternArray){
        for(var i =0; i <regexPatternArray.length; i++){
            if(isMatch(str,regexPatternArray[i].value)){
                return regexPatternArray[i];
            }
        }
        return false;
    }

    function getRegexPatternArray(regularExpressionsInput){
        var arr = [];
        var result = "";
        for(var i =0; i <regularExpressionsInput.length; i++){
            var curr = regularExpressionsInput[i].value;
            result = curr.replace(/\s/g,'');
            result = result.replace(/\t/g, '');
            result = result.replace(/\+/g , '|');
            arr.push(RegularExpression(result, regularExpressionsInput[i].name));
        }
        return arr;
    }

    return {
        getPotentialSet : getPotentialSet,
        isPotential: isPotential,
        isMatch: isMatch,
        matchRegex: matchRegex,
        getRegexPatternArray: getRegexPatternArray
    }
})();



RegExp.prototype.toPartialMatchRegex = function() {
    "use strict";
    
    var re = this,
        source = this.source,
        i = 0;
    
    function process () {
        var result = "",
            tmp;

        function appendRaw(nbChars) {
            result += source.substr(i, nbChars);
            i += nbChars;
        };
        
        function appendOptional(nbChars) {
            result += "(?:" + source.substr(i, nbChars) + "|$)";
            i += nbChars;
        };

        while (i < source.length) {
            switch (source[i])
            {
                case "\\":
                    switch (source[i + 1])
                    {
                        case "c":
                            appendOptional(3);
                            break;
                            
                        case "x":
                            appendOptional(4);
                            break;
                            
                        case "u":
                            if (re.unicode) {
                                if (source[i + 2] === "{") {
                                    appendOptional(source.indexOf("}", i) - i + 1);
                                } else {
                                    appendOptional(6);
                                }
                            } else {
                                appendOptional(2);
                            }
                            break;
                            
                        default:
                            appendOptional(2);
                            break;
                    }
                    break;
                    
                case "[":
                    tmp = /\[(?:\\.|.)*?\]/g;
                    tmp.lastIndex = i;
                    tmp = tmp.exec(source);
                    appendOptional(tmp[0].length);
                    break;
                    
                case "|":
                case "^":
                case "$":
                case "*":
                case "+":
                case "?":
                    appendRaw(1);
                    break;
                    
                case "{":
                    tmp = /\{\d+,?\d*\}/g;
                    tmp.lastIndex = i;
                    tmp = tmp.exec(source);
                    if (tmp) {
                        appendRaw(tmp[0].length);
                    } else {
                        appendOptional(1);
                    }
                    break;
                    
                case "(":
                    if (source[i + 1] == "?") {
                        switch (source[i + 2])
                        {
                            case ":":
                                result += "(?:";
                                i += 3;
                                result += process() + "|$)";
                                break;
                                
                            case "=":
                                result += "(?=";
                                i += 3;
                                result += process() + ")";
                                break;
                                
                            case "!":
                                tmp = i;
                                i += 3;
                                process();
                                result += source.substr(tmp, i - tmp);
                                break;
                        }
                    } else {
                        appendRaw(1);
                        result += process() + "|$)";
                    }
                    break;
                    
                case ")":
                    ++i;
                    return result;
                    
                default:
                    appendOptional(1);
                    break;
            }
        }
        
        return result;
    }
    
    return new RegExp(process(), this.flags);
};