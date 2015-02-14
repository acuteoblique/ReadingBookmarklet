(function readingBookmarkletGlobal() {
    "use strict";

    function initialize() {
        var preTag;

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initialize);
        }
        else {
	        preTag = document.getElementsByTagName('pre')[0];
	        preTag.style.fontFamily="arial";
 	        preTag.style.wordWrap='break-word'; 
        }
    }

    function loadRequiredScripts(uris, callback) {
        var lastScriptUri = getLastScriptUri(),
            baseUri = getFirstOffSplitBySubstring(lastScriptUri, "readingBookmarklet.js");

        function getLastScriptUri() {
            var scripts = document.querySelectorAll("script"),
                lastScriptUri,
                idx;

            for (idx = scripts.length; idx > 0 && !lastScriptUri; --idx) {
                if (scripts[idx - 1].src.length > 0) {
                    lastScriptUri = scripts[idx - 1].src;
                }
            }
            return lastScriptUri;
        }

        function getFirstOffSplitBySubstring(fullString, searchString) {
            var found = fullString.indexOf(searchString);
            return found == -1 ? fullString : fullString.substr(0, found);
        }

        function scriptError() {
            console.error("Error loading script: " + this.getAttribute("src"));
            loadNextScript();
        }

        function scriptLoaded() {
            loadNextScript();
        }

        function loadNextScript() {
            var script,
                uri;
            
            if (uris.length > 0) {
                script = document.createElement("script"),
                uri = uris.splice(0, 1)[0];

                script.setAttribute("src", baseUri + uri);
                script.setAttribute("type", "text/javascript");
                script.addEventListener("load", scriptLoaded);
                script.addEventListener("error", scriptError);
                document.head.appendChild(script);
            }
            else {
                callback();
            }
        }
        loadNextScript();
    }

    if (typeof window.setImmediate === "undefined") {
        window.setImmediate = function (callback) {
            window.setTimeout(callback, 0);
        };
    }

    loadRequiredScripts([
    ], initialize);
})();
