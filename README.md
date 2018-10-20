# CYK Algorithm

**Requirements**:
- Have node installed
- Node version at least 8.12

**Instructions**:

1. Gramatic must be on FNCh for the algorithm to work
2. The syntax of the gramatic is: 
    - *S->AB|BC A->BA|b B->a|SA*
    - Where S is the initial symbol
    - Use spaces to separate **different** productions
    - The entire gramatic must me introduced using "" around it
3. Sometimes, the word also needs to be introduced using "" arount it (e.g. when using [])
4. Both the gramatic and the word are introduced as arguments
5. Sample command to run the program: 
    ~~~~
    node GLC.js "S->AB|SS|AC|BD|BA A->a B->b C->SB D->SA" ab
    ~~~~
6. Sample output:
    ~~~
    S=>AB=>aB=>ab
    ~~~

Go nuts!