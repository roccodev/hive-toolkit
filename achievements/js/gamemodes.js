const URL = "https://api.hivemc.com/v1/game/"

function gamemodes() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", URL);
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

export {gamemodes}
