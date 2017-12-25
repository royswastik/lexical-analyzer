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