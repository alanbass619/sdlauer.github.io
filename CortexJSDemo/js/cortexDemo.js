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
    let mfUser = document.querySelector('#latexUserAns' + num);
    let mfAuthor = document.querySelector('#MyauthorAns' + num);
    if (mfUser == mfAuthor) console.log("equal expressions");
    // let x = 5;
    ce.set({ x: x });
    let exprUsimp = ce.parse(mfUser.value).simplify().latex;
    let exprAsimp = ce.parse(mfAuthor.value).simplify().latex;
    document.getElementById('latexChkr' + num).value = "";
    let out1 = "Incorrect";

    let exprUeval = ce.parse(mfUser.value).evaluate();
    let exprAeval = ce.parse(mfAuthor.value).evaluate();
    let out2 = mfAuthor.value + " \\approx " + exprAeval;
    if (exprUsimp == "" || (exprUeval == '["Sequence"]')) out1 = "Incorrect\nNO USER INPUT";
    else {
        switch (sieve) {
            case 'latex':
                if (mfUser.value == mfAuthor.value)
                    out1 = "Correct  \nLaTeX (user <==> author) = \n    " + mfUser.value + "\n==\n    " + mfAuthor.value;

                else if (exprUsimp == exprAsimp)
                     out1 = "Correct, but different order";
                    else if (exprUeval == exprAsimp) out1 += "\nThe answer of " + mfUser.value + " is a correct approximation, but an expression is expected, not a numerical value.\nLaTeX (user NOT IDENTICAL author) = " + mfUser.value + " IS NOT IDENTICAL TO\n    " + mfAuthor.value;

                else if (mfUser.value == exprUeval) out1 += "\nAn expression is expected.";
                else out1 += "\nThe expression contains an error.";
                break;
            case 'approx':
                out1 += "\nA numerical approximation is expected.";
            case 'exact':
                let exprUvalOf = ce.parse(mfUser.value).N().valueOf();
                let exprAvalOf = ce.parse(mfAuthor.value).N().valueOf();
                out2 = exprAsimp + " \\approxeq " + exprAvalOf.toFixed(p);
                if (exprUsimp == exprAsimp) out1 = "Incorrect\nA simple numerical answer is expected, not an expression.\n" +
                    "User input: " + mfUser.value + "    Expected input: " + exprAvalOf.toFixed(p);
                else {

                    if ((exprAvalOf - prec) < exprUvalOf && exprUvalOf < (exprAvalOf + prec)) {
                        out1 = "Correct" + "\nFor: x = " + x + "\nLaTeX = " + exprUsimp + " ? " + exprAsimp + "\napproximation (user <--> author) = " + exprUvalOf + " <--> " + exprAvalOf;;

                    }
                }
                break;
            default:
                break;
        }
    }
    document.getElementById('latexChkr' + num).value = out1;
    document.getElementById('MyauthorAnsApprox' + num).innerHTML = out2;


}