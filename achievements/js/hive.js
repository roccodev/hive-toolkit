const baseUrl = "https://api.hivemc.com/v1/player/"


function global(player) {
  var url = baseUrl + player
  return makePromise(url)
}

function specific(player, game) {
  var url = baseUrl + player + "/" + game
  return makePromise(url)
}

function data() {
  var url = "https://api.hivemc.com/v1/server/achievements"
  return makePromiseData(url)
}

function dataSpecific(game) {
  var url = "https://api.hivemc.com/v1/game/" + game
  return makePromise(url)
}

function makePromiseData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function makePromise(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(JSON.parse(xhr.response).achievements);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

export {global, specific, data, dataSpecific}
