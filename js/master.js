

function include(file, type, defer) {
  
    var script  = document.createElement('script');
    script.src  = file;
    script.type = type;
    script.defer = defer;
    
    document.getElementsByTagName('head').item(0).appendChild(script);
    
  }
include("https://code.jquery.com/jquery-1.10.2.js",'',false);
include("https://code.jquery.com/ui/1.10.4/jquery-ui.js",'',false);
include("js/statement-justification.js",'text/javascript',true);
include("http://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML",'text/javascript',false);

// https://www.mackenziesoftware.com/2020/06/reuse-navigation-bar-on-multiple-pages.html
$.get("navigation.html", function(data){
    $("#nav-placeholder").replaceWith(data);
});
 
 