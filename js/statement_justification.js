// some from: https://www.pureexample.com/ExampleTesterII-81.html li items draggable/sortable

// Number of statements in proof is required in html file
//initial height of step li
var stepHtInit;
var max = 0;
/*
    decisionMatrix:
        index 0: number of rows needed before -- dependent on reqAfter array
        index 1: 1 for row needed after, 0 for last row and distractors
        index 2: from html -- row number required before (only ONE include if multiple) -- reqBefore array
        index 3: from html -- row number required after -- reqAfter array
*/
var decisionMatrix = [[], [], reqAfter];
var proofRows;
var plural = [" is", "s are"];
// button to hide group selection when no initial opt set
$(function () {
    $(".selOptBtn").click(function () {
        opts = parseInt($('input:radio:checked').val());
        $(".selGroup").prop('hidden', true);
        $("#instructions").prop('hidden', false);
        giddyup();
    });
});
// set statement/step/justification table with proof type chosen/!chosen
function setStJust() { // called on startup
// set columns of proof table
    proofRows = reqAfter.length;
    setColOpts("#statement_opt");
    setColOpts("#justification_opt");

    // set draggable/sortable interactive columns
    setSort("#statement");
    setSort("#justification");
// toggle on/off check button and proof selection button
    if (opts > 0) {
        $(".selGroup").prop('hidden', true);
        $("#instructions").prop('hidden', false);
    }
    else {
        $(".selGroup").prop('hidden', false);
        $("#instructions").prop('hidden', true);
    }
// initialize step column in table and arrays for checker
    for (i = 0; i < $("#statement_opt li").length; i++) {
        $("#step").append(`<li class="shufflerstep">${i + 1}</li>`);
    }
    // get initial step column cell height from html settings
    stepHtInit = $("#step > li").eq(0).height();
// initialize array for checker
    for (i = 0; i < $("#statement_opt li").length; i++) {
        decisionMatrix[0].push(0);
        decisionMatrix[1].push(0);
    }
    for (let i = 0; i < proofRows; i++) {
        if (decisionMatrix[2][i] != 0) {
            decisionMatrix[0][decisionMatrix[2][i] - 1]++; // rows needed before before
        }
        if (i < proofRows - 1) {
            decisionMatrix[1][i]++; // rows needed after       
        }
    }
// set column heights -- will vary while dragging
    setHeight();
}
// select the type of proof wanted and display page
function giddyup() { // called on startup
    switch (opts) {
        case 1: // shuffled statements only
            setHide([false, false, true, true]);
            setSortable([true, true, false, false]);
            shuffleNodes('statement_opt');
            $('#instr').html('<b>Proof:</b> Reorder the statements to correct the proof.');
            break;
        case 2: // shuffled statements with static justifications
            setHide([false, false, true, false]);       
            setSortable([true, true, false, false]);
            $('.2Col').attr('hidden', false);
            rename("justification");
            $("th.justOpt").html("Justifications");
            shuffleNodes('statement_opt');
            $('#instr').html('<b>Proof:</b> Match each statement with the appropriate justification in the correct order.');
            break;
        case 3: // static statements with shuffled justifications
            setHide([true, false, false, false]);
            setSortable([false, false, true, true]);
            $('.2Col').attr('hidden', false);
            rename("statement");
            $("th.stOpt").html("Statements");
            shuffleNodes('justification_opt');
            $('#instr').html('<b>Proof:</b> Reorder the justifications to pair with the statements.');
            break;
        case 4: // shuffled statements and justifications
            setHide([false, false, false, false]);
            setSortable([true, true, true, true]);
            shuffleNodes('justification_opt');
            shuffleNodes('statement_opt');
            $(".2Col").prop('hidden', false);
            $('#instr').html('<b>Proof:</b> Reorder each statement and justification to pair in the correct order.');
        default:
            // alert("No proof option chosen.");
            break;
    }
    setHeight();
}
// rename column <th> for nonshuffled content --  checker uses statement and justification columns only
function rename(item) {
    $(`#${item}_opt`).attr('id', `${item}1`);
    $(`#${item}`).attr('id', `${item}_opt`);
    $(`#${item}1`).attr('id', `${item}`);
    for (let i = proofRows; i < $(`#${item}`).children().length; i++) {
        $(`#${item}`).children().eq(i).attr('hidden', true);
    }
}
// initialize statement_opt and justification_opt columns 
function setColOpts(idName) {
    for (i = 0; i < $(idName + " li").length; i++) {
        $(idName).children().eq(i).attr({ 'value': (i + 1), 'class': 'shuffled' });
    }
}
// initialize draggable/sortable with column pairs
function setSort(col) {
    $(`${col}_opt,${col}`).sortable({
        connectWith: `${col}_opt,${col}`,
        start: function (event, ui) {
            ui.item.toggleClass("highlight");
        },
        stop: function (event, ui) {
            ui.item.toggleClass("highlight");
            var children = $(this)
                .sortable('refreshPositions')
                .children();
            liHt();
        }
    });
}
// show/hide table columns for different proof types
function setHide(TF) {
    let sethide = ['.st', '.stOpt', '.just', '.justOpt'];
    let setstyle = ['#statement', '#statement_opt', '#justification', '#justification_opt'];
    for (let i = 0; i < TF.length; i++) {
        $(sethide[i]).prop('hidden', TF[i]);
        if (TF[i]) {
            $(setstyle[i] + " li").css({ 'background': '#B1D6FC', 'color': 'black' });
        }
    }
}
// set which columns are sortable and which are static and update style
function setSortable(TF) {
    let setstyle = ['#statement', '#statement_opt', '#justification', '#justification_opt'];
    for (let i = 0; i < TF.length; i++) {
        $(setstyle[i]).sortable('enable');
        if (TF[i]) {
            $(setstyle[i]).sortable('enable');
        }
        else {
            $(setstyle[i]).sortable('disable');
            $(setstyle[i] + " li").css({ 'background': '#B1D6FC', 'color': 'black' });
        }
    }
}
// Update height and style of li on drag
function liHt() {
    $("li").css('height', '');
    let h = 0;
    for (let i = 0; i < $("#step li").length; i++) {
        m = Math.max($("#statement li").length, $("#justification li").length);
        if (i < m) {
            if ($("#statement li").length > i && $("#justification li").length > i) {
                h = Math.max($("#statement li").eq(i).height(), $("#justification li").eq(i).height());
                $("#statement li").eq(i).height(h);
                $("#justification li").eq(i).height(h);
            }
            else if ($("#justification li").length < m) {
                h = $("#statement li").eq(i).height();
                $("#statement li").eq(i).height(h);
            }
            else {
                h = $("#justification li").eq(i).height();
                $("#justification li").eq(i).height(h);
            }
            $("#step li").eq(i).height(h);
            $("#step li").eq(i).css('background-color', '#3193F5');
        }
        else {
            $("#step li").eq(i).height(stepHtInit);
            $("#step li").eq(i).css('background-color', '#e8e8e8');
        }
    }
    setHeight();
}
// shuffle li elements in ul -- needs shuffleNodes(e) function call
// https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order
// rearrange column rows cells into a random order (li elements)
function shuffleNodes(e) {
    let listli = document.getElementById(e);
    var nodes = listli.children, i = 0;
    nodes = Array.prototype.slice.call(nodes);
    nodes = shuffle(nodes);
    while (i < nodes.length) {
        listli.appendChild(nodes[i]);
        ++i;
    }
}
// put items in column in random order (li elements)
function shuffle(items) {
    var cached = items.slice(0), temp, i = cached.length, rand;
    while (--i) {
        rand = Math.floor(i * Math.random());
        temp = cached[rand];
        cached[rand] = cached[i];
        cached[i] = temp;
    }
    return cached;
}
// dynamically set height of all columns in table (ul elements)
function setHeight() {
    $(".shuffler1,#step,.shuffler2").each(function () {
        $(this).css("height", '');
    });
    let h = [document.getElementById('statement_opt'), document.getElementById('justification_opt'), document.getElementById('step'), document.getElementById('statement'), document.getElementById('justification')];
    let maxht = h[0].clientHeight;
    for (let i = 0; i < 5; i++) {
        if (h[i].clientHeight > maxht) maxht = h[i].clientHeight;
    }
    $(".shuffler1,#step,.shuffler2").each(function () {
        $(this).css("height", maxht);
    });
}
// collect value attribute on column in table (li 'value' values)
let getData = arr => {
    return arr.map(function () {
        return $(this).attr('value');
    }).get();
}
// check order of proof statements column -- return str = (before and after info for errors)
function checkOrder(l1b) {
    let len = l1b.length;
    let countAfter, countBefore;
    let str = '', numSteps;
    if (len < proofRows) { // proof is too short?
        str += "(Some rows are missing from the proof.)<br/>";
    }
    if (len > proofRows) { // proof is too long?
        str += "(Some rows should not be included in the proof.)<br/>";
    }
    l1b.forEach(function (value, key) {
        val = parseInt(value) - 1;
        if (val >= proofRows) { // check for distractor
            str += "-- Step " + (key + 1) + " is not part of the proof.<br/>";
        }
        countBefore = 0; countAfter = decisionMatrix[1][val];
        // check for statements missing before and after current statement
        for (let r = 0; r < len; r++) {
            if (r < key) { // before
                if (decisionMatrix[2][l1b[r] - 1] == value) {
                    countBefore++;
                }
            }
            if (r > key) { // after
                if (l1b[r] == decisionMatrix[2][val]) { // reqAfter is actually after?
                    countAfter--;
                }
                else if (value == proofRows) { // steps after the actual last proof statement?
                    str += "-- No more statements are needed AFTER step " + (key + 1) + ".<br/>";
                    r = len;
                }
            }
        }
        if (countBefore != decisionMatrix[0][val]) { // steps missing before?
            numSteps = decisionMatrix[0][val] - countBefore;
            str += ("-- At least " + numSteps + " more statement" + plural[((numSteps == 1) ? 0 : 1)] + " needed BEFORE step " + (key + 1) + ".<br/>");
        }
        if (countAfter != 0) { // steps missing after?
            numSteps = 1; // TODO  make graph to check the real number of steps before 
            str += ("-- At least " + numSteps + " more statement" + plural[((numSteps == 1) ? 0 : 1)] + " needed AFTER step " + (key + 1) + ".<br/>");
        }
    });
    if (str == '' && len == proofRows) { // found no errors?
        str = "Order is correct!";
    }
    return "<b>Check for correct order:</b><br/>"+str;
}
// check match of statements and justifications-- return first row number incorrectly paired
function checkPairs(l1a, l2a) {
    let len = Math.min(l1a.length, l2a.length);
    let str = '';
    for (let i = 0; i < len; i++) {
        if (l1a[i] != l2a[i]) { // incorrect match?
            str += "-- Incorrect match at step " + (i+1) +".<br/>"; // found an incorrect match
        }
    }
    if (str.length == 0){ // all rows paired correctly
        str = (len < proofRows) ? "All matches are correct so far.<br/>" : "All matches are correct!.<br/>"; 
    }
    if (opts == 2 && l1a.length > proofRows){
        str +="-- Proof has fewer than "+ l1a.length + " statements.<br/>";
    }
    else if (l2a.length > proofRows && opts == 3){
        str +="-- Proof has fewer than "+ l2a.length + " justifications.<br/>";
    }
    return "<b>Check for correct matches:</b><br/>"+str+ "<br/>";
}
// check for correct match of statements and justifications and correct order
function checker() {
    let chk ="";
    let l1 = getData($("#statement > li"));
    // only check match if justifications are present
    if (opts > 1) {
        let l2 = getData($("#justification > li"));
        chk = checkPairs(l1, l2);
    }
    if (opts !=3) {
        chk += checkOrder(l1);
    }
    $("#chkOrder").html(chk);
}