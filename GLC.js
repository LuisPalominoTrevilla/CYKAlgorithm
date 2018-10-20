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

    // Use CYK algorithm to check if w belongs to GLC
    accepts(w){
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
                return true;
            }
        }
        return false;
    }
}

let a = new GLC("S->AB|SS|AC|BD|BA A->a B->b C->SB D->SA");
console.log(a.accepts('aabaabbb'));