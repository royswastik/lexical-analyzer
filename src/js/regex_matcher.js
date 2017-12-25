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