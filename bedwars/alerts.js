let domAlert = document.getElementById("bed-alert")
const url = "https://rocco.dev/archive/bedwars/alerts.json"
const options = {
    method: 'GET',
    cache: 'default',
    headers: {
        'Content-Type': 'application/json'
    }
}

fetch(url, options).then(res => {
    return res.json()
}).then(json => {
    if (!json || !json.length || json.length == 0) {
        return
    }
    domAlert.hidden = false
    let latest = json[0]
    let text = latest.text
    let link = latest.link

    domAlert.innerHTML = text
    domAlert.innerHTML += '<br><a href="' + link + '">Read more</a>'
})