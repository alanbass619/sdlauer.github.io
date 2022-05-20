// https://www.pureexample.com/ExampleTesterII-81.html
// li items draggable

$(function () {
	$("#statement_opt,#statement").sortable({
		connectWith: "#statement_opt,#statement",
        start: function (event, ui) {
			ui.item.toggleClass("highlight");
		},
		stop: function (event, ui) {
			ui.item.toggleClass("highlight");
		}
	});
	$("#statement_opt,#statement").disableSelection();
});
$(function () {
	$("#justification_opt,#justification").sortable({
		connectWith: "#justification_opt,#justification",
        start: function (event, ui) {
			ui.item.toggleClass("highlight");
		},
		stop: function (event, ui) {
			ui.item.toggleClass("highlight");
		}
	});
	$("#justification_opt,#justification").disableSelection();
});

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
// based on: https://stackoverflow.com/questions/68965082/how-do-i-move-item-from-1-list-to-another-list-in-html-->
// allow option lists to be moved to Statement and Justification

// set equal heights  all li elements
var max = -1;
$(".shuffled").each(function () {
    var h = $(this).height();
    max = h > max ? h : max;
});
$(".shuffled,.shufflerstep").each(function () {
    $(this).css("height", max/10+'vw');
});

// set height of 4 ul elements 
let l1set = document.getElementById("statement_opt").childElementCount;
let l1aset = document.getElementById("justification_opt").childElementCount;

let ht = Math.max(l1set, l1aset) * (max + 17)/10 +'vw';
$(".shuffler2,.shuffler1,#step").each(function () {
    $(this).css("height", ht);
});

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
                if (l1dep[t].slice(2,5) == l1[key]) {
                    // alert(l1dep[t][1]);
                    valAfter = checkRow;
                    countAfter++;
                }
            }
        }
        if (valBefore < 0) {
            for (let t=0; t < checkRow; t++) {
                if (l1dep[t].slice(0,2) == l1[key]) {
                    // alert(l1dep[t][1]);
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
    let len = Math.min(l1a.length, l2a.length);
    for (let i = 0; i < len; i++) {
        if (l1a[i] != l2a[i]) {
            return i + 1;
        }
    }
    return len + 1;
}
let proofRows = $(".proofRows").attr('data-compare');
function checker() {
    let l1 = getData($("#statement > li"));
    let l1len = l1.length;
    let l2 = getData($("#justification > li"));
    let l2len = l2.length;
    let str = "";
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


    // if (l1len == proofRows){
    if (str.length == 0) {
        let c = checkOrder(l1);
        pluralAfter = (c.countAfter == 1) ? " is" : "s are";
        pluralBefore = (c.countBefore == 1) ? " is" : "s are";
        str += (c.valAfter < 0) ? "Correct!" : " -- Statements are out of order. At least " + c.countAfter + " more step" + pluralAfter + " needed before step " + c.valAfter + ".<br/>";
        str += (c.valBefore < 0) ? "" : " -- Statements are out of order. At least " + c.countBefore + " more step" + pluralBefore + " needed after step " + c.valBefore + ".<br/>";

    }
    $("#chkOrder").html(str);
}