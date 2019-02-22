import {gamemodes} from './gamemodes.js'
import {global, specific, data, dataSpecific} from './hive.js'

var modes = {}
var achievements = {}
var achievementsData = {}

var args = document.URL.match(/player=(.+)/)

var player;

async function main() {

  var loader = document.getElementById("loader")

  if(args == null || args.length < 2) {
    console.log("No player specified. Aborting.")
    loader.innerHTML = "Welcome to the Achievements Viewer. Enter a player on the top right corner to view their achievements."
    return;
  }
  else {
    player = args[1]
  }
  console.log("Fetching gamemodes...")

  modes.global = "Global Achievements"
  await gamemodes().then(function(data) {
    Object.assign(modes, data)
  })

  console.log("Fetched gamemodes " + s(modes))

  console.log("Injecting gamemodes into DOM...")

  console.log("Loading global achievements...")

  await global(player).then(function(data) {
    achievements.global = data
  })

  console.log("Loading global achievement data...")
  await data().then(function(d) {
    achievementsData.global = d
  })
  var clone = achievementsData.global.slice(0)
  if(achievements.global) {
    for(var i2 in clone) {
      if(!(clone[i2].name in achievements.global)) {
        achievements.global[clone[i2].name] =  {
          progress: 0,
          unlockedAt: 0
        }
      }
    }
  }



  var tracker = 0;
  var trackingSize = Object.keys(modes).length
  for(var i in modes) {
    if(i === "global") continue;
    console.log("Loading data for mode " + i)
    loader.innerHTML = "Loading stuff, please wait... (" + Math.round((++tracker * 100 / trackingSize)) + "%)"
    await specific(player, i).then(function(data) {
      console.log(data)
      achievements[i] = data
    })
    await dataSpecific(i).then(function(data) {
      achievementsData[i] = data
    })
    var clone = achievementsData[i].slice(0)
    if(achievements[i]) {
      for(var i2 in clone) {
        if(!(clone[i2].name in achievements[i])) {
          achievements[i][clone[i2].name] =  {
            progress: 0,
            unlockedAt: 0
          }
        }
      }
    }
  }

  console.log("Fetched achievements " + s(achievements))
  console.log("Fetched achievement data " + s(achievementsData))

  console.log("Injecting achievements + data into DOM...")
  var body = document.getElementsByClassName("container-fluid")[1]
  for(var i in modes) {
    if(!achievements[i]) continue;
    var div = document.createElement("DIV")
    var e = document.createElement("H2")
    div.id = i
    div.className = "panel-group"

    var div2 = document.createElement("DIV")
    div2.className = "panel panel-default"

    var div3 = document.createElement("DIV")
    div3.className = "panel-heading"

    var h4 = document.createElement("H4")
    h4.className = "panel-title"
    h4.innerHTML = '<a data-toggle="collapse" data-parent="#' + i + '" href="#collapse-' + i + '"">' + modes[i] + '</a>'


    div3.appendChild(h4)
    div2.appendChild(div3)
    div.appendChild(div2)

    body.appendChild(div)
  }


  loader.innerHTML = "Now viewing " + player + "'s achievements. Click on a panel to expand/collapse it."

  injectIntoDOM(achievements.global, achievementsData.global, "global")

  for(var i in modes) {
    if(i === "global") continue;
    console.log("Parsing mode " + i)
    if(achievements[i]) {
      injectIntoDOM(achievements[i], achievementsData[i], i)
    }

  }



}

function configureForm() {
  var pl = document.forms["searchPlayer"]["player"].value;
  window.location.replace("?player=" + pl)

}


function injectIntoDOM(achievements, data, game) {

  var globalElement = document.getElementById(game)

  var pLp = document.createElement("DIV")
  pLp.className = "panel-collapse collapse"
  pLp.id="collapse-" + game

  var panelList = document.createElement("DIV")
  panelList.className = "panel-body"

  var list = document.createElement("TABLE")
  list.className = "table table-striped"


  var thead = document.createElement("THEAD")
  thead.innerHTML = '<th>Title</th><th>Description</th><th>Unlocked at</th><th>Progress</th>'

  var tbody = document.createElement("TBODY")
  var unlocked = 0;
  var inProgress = 0;
  var unstarted = 0;
  for(var i in achievements) {
    if(i === "version") continue;
    var obj = getByName(i, data)
    if(obj == null) {
      obj = {
        publicname: i,
        description: "Unknown description. Probably a map achievement?"
      }
    }
    var ach = achievements[i]

    var e1 = document.createElement("TR")


    var e2 = document.createElement("TD")
    e2.innerHTML = obj.publicname

    var e3 = document.createElement("TD")
    e3.innerHTML = obj.description

    var e4 = document.createElement("TD")
    e4.innerHTML = (ach.unlockedAt === 0 ? "-" : new Date(ach.unlockedAt * 1000).toLocaleString())

    var td5 = document.createElement("TD")

    var e5 = document.createElement("SPAN")
    if(ach.unlockedAt == 0 && ach.progress == 0) {
      e5.className = "label label-default"
      e5.innerHTML = "Not Started"
    }
    else if(ach.unlockedAt == 0) {
      e5.className = "label label-primary"
      e5.innerHTML = ach.progress + " / " + obj.stages
      inProgress++
    }
    else {
      e5.className = "label label-success"
      e5.innerHTML = "Unlocked"
      unlocked++
    }


    td5.appendChild(e5)






    e1.appendChild(e2)
    e1.appendChild(e3)
    e1.appendChild(e4)
    e1.appendChild(td5)

    tbody.appendChild(e1)
  }

  list.appendChild(thead)
  list.appendChild(tbody)
  panelList.innerHTML = "Unlocked: " + unlocked + " / In Progress: " + inProgress + " (Total: " + data.length +")"
  panelList.appendChild(list)
  pLp.appendChild(panelList)
  globalElement.appendChild(pLp)
}

main()

function getByName(name, array) {
  for(var i in array) {
    if(array[i].name === name) {
      return array[i]
    }
  }
  return null
}

function s(json) {
  return JSON.stringify(json)
}
