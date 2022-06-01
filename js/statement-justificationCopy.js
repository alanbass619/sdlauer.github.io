// https://www.pureexample.com/ExampleTesterII-81.html
// li items draggable/sortable
// Number of statements in proof
//initial height of step li
let stepHtInit = $("#step > li").eq(0).height();
var max = 0;
$(function(){
    // setStatements("#statement_opt");
    // setJustifications("#justification_opt");
    $(".selOptBtn").click(function(){      
        opts = parseInt($('input:radio:checked').val());
        alert(opts);
        // window.location.reload(true);
        $('input[name="selOpt"]').val(opts);
        
        giddyup();
        alert(opts);
    });
    // window.location.reload();
 });
 function setStJust(){
    setStatements("#statement_opt");
    setJustifications("#justification_opt");
 }
       
function giddyup() {
    // alert("huh?");
    // $("#check").attr('onclick', 'checker()');
    switch (opts) {
        case 1:  
            // setStatements("#statement_opt");
            setEmptyJust();
            disAbleSortable('#justification');
            disAbleSortable('#justification_opt');
            shuffleNodes('statement_opt');
            $(".st").prop("hidden", false);
            $(".stOpt").prop("hidden", false);
            $(".justOpt").prop("hidden", true);
            $(".just").prop("hidden", true);
            break;
        case 2:
            $(".st").prop("hidden", false);
            $(".stOpt").prop("hidden", false);
            $(".justOpt").prop("hidden", false);
            $(".just").prop("hidden", true);
            // setStatements("#statement_opt");
            // setJustifications("#justification_opt");
            disAbleSortable('#justification');
            disAbleSortable('#justification_opt');
            $("#justification_opt").attr('id', 'justification1');
            $("#justification").attr('id', 'justification_opt');
            $("#justification1").attr('id', 'justification');

            shuffleNodes('statement_opt');
            break;
        case 3:
            // setStatements("#statement_opt");
            $(".st").prop("hidden", true);
            $(".stOpt").prop("hidden", false);
            $(".justOpt").prop("hidden", false);
            $(".just").prop("hidden",false);
            // setJustifications("#justification_opt");
            disAbleSortable('#statement');
            disAbleSortable('#statement_opt');
            $("#statement_opt").attr('id', 'statement1');
            $("#statement").attr('id', 'statement_opt');
            $("#statement1").attr('id', 'statement');
            shuffleNodes('justification_opt');
            break;
        case 4:
            $(".st").prop("hidden", false);
            $(".stOpt").prop("hidden", false);
            $(".justOpt").prop("hidden", false);
            $(".just").prop("hidden",false);
            shuffleNodes('justification_opt');
            shuffleNodes('statement_opt');
        default:
            break;
    }
    stepHtInit = $("#step > li").eq(0).height();
    setHeight();
}
function setStatements(idName) {
    for (i = 0; i < $(idName + " li").length; i++) {
        if (i < 10) { row = "0" + (i + 1); }
        else { row = "" + (i + 1); }
        $(idName).children().eq(i).attr({ 'data-compare': `${reqBefore[i]}${reqAfter[i]}`, 'value': `${row}`, 'class': 'shuffled' });
        // $("#step").append(`<li class="shufflerstep">${i + 1}</li>`);
    }
}
function setJustifications(idName) {
    for (i = 0; i < $(idName + " li").length; i++) {
        if (i < 10) { row = "0" + (i + 1); }
        else { row = "" + (i + 1); }
        $(idName).children().eq(i).attr({ 'value': row, 'class': 'shuffled' });
        // $(idName+" li").val(row); 
    }
}
function setEmptyJust() {
    for (i = 0; i < $("#statement" + " li").length; i++) {
        if (i < 10) { row = "0" + (i + 1); }
        else { row = "" + (i + 1); }
        $("#justification").append('<li>' + row + '<li>');
        $("#justification").children().eq(i).attr('value', row);
    }

}
$(function () {
    for (i = 0; i < $("#statement_opt li").length; i++) {

        $("#step").append(`<li class="shufflerstep">${i + 1}</li>`);
    }
});

$(function () {
    $("#statement_opt,#statement").sortable({
        connectWith: "#statement_opt,#statement",
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
});
function disAbleSortable(item) {
    $(item).sortable('disable');
    $(item + " li").css({ 'background': '#B1D6FC', 'color': 'black' });
}
function enAbleSortable(item) {
    $(item).sortable('enable');
    $(item + " li").css({ 'background': '#B1D6FC', 'color': 'black' });
}
$(function () {
    $("#justification_opt,#justification").sortable({
        connectWith: "#justification_opt,#justification",
        start: function (event, ui) {
            ui.item.toggleClass("highlight");
        },
        // tolerance: 'intersection',
        stop: function (event, ui) {
            ui.item.toggleClass("highlight");
            // https://www.geeksforgeeks.org/jquery-ui-sortable-refreshpositions-method/
            var children = $(this)
                .sortable('refreshPositions')
                .children();
            liHt();
        }
    });
});
// Update height and color of li
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
            $("#step li").eq(i).css('background-color', 'rgb(232, 232, 232)');
        }
    }
    setHeight();
}
// shuffle li elements in ul -- needs shuffleNodes(e) function call
// https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order

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

let getData = arr => {
    return arr.map(function () {
        return $(this).attr('value');
    }).get();
}
//  value < compare-data
let getDependency = arr => {
    return arr.map(function () {
        return $(this).attr('data-compare');
    }).get();
}
// Check for correct order
function checkOrder(l1) {
    let l1dep = getDependency($("#statement > li"));
    // alert(l1);
    // alert(l1dep);
    let valAfter = -1, valBefore = -1;
    let countAfter = 0, countBefore = 0;
    l1dep.forEach(function (value, key) {
        checkRow = parseInt(key) + 1;
        if (valAfter < 0) {
            for (let t = checkRow; t < l1.length; t++) {
                if (l1dep[t].slice(2, 5) == l1[key]) {
                    valAfter = checkRow;
                    countAfter++;
                }
            }
        }
        if (valBefore < 0) {
            for (let t = 0; t < checkRow; t++) {
                if (l1dep[t].slice(0, 2) == l1[key]) {
                    valBefore = checkRow;
                    countBefore++;
                }
            }
        }
    });
    return { countAfter, valAfter, countBefore, valBefore };
}
// Check for correct pairing -- return first row number incorrectly paired
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

function checker() {
    let str = "";
    let l1 = getData($("#statement > li"));
    let l1len = l1.length;
    let l2 = getData($("#justification > li"));
    // alert("l1= " + l1);
    // alert("l2= " + l2);
    let l2len = l2.length;
    if (l2len > 0) {


        let maxRows = Math.max(l2len, l1len);
        if (maxRows < proofRows) {
            str += " -- At least one step is missing from the proof.<br/>";
        }
        else if (maxRows > proofRows) {
            str += " -- The solution has fewer than " + maxRows + " steps.<br/>";
        }
        if (!(l1.every((e, i) => l2[i] == e)) || (l1len != l2len)) {
            str += " -- Statements require correct pairing with justifications. First incorrect justification at step " + checkPairs(l1, l2) + ".<br/>";
        }
    }

    if (l2len==0 & l1len != proofRows || l1len==0 & l2len != proofRows){
        str += " -- At least one step is missing from the proof.<br/>";
    }
    // if (str.length == 0) {
        let c = checkOrder(l1);
        pluralAfter = (c.countAfter == 1) ? " is" : "s are";
        pluralBefore = (c.countBefore == 1) ? " is" : "s are";
        str += (c.valAfter < 0) ? "Statement order is correct so far." : " -- Statements are out of order. At least " + c.countAfter + " more step" + pluralAfter + " needed before step " + c.valAfter + ".<br/>";
        str += (c.valBefore < 0) ? "" : " -- Statements are out of order. At least " + c.countBefore + " more step" + pluralBefore + " needed after step " + c.valBefore + ".<br/>";
    if (str=="Statement order is correct so far."){str="Correct!";}
    // }
    $("#chkOrder").html(str);
}