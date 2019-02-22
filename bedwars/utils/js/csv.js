function makeCsv(obj, mode = 0) {

    var fields = Object.keys(obj[Object.keys(obj)[0]])
    var values = Object.values(obj)
    var csv = values.map(row => fields.map(fieldName => JSON.stringify(row[fieldName])).join(','))
    if(mode == 1) {
        fields = ["Place", "Name", "Points", "Kills", "Deaths", "Victories", "Played", "Beds", "Teams"]
    }
    else if(mode == 2) {
        fields = ["Name", "Points", "Kills", "Deaths", "Victories", "Played", "Beds", "Teams", "No. Players"]
    }
    csv.unshift(fields.join(','))
    csv = csv.join('\r\n')

    download(csv, "result.csv", "text/csv")
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { 
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}