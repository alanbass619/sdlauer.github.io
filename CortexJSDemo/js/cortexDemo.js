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

function approxCE(x, num, cat) {
    let ce = new ComputeEngine.ComputeEngine();
    let p = 4;
    let prec = Math.pow(10, -p);
    document.getElementById("latexChkr" + num).value = "";

    let mfUser = document.querySelector('#latexUserAns' + num);
    let mfAuthor = document.querySelector('#MyauthorAns' + num);
    if (mfUser == mfAuthor) console.log("equal expressions");

    // let x = 5;
    ce.set({ x: x });

    let exprU = ce.parse(mfUser.value).simplify().latex;

    let exprA = ce.parse(mfAuthor.value).simplify().latex;

    let exprUv = ce.parse(mfUser.value).N().valueOf();
    let exprAv = ce.parse(mfAuthor.value).N().valueOf();

    let pre = "Incorrect\n";

    if ((exprAv - prec) < exprUv && exprUv < (exprAv + prec)) {
        if (exprU == exprA) pre += "A simple numerical answer is expected, not an expression.";
        else pre = "Correct\n";
    }
    else {
        if (exprU == exprA) pre += "A numerical answer is expected, not an expression.";
        else if (exprUv == '["Sequence"]') exprU = ("NO USER INPUT");
    }

    document.getElementById('latexChkr' + num).value = "";
    document.getElementById('latexChkr' + num).value = pre + "\nFor: x = " + x + "\nLaTeX = " + exprU + " ? " + exprA + "\napproximation = " + exprUv + " ? " + exprAv;
    document.getElementById('MyauthorAnsApprox' + num).innerHTML = exprA + " \\approx " + exprAv.toFixed(p);
}