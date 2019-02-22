const baseUrl = "https://api.hivemc.com/v1/player/"

const rankColors = {

  sleepy: "gray",
  snoozer: "blue",
  drowsy: "yellow",
  sloth: "gold",
  hypnotist: "lightpurple",
  siesta: "green",
  dreamer: "aqua",
  sleep_walker: "red",
  hibernator: "darkaqua",
  bed_head: "yellow",
  panda: "purple",
  insomniac: "blue",
  well_rested: "green",
  koala: "darkaqua bold",
  day_dreamer: "lightpurple bold",
  power_nap: "gold bold",
  bear: "aqua bold",
  bed_warrior: "darkred bold",
  snorlax: "darkaqua bold",
  sandman: "yellow bold",
  lullaby: "lightpurple bold",
  bed_bug: "green bold",
  sleeping_lion: "gold bold",
  tranquilised: "aqua bold",
  sleepless: "purple bold",
  dream_catcher: "lightpurple bold italic",
  morpheus: "blue bold italic",
  sleeping_beauty: "green bold italic",
  eternal_rest: "gray bold italic",
  nightmare: "red bold italic",
  lastNightmare: "red bold italic underline",
  zzzzzz: "white bold"

}


function ranks() {
  var url = "https://api.hivemc.com/v1/game/BED/titles"


  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}


function maps() {
  var url = "https://api.hivemc.com/v1/game/BED/maps"


  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}



function stats(player, mode) {
  var url = baseUrl + player + "/" + mode


  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

export {stats, rankColors, ranks, maps}
