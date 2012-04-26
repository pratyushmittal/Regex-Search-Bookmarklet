/*
REGEX Bookmarklet-

Modified from original Bookmarklet of D. Patrick Caldwell
http://dpatrickcaldwell.blogspot.in/2010/09/regular-expression-search-bookmarklet.html

Compress using (Use Aggressive):
http://fmarcia.info/jsmin/test.html

Include jQuery:
http://coding.smashingmagazine.com/2010/05/23/make-your-own-bookmarklets-with-jquery/

Bookmarklet:
javascript:(function(){if(window.myBookmarklet!==undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src='LINK-To-JS-File';}})();

*/

(function(){

    var v = "1.3.2";

    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var done = false;
        var script = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function(){
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                initMyBookmarklet();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        initMyBookmarklet();
    }

    function initMyBookmarklet() {
        (window.myBookmarklet = function() {

            // Bookmarklet Code Begin
            function searchWithinNode(node, re) {
                // more variables
                var pos, skip, acronym, middlebit, endbit, middleclone;
                skip = 0;

                // be sure the target node is a text node
                if (node.nodeType == 3) {
                    // find the position of the first match
                    pos = node.data.search(re);

                    // if there's a match . . . 
                    if (pos >= 0) {
                      // create the acronym node.
                      acronym = document.createElement('ACRONYM');
                      acronym.title = 'Search ' + (searches + 1) + ': ' + re.toString();
                      acronym.style.backgroundColor = backColor;
                      acronym.style.borderTop = '1px solid ' + borderColor;
                      acronym.style.borderBottom = '1px solid ' + borderColor;
                      acronym.style.fontWeight = 'bold';
                      acronym.style.color = borderColor;

                    // get the last half of the node and cut the match
                    // out.  then, clone the middle part and replace it with
                    // the acronym
                      middlebit = node.splitText(pos);
                      endbit = middlebit.splitText(RegExp.lastMatch.length);
                      middleclone = middlebit.cloneNode(true);
                      acronym.appendChild(middleclone);
                      middlebit.parentNode.replaceChild(acronym, middlebit);
                      count++;
                      skip = 1;
                    }
                }

                // if the node is not a text node and is not
                // a script or a style tag then search the children
                else if (node.nodeType == 1 && node.childNodes && node.tagName.toUpperCase() != 'SCRIPT' && node.tagName.toUpperCase != 'STYLE') {
                    for (var child = 0; child < node.childNodes.length; ++child) {
                        child = child + searchWithinNode(node.childNodes[child], re);
                    }
                }

                return skip;
            }

            function set_message(text){
                noti = $('#reg-noti');
                if (noti.length == 0) {
                    notifications = '<div style="position:fixed;bottom:0;display:block;padding:5px;background-color:white;" id="reg-noti">' + text + '</div>';
                    $('body').append(notifications);
                } else {
                    message = '<br />' + text;
                    noti.append(message);
                }
            }

            function post_search(){
                set_message('Found ' + count + ' match' + (count == 1 ? '' : 'es') + ' for ' + regexp + '.');

                // if we made any matches, increment the search count
                if (count > 0) {
                    searches++;
                }
            }


            //Initialization
            var count = 0, searches = 0, text, regexp, borderColor, backColor;

            // Set Create Input Box
            for_input = 'Enter Regex Pattern:<input style="border:1px solid #cdcdcd;padding:3px;margin:3px;" id="regex-query" type="text"/><a style="padding-left:5px;" id="regex-search" href="#">Search</a>';
            set_message(for_input);


            // Bind Actions to click
            $('#regex-search').click(function(){
                text = $('#regex-query').val();
                if (text == null || text.length == 0) {
                    alert('Nothing to find.');
                    return false;
                }
                try {
                  regexp = new RegExp(text, 'i');
                } catch (er) {
                  set_message('Unable to create regular expression using text \'' + text + '\'.\n\n' + er);
                  return false;
                }

                // use the search count to get the colors.
                borderColor = '#' 
                  + (searches + 8).toString(2).substr(-3)
                  .replace(/0/g, '3')
                  .replace(/1/g, '6');
                backColor = borderColor
                  .replace(/3/g, 'c')
                  .replace(/6/g, 'f');

                // for the last half of every 16 searhes, invert the
                // colors.  this just adds more variation between
                // searches.
                if (searches % 16 / 8 >= 1) {
                  var tempColor = borderColor;
                  borderColor = backColor;
                  backColor = tempColor;
                }
                searchWithinNode(document.body, regexp);
                post_search();
            });
            
            // Bookmarklet Code End
        
        })();
    }

})();