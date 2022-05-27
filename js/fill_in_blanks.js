$(function () {
    $("#optionsFiB,span").sortable({
        connectWith: "#optionsFiB,span",
        disabled: $("span").length == 1,
        // start: function (event, ui) {
        //     ui.item.toggleClass("highlight");
        // },
        receive: function (event, ui) {
            var list = $(this);
            if (list.attr('id') != "optionsFiB" && list.children().length == 1) {
                list.sortable("disable");
            }
        },
        stop: function (event, ui) {
            // ui.item.toggleClass("highlight");
            var children = $(this)
                .sortable('refreshPositions')
                .children();
        }
    });
});
$("span").click(function () {
    // send li back to list and set answer blank sortable
    if ($(this).children().length == 1) {
        var tspanElem = $(this).find(":first-child").detach();
        $("#optionsFiB").append(tspanElem);
    }
    $(this).sortable("enable");
});
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
// Check for correct fill
function checkOrder() {
    let l1Dep = getDependency($("#optionsFiB > li"));
    let scanDep = getDependency($("scan"));
    // alert(parseInt(l1dep[0].slice(0,3)));
    let valBefore = -1;
    let count = 0;
    l1dep.forEach(function (value, key) {
        checkRow = parseInt(key) + 1;
        if (valBefore < 0) {
            for (let t = 0; t < checkRow; t++) {
                if (l1Dep[t] != scanDep[key]) {
                    valBefore = checkRow;
                    countBefore++;
                }
            }
        }
    });
    return { countAfter, valAfter, countBefore, valBefore };
}


function checker() {
    let l1 = getData($("#optionsFiB > li"));
    let l1len = l1.length;
    let l2 = getData($(".ans"));
    let l2len = l1.length;
    alert("opt= " + l1);
    alert("ans= " + l2);
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