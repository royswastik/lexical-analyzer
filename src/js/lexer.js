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






