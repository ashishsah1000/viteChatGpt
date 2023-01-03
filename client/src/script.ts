import "./style.css";
import typescriptLogo from "../src/typescript.svg";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const form = document.querySelector("form");
const chatcontainer = document.querySelector("#chat_container");

let loadInterval: any;

function loader(element: any) {
  console.log(element);
  element.innerHTML = "";
  loadInterval = setInterval(() => {
    element.innerHTML += ".";
    console.log("load interval is runnning ");
    if (element.innerHTML == "....") {
      element.innerHTML = "";
    }
  }, 300);
}

function typeText(element: any, text: string) {
  console.log("activated with string", text, element);
  let index = 0;
  console.log(text.length);
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 50);
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexaDecimalString}`;
}

function chatStripe(isAi: any, value: any, uniqueId: any) {
  return `
    <div class="wrapper ${isAi && "ai"}">
        <code>
      <div class="chat">
  

        <div class="profile">
        <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />

        </div>
        <div class="message" id=${uniqueId}>${value}</div>

      </div>
            </code>
    </div>
    `;
}

const handleSubmit = async (e: any) => {
  e.preventDefault();

  const data = new FormData(form!);
  chatcontainer!.innerHTML += chatStripe(
    false,
    data.get("prompt"),
    Math.random().toString(16)
  );
  form?.reset();

  const uniqueId = generateUniqueId();
  chatcontainer!.innerHTML += chatStripe(true, "", uniqueId);

  chatcontainer?.scrollTop != chatcontainer?.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);
  // fetch data from server
  console.log("Calling fetch");
  const response = await fetch("http://localhost:3001", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });
  clearInterval(loadInterval);
  messageDiv!.innerHTML = "";
  if (response!.ok) {
    const data = await response.json();
    console.log(data);
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv!.innerHTML = "something went wrong";
  }
};

form?.addEventListener("submit", handleSubmit);
form?.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
