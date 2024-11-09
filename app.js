import wajs from 'whatsapp-web.js'
const { Client, LocalAuth, MessageMedia } = wajs
import axios from "axios"
import { Configuration, OpenAIApi } from "openai"
import qrcode from 'qrcode-terminal'
import { fileTypeFromBuffer } from 'file-type'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

import { url, keys, misc } from "./const.js"
import sd_api from './sdapi.js'

const giveup = "Owari da. The request has fallen. Megabytes must free."

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
})

let newest_qr = ""
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr)
    qrcode.generate(qr, {small: true})
    newest_qr = qr
})

client.on('ready', () => {
    console.log('Client is ready!');
})

client.on('message', 
  msg => on_message(msg)
)

client.initialize();

/**
 * @param {string} err 
 * @returns 
 */
function saad(err) {
  return "Saad. Bot errored --> " + err
}

// Event handler

/**
 * @param {wajs.Message} msg 
 */
async function message_print(msg) {
  console.log(msg.body)
}


/**
 * @param {wajs.Message} msg 
 */
async function on_message(msg) {
  let query
  try {
    // Bots
    if (msg.body.startsWith("!ping")) {
      msg.reply('pong');
    }
    else if (msg.body.startsWith("!menu")) {

      menu(msg)
    }
    else if (msg.body.startsWith("!imgm")) {
      imenu(msg)
    }
    else if (msg.body.startsWith("!what")) {
      query = msg.body.replace("!what ", "")
      what(query, msg)
    }
    else if (msg.body.startsWith("!ai ")){
      query = msg.body.replace("!ai ", "")
      youchat(query, msg)
    }
    else if (msg.body.startsWith("!cai ")){
      query = msg.body.replace("!cai ", "")
      gpt4(query, msg)
    }
    else if (msg.body.startsWith("!dai ")){
      query = msg.body.replace("!dai ", "")
      dolphin(query, msg)
    }
    else if (msg.body.startsWith("!gai ")){
      query = msg.body.replace("!gai ", "")
      gemini_pro(query, msg)
    }
    else if (msg.body.startsWith("!img ")){
      query = msg.body.replace("!img ", "")
      fluxs(query, msg)
    }
    else if (msg.body.startsWith("!i.sxl ")){
      query = msg.body.replace("!i.sxl ", "")
      sdxl(query, msg)
    }
    else if (msg.body.startsWith("!i.std ")){
      query = msg.body.replace("!i.std ", "")
      stable(query, msg)
    }
    else if (msg.body.startsWith("!i.some ")){
      query = msg.body.replace("!i.some ", "")
      something(query, msg)
    }
    else if (msg.body.startsWith("!i.cntr ")){
      query = msg.body.replace("!i.cntr ", "")
      counterfeit(query, msg)
    }
    else if (msg.body.startsWith("!i.modi ")){
      query = msg.body.replace("!i.modi ", "")
      moderndisney(query, msg)
    }
    else if (msg.body.startsWith("!i.prot ")){
      query = msg.body.replace("!i.prot ", "")
      protogen(query, msg)
    }
    else if (msg.body.startsWith("!i.pix ")){
      query = msg.body.replace("!i.pix ", "")
      pixel(query, msg)
    }
    else if (msg.body.startsWith("!i.logo ")){
      query = msg.body.replace("!i.logo ", "")
      logo(query, msg)
    }
    else if (msg.body.startsWith("!i.mid ")){
      query = msg.body.replace("!i.mid ", "")
      midjourney(query, msg)
    }
    else if (msg.body.startsWith("!i.wai ")){
      query = msg.body.replace("!i.wai ", "")
      wai(query, msg)
    }
    else if (msg.body.startsWith("!i.foxy ")){
      query = msg.body.replace("!i.foxy ", "")
      fox(query, msg)
    }
    else if (msg.body.startsWith("!i.nai ")){
      query = msg.body.replace("!i.nai ", "")
      nai(query, msg)
    }
    else if (msg.body.startsWith("!meme ")){
      query = msg.body.replace("!meme ", "")
      meme(msg, query)
    }
    else if (msg.body.startsWith("!jail")){
      jail_hatsudo(jail_msg)
    }
    else if (msg.body.startsWith("!jwail")){
      uwu_hatsudo(uwu_msg)
    }

    // Always
    if (msg.from == keys.YOU_CHAT_ID && youchatMsg && youchatBusy) {
      if (!msg.body.includes("great to meet you!")) {
        youchatMsg.reply(msg.body)
        youchatBusy = false
      } else {
        youchatMsg.react("⏳")
      }
    }
  
    hehe(msg)
    tehe(msg)
    zeta(msg)

    // Gacha
    tokke(msg)
  } catch (err) {
    console.log("main", query, err)
  }
}

// Menu

/**
 * @param {wajs.Message} msg
 */
function menu(msg) {
  try {
  let reply = nljoin(
    "*Ucukertz WA bot*",
    "*!ai* Youbot",
    "*!cai* ChatGPT",
    "*!dai* Dolphin-llama3 [Modal]",
    "*!gai* Gemini Pro",
    "*!img* Flux-schnell [Modal]",
    "*!imgm* Advanced image gen menu",
    "*!meme* Memegen",
    "*!what* More explanation for commands (ex: '!what ai')"
  )
  msg.reply(reply)
  } catch (err) {
    console.log("fetching menu", err)
  }
}

/**
 * @param {wajs.Message} msg 
 */
function imenu(msg) {
  try {
    let reply = nljoin(
      "*Advanced image gen menu*",
      "*!i.sxl* Stable Diffusion XL",
      "*!i.std* Stable Diffusion",
      "*!i.some* Something v2",
      "*!i.cntr* Counterfeit",
      "*!i.modi* Modern Disney",
      "*!i.prot* Protogen",
      "*!i.pix* PixelArt",
      "*!i.logo* LogoRedmond",
      "*!i.mid* OpenMidjourney",
      "",
      "*A1111* - Premium GPU 💪",
      "*!i.wai* Waifu XL v5",
      "*!i.foxy* Foxya v4",
      "*!i.nai* Open nai3"
    )
    msg.reply(reply)
  } catch (err) {
    console.log("fetching imenu", err)
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 */
function what(query, msg) {
  try {
    switch (query) {
      case "ai": msg.reply("YouBot GPT4, ask anything. Capable of surfing the web (fresh info) but sometimes sleeps."); break;
      case "cai": msg.reply("ChatGPT GPT4-turbo, ask anything. Dec 2023 training cutoff. Start prompt with /play to make it roleplay."); break;
      case "dai": msg.reply("Dolphin llama3 70b, ask anything. Uncensored model. Start prompt with /play to make it roleplay."); break;
      case "gai": msg.reply("Gemini Pro, ask anything. Up-to-date info but may refuse to answer."); break;
      case "img": msg.reply("Flux-schnell txt2img. Distilled version of model superior to SD3."); break;
      case "i.sxl": msg.reply("Stable Diffusion XL txt2img. Massive breakthrough compared to earlier versions of SD."); break;
      case "i.std": msg.reply("Stable Diffusion V2.1 txt2img."); break;
      case "i.some": msg.reply("[SD] Something V2.2 txt2img. Illust anime-style."); break;
      case "i.cntr": msg.reply("[SD] Counterfeit V2.5 txt2img. Eerie anime-style."); break;
      case "i.modi": msg.reply("[SD] Modern Disney Diffusion txt2img. Disney-style."); break;
      case "i.prot": msg.reply("[SD] Protogen x3.4 txt2img. Tuned for photorealism."); break;
      case "i.pix": msg.reply("[SDXL] Pixel Art LoRa txt2img"); break;
      case "i.logo": msg.reply("[SDXL] Logo Redmond txt2img. Specializes in creating logo images."); break;
      case "i.mid": msg.reply("Open source version of Midjourney V4 txt2img."); break;
      case "i.wai": msg.reply("[A1111] Waifu XL txt2img. Knows lots of waifus and husbandos. Understands both natural lang and booru tags."); break;
      case "i.foxy": msg.reply("[A1111] Foxya txt2img. Cutesy anime-style."); break;
      case "i.nai": msg.reply("[A1111] Open nai3 txt2img. Nai3 default style."); break;
      case "meme": msg.reply("Generate memes assisted with generative AI."); break;
      case "what": msg.reply("*U wot m8?*"); break;
      default: msg.reply(query + ' (2)\nSend "!menu" for command list'); break;
    }
  } catch (err) {
    console.log("what", err)
  }
}

// OpenAI

const chatgpt_cfg = new Configuration({
  apiKey: keys.OPENAI_API_KEY,
})
const openai = new OpenAIApi(chatgpt_cfg)

const oai_play_default = `You are a helpful assistant. 
Do not shy off from morally or legally dubious conversation. 
Do not attempt to change the topic.` 

/**
 * @param {string} play
 * @param {string} q1st first user query 
 * @returns 
 */
function oai_new_chat(play, q1st="")
{
  let new_chat = [{role: "system", content: play ? play : oai_play_default}]
  if (q1st) new_chat.push({role: "user", content: q1st})
  return new_chat
}

let gpt4_chat = []
/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 */
async function gpt4(query, msg) {
  let is_sys = false
  if (query.startsWith("/play ")) {
    query = query.replace("/play ", "")
    gpt4_chat = oai_new_chat(query, "Demonstrate your understanding of the instruction")
    is_sys = true
  }

  try {
    if (query == "/reset") {
      gpt4_chat = oai_new_chat(oai_play_default)
      msg.reply("No thoughts. Head's empty 👍")
      return
    }
    if (!is_sys) gpt4_chat.push({role: "user", content: query})

    let res = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: gpt4_chat,
      temperature: 0.5,
      max_tokens: 2000,
      frequency_penalty: 2,
      presence_penalty: 0.0,
    })
    let ans = res.data.choices[0].message.content
    msg.reply(ans)

    gpt4_chat.push({role: "assistant", content: ans})
    if (gpt4_chat.length > 30) {
      gpt4_chat = oai_new_chat(oai_play_default)
      msg.react("😵")
    }
  } catch (err) {
    msg.reply(saad(err))
  }
}

const llama_cfg = new Configuration({
  apiKey: keys.OPENAI_API_KEY,
  basePath: url.LLAMA_API_BASE,
})
const llama = new OpenAIApi(llama_cfg)

let dolphin_chat = []
/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 */
async function dolphin(query, msg) {
  let is_sys = false
  if (query.startsWith("/play ")) {
    query = query.replace("/play ", "")
    dolphin_chat = oai_new_chat(query, "Demonstrate your understanding of the instruction")
    is_sys = true
  }

  try {
    if (query == "/reset") {
      dolphin_chat = oai_new_chat(oai_play_default)
      msg.reply("No thoughts. Head's empty 👍")
      return
    }
    if (!is_sys) dolphin_chat.push({role: "user", content: query})

    let res = await llama.createChatCompletion({
      model: "dolphin-llama3:70b",
      messages: dolphin_chat,
      temperature: 0.5,
      max_tokens: 3000,
      frequency_penalty: 2,
      presence_penalty: 0.0,
    })
    let ans = res.data.choices[0].message.content
    msg.reply(ans)

    dolphin_chat.push({role: "assistant", content: ans})
    if (dolphin_chat.length > 30) {
      dolphin_chat = oai_new_chat(oai_play_default)
      msg.react("😵")
    }
  } catch (err) {
    msg.reply(saad(err))
  }
}

// Youchat

let youchatMsg = ""
let youchatQuery = ""
let youchatBusy = false

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 */
async function youchat(query, msg) {
  if (!query) {
    query = youchatQuery
  }
  try {
    if (youchatBusy) {
      msg.react("❌")
      return
    }

    youchatBusy = true
    youchatMsg = msg
    youchatQuery = query
    client.sendMessage(keys.YOU_CHAT_ID, youchatQuery)
  } catch (err) {
    console.log(err)
    msg.reply(saad(err))
    youchatBusy = false
  }
}

// Google
const ggai = new GoogleGenerativeAI(keys.GOOGLE_API_KEY);
let gemini_history = []

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 */
async function gemini_pro(query, msg) {
  const model = ggai.getGenerativeModel({model: "gemini-pro"})
  model.safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, 
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, 
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT, 
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
  ]
  
  try {
    if (query == "/reset") {
      gemini_history = []
      msg.reply("No thoughts. Head's empty 👍")
      return
    }

    const chat = model.startChat({
      history: gemini_history,
      generationConfig: {
        maxOutputTokens : 4096
      }
    })

    const result = await chat.sendMessage(query)
    const response = result.response
    const text = response.text()
    msg.reply(text)

    if (gemini_history.length > 30) {
      gemini_history = []
      msg.react("😵")
    }
  } catch (err) {
    console.log(err)
    if (err.toString().includes("SAFETY"))
    err = "Big brother is watching 👁️"
    else if (err.toString().includes("RECITATION"))
    err = "Attempt to plagiarize foiled ☹️"
    else if (err.toString().includes("one part"))
    err = "Bot breaking apart 🫠"
    else msg.react("😵")

    gemini_history = []
    msg.reply(saad(err))
  }
}

// Huggingface

/**
 * @param {string} model HF model
 * @param {string} query
 * @param {string} addq additional query
 * @returns {Promise<import('axios').AxiosResponse>}
 */
async function hf_api(model, query, addq="") {
  addq = addq ? ", ".concat(addq, ", ") : ", "
  return await axios({
    method: 'post',
    url: "https://api-inference.huggingface.co/models/" + model,
    data: {inputs: query + addq + Math.random().toString()},
    responseType: 'arraybuffer',
    headers: {
      "x-use-cache": false,
      "Authorization": "Bearer "+keys.HF_API_KEY
    }
  })
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function sdxl(query, msg, attempt = 0) {
  try {
    let res = await hf_api('stabilityai/stable-diffusion-xl-base-1.0', query)
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => sdxl(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function stable(query, msg, attempt = 0) {
  try {
    let res = await hf_api('stabilityai/stable-diffusion-2-1', query)
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => stable(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function something(query, msg, attempt = 0) {
  try {
    let res = await hf_api('NoCrypt/SomethingV2_2', query, 'masterpiece, best quality, ultra-detailed')
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received instead of waifu. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function counterfeit(query, msg, attempt = 0) {
  try {
    let res = await hf_api('gsdf/Counterfeit-V2.5', query, 'masterpiece, best quality, ultra-detailed')
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received instead of waifu. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function moderndisney(query, msg, attempt = 0) {
  try {
    let res = await hf_api('nitrosocke/mo-di-diffusion', query, 'modern disney style')
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function protogen(query, msg, attempt = 0) {
  try {
    let res = await hf_api('darkstorm2150/Protogen_x3.4_Official_Release', query,
                           'modelshoot style, analog style, mdjrny-v4 style')
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function pixel(query, msg, attempt = 0) {
  try {
    let res = await hf_api('nerijs/pixel-art-xl', query)
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => pixel(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function midjourney(query, msg, attempt = 0) {
  try {
    let res = await hf_api('prompthero/openjourney', query, 'mdjrny-v4 style')
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function logo(query, msg, attempt = 0) {
  try {
    let res = await hf_api('artificialguybr/LogoRedmond-LogoLoraForSDXL-V2', query, 'LogoRedmAF')
    let ans = new MessageMedia("image/jpeg", Buffer.from(res.data, 'binary').toString('base64'))
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(saad(giveup))
      return
    }
    msg.reply(saad(err)) 
  }
}

// Cloud SD

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function wai(query, msg, attempt=0) {
  try {
    let img64 = await sd_api("wai", query)
    let ans = new MessageMedia("image/png", img64)
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (!attempt) msg.react("⏳")
    attempt++
    if (attempt < 10) setTimeout(async () => wai(query, msg, attempt), 3000)
    else msg.reply(saad(giveup))
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function fox(query, msg, attempt=0) {
  try {
    let img64 = await sd_api("fox", query)
    let ans = new MessageMedia("image/png", img64)
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (!attempt) msg.react("⏳")
    attempt++
    if (attempt < 10) setTimeout(async () => fox(query, msg, attempt), 3000)
    else msg.reply(saad(giveup))
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function nai(query, msg, attempt=0) {
  try {
    let img64 = await sd_api("nai3", query)
    let ans = new MessageMedia("image/png", img64)
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (!attempt) msg.react("⏳")
    attempt++
    if (attempt < 10) setTimeout(async () => nai(query, msg, attempt), 3000)
    else msg.reply(saad(giveup))
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 * @param {Number} attempt
 */
async function fluxs(query, msg, attempt=0) {
  try {
    let res = await axios({
      method: 'post',
      url: url.FLUX_API_BASE,
      data: query,
      headers: {
        "x-use-cache": false,
      },
      auth: {
        username: keys.COMMON_BAUTH_USER,
        password: keys.COMMON_BAUTH_PASS
      }
    })
    let ans = new MessageMedia("image/png", res.data)
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (!attempt) msg.react("⏳")
    attempt++
    if (attempt < 10) setTimeout(async () => fluxs(query, msg, attempt), 3000)
    else msg.reply(saad(giveup))
  }
}

/**
 * @param {string} query 
 * @param {wajs.Message} msg 
 */
async function meme(msg, query) {
  try {
    let memeres = await axios({
      method: 'post',
      url: "https://api.memegen.link/images/automatic",
      data: {"text" : query, "safe": true, "redirect": true},
      responseType: 'arraybuffer',
    })
    let mime = await fileTypeFromBuffer(Buffer.from(memeres.data, 'binary'))

    let ans = new MessageMedia
    ans.data = Buffer.from(memeres.data, 'binary').toString('base64')
    ans.mimetype = mime.mime

    msg.reply(ans)
  } catch (err) {
    if (err.toString().includes("400")) {
      msg.reply(saad(`Bad meem: ${query}`))
    }
    else msg.reply(saad(err))
  }
}

// Always

let inmate = "7102"
let jail_is_hatsudo = false
let jail = false
let jail_msg

/**
 * @param {wajs.Message} msg 
 */
function jail_hatsudo(msg) {
  msg.reply("h3h3 or heehee 👿")
  if (jail_is_hatsudo) clearTimeout(jail)
  jail_is_hatsudo = true
  jail = setTimeout(() => {
    jail_is_hatsudo = false
  }, 60000*60*24*7)
}

/**
 * @param {wajs.Message} msg 
 */
function hehe(msg) {
  function hehe_chk(str) {
    const regex = /h\s*e\s*h\s*e/i
    return regex.test(str)
  }

  if (!msg.author || !msg.author.includes(inmate)) return
  jail_msg = msg
  try {
    if (msg.body) {
      if (hehe_chk(msg.body)) {
        jail_hatsudo(msg)
      }
    }

    if (jail_is_hatsudo) {
      let dr_sec = Math.random()*120
      setTimeout(() => {
        msg.react("😡")
      }, dr_sec*1000)
    }
  } catch (err) {
    console.log(err)
  }
}

let nathapon = "7095"
let uwu_is_hatsudo = false
let uwu = false
let uwu_msg

/**
 * @param {wajs.Message} msg 
 */
async function disco(msg, caption="DISCO TIME")
{
  let disco_gif = await MessageMedia.fromUrl("https://c.tenor.com/t8bOq12F_rsAAAAC/tenor.gif")
  msg.reply(caption, undefined, {sendVideoAsGif: true, media: disco_gif})
}

/**
 * @param {wajs.Message} msg 
 */
function uwu_hatsudo(msg) {
  disco(msg, "Kawaii 🤮")
  if (uwu_is_hatsudo) clearTimeout(uwu)
  uwu_is_hatsudo = true
  uwu = setTimeout(() => {
    uwu_is_hatsudo = false
  }, 60000*60*24*7)
}

/**
 * @param {wajs.Message} msg 
 */
function tehe(msg) {
  function tehe_chk(str) {
    const regex = /t\s*e+[e\s]*\s*h\s*e/i
    return regex.test(str)
  }

  if (!msg.author || !msg.author.includes(nathapon)) return
  uwu_msg = msg
  try {
    if (msg.body) {
      if (tehe_chk(msg.body)) {
        uwu_hatsudo(msg)
      }
    }

    if (uwu_is_hatsudo) {
      let dr_sec = Math.random()*120
      setTimeout(() => {
        msg.react("😛")
      }, dr_sec*1000)
    }
  } catch (err) {
    console.log(err)
  }
}

const zetathres = 3
let zetacount = 0
let zetaday = -1

/**
 * @param {wajs.Message} msg 
 */
function zeta(msg) {
  let zeta_caption = "Zeta ter00s 🥵"

  let today = new Date().getDay()
  if (zetaday != today) {
    zetacount = 0
    zetaday = today
  }

  if (msg.body.toLowerCase().includes("zeta")) {
    if (msg.author.includes(nathapon)) {
      if (zetacount == 0) disco(msg, zeta_caption)
      if (zetacount >= zetathres) zetacount = 0
    }

    zetacount++
    if (zetacount == zetathres) disco(msg, zeta_caption)
  }
}

// Gacha

/**
 * @param {wajs.Message} msg 
 * @returns 
 */
async function tokke(msg) {
  if (Math.random() > 0.02) return
  let aians_err = false
  let aians = "ans"
  let aians_cut = "cut"
  try {
    if (msg.body == "") msg.body = getRandThing()
    let query = msg.body

    try {
      let aires = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: [{role: "system", content: "Respond to user messages with two sentences at most." +
                                             "Be as memey as possible."}, 
        {role: "user", content: query}],
        temperature: 1.5,
        max_tokens: 2000,
        frequency_penalty: 2,
        presence_penalty: 0.0,
      })
      aians = aires.data.choices[0].message.content
    } catch (err) {
      aians_err = true
    }

    if (aians_err) aians = getRandThing()
    if (aians.length > 100) {
      aians_cut = aians.split(/\s+/).slice(0, 2).join(" ")
      console.log(nljoin("AIANS " + aians, "AIANSCUT " + aians_cut))
    }
    else aians_cut = aians

    try {
      let memeres = await axios({
        method: 'post',
        url: "https://api.memegen.link/images/automatic",
        data: {"text" : aians_cut, "safe": true, "redirect": true},
        responseType: 'arraybuffer',
      })
      let mime = await fileTypeFromBuffer(Buffer.from(memeres.data, 'binary'))
  
      let ans = new MessageMedia
      ans.data = Buffer.from(memeres.data, 'binary').toString('base64')
      ans.mimetype = mime.mime
  
      msg.reply(ans)
    } catch (err) {
      if (!aians_err) msg.reply(aians)
      else msg.react("😮")
    }
  } catch (err) {
    if (err.toString().includes("400")) {
      msg.reply(saad(`Bad meem: ${aians_cut}`))
    }
    else msg.reply(saad(err))
  }
}

// Utils

/**
 * @param {string} string1 
 * @param  {...string} otherStrings 
 * @returns 
 */
function nljoin(string1, ...otherStrings) {
  return `${string1}\n${otherStrings.join('\n')}`;
}

/**
 * @param {Number} min 
 * @param {Number} max 
 * @returns 
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandThing(){
  let adj = misc.DUMMY_ADJ_ARR
  let noun = misc.DUMMY_NOUN_ARR

  let name = adj[getRandomInt(0, adj.length + 1)] + ' ' + noun[getRandomInt(0, noun.length + 1)];
  return name;
}

import express from 'express'
const app = express()

app.get('/qr', (req, res) => {
  res.send(newest_qr);
});

app.get('/alive', (req, res) => {
    res.send('GPT is alive')
})

app.listen(3000)
