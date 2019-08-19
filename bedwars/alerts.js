let domAlert = document.getElementById("bed-alert")
const url = "https://rocco.dev/archive/bedwars/alerts.json"

var xhr = new XMLHttpRequest()
xhr.onload = function (e) {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText)
            if (!json || !json.length || json.length == 0) {
                return
            }
            domAlert.hidden = false
            let latest = json[0]
            let text = latest.text
            let link = latest.link

            domAlert.innerHTML = text
            domAlert.innerHTML += '<br><a href="' + link + '">Read more</a>'
        }
    }
}
xhr.open("GET", url, true)
xhr.send(null)