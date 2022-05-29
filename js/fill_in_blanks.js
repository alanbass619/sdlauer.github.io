$(function () {
    let i = 0;
    for (i = 0; i < pt.length; i++) {
        $("#proof").append(pt[i]);
        if (i < pt.length - 1) {
            $("#proof").append('<span class="ans" id="' + ansIndex[i] + '" data-max="1"></span>');
        }
        $("#optionsFiB").append('<li id="' + ansIndex[i] + '">' + at[i] + '</li>');
    }
    for (j = i - 1; j < at.length; j++) {
        $("#optionsFiB").append('<li id="00">' + at[j] + '</li>');
    }

    $(".ans").click(function () {
        // send li back to list and set answer blank sortable
        if ($(this).children().length == 1) {
            var tspanElem = $(this).find(":first-child").detach();
            $("#optionsFiB").append(tspanElem);

        }
        $(this).css({ 'background-color': 'white', 'color': 'black' });
        $(this).sortable("enable");
    });
});
$(function () {
    $("#optionsFiB,span").sortable({
        connectWith: "#optionsFiB,span",
        disabled: $("span").length == 1,
        receive: function (event, ui) {
            var list = $(this);
            if (list.attr('id') != "optionsFiB" && list.children().length == 2) {
                var tspanElem = $(this).find(":nth-child(2)").detach();
            $("#optionsFiB").append(tspanElem);
                // list.sortable("disable");
                $(this).css({ 'background-color': 'white', 'color': 'blue' });
            }
        },
        stop: function (event, ui) {
            var children = $(this)
                .sortable('refreshPositions')
                .children();
        }
    });
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

function checker() {
    let str = 'All correct!';
    let count = $('.ans').length;
    let inc = 0;
    $(".ans").each(function () {
        if ($(this).attr('id') == $(this).html().slice(8, 10)) {
            $(this).css({ 'background-color': '#3193F5', 'color': 'white' });
        }
        else {
            $(this).css({ 'background-color': '#FFD364', 'color': 'red' });
            inc++;

        }
    });
    if (inc == 1) {
        str = '' + inc + ' answer out of the ' + count + ' required answers is incorrect.'
    }
    else if (inc > 0) {
        str = '' + inc + ' answers out of the ' + count + ' required answers are incorrect.'
    }

    $("#chkOrder").html(str);
}