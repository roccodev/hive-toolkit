import {stats, rankColors} from "./stats.js"

var cache = {}
var cachedPlayers = [];
var selectedMode = "BED";
var done = []
var clonedDiv, cloned1, cloned2, cloned3, tableDiv, table1, table2, table3

function main() {

  var arr = document.URL.match(/player=(.+)/)
  if(arr == null) {
    document.getElementsByClassName("container")[0].innerHTML = ""
    document.getElementById("noPlayer").hidden = false
    document.getElementById("add-btn").addEventListener("click", addMore)
    document.getElementById("input-group").addEventListener("submit", searchPlayer)
    return
  }
  var playerStr = arr[1];
  var players = playerStr.indexOf('&') > -1 ? playerStr.split('&') : playerStr
  displayDOM(players, "BED")

}

$('#selector button').click(function() {

  $(this).addClass('active').siblings().removeClass('active');
  selectedMode = $(this).context.id
  done = []
  clonedDiv = null
  var cont = document.getElementById("table-container")
  var children = cont
  var elements = cont.getElementsByClassName("other");
  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }

  displayDOM(cachedPlayers, $(this).context.id)


});

function searchPlayer(event) {
  event.preventDefault()
  if(event.explicitOriginalTarget.type !== "submit") return false
  console.log(event);
  var players = event.target.querySelectorAll("input")
  console.log(players);
  var str = ""
  players.forEach(function(it) {
    str += it.value + "&"
  })

  window.location.replace("?player=" + str.substring(0, str.length - 1))
  return false
}

function addMore() {
  var newDiv = document.createElement("div")
  newDiv.className = "form-group"
  var newInput = document.createElement("input")
  newInput.setAttribute('type', 'text')
  newInput.className = "form-control"
  newInput.placeholder = "Player or UUID..."

  newDiv.appendChild(newInput)
  var list = document.getElementById("input-group")
  list.insertBefore(newDiv, list.childNodes[2])
}

function displayDOM(playersRaw, mode) {

  var players = typeof(playersRaw) === "string" ? [playersRaw] : playersRaw

  var counter = 0;
  table1 = null
  table2 = null
  table3 = null



  var container = document.getElementById("table-container")
  if(players.length != 1)  {
    container.className = "row"
    var cached = document.getElementById("cached")
    container.parentNode.insertBefore(cached, container.parentNode.childNodes[2])
  }
  for(var key in players) {
    var player = players[key]
    if(cachedPlayers.indexOf(player) == -1)
    cachedPlayers.push(player)

    if(done.indexOf(player) != -1) {
      counter++
      continue
    }
    if(!cache[player] || !(cache[player][mode])) {

      loadStats(player, mode, players)
      return
    }
    if(selectedMode !== mode) return


    var res = cache[player][mode]

    if(res.code) {
      counter++
      continue
    }



    if(counter == 0 && !clonedDiv || clonedDiv == null) {

      clonedDiv = document.getElementsByClassName("table-div")[0]
      cloned1 = clonedDiv.getElementsByClassName("table-stats")[0]

      cloned2 = clonedDiv.getElementsByClassName("table-more")[0]
      cloned3 = clonedDiv.getElementsByClassName("table-extra")[0]
      table1 = cloned1
      table2 = cloned2
      table3 = cloned3
      tableDiv = clonedDiv
    }
    else {

      table1 = cloned1.cloneNode(true)
      table2 = cloned2.cloneNode(true)
      table3 = cloned3.cloneNode(true)

      tableDiv = clonedDiv.cloneNode(false)

    }



    table1.querySelector(".pts").innerHTML = res.total_points.toLocaleString()
    table1.querySelector(".kills").innerHTML = res.kills.toLocaleString()
    table1.querySelector(".deaths").innerHTML = res.deaths.toLocaleString()
    table1.querySelector(".victories").innerHTML = res.victories.toLocaleString()
    table1.querySelector(".played").innerHTML = res.games_played.toLocaleString()
    table1.querySelector(".beds").innerHTML = res.beds_destroyed.toLocaleString()
    table1.querySelector(".teams").innerHTML = res.teams_eliminated.toLocaleString()
    table1.querySelector(".streak").innerHTML = res.win_streak.toLocaleString()

    table2.querySelector(".kdr").innerHTML = (res.kills / res.deaths).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})

    var wlrStr = (res.victories / (res.games_played - res.victories))
    .toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " (" + (res.victories / res.games_played * 100.0).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "%)"


    table2.querySelector(".wlr").innerHTML = wlrStr
    table2.querySelector(".ppg").innerHTML = (res.total_points / res.games_played).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    table2.querySelector(".kpg").innerHTML = (res.kills / res.games_played).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    table2.querySelector(".dpg").innerHTML = (res.deaths / res.games_played).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})

    table3.querySelector(".firstgame").innerHTML = new Date(res.firstLogin * 1000).toLocaleString()
    table3.querySelector(".lastgame").innerHTML = new Date(res.lastlogin * 1000).toLocaleString()

    if(document.URL.includes("&")) {
      var hide = document.getElementsByClassName("rank")[0]
      var rankClone = hide.cloneNode(true)
      rankClone.hidden = false
      setTitle(cache[player].BED, rankClone)
      rankClone.className += " rank"
      hide.hidden = true
      if(tableDiv.querySelector("p") == null) {
        var p = document.createElement("p")
        p.innerHTML = player
        p.className = "font-weight-bold other"

        tableDiv.insertBefore(p, tableDiv.childNodes[1])
      }

      if(tableDiv.querySelector(".rank") == null) {
        tableDiv.insertBefore(rankClone, tableDiv.childNodes[2])
        tableDiv.insertBefore(document.createElement("br"), tableDiv.childNodes[3])
        tableDiv.insertBefore(document.createElement("br"), tableDiv.childNodes[4])
      }

    }



    if(counter != 0) {

      tableDiv.appendChild(table1)
      tableDiv.appendChild(document.createElement("br"))
      tableDiv.appendChild(table2)
      tableDiv.appendChild(document.createElement("br"))
      tableDiv.appendChild(table3)
      tableDiv.className = "table-div col-sm other"
      container.appendChild(tableDiv)

    }
    counter++
    if(done.indexOf(player) == -1)
    done.push(player)
  }


  document.querySelector("#cached").innerHTML = "Data as of " + new Date(res.cached * 1000).toLocaleString()

}

function loadWithoutDisplay(player, mode) {
  stats(player, mode).then(function(res){
    cache[player][mode] = res
  })
}

function loadStats(player, mode, inputRaw) {

  stats(player, mode).then(function(res){


    if(!cache[player]) cache[player] = {}
    cache[player][mode] = res

    displayDOM(inputRaw, mode)
    var disp = inputRaw.length == 1 ? inputRaw[0] + "'s Stats" : "Stats Comparison"
    document.getElementById("title").innerHTML = disp

    if(inputRaw.length == 1)
    setTitle(res, document.getElementsByClassName("rank")[0])
  })
}

function setTitle(res, toSet) {
  var title;
  if(!res.title.startsWith("✸")) {
    title = /^(.+)\s(.+)/g.exec(res.title)[1]
    .replace(" ", "_").toLowerCase()
  } else {
    title = "zzzzzz";
  }
  if(res.title.startsWith("Sleepy ") && res.total_points > 1500) {
    title = "zzzzzz"
  }

  var classNames = "rank-outline " + rankColors[title]
  toSet.className = classNames;
  toSet.innerHTML = title === "zzzzzz" ? "✸ Zzzzzz" : res.title
}

main()
