import("https://unpkg.com/mathlive@latest?module"); // 0.94.0 = latest
import("https://unpkg.com/@cortex-js/compute-engine");
maxElems = numElems
for (let i = 1; i <= maxElems; i++) {
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
function isNumeric(str) {
    if (typeof str != "string") return false //+ "not string"// we only process strings!  
    return (!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))) //+ str// ...and ensure strings of whitespace fail
} 

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
    return [e, eNeg, hasEqual,isNumeric(e)];
}


function approxCE(x, num, sieve, orderMatters, equationCheck) {
    console.clear();
    let ce = new ComputeEngine.ComputeEngine();
    let p = 3;
    let prec = Math.pow(10, -p);
    document.getElementById("latexChkr" + num).value = "";
    let mathFieldUser = document.querySelector('#latexUserAns' + num);
    let textAreaAuthor = document.querySelector('#MyauthorAns' + num);
    let exprUorig = mathFieldUser.value.replaceAll('$', '')
    let exprAorig = textAreaAuthor.value;
    let [exprUsimp, unusedVar, isUequation,isUnumber] = equationAdj(exprUorig, equationCheck)
    let [exprAsimp, exprAsimpNeg, isAequation, isAnumber] = equationAdj(exprAorig, equationCheck);
    exprUsimp = ce.parse(exprUsimp).simplify().latex;
    exprAsimp = ce.parse(exprAsimp).simplify().latex;
    let eqMess = ""
    let numMess = ""
    if (isAequation != isUequation) {
        if (isAequation) { eqMess = "\nAn expression is needed, not an equation." }
        else { eqMess = "\nAn equation is needed, not an expression." }
    }
    if (isAnumber != isUnumber) {
        if (isAnumber) { numMess = "\nA number is needed, not an expression." }
        else {numMess = "\nAn expression is needed, not a number." }
    }
    console.log(exprAsimp + ' author ' + exprUsimp + '\n' + eqMess + '\n'+numMess+ '\n')
    exprAsimp = ce.parse(exprAsimp).simplify().latex;
    exprAsimpNeg = ce.parse(exprAsimpNeg).simplify().latex;
    let bothAreSameType = (exprUsimp == exprAsimp || exprUsimp == exprAsimpNeg);
    let exprSimpCheck = "The answer entered is not equivalent to the correct answer.";
    if (bothAreSameType) { 
        exprSimpCheck = "The answer is an equivalent expression, equation, or number."     
    }
    console.log(exprUsimp + " check  " + exprAsimp + " check  " + exprAsimpNeg + '\n' + exprSimpCheck);
    document.getElementById('latexChkr' + num).value = "";
    let out1 = "Incorrect";
    let exprAeval = ''; 
    let exprAapprox = '';
    let exprAvalOf = '';
    if (!isAequation){
        let exprAeval = ce.parse(exprAorig).evaluate();
        console.log(exprAeval);
        if (sieve != 'latex' ) {
            exprAeval = ce.parse(exprAorig).N().valueOf();
            exprAapprox = " \\approx " + exprAeval.toFixed(p);
            exprAvalOf = parseFloat(exprAeval);       
        }
    }

    let out2 = exprAorig +  exprAapprox;
    if (exprUsimp == "" || (exprUsimp == '["Sequence"]')) out1 = "Incorrect\nNO USER INPUT";
    else {
        let exprUvalOf = parseFloat(exprUsimp);
        let exprAvalOf = parseFloat(exprAeval);

        switch (sieve) {
            // Want a LaTeX expression for the answer
            case 'latex':
                // whitespace removed
                let adjMathFieldUser = exprUorig.replace(/\s/g, "");
                let adjTextAreaAuthor = exprAorig.replace(/\s/g, "");
                console.log('\n' + adjMathFieldUser + ' case latex ' + adjTextAreaAuthor + '\n')
                // The expected answer given
                if (adjMathFieldUser == adjTextAreaAuthor && bothAreSameType)
                    out1 = "Correct  \nLaTeX: " + exprAorig;
                // Answer in a different order
                else if (bothAreSameType && isAequation == isUequation && isUnumber == isAnumber)
                    out1 = "Correct, but slightly different than expected.\nExpected input: " + exprAorig;
                // Numerical answer, but needed an expression
                else if (bothAreSameType && exprUsimp == exprUorig) out1 += "\nThe answer " + exprUorig + 
                " is a good numerical answer, but an expression is expected, not a numerical value.\nExpected: " + exprAorig;         
                    // Neither a correct number nor expression
                else out1 += "\nThe expression contains an error.";
                break;
            case 'approx':
                if (exprUvalOf >= exprAvalOf - 1* prec && exprUvalOf <= exprAvalOf + 1 * prec) {

                    if (exprUorig == exprAvalOf)
                        out1 = "Incorrect. A simple numerical answer is expected, not an expression.\n" +
                            "User input: " + exprUorig + "    Expected: " + exprAvalOf.toFixed(p) + bothAreSameType
                    else
                        out1 = "Correct. Expected: " + exprAvalOf.toFixed(p);
                }
                else out1 = "Incorrect.\nUser input: " + exprUorig + "    Expected: " + exprAvalOf.toFixed(p) + bothAreSameType;
                // out2 = exprAsimp + " \\approxeq " + exprAvalOf.toFixed(p);
                break;
            case 'exact':
                if (bothAreSameType) {
                    if (exprUsimp == exprAsimp) out1 = "Correct. The expected answer is " + exprAorig;
                    // Check for opposite sign
                    else out1 = "Incorrect.  The expected answer is opposite in sign.\nUser input: " + exprUorig + "    Expected input: " + exprAorig;
                }
                else if ((exprAvalOf - 0.001) <= exprUvalOf && exprUvalOf <= (exprAvalOf + 0.001))
                    out1 = "The answer " + exprUorig + " is a good numerical approximation, but an exact number is required.\nExpected: " + exprAorig;
                else
                    out1 = "Incorrect.\nUser input: " + exprUorig + "    Expected input: " + exprAorig;
                break;
            default:
                break;
        }
    }
    console.log(out2);
    document.getElementById('latexChkr' + num).value = out1;
    document.getElementById('MyauthorAnsApprox' + num).value = out2;


}