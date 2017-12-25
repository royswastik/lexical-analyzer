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