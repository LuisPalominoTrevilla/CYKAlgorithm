// GLC in FNCh form
class GLC{
    constructor(productions){
        // Assumes GLC input is correct and has no mistakes
        this.productions = this.parseProductions(productions);
    }

    parseProductions(productions){
        let P = {}
        let state, producer, producee;
        for(var prod of productions.split(" ")){
            state = 0;
            producee = '';
            producer = '';
            for (var char of prod+"|") {
                if (state === 0){
                    producer = char;
                    state = 1;
                }else if (state === 1 && char === '>'){
                    state = 2;
                }else if (state === 2){
                    if (char == '|'){
                        if (!P[producee]){
                            P[producee] = new Set();
                        }
                        P[producee].add(producer);
                        producee = '';
                        continue;
                    }
                    producee += char;
                }
            }
        }
        return P;
    }

    // Receives a CYK computed table and returns its derivation from the left
    getDerivation(dp, cols, word){
        let result = 'S=>';
        let terminals = '';
        let counter = 0;
        let i = 0;
        let j = cols;
        let letter = 'S';
        let stack = [];
        while (counter <= cols) {
            let found = false;
            if (i == j) {
                terminals += word[counter++];
                result += terminals;
                for (var s = stack.length-1; s >= 0; s--) {
                    result += stack[s][2];
                }
                if (stack.length > 0){
                    result += "=>";
                    const element = stack.pop();
                    i = element[0];
                    j = element[1];
                    letter = element[2];
                }
            }
            for (var k = i; k < j; k++) {
                const setA = dp[i][k]
                const setB = dp[k+1][j]
                for (var valA of setA){
                    for(var valB of setB){
                        const producers = this.productions[valA+valB];
                        if (producers){
                            for(var elem of producers) {
                                if (elem == letter) {
                                    result += terminals;
                                    result += valA+valB;
                                    for (var s = stack.length-1; s >= 0; s--) {
                                        result += stack[s][2];
                                    }
                                    result += "=>";
                                    stack.push([k+1,j,valB]);
                                    j = k;
                                    letter = valA;
                                    found = true;
                                    break;
                                }
                            }
                            if (found) break;
                        }
                    }
                    if (found) break;
                }
                if (found) break;
            }
        }
        return result;
    }

    // Use CYK algorithm to check if w belongs to GLC
    accepts(w){
        if (w.length == 0) return "La cadena "+w+" no es aceptada por la gramática G";
        let dp = Array(w.length).fill().map(()=>Array(w.length).fill());
        // Preparation
        for (var i = 0; i < w.length; i++){
            dp[i][i] = new Set(this.productions[w[i]]);
        }
        for (var j = 1; j < w.length; j++) {
            let row = 0;
            for (var i = j; i < w.length; i++) {
                let cellValue = new Set();
                for (var k = row; k < i; k++) {
                    const setA = dp[row][k]
                    const setB = dp[k+1][i]
                    for (var valA of setA){
                        for(var valB of setB){
                            const producers = this.productions[valA+valB];
                            if (producers){
                                for(var elem of producers) {
                                    cellValue.add(elem);
                                }
                            }
                        }
                    }
                }
                dp[row++][i] = cellValue;
            }
        }
        for (var symbol of dp[0][w.length-1]) {
            if (symbol == "S"){
                return this.getDerivation(dp, w.length-1, w);
            }
        }
        return "La cadena "+w+" no es aceptada por la gramática G";
    }
}
let gramatic = process.argv[2];
let word = process.argv[3];

let glc = new GLC(gramatic);
console.log(glc.accepts(word));