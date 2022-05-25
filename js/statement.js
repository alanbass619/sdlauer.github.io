// https://www.pureexample.com/ExampleTesterII-81.html
// li items draggable
// Number of statements in proof
let proofRows = $(".proofRows").attr('data-compare');
var max = 0;
$(function () {
    $("#statement_opt,#statement").sortable({
        connectWith: "#statement_opt,#statement",
        start: function (event, ui) {
            ui.item.toggleClass("highlight");
        },
        stop: function (event, ui) {
            ui.item.toggleClass("highlight");
            // https://www.geeksforgeeks.org/jquery-ui-sortable-refreshpositions-method/
            var children = $(this)
                .sortable('refreshPositions')
                .children();
            // alert('Positions: ');
            // $.each(children, function () {
            //     alert($(this).index());
            // });
        }
    });
    $("#justification_opt,#justification").disableSelection();
});

// Update height of li
function liHt() {
    
    let len = Math.max(a.height, b.height);
    for (let i = 0; i < len; i++) {
        if (l1a[i] != l2a[i]) {
            return i + 1;
        }
    }
    return len + 1;
}

// const ulList = document.getElementById("statement_opt");
// const li = document.getElementsByTagName('li');
// var nodes = Array.from(ulList.children);
// let selected = -1;
// document.getElementById("statement_opt").addEventListener("click", function (e) {
//     if (selected !== nodes.indexOf(e.target)) {
//         selected = nodes.indexOf(e.target);
//         alert(selected);

//     } else {
//         alert("Already selected");
//     }

// });


// Set ul box heights
function setHeight() {
    let h = document.getElementById('statement_opt');
    let ht = h.clientHeight;
    $(".shuffler1,#step").each(function () {
        $(this).css("height", ht);
    });
}

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

let getData = arr => {
    return arr.map(function () {
        return $(this).attr('id');
    }).get();
}
//  id < compare-data
let getDependency = arr => {
    return arr.map(function () {
        return $(this).attr('data-compare');
    }).get();
}
// Check for correct order
function checkOrder(l1) {
    let l1dep = getDependency($("#statement > li"));
    // alert(parseInt(l1dep[0].slice(0,3)));
    let valAfter = -1, valBefore = -1;
    let countAfter = 0, countBefore = 0;
    l1dep.forEach(function (value, key) {
        checkRow = parseInt(key) + 1;
        if (valAfter < 0) {
            for (let t = checkRow; t < l1.length; t++) {
                if (l1dep[t].slice(2, 5) == l1[key]) {
                    // alert(l1dep[t][1]);
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


function checker() {
    let l1 = getData($("#statement > li"));
    let l1len = l1.length;
    let str = "";
    let maxRows = /*Math.max(l2len,*/ l1len/*)*/;
    if (maxRows < proofRows) {
        str += " -- At least one step is missing from the proof.<br/>";
    }
    else if (maxRows > proofRows) {
        str += " -- The solution has fewer than " + maxRows + " rows.<br/>";
    }

    if (str.length == 0) {
        let c = checkOrder(l1);
        pluralAfter = (c.countAfter == 1) ? " is" : "s are";
        pluralBefore = (c.countBefore == 1) ? " is" : "s are";
        str += (c.valAfter < 0) ? "Correct!" : " -- Statements are out of order. At least " + c.countAfter + " more statement" + pluralAfter + " needed before step " + c.valAfter + ".<br/>";
        str += (c.valBefore < 0) ? "" : " -- Statements are out of order. At least " + c.countBefore + " more statement" + pluralBefore + " needed after step " + c.valBefore + ".<br/>";

    }
    $("#chkOrder").html(str);
}