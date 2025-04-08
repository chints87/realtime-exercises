const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  // post to /poll a new message
  const data = {
    user,
    text
  }

  

  const res = await fetch("/poll", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const json = await res.json()
}

async function getNewMsgs() {
  // poll the server
  let json
  try{
    const res = await fetch("/poll");
    json = await res.json()

  } catch(e){
    console.log('error',e)
  }

  allChat = json.msg
  console.log(allChat)
  render()
  // For no pause
  // setTimeout(getNewMsgs, INTERVAL)
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// // make the first request for no-pause
// getNewMsgs();

// pause-on-unfocus

let timeToNextRequest = 0;

// The time variable value is provided by the requestAnimationFrame
async function rafTimer(time){
  if(timeToNextRequest <= time){
    await getNewMsgs();
    // The longer the time it takes to receive the message
    // the longer the timeToNextRequest
    timeToNextRequest = time + INTERVAL
  }
  
  // The function raftTimer runs on the main thread
  // so keep it light
  requestAnimationFrame(rafTimer)
}

//First call to raftTimer
requestAnimationFrame(rafTimer)

