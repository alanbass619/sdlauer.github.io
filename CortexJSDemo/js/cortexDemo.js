import("https://unpkg.com/mathlive@0.90.6?module");
import("https://unpkg.com/@cortex-js/compute-engine");
let mfMy1 = document.querySelector('#formulaApprox1');
let latexField1 = document.querySelector('#latexUserAns1');

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
var showHideAns = document.getElementById("showHideAns1");

var remove = true;
document.getElementById("showHideAns1").addEventListener("click", function (e) {

    if (remove) {
        this.textContent = "Hide answer";
        // document.getElementById("bothLatexAns").hidden = false;
        $("#bothLatexAns1").prop('hidden', false);
        remove = false;
    } else {
        this.textContent = "Show answer";
        $("#bothLatexAns1").prop('hidden', true);
        remove = true;
    }
});


function approxCE(x) {
    let ce = new ComputeEngine.ComputeEngine();
    let p = 4;
    let prec = Math.pow(10,-p);
    document.getElementById("latexChkr1").value = "";

    let mfUser1 = document.querySelector('#latexUserAns1');
    let mfAuthor1 = document.querySelector('#MyauthorAns1');
    if (mfUser1 == mfAuthor1) console.log ("equal expressions");

    // let x = 5;
    ce.set({ x: x });

    let exprU = ce.parse(mfUser1.value).simplify().latex;

    let exprA = ce.parse(mfAuthor1.value).simplify().latex;

    let exprUv = ce.parse(mfUser1.value).N().valueOf();
    let exprAv = ce.parse(mfAuthor1.value).N().valueOf();

    let pre = "Incorrect\n";

    if ((exprAv - prec) < exprUv && exprUv < (exprAv + prec)){
        if (exprU == exprA) pre += "A simple numerical answer is expected, not an expression.";
        else pre = "Correct\n";
    }
    else {
        if (exprU == exprA) pre += "A numerical answer is expected, not an expression.";
        else if (exprUv == '["Sequence"]') exprU = ( "NO USER INPUT");
    }

    document.getElementById('latexChkr1').value = "";
    document.getElementById('latexChkr1').value = pre + "\nFor: x = " + x + "\nLaTeX = " + exprU + " ? " + exprA +   "\napproximation = " + exprUv + " ? " + exprAv;
    document.getElementById('MyauthorAnsApprox1').innerHTML = exprA +" \\approx " + exprAv.toFixed(p);
}