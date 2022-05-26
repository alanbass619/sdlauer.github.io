$(function () {
    $("#optionsFiB,span").sortable({
        connectWith: "#optionsFiB,span",
        start: function (event, ui) {
            ui.item.toggleClass("highlight");
        },
        receive: function(event, ui) {
            var list = $(this);
            if (list.attr('id') != "optionsFiB") {
                if (list.children().length > 1) {                
                    var tspanElem = list.find(":first-child").detach();
                    // tspanElem.removeAttr("style");
                    $("#optionsFiB").append(tspanElem);
                    ui.css("color","purple");
                }
            }
            $this.css("color","purple");
        },
        stop: function (event, ui) {
            // ui.item.toggleClass("highlight");
            // https://www.geeksforgeeks.org/jquery-ui-sortable-refreshpositions-method/
            var children = $(this)
                .sortable('refreshPositions')
                .children();
            // liHt();
        },
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
