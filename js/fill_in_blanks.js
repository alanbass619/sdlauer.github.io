$(document).ready(function() {
    // This code used for set order attribute for items
  var numberOfItems = $("#optionsFiB").find('li').length;
  $.each($("#optionsFiB").find('li'), function(index, item) {
      $(item).attr("order", index);
      var removeButton = $('<i class="fa fa-times" style="display:none"></i>');
      removeButton.click(function(){
           addToOlderPlace($(this).parent());
        });
      $(item).append(removeButton);
  });
    $("span").droppable({
      accept: "li",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function(event, ui) {
      // Check for existing another option
      if($(this).find('li').length > 0)
      addToOlderPlace($(this).find('li'));
        $(this).addClass("ui-state-highlight");
        $(this).addClass('matched');
        $(ui.draggable).find('i').attr("style","");
        $(this).append($(ui.draggable));
      }
    });
    // $("li").sortable();
    $("li").draggable({
       helper:"clone",
      revert: "invalid"
    });
    // This function used for find old place of item
    function addToOlderPlace($item) {
          var indexItem = $item.attr('order');
          var itemList = $("#optionsFiB").find('li');
          $item.find('i').hide();
          if (indexItem === "0")
              $("#optionsFiB").prepend($item);
          else if (Number(indexItem) === (Number(numberOfItems)-1))
                $("#optionsFiB").append($item);
          else
              $(itemList[indexItem - 1]).after($item);
      }
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
