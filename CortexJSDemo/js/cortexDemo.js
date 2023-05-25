import("https://unpkg.com/mathlive@latest?module"); // 0.94.5 = latest
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
// a = b changes to b = a
function flipEquation(e) {
    eq = e.indexOf("=")
    return e.substring(eq + 1) + '=' + e.substring(0, eq);
}
// creates negative of expressions and changes a = b to a - b = 0  
function equationAdj(ce, e, tf) {
    let eNeg = '' + e;
    let hasEqual = false;
    eNeg = '-(' + eNeg + ')';
    //TODO needs an adjustment for other types of "=" in equation Ex: sum_{i=1}
    if (e.includes('=')) {
        if (tf) {
            e = e.replace('=', "-(") + ') = 0';
            eNeg = '-(' + eNeg.replace('=', "-(") + ')) = 0';
            hasEqual = true;
        }
    }
    tf = isNumeric(e)
    e = ce.parse(e).simplify().latex;
    eNeg = ce.parse(eNeg).simplify().latex;
    return [e, eNeg, hasEqual, tf];
}
// add braces to relevant single number entities
function addBraces(e,mtch){
    console.log(mtch);
    let len = mtch.length;
    let tf = e.includes(mtch);
    let indx = e.indexOf(mtch, 0) +len;
    console.log(indx + ' index and char ' +e.at(indx));
    while (tf){       
        
        if (e.at(indx) != '{'){
            
            if (mtch == 'frac'){
                console.log(e + '  2a');
                e = e.substring(0,indx) + '{' + e.substring(indx, indx+1)+'}{' +  e.substring(indx+1, indx+2)+ '}' +  e.substring(indx+2);
                console.log(e + '  2b');
            }
            else {
                e = e.substring(0,indx) + '{' + e.substring(indx, indx+1)+'}';
            }
        }
        indx = indx +1;
        indx = e.indexOf(mtch, indx+1) + len;
        if (indx < 0 || indx >= len-1){tf = false}
    }
    console.log(e + '  1');
    return e
}
// add braces to single number subscripts, superscripts, fracs
function braceAdj(e){
    let mtches = ['frac','_','^',]
    console.log(mtches[1]);
    for (const elem of mtches){
        console.log(e.indexOf(elem));
        if (e.indexOf(elem)>0){
            e = addBraces(e,elem)
        }
    }
    console.log(e + '  2');
    return e;
}
function exprCleaner(e){
    e = e.replaceAll('$', '').replaceAll('\\frac{-', '-\\frac{');

    return e;
}
function approxCE(x, num, sieve, formReq, equationCheck) {
    console.clear();
    let ce = new ComputeEngine.ComputeEngine();
    let p = 3;
    let prec = Math.pow(10, -p);
    document.getElementById("latexChkr" + num).value = "";
    let mathFieldUser = document.querySelector('#latexUserAns' + num);
    let textAreaAuthor = document.querySelector('#MyauthorAns' + num);
    let exprUorig = exprCleaner(mathFieldUser.value);  
    // console.log(exprUorig);
    // exprUorig = exprCleaner(exprUorig.replaceAll('\\frac{-', '-\\frac{');
    // console.log(exprUorig);
    let exprAorig = exprCleaner(textAreaAuthor.value);
    // exprAorig = exprAorig.replaceAll('\\frac{-', '-\\frac{');
    // Set comparison values for author and user input
    let [exprUsimp, unusedVar0, isUequation, isUnumber] = equationAdj(ce, exprUorig, equationCheck)
    let [exprAsimp, exprAsimpNeg, isAequation, isAnumber] = equationAdj(ce, exprAorig, equationCheck);
    let [exprAsimp1, exprAsimpNeg1, unusedVar1, unusedVar2] = equationAdj(ce, flipEquation(exprAorig), equationCheck);
    console.log(exprAsimp +'\n'+exprUsimp);
    let equivalentExpOrNum = (exprUsimp == exprAsimp || exprUsimp == exprAsimpNeg || exprUsimp == exprAsimp1 || exprUsimp == exprAsimpNeg1);
    document.getElementById('latexChkr' + num).value = "";
    let out1 = "Incorrect";
    let exprAapprox = '';
    let exprAvalOf = '';
    let exprUvalOf = '';
    let expected = exprAorig;
    if (!isAequation) {
        if (sieve != 'latex') {
            exprAvalOf =parseFloat(ce.parse(exprAorig).N().valueOf())
            expected = exprAvalOf.toFixed(p)
            exprAapprox = " \\approxeq " + expected;
        }
        else {
            if (exprAsimp != exprAorig) {
                exprAapprox = ' \\approxeq ' + exprAsimp;
                //TODO//////////////   !!!! exprAsimp may not calculate correctly --  
                ////////////////   !!!! there's an error in the ComputeEngine for ce.parse( *** ).simplify().latex;
            }
        }
    }

    if (exprUsimp == "" || (exprUsimp == '["Sequence"]')) out1 = "Incorrect\nNO USER INPUT";
    else {
        switch (sieve) {
            // Want a LaTeX expression for the answer
            //TODO  refine latex case for "order matters" Ex: correct form of y = mx + b
            case 'latex':
                // whitespace removed, braces added for frac, _, ^
                let adjMathFieldUser = braceAdj(exprUorig).replace(/\s/g, "");
                let adjTextAreaAuthor = braceAdj(exprAorig).replace(/\s/g, "");
                console.log(adjMathFieldUser + '   ' + adjTextAreaAuthor);
                // The expected answer was given
                if (equivalentExpOrNum) {
                    if (adjMathFieldUser == adjTextAreaAuthor)
                        out1 = "Correct  \nLaTeX: " + exprAorig;
                    // Answer in a different order or form
                    else if (isAequation == isUequation && isUnumber == isAnumber){
                        out1 = "Correct, but slightly different than expected.\nExpected input: " + exprAorig;
                        if (formReq != ''){
                            out1 += "\nRequired form:  " + formReq;
                        }
                    }
                    // Numerical answer correct, but needed an expression
                    else if (exprUsimp == exprUorig) {
                        out1 += "\nThe answer " + exprUorig +
                            " is a good numerical answer, but an expression is needed, not a numerical value.\nExpected: " + exprAorig;
                    }
                }
                // Neither a correct number nor expression
                else out1 += "\nThe expression contains an error.";
                break;
            case 'approx':
                exprUvalOf = parseFloat(ce.parse(exprUorig).N().valueOf())
                if (exprUorig == exprUsimp && isNumeric(exprUorig)) {
                    if ((exprUvalOf >= exprAvalOf - 1 * prec && exprUvalOf <= exprAvalOf + 1 * prec)) {
                        out1 = "Correct. Expected: " + expected;
                    }
                    else { out1 = "Incorrect.\nUser input: " + exprUorig + "    Expected: " + expected; }
                }
                else if (exprUvalOf == expected) {
                    out1 = "Incorrect. The answer does simplify to the expected approximation.  However, a simple numerical answer is needed, not an expression.\n" +
                        "User input: " + exprUorig + "    Expected: " + expected
                }
                else {
                    out1 = "Incorrect. A simple numerical answer is expected, not an expression.\n" +
                        "User input: " + exprUorig + "    Expected: " + expected
                }
                break;
            case 'exact':
                exprUvalOf = parseFloat(ce.parse(exprUorig).N().valueOf())
                if (equivalentExpOrNum) {
                    if (exprUsimp == exprAsimp) out1 = "Correct. The expected answer is " + exprAorig;
                    // Check for opposite sign
                    else out1 = "Incorrect.  The answer is opposite in sign.\nUser input: " + exprUorig + "    Expected input: " + exprAorig;
                }
                else if ((exprAvalOf - 0.001) <= exprUvalOf && exprUvalOf <= (exprAvalOf + 0.001))
                    out1 = "The answer " + exprUorig + " is a good numerical approximation, but an exact number or expression is needed.\nExpected: " + exprAorig;
                else
                    out1 = "Incorrect.\nUser input: " + exprUorig + "    Expected input: " + exprAorig;
                break;
            default:
                break;
        }
    }
    let out2 = exprAorig + exprAapprox;
    document.getElementById('latexChkr' + num).value = out1;
    document.getElementById('MyauthorAnsApprox' + num).value = out2;


}