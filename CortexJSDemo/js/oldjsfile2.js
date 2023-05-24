import("https://unpkg.com/mathlive@latest?module");
import("https://unpkg.com/@cortex-js/compute-engine");
for (let i = 1; i < 4; i++) {
    let mfMy1 = document.querySelector('#formulaApprox' + i);
    let latexField1 = document.querySelector('#latexUserAns' + i);
    latexField1.addEventListener('input', () => mfMy1.setValue(latexField1.value));
    function onMathfieldInput() {
        // Update raw LaTeX value
        latexField1.value = mfMy1.value;
    }

    mfMy1.addEventListener('input', onMathfieldInput);
    onMathfieldInput;
    var showHideAns = document.getElementById("showHideAns" + i);
    var remove = true;
    document.getElementById("showHideAns" + i).addEventListener("click", function (e) {
        if (remove) {
            this.textContent = "Hide answer";
            $("#bothLatexAns" + i).prop('hidden', false);
            remove = false;
        } else {
            this.textContent = "Show answer";
            $("#bothLatexAns" + i).prop('hidden', true);
            remove = true;
        }
    });
}
// function orderCheck(a,u) {  
//     aAdj = a;
//     uAdj = u;
//     uAdj = uAdj.replace(/\D+/g, "-1")
//     aAdj = aAdj.replace(/\D+/g, "-1")
//     console.log(a + '  ' +aAdj +'\n');
//     console.log(u + '  ' +uAdj +'\n');
//     console.log(aAdj == uAdj);
//     return aAdj == uAdj;
// }
function equationAdj(e, tf) {
    let eNeg = '' + e;
    let hasEqual = false;
    eNeg = '-(' + eNeg + ')';
    if (e.includes('=')) {
        if (tf) {
            e = e.replace('=', "-(") + ') = 0';
            eNeg = '-(' + eNeg.replace('=', "-(") + ')) = 0';
            hasEqual = true;
        }
    }
    return [e, eNeg, hasEqual];
}

function isNumeric(str) {
    if (typeof str != "string") return false //+ "not string"// we only process strings!  
    return (!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))) //+ str// ...and ensure strings of whitespace fail
}
function approxCE(x, num, sieve, orderMatters, equationCheck) {
    console.clear();
    let ce = new ComputeEngine.ComputeEngine();
    let p = 3;
    let prec = Math.pow(10, -p);
    document.getElementById("latexChkr" + num).value = "";
    let mathFieldUser = document.querySelector('#latexUserAns' + num);
    // console.log(isNumeric(mathFieldUser.value + '\n'));
    let textAreaAuthor = document.querySelector('#MyauthorAns' + num);

    // if (orderMatters){
    //     orderCheck(textAreaAuthor.value,mathFieldUser.value);
    // }
    // equationCheck(textAreaAuthor.value,mathFieldUser.value);
    // if (mathFieldUser == textAreaAuthor) console.log("equal expressions");
    // ce.set({ x: x });
    // ce.set({ 4: 42 });
    mathFieldUser.value = mathFieldUser.value.replaceAll('$', '')
    let exprUorig = mathFieldUser.value;
    let exprAorig = textAreaAuthor.value;
    let [exprUsimp, unusedVar, isUequation] = equationAdj(exprUorig, equationCheck)
    exprUsimp = ce.parse(exprUsimp).simplify().latex;
    let [exprAsimp, exprAsimpNeg, isAequation] = equationAdj(exprAorig, equationCheck);
    let eqMess = "Okay"


    if (isAequation != isUequation) {
        if (isUequation) { eqMess = "An expression is needed, not an equation." }
        else { eqMess = "An equation is needed, not an expression." }
    }
    console.log(exprAsimp + ' author ' + exprUsimp + '\n' + eqMess + '\n')
    exprAsimp = ce.parse(exprAsimp).simplify().latex;
    exprAsimpNeg = ce.parse(exprAsimpNeg).simplify().latex;
    let exprSimpCheck = "Nonequivalent expression or equation";
    if (exprUsimp == exprAsimp || exprUsimp == exprAsimpNeg) { exprSimpCheck = "Equivalent expression or equation" }
    console.log(exprUsimp + " check  " + exprAsimp + " check  " + exprAsimpNeg + '\n' + exprSimpCheck);
    document.getElementById('latexChkr' + num).value = "";
    let out1 = "Incorrect";
    let exprUn = "doesn't work";
    let exprAn = "doesn't work";
    console.log(exprUn + '  1 ' + exprAn);
    let exprAeval = ce.parse(textAreaAuthor.value).evaluate();
    console.log(exprAeval);
    let exprUeval = exprUsimp;
    if (sieve != 'latex' ) {
        console.log(exprAeval + '  2 ' + exprAn);
        if (sieve != "latex"){

        exprAeval = ce.parse(textAreaAuthor.value).N().valueOf();
        console.log(exprAeval + '  2.5 ' + exprAn);
        exprAn = exprAeval;
        console.log(exprAeval + '  3 ' + exprAn);
    }}
    // else { exprUn = 'LaTeX'; }
    // if (isNumeric(mathFieldUser.value)) {
    //     exprUeval = ce.parse(mathFieldUser.value).evaluate();
    //     exprUn = exprUeval;
    //     console.log(exprUn + '  user ' + exprUeval);
    // }
    // else { exprAn = 'LaTeX'; }
    // console.log(exprUn + '  4 ' + exprAn);

    // let outVars = "USER VALUES:\n  document.querySelector('#latexUserAns' + num)\n    =" + mathFieldUser + "\n    mathFieldUser.value \n     =" + mathFieldUser.value
    //     + "\n    ce.parse(mathFieldUser.value).simplify().latex;\n     =" + exprUsimp + "\n    ce.parse(mathFieldUser.value).evaluate()\n     =" + exprUeval
    //     + "\n    ce.parse(mathFieldUser.value).N()\n     =" + exprUn
    //     + "\n\nAUTHOR VALUES\n    document.querySelector('#MyauthorAns' + num)\n    =" + textAreaAuthor + "\n    textAreaAuthor.value \n     =" + textAreaAuthor.value
    //     + "\n    ce.parse(textAreaAuthor.value).simplify().latex \n     =" + exprAsimp + "\n    ce.parse(textAreaAuthor.value).evaluate() \n     =" + exprAeval
    //     + "\n    ce.parse(textAreaAuthor.value).N() \n     =" + exprAn;
    let out2 = textAreaAuthor.value + " \\approx " + exprAeval//.toFixed(p);
    if (exprUsimp == "" || (exprUeval == '["Sequence"]')) out1 = "Incorrect\nNO USER INPUT";
    else {
        let exprUvalOf = parseFloat(exprUeval);
        let exprAvalOf = parseFloat(exprAeval);

        switch (sieve) {
            // Want a LaTeX expression for the answer
            case 'latex':
                // The expected answer
                let adjMathFieldUser = mathFieldUser.value.replace(/\s/g, "");
                let adjTextAreaAuthor = textAreaAuthor.value.replace(/\s/g, "");
                console.log('\n' + adjMathFieldUser + ' case latex ' + adjTextAreaAuthor + '  ' + exprUn + '  ' + exprAn + '\n' + (adjMathFieldUser == adjTextAreaAuthor && exprUn == exprAn) + '\n')
                if (adjMathFieldUser == adjTextAreaAuthor && exprUsimp == exprAsimp)
                    out1 = "Correct  \nLaTeX: " + textAreaAuthor.value;
                // Answer in a different order
                else if (exprUsimp != exprUorig  && exprUeval == exprAeval)
                    out1 = "Correct, but slightly different than expected.\nExpected input: " + textAreaAuthor.value;
                // Numerical answer, but needed an expression
                else if (exprUsimp == exprAsimp && exprUsimp == exprUorig) out1 += "\nThe answer " + mathFieldUser.value + " is a good numerical answer, but an expression is expected, not a numerical value.\nExpected: " + textAreaAuthor.value;
                // Neither a correct number nor expression
                else out1 += "\nThe expression contains an error.";
                break;
            case 'approx':
                if (exprUvalOf >= exprAvalOf - 5* prec && exprUvalOf <= exprAvalOf + 5 * prec) {
                    if (mathFieldUser.value == exprAvalOf)
                        out1 = "Incorrect. A simple numerical answer is expected, not an expression.\n" +
                            "User input: " + mathFieldUser.value + "    Expected: " + exprAvalOf.toFixed(p)
                    else
                        out1 = "Correct. Expected: " + exprAvalOf.toFixed(p);
                }
                else out1 = "Incorrect.\nUser input: " + mathFieldUser.value + "    Expected: " + exprAvalOf.toFixed(p);
                // out2 = exprAsimp + " \\approxeq " + exprAvalOf.toFixed(p);
                break;
            case 'exact':

                // let approxAuthor = parseFloat(exprAvalOf.toFixed(p))
                // out2 = exprAsimp + " \\approxeq " + exprAvalOf.toFixed(p);
                
                // outVars += "\n\nNumbers for 'if' below:\nUSER    ce.parse(mathFieldUser.value).N().valueOf()\n     = " + exprUvalOf +
                //     "\nAUTHOR    ce.parse(textAreaAuthor.value).N().valueOf() \n    =" + exprAvalOf + "\n    approxAuthor\n    =" + approxAuthor;
                if (exprUsimp == exprAsimp)
                    out1 = "Correct. The expected answer is " + textAreaAuthor.value;
                else if ((exprAvalOf - 0.001) <= exprUvalOf && exprUvalOf <= (exprAvalOf + 0.001))
                    out1 = "\nThe answer " + exprUvalOf + " is a good numerical approximation, but an exact number is required.\nExpected: " + textAreaAuthor.value;
                else
                    out1 = "Incorrect.\nUser input: " + mathFieldUser.value + "    Expected input: " + textAreaAuthor.value;
                break;
            default:
                break;
        }
    }
    console.log(out2);
    document.getElementById('latexChkr' + num).value = out1;
    document.getElementById('MyauthorAnsApprox' + num).value = out2;


}