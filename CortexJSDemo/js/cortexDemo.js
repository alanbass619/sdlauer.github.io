import("https://unpkg.com/mathlive@latest?module");
import("https://unpkg.com/@cortex-js/compute-engine");
// 0.94.5 = latest
maxElems = numElems // varies for subject matter --  set in script at end of each html page
document.querySelector('math-field').addEventListener('focus', () => {
    mathVirtualKeyboard.layouts = {
    rows: [
        [
        "p", "q", "r", "s", "\\forall", "\\exists", "\\therefore"
        ],
        [ 
            "\\neg","\\lor", "\\land", "\\rightarrow", "\\leftrightarrow", "\\equiv", "\\oplus"
        ],
        [
            "\\text{T}", "\\text{F}", "(", ")", '[left]', '[right]', '[backspace]'
        ]
    ]
    };
    mathVirtualKeyboard.visible = true;
    });
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
        }
        else {
            this.textContent = "Show answer";
            $("#bothLatexAns" + i).prop('hidden', true);
            remove = true;
        }
    });
}
function isNumeric(str) {
    if (typeof str != "string") {
        return false
    } //+ "not string"// we only process strings!  
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
// add braces to relevant single number entities Ex: sqrt, frac, _, ^
function addBraces(e, mtch) {
    let len = mtch.length;
    let tf = e.includes(mtch);
    let indx = e.indexOf(mtch, 0) + len;
    cnt = 0;
    while (tf && cnt < e.length) {
        if (e.at(indx) != '{') {
            if (mtch == 'frac') {
                e = e.substring(0, indx) + '{' + e.substring(indx, indx + 1) + '}{' + e.substring(indx + 1, indx + 2) + '}' + e.substring(indx + 2);
            }
            else {
                e = e.substring(0, indx) + '{' + e.substring(indx, indx + 1) + '}';
            }
        }
        indx = indx + 2;
        indx = e.indexOf(mtch, indx) + len;
        if (indx < len || indx >= e.length - 1) {
            tf = false
        }
        cnt = cnt + 2;
    }
    if (mtch == 'frac') {
        e = fracSigns(e);
    }
    return e
}
// check for  single number subscripts, superscripts, fracs, sqrt
function braceAdj(e) {
    let mtches = ['frac', '_', '^', 'sqrt']
    for (const elem of mtches) {
        if (e.indexOf(elem) > 0) {
            // add braces if missing -- for latex checking
            e = addBraces(e, elem)
        }
    }
    e = replaceDoubleSign(e);
    return e;
}
// Check if \frac fraction has a negative numeric num and/or den
function fracSigns(e) {
    let len = e.length;
    let indxFrac = 0;
    let cnt = 0;
    let sgn = false;
    while (cnt < len) {
        indxFrac = e.indexOf('\\frac{', indxFrac + 1);
        if (indxFrac > 0) {
            let num1 = e.indexOf('{', indxFrac);
            let num2 = e.indexOf('}', num1 + 1);
            let subNum = e.substring(num1 + 1, num2);
            if (isNumeric(subNum)) {
                let num = parseFloat(subNum);
                if (num < 0) {
                    sgn = !sgn;
                    num = -num
                }
                e = e.substring(0, num1 + 1) + num + e.substring(num2);
            }
            let den1 = e.indexOf('{', num1 + 1);
            let den2 = e.indexOf('}', den1 + 1);
            let subDen = e.substring(den1 + 1, den2);
            console.log(subNum + '   ' + subDen);
            console.log(e + '   den');
            if (isNumeric(subDen)) {
                let den = parseFloat(subDen);
                if (den < 0) {
                    den = -den
                    sgn = !sgn;
                }
                e = e.substring(0, den1 + 1) + den + e.substring(den2);
                den2 = e.indexOf('}', den1 + 1);
            }
            if (sgn) {
                if (e.charAt(indxFrac - 1) == '-') {
                    e = e.substring(0, indxFrac - 1) + '+' + e.substring(indxFrac);
                }
                else if ((e.charAt(indxFrac - 1) == '+')) {
                    e = e.substring(0, indxFrac - 1) + '-' + e.substring(indxFrac);
                }
                else {
                    e = e.substring(0, indxFrac - 1) + '{-' + e.substring(indxFrac + 1, den2 + 1) + '}' + e.substring(indxFrac + 1);
                }
            }
            cnt = cnt + 5;
            indxFrac = indxFrac + 5;
        }
        else {
            cnt = len;
        }
    }
    // Replace any new double signs in expr
    e = replaceDoubleSign(e);
    return e;
}
// Replaces double signs with equivalent + or -
function replaceDoubleSign(e) {
    return e.replaceAll('++', '+').replaceAll('-+', '-').replaceAll('+-', '-').replaceAll('--', '+');
}
// Removes $, rewrites frac with - in num or den, replaces double signs
function exprCleaner(e) {
    e = e.replaceAll('$', '');
    e = replaceDoubleSign(e);
    return e;
}
function truthTable(num, placeHolders,vals){
    // console.clear();   
    let out1 = ''
    const mtt = document.getElementById(placeHolders);
    places = mtt.getPrompts();
    let right = places.length;
    for (let i = 0; i < places.length; i++) {
        if (vals[i] != mtt.getPromptValue(places[i])){
            right--;
            out1 += '\nAnswer blank ' + (i+1) + ' is incorrect.'
        }
    }
    document.getElementById('latexChkr' + num).value = `${right} out of ${places.length} answers are correct.  ${out1}`;
}

function approxCE(x, num, sieve, formReq, equationCheck) {
    console.clear();
    let ce = new ComputeEngine.ComputeEngine();
    let p = 3;
    let prec = Math.pow(10, -p);
    document.getElementById("latexChkr" + num).value = "";
    let mathFieldUser = document.querySelector('#latexUserAns' + num);
    let textAreaAuthor = document.querySelector('#MyauthorAns' + num);
    
    let out1 = "Incorrect";
    let exprAapprox = '';
    let exprAorig = exprCleaner(textAreaAuthor.value);
    if (mathFieldUser.value == "" || (mathFieldUser.value == '["Sequence"]')) {
        out1 = "Incorrect\nNO USER INPUT";
    }
    else {
        let exprAorig = exprCleaner(textAreaAuthor.value);
        let exprUorig = exprCleaner(mathFieldUser.value);
        console.log(ce.parse(exprAorig).isSame(ce.parse(exprUorig)) + '   '+ exprUorig + '  ' +exprAorig);
        // Set comparison values for author and user input
        let [exprUsimp, unusedVar0, isUequation, isUnumber] = equationAdj(ce, exprUorig, equationCheck);
        let [exprAsimp, exprAsimpNeg, isAequation, isAnumber] = equationAdj(ce, exprAorig, equationCheck);
        let [exprAsimp1, exprAsimpNeg1, unusedVar1, unusedVar2] = equationAdj(ce, flipEquation(exprAorig), equationCheck);
        let equivalentExpOrNum = (exprUsimp == exprAsimp || exprUsimp == exprAsimpNeg || exprUsimp == exprAsimp1 || exprUsimp == exprAsimpNeg1);
        document.getElementById('latexChkr' + num).value = "";
        let exprAvalOf = '';
        let exprUvalOf = '';
        let expected = exprAorig;
        if (!isAequation) {
            if (sieve != 'latex') {
                exprAvalOf = parseFloat(ce.parse(exprAorig).N().valueOf())
                expected = exprAvalOf.toFixed(p)
                exprAapprox = " \\approxeq " + expected;
            }
            else {
                if (exprAsimp != exprAorig) {
                    exprAapprox = ' \\approxeq ' + exprAsimp;
                    //TODO//////////////   !!!! exprAsimp may not calculate correctly --  
                    ////////////////   !!!! ComputeEngine doesn't actually perform the order of operations consistently
                }
            }
        }
        switch (sieve) {
            // Want a LaTeX expression for the answer
            //TODO  refine latex case for "order matters" Ex: correct form of y = mx + b
            case 'latex':
                // whitespace removed
                let adjMathFieldUser = braceAdj(exprUorig).replace(/\s/g, "");
                let adjTextAreaAuthor = braceAdj(exprAorig).replace(/\s/g, "");

                // The expected answer was given
                if (equivalentExpOrNum) {
                    if (adjMathFieldUser == adjTextAreaAuthor) {
                        out1 = "Correct  \nLaTeX: " + exprAorig;
                    }
                    // Answer in a different order or form
                    else if (isAequation == isUequation && isUnumber == isAnumber) {
                        out1 = "Correct, but slightly different than expected.\nExpected input: " + exprAorig;
                        if (formReq != '') {
                            out1 += "\nRequired form:  " + formReq;
                        }
                    }
                    // Numerical answer correct, but needed an expression
                    else if (exprUsimp == exprUorig) {
                        out1 += "\nThe answer " + exprUorig +
                            " is a good numerical answer, but an expression is needed, not a numerical value.\nUser input: " + exprUorig + "   Expected: " + exprAorig;
                    }
                }
                // Neither a correct number nor expression
                else out1 += "\nThe expression contains an error.";
                break;
            case 'approx':
                exprUvalOf = parseFloat(ce.parse(exprUorig).N().valueOf())
                if (exprUorig == exprUsimp && isNumeric(exprUorig)) {
                    if ((exprUvalOf >= exprAvalOf - 1 * prec && exprUvalOf <= exprAvalOf + 1 * prec)) {
                        out1 = "Correct.\nUser input: " + exprUorig + "    Expected: " + expected;
                    }
                    else { out1 = "Incorrect.\nUser input: " + exprUorig + "    Expected: " + expected; }
                }
                else if (exprUvalOf.toFixed(p) == expected) {
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
                else if ((exprAvalOf - 0.001) <= exprUvalOf && exprUvalOf <= (exprAvalOf + 0.001)) {
                    out1 = "The answer " + exprUorig + " is a good numerical approximation, but an exact number or expression is needed.\nUser input: " + exprUorig + "     Expected: " + exprAorig;
                }
                else {
                    out1 = "Incorrect.\nUser input: " + exprUorig + "    Expected input: " + exprAorig;
                }
                break;
            default:
                break;
        }
    }
    let out2 = exprAorig + exprAapprox;
    document.getElementById('latexChkr' + num).value = out1;
    document.getElementById('MyauthorAnsApprox' + num).value = out2;


}