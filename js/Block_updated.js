// makes answers and blanks sortable/draggable
$(function () {
    $("#optionsFiB,.ans").sortable({
        connectWith: "#optionsFiB,.ans",
        disabled: $(".ans").length == 1,
        receive: function (event, ui) {
            // blocks receive to keep from breaking LaTeX
            $(".ans").on("sortreceive", function(event, ui) {
                var $list = $(this);       
                if ($list.children().length > 1 ) {
                    $(ui.sender).sortable('cancel');
                }
            });
            list.css({ 'background-color': 'white', 'color': 'blue' });
        },
        // updates positions to be able to check answers
        stop: function (event, ui) {
            var children = $(this)
                .sortable('refreshPositions')
                .children();
        }
    });
});
// shuffle li elements in ul -- needs shuffleNodes(e) function call
// https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order
// Same as statement_justification.js shuffle functions
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
// shuffle li elements in ul
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
// checks for correct answers in correct blanks
function checker() {
    let str = 'All correct!';
    let count = $('.ans').length;
    let inc = 0;
    let expl = '';
    $('.ans').css('border', '.2vw solid black');
    // sets style for correct and incorrect answers in blanks
    $(".ans").each(function () {
        if ($(this).attr('value') != $(this).html().slice(11, 13)) {
            $(this).css({'border': '.2vw solid red'});
            inc++;
            expl = $(this).attr('value');
            return false;
        }
    });
    // counts incorrect anxwers
    // English single
    if (str.length > 0) {
        str = "Explanation for value " + parseInt(expl) + " incorrect goes here.";
    }
    else {
        str = "all correct";
    }
    // if (inc == 1) {
    //     str = '' + inc + ' answer out of the ' + count + ' required answers is incorrect.'
    // }
    // // English multiple 
    // else if (inc > 0) {
    //     str = '' + inc + ' answers are incorrect out of the ' + count + ' required answers.'
    // }
    $("#chkOrder").html(str);
}