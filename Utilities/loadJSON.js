function loadJSON (json, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', json + '.json', true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState== 4 && xobj.status == "200") {
            
               callback(xobj.responseText);
            }
    };
        xobj.send(null);
    }

    export {loadJSON};