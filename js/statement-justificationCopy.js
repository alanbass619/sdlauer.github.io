// some from: https://www.pureexample.com/ExampleTesterII-81.html li items draggable/sortable

// Number of statements in proof is required in html file
//initial height of step li
let stepHtInit = $("#step > li").eq(0).height();
var max = 0;
var  cBefore = [];
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
    // set step column in table
    for (i = 0; i < $("#statement_opt li").length; i++) {
        $("#step").append(`<li class="shufflerstep">${i + 1}</li>`);
    }
    // set column heights -- will vary while dragging
    setHeight();
    for (let i = 0; i < proofRows; i++) {
         cBefore.push(0);
    }
    // count elements needed before row at index i
    for (let i = 0; i < proofRows; i++) {
        if (reqAfter[i] != 0) {
             cBefore[reqAfter[i] - 1]++;
        }
    }
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
            rename("justification");
            $("th.justOpt").html("Justifications");
            shuffleNodes('statement_opt');
            $('#instr').html('<b>Proof:</b> Match each statement with the appropriate justification in the correct order.');
            break;
        case 3: // static statements with shuffled justifications
            setHide([true, false, false, false]);
            setSortable([false, false, true, true]);
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
            break;
    }
}
// rename columns for nonshuffled content --  checker uses statement and justification columns only
function rename(item) {
    $(`#${item}_opt`).attr('id', `${item}1`);
    $(`#${item}`).attr('id', `${item}_opt`);
    $(`#${item}1`).attr('id', `${item}`);
    
}
// initialize statement_opt and justification_opt columns 
function setColOpts(idName) {
    for (i = 0; i < $(idName + " li").length; i++) {
        $(idName).children().eq(i).attr({ 'value': (i+1), 'class': 'shuffled' });
    }
}
// as integers
// function setIntArr(arr) {
//     let newIntArr = [];
//     arr.forEach(function (value, key) {
//         newIntArr.push(parseInt(value));
//     });
//     return newIntArr;
// }
// make pair of columns sortable and draggable
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
        // alert('sortable');
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
// rearrange column rows into a random order (li elements)
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
// dynamically set height of all columns (ul elements)
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
// gather values on column (li 'value' values)
let getData = arr => {
    return arr.map(function () {
        return $(this).attr('value');
    }).get();
}
// get incorrect order of proof statements column --  return before and after info for errors
function checkOrder(l1) {
    let valDist='', valAfter = -1, valBefore = -1;
    let countDist=0, countAfter = 0, countBefore = 0;
    let str = '';
    l1.forEach(function (value, key) {
        val = parseInt(value) -1;
        // alert(val);
        if (val >= proofRows){ // distractor
            countDist++;
            valDist += (valDist=='')? (" "+ (key+1)): (", "+ (key+1));
            
        }
        if (valBefore < 1){
        // checkRow = value;
        countBefore =  cBefore[key] +1;
        // alert(ountBefore);
        // if(countBefore > 0){  // check for rows missing before
            for (let r = 0; r < proofRows; r++){
                // str+= r+"  "+countBefore +"  "+reqBefore[r]+"\n";
                if (reqAfter[r] == val){
                    valBefore = key+1;
                    countBefore++;
                    // alert(countBefore+"  "+valBefore);
                }
            }}
        // }
        // check for distractor
        if(key< proofRows && val < proofRows){
            str += (key + "  " + val + "  " +  cBefore(key) + "  " + reqBefore[val] + "  " + reqAfter[val] + "\n" );
        }
        // if (l1[key] > proofRows) {
        //     countAfter = 100;
        //     valAfter = checkRow;
        // }
        // for (let t = 0; t < l1.length; t++) {
        //     // any dependent rows after?
        //     if (valAfter < 0 && t >= checkRow) {
        //         if ( cBefore[t] == value) {
        //             valAfter = checkRow;
        //             countAfter++;
        //         }
        //     }
        //     // any dependent rows before?
        //     if (valBefore < 0 && t < checkRow) {
        //         if (reqBefore[t-1] == value) {
        //             valBefore = checkRow;
        //             countBefore++;
        //         }
        //     }
        // }
        
        // dependent rows missing?

        });
        // alert(countDist+"  "+valDist);
        alert(str);
    
    // alert("valDist="+ valDist +"   countDist="+ countDist +"   countAfter="+ countAfter +"   valAfter="+ valAfter +"   countBefore="+ countBefore +"   valBefore="+ valBefore);
    return { valDist, countDist, countAfter, valAfter, countBefore, valBefore };
}
// get incorrect pairing of statements and justifications-- return first row number incorrectly paired
function checkPairs(l1a, l2a) {
    // alert(l1a.length+ "   "+ l2a.length);
    let len = Math.min(l1a.length, l2a.length);
    for (let i = 0; i < len; i++) {
        // alert(l1a[i]+ "   "+ l2a[i]);
        if (l1a[i] != l2a[i]) {
            return i + 1;
        }
    }
    return len + 1;
}
// check for correct pairing of statements and justifications and correct order
function checker() {
    let str = "";
    let l1 = getData($("#statement > li"));
    let l1len = l1.length;
    let l2 = getData($("#justification > li"));
    let l2len = l2.length;
    let maxRows = Math.max(l2len, l1len);
    if (maxRows < proofRows) {
        str += " -- At least one step is missing from the proof.<br/>";
    }
    else if (maxRows > proofRows) {
        str += " -- The solution has fewer than " + maxRows + " steps.<br/>";
    }
    // only check pairing if justifications are present
    if ((!(l1.every((e, i) => l2[i] == e)) || (l1len != l2len)) && opts > 1) {
        str += " -- Statements require correct pairing with justifications. First incorrect justification at step " + checkPairs(l1, l2) + ".<br/>";
    }
    // check order of statements column
    let c = checkOrder(l1);
    pluralAfter = (c.countAfter == 1) ? " is" : "s are";
    pluralBefore = (c.countBefore == 1) ? " is" : "s are";

    if (c.countAfter > 90) {
        str += "Step " + c.valAfter + " is not part of the proof.";
    }
    else if (c.countAfter > 0) {
        str += " -- Statements are out of order. At least " + c.countAfter + " more step" + pluralAfter + " needed before step " + c.valAfter + ".<br/>";
    }
    if (c.valAfter < 0) {
        str += "Order is correct so far.";
    }
    str += (c.valBefore < 0) ? "" : " -- Statements are out of order. At least " + c.countBefore + " more step" + pluralBefore + " needed after step " + c.valBefore + ".<br/>";
    if (str == "Order is correct so far." && l1len == proofRows) { str = "Correct!"; }
    // }
    $("#chkOrder").html(str);
    // alert(reqBefore+"\n"+reqAfter);
}