let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");
const Api =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBDLyca5ddOQeSZxPHRtQt5JYkVrixmPD8";
let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");
  let requestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // Fixed the header here
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: user.message },
            user.file.data ? [{ inline_data: user.file }] : [],
          ],
        },
      ],
    }),
  };

  try {
    let response = await fetch(Api, requestOption);
    let data = await response.json();
    // console.log(data);

    let apiResponse = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold** markers
      .replace(/([.!?])\s+(?=[A-Z])/g, "$1<br><br>")
      // .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    text.innerHTML = apiResponse;
  } catch (error) {
    console.log(error);
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
    image.src = `image.png`;
    image.classList.remove("choose");
    user.file = {};
  }
}

function createChatBox(html, classes) {
  let div = document.createElement("dev");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function chatResponse(usermessage) {
  user.message = usermessage;
  let html = ` <img src="a1.png" alt="" id="userImage" width="10%" />
        <div class="user-chat-area">
         ${user.message}
         ${
           user.file.data
             ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`
             : ""
         }
        </div>`;
  prompt.value = "";
  let userchatbox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userchatbox);

  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });

  setTimeout(() => {
    let html = ` <img src="a2.png" alt="" id="aiImage" width="10%" />
        <div class="ai-chat-area">
      
<div class="loader">
  <div class="circle">
    <div class="dot"></div>
    <div class="outline"></div>
  </div>
  <div class="circle">
    <div class="dot"></div>
    <div class="outline"></div>
  </div>
  <div class="circle">
    <div class="dot"></div>
    <div class="outline"></div>
  </div>
  <div class="circle">
    <div class="dot"></div>
    <div class="outline"></div>
  </div>
</div>
          
        </div>`;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    chatResponse(prompt.value);
  }
});

submitbtn.addEventListener("click", () => {
  chatResponse(prompt.value);
});

imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = (e) => {
    let base64 = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64,
    };
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    image.classList.add("choose");
  };

  reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
  imagebtn.querySelector("input").click();
});
