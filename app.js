const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const apis = require("./apis.json")
const keys = require("./keys.json")
const axios = require("axios")
const { Configuration, OpenAIApi } = require("openai")
const qrcode = require('qrcode-terminal')

const retard = "JS being retarded"
const mloading = "Loading the AI. Please wait warmly."

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
})

newest_qr = ""
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr)
    qrcode.generate(qr, {small: true})
    newest_qr = qr
})

client.on('ready', () => {
    console.log('Client is ready!');
})

client.on('message', async msg => {
    // Bots
    if (msg.body.startsWith("!ping")) {
      msg.reply('pong');
    }
    else if (msg.body.startsWith("!menu")) {
      msg.reply("*Ucukertz WA bot*\n" +
      "*!ai* HuggingChat\n" +
      "*!cai* ChatGPT\n" +
      "*!yai* YouBot\n" +
      "*!img* Stable Diffusion\n" +
      "*!i.some* Something v2\n" +
      "*!i.cntr* Counterfeit\n" +
      "*!i.modi* Modern Disney\n" +
      "*!i.prot* Protogen\n" +
      "*!i.mid* OpenMidjourney\n" +
      "")
    }
    else if (msg.body.startsWith("!what")) {
      query = msg.body.replace("!what ", "")
      what(query, msg)
    }
    else if (msg.body.startsWith("!ai ")){
      query = msg.body.replace("!ai ", "")
      huggingchat(query, msg)
    }
    else if (msg.body.startsWith("!cai ")){
      query = msg.body.replace("!cai ", "")
      gpt35(query, msg)
    }
    else if (msg.body.startsWith("!yai ")){
      query = msg.body.replace("!yai ", "")
      youchat(query, msg)
    }
    else if (msg.body.startsWith("!img ")){
      query = msg.body.replace("!img ", "")
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
    else if (msg.body.startsWith("!i.mid ")){
      query = msg.body.replace("!i.mid ", "")
      midjourney(query, msg)
    }
    else if (msg.body.startsWith("/")){
      msg.reply('Nice "/"\nSend "!menu" for command list')
    }

    // Always
    fikar_hehe(msg)

    // Gacha
})

client.initialize();

function errReply(err) {
  return "Saad. API server errored --> " + err
}

function what(query, msg) {
  switch (query) {
    case "ai": msg.reply("HuggingChat, ask anything. Uses OpenAssistant as model backend. Open source ChatGPT competitor."); break;
    case "cai": msg.reply("ChatGPT GPT3.5-turbo, ask anything. Capable of receiving large input but have 2021 training cutoff."); break;
    case "yai": msg.reply("YouBot GPT4, ask anything. Capable of surfing the web (fresh info) but input limit is small and often breaks."); break;
    case "img": msg.reply("Stable Diffusion V2.1 text-to-image."); break;
    case "i.some": msg.reply("[SD] Something V2.2 text-to-image. Cutesy anime-style."); break;
    case "i.cntr": msg.reply("[SD] Counterfeit V2.5 text-to-image. Eerie(?) anime-style."); break;
    case "i.modi": msg.reply("[SD] Modern Disney Diffusion text-to-image. Disney-style."); break;
    case "i.prot": msg.reply("[SD] Protogen x3.4 text-to-image. Tuned for photorealism."); break;
    case "i.mid": msg.reply("Open source version of Midjourney V4 text-to-image."); break;
    default: msg.reply(query + ' (2)\nSend "!menu" for command list'); break;
  }
}

// OpenAI

const configuration = new Configuration({
  apiKey: keys.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function gpt35(query, msg) {
  try {
    let res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: query}],
      temperature: 0.5,
      max_tokens: 2000,
      frequency_penalty: 2,
      presence_penalty: 0.0,
    })
    ans = res.data.choices[0].message.content
    msg.reply(ans)
  } catch (err) {
    if (err) msg.reply(errReply(err)) 
    else msg.reply(errReply(retard))
  }
}

// Youchat

async function youchat(query, msg, attempt = 0) {
  let url = "https://api.betterapi.net/youchat?inputs="+query+"&key="+keys.YOUCHAT_API_KEY
  try {
    let res = await axios.get(url)
    msg.reply(res.data.generated_text)
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 5) setTimeout(async () => youchat(query, msg, attempt), 10000)
      else msg.reply(errReply(err))
      return
    }
    msg.reply(errReply(err)) 
  }
}

// HuggingChat

async function huggingchat(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: apis.HUGGING_CHAT_HOST+"/",
      data: query,
      responseType: 'arraybuffer',
      headers: {
       "x-use-cache": false,
       "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    msg.reply(res)
  } catch (err) {
    console.log(err)
    if (err.toString().includes("500")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 5) setTimeout(async () => huggingchat(query, msg, attempt), 10000)
      else msg.reply(errReply(err))
      return
    }
    msg.reply(errReply(err)) 
  }
}


// Huggingface

async function stable(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      data: {inputs: query+", "+Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
       "x-use-cache": false,
       "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    msg.reply(ans)
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => stable(query, msg, attempt), 60000)
      else msg.reply(errReply(retard))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function something(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/NoCrypt/SomethingV2_2',
      data: {inputs: query+", masterpiece, best quality, ultra-detailed, "+Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received instead of waifu. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(retard))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function counterfeit(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/gsdf/Counterfeit-V2.5',
      data: {inputs: query+", masterpiece, best quality, ultra-detailed, "+Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received instead of waifu. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(retard))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function moderndisney(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/nitrosocke/mo-di-diffusion',
      data: {inputs: query+", modern disney style, "+Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(retard))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function protogen(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/darkstorm2150/Protogen_x3.4_Official_Release',
      data: {inputs: query+", modelshoot style, analog style, mdjrny-v4 style, "+Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(retard))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function midjourney(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/prompthero/openjourney',
      data: {inputs: query+", mdjrny-v4 style, "+Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(retard))
      return
    }
    msg.reply(errReply(err)) 
  }
}

// Always

let fikar = "7102"
let hehe_curse = false
let curse
function fikar_hehe(msg) {
  if (!msg.author) return
  try {
    const regex = /h\s*e\s*h\s*e\s*/i
    if (msg.author.includes(fikar) && regex.test(msg.body)) {
      msg.reply("h3h3 or heehee 👿")
      if (hehe_curse) clearTimeout(curse)
      hehe_curse = true
      curse = setTimeout(() => {
        hehe_curse = false
      }, 60000*60*24)
    }
    if (msg.author.includes(fikar) && hehe_curse) {
      let dr_sec = Math.random()*120
      setTimeout(() => {
        msg.react("😡")
      }, dr_sec*1000)
    }
  } catch (err) {
    console.log(err)
  }
}

const express = require('express')
const app = express()

app.get('/qr', (req, res) => {
  res.send(newest_qr);
});

app.get('/alive', (req, res) => {
    res.send('GPT is alive')
})