import("https://unpkg.com/mathlive@0.90.6?module");
import("https://unpkg.com/@cortex-js/compute-engine");
for (let i = 1; i < 4; i++) {
    let mfMy1 = document.querySelector('#formulaApprox' + i);
    let latexField1 = document.querySelector('#latexUserAns' + i);
    latexField1.addEventListener('input', () => mfMy1.setValue(latexField1.value));
    function onMathfieldInput() {
        // Output MathJSON representation of the expression
        console.clear();
        console.log('MathJSON expression', mfMy1.expression.json);
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
            // document.getElementById("bothLatexAns").hidden = false;
            $("#bothLatexAns" + i).prop('hidden', false);
            remove = false;
        } else {
            this.textContent = "Show answer";
            $("#bothLatexAns" + i).prop('hidden', true);
            remove = true;
        }
    });
}

function approxCE(x, num, sieve) {
    let ce = new ComputeEngine.ComputeEngine();
    let p = 4;
    let prec = Math.pow(10, -p);
    document.getElementById("latexChkr" + num).value = "";
    let mathFieldUser = document.querySelector('#latexUserAns' + num);
    let textAreaAuthor = document.querySelector('#MyauthorAns' + num);
    if (mathFieldUser == textAreaAuthor) console.log("equal expressions");
    // let x = 5;
    ce.set({ x: x });
    let exprUsimp = ce.parse(mathFieldUser.value).simplify().latex;
    let exprAsimp = ce.parse(textAreaAuthor.value).simplify().latex;
    document.getElementById('latexChkr' + num).value = "";
    let out1 = "Incorrect";
    let exprUn = "doesn't work";
    let exprAn = "doesn't work";
    try { exprUn = ce.parse(mathFieldUser.value).N(); }
    catch (err) { exprUn = 'LaTeX'; }
    try { exprAn = ce.parse(textAreaAuthor.value).N(); }
    catch (err) { exprAn = 'LaTeX'; }
    let exprUeval = ce.parse(mathFieldUser.value).evaluate();
    let exprAeval = ce.parse(textAreaAuthor.value).evaluate();
    let outVars = "USER VALUES:\n  document.querySelector('#latexUserAns' + num)\n    =" + mathFieldUser + "\n    mathFieldUser.value \n     =" + mathFieldUser.value
        + "\n    ce.parse(mathFieldUser.value).simplify().latex;\n     =" + exprUsimp + "\n    ce.parse(mathFieldUser.value).evaluate()\n     =" + exprUeval
        + "\n    ce.parse(mathFieldUser.value).N()\n     =" + exprUn
        + "\n\nAUTHOR VALUES\n    document.querySelector('#MyauthorAns' + num)\n    =" + textAreaAuthor + "\n    textAreaAuthor.value \n     =" + textAreaAuthor.value
        + "\n    ce.parse(textAreaAuthor.value).simplify().latex \n     =" + exprAsimp + "\n    ce.parse(textAreaAuthor.value).evaluate() \n     =" + exprAeval
        + "\n    ce.parse(textAreaAuthor.value).N() \n     =" + exprAn;
    let out2 = textAreaAuthor.value + " \\approx " + exprAeval;
    if (exprUsimp == "" || (exprUeval == '["Sequence"]')) out1 = "Incorrect\nNO USER INPUT";
    else {
        switch (sieve) {
            // Want a LaTeX expression for the answer
            case 'latex':
                // The expected answer
                if (mathFieldUser.value == textAreaAuthor.value && exprUn == exprAn)
                    out1 = "Correct  \nLaTeX (user <==> author) = \n    " + mathFieldUser.value + "\n==\n    " + textAreaAuthor.value;
                // Answer in a different order
                else if (exprUsimp == exprAsimp && exprUn == exprAn)
                    out1 = "Correct, but different order\nExpected " + textAreaAuthor.value;
                // Numerical answer, but needed an expression
                else if (exprUeval == exprAsimp) out1 += "\nThe answer " + mathFieldUser.value + " is a correct approximation, but an expression is expected, not a numerical value.\n\n" + mathFieldUser.value + " IS NOT IDENTICAL TO " + textAreaAuthor.value;
                // Neither a correct number nor expression
                else out1 += "\nThe expression contains an error.";
                break;
            case 'approx':
                if (exprUeval == exprAsimp){
                    out1 = "Correct. ";
                    if (mathFieldUser.value == exprUsimp)
                       out1 += "The expected answer is " + textAreaAuthor.value; 
                    else 
                        out1 += "However, a number is expected, not an expression.";
                    break;
                }
                
            case 'exact':
                let exprUvalOf = ce.parse(mathFieldUser.value).N().valueOf();
                let exprAvalOf = ce.parse(textAreaAuthor.value).N().valueOf();
                out2 = exprAsimp + " \\approxeq " + exprAvalOf.toFixed(p);
                outVars += "\n\nIf number:\nUSER    ce.parse(mathFieldUser.value).N().valueOf()\n     = " + exprUvalOf +
                    "\nAUTHOR    ce.parse(textAreaAuthor.value).N().valueOf() \n    =" + exprAvalOf + "\n    exprAvalOf.toFixed(p)\n    =" + exprAvalOf.toFixed(p);
                if (exprUsimp == exprAsimp && exprUn != exprAn) 
                    out1 = "Correct. However, A simple numerical answer is expected, not an expression.\n" +
                        "User input: " + mathFieldUser.value + "    Expected input: " + exprAvalOf.toFixed(p);
                else {

                    if ((exprAvalOf - prec) < exprUvalOf && exprUvalOf < (exprAvalOf + prec)) {
                        out1 = "Correct" + "\nFor: x = " + x + "\nLaTeX = " + exprUsimp + " ? " + exprAsimp + 
                            "\napproximation (user <--> author) = " + exprUvalOf + " <--> " + exprAvalOf;;

                    }
                    else out1 = "Incorrect value.  Expected answer is " + exprAsimp;
                }
                break;
            default:
                break;
        }
    }
    console.log(outVars);
    document.getElementById('latexChkr' + num).value = out1;
    document.getElementById('MyauthorAnsApprox' + num).innerHTML = out2;


}