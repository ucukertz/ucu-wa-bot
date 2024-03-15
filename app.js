import wajs from 'whatsapp-web.js'
const { Client, LocalAuth, MessageMedia } = wajs
import keys from "./keys.js"
import axios from "axios"
import { Configuration, OpenAIApi } from "openai"
import qrcode from 'qrcode-terminal'
import { fileTypeFromBuffer } from 'file-type'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

client.on('message', async msg => {
    let query
    // Bots
    if (msg.body.startsWith("!ping")) {
      msg.reply('pong');
    }
    else if (msg.body.startsWith("!menu")) {
      msg.reply("*Ucukertz WA bot*\n" +
      "*!ai* Youbot\n" +
      "*!cai* ChatGPT\n" +
      "*!gai* Gemini Pro\n" +
      "*!img* Stable Diffusion XL\n" +
      "*!imgm* Stable Diffusion XLM\n" +
      "*!i.std* Stable Diffusion\n" +
      "*!i.some* Something v2\n" +
      "*!i.cntr* Counterfeit\n" +
      "*!i.modi* Modern Disney\n" +
      "*!i.prot* Protogen\n" +
      "*!i.pix* PixelArt\n" +
      "*!i.logo* LogoRedmond\n" +
      "*!i.mid* OpenMidjourney\n" +
      "*!meme* Memegen\n" +
      "*!what* More explanation for above commands (ex: '!what ai')\n" +
      "")
    }
    else if (msg.body.startsWith("!what")) {
      query = msg.body.replace("!what ", "")
      what(query, msg)
    }
    else if (msg.body.startsWith("!ai ")){
      query = msg.body.replace("!ai ", "")
      youchat(query, msg)
    }
    else if (msg.body.startsWith("!gai ")){
      query = msg.body.replace("!gai ", "")
      gemini_pro(query, msg)
    }
    else if (msg.body.startsWith("!cai ")){
      query = msg.body.replace("!cai ", "")
      gpt35(query, msg)
    }
    else if (msg.body.startsWith("!img ")){
      query = msg.body.replace("!img ", "")
      sdxl(query, msg)
    }
    else if (msg.body.startsWith("!imgm ")){
      query = msg.body.replace("!imgm ", "")
      sdxlm(query, msg)
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
    else if (msg.body.startsWith("!meme ")){
      query = msg.body.replace("!meme ", "")
      meme(msg, query)
    }

    // Always
    if (msg.body.includes("📚") && msg.body.includes("Sources"))
    youchatId = msg.from
    if (msg.from == youchatId && youchatBusy) {
      if (!msg.body.includes("great to meet you!")) {
        youchatMsg.reply(msg.body)
        youchatBusy = false
      } else {
        youchatMsg.react("⏳")
        youchatBusy = false
        youchat("", youchatMsg)
      }
    }

    fkr_hehe(msg)

    // Gacha
    tokke(msg)
})

client.initialize();

function errReply(err) {
  return "Saad. Bot errored --> " + err
}

function what(query, msg) {
  switch (query) {
    case "ai": msg.reply("YouBot GPT4, ask anything. Capable of surfing the web (fresh info) but sometimes sleeps."); break;
    case "cai": msg.reply("ChatGPT GPT3.5-turbo, ask anything. Large input but have Jan 2022 training cutoff. Doesn't remember convo."); break;
    case "gai": msg.reply("Gemini Pro, ask anything. Up-to-date info but may refuse to answer."); break;
    case "img": msg.reply("Stable Diffusion XL txt2img. Massive breakthrough compared to earlier versions of SD."); break;
    case "imgm": msg.reply("Stable Diffusion XL txt2img. More sampling steps compared to !img, slower but much better."); break;
    case "i.std": msg.reply("Stable Diffusion V2.1 txt2img."); break;
    case "i.some": msg.reply("[SD] Something V2.2 txt2img. Cutesy anime-style."); break;
    case "i.cntr": msg.reply("[SD] Counterfeit V2.5 txt2img. Eerie(?) anime-style."); break;
    case "i.modi": msg.reply("[SD] Modern Disney Diffusion txt2img. Disney-style."); break;
    case "i.prot": msg.reply("[SD] Protogen x3.4 txt2img. Tuned for photorealism."); break;
    case "i.pix": msg.reply("[SDXL] Pixel Art LoRa txt2img"); break;
    case "i.logo": msg.reply("[SDXL] Logo Redmond. Specializes in creating logo images."); break;
    case "i.mid": msg.reply("Open source version of Midjourney V4 txt2img."); break;
    case "meme": msg.reply("Generate memes assisted with generative AI."); break;
    case "what": msg.reply("*U wot m8?*"); break;
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
    let ans = res.data.choices[0].message.content
    msg.reply(ans)
  } catch (err) {
    msg.reply(errReply(err))
  }
}

// Youchat

let youchatId = ""
let youchatMsg = ""
let youchatQuery = ""
let youchatBusy = false
async function youchat(query, msg) {
  if (!query) {
    query = youchatQuery
  }
  try {
    if (youchatId == "") {
      msg.reply(errReply("Youbot is sleeping 💤"))
      return
    }
    if (youchatBusy) {
      msg.react("❌")
      return
    }

    youchatBusy = true
    youchatMsg = msg
    youchatQuery = query
    client.sendMessage(youchatId, youchatQuery)
  } catch (err) {
    console.log(err)
    msg.reply(errReply(err))
    youchatBusy = false
  }
}

// Google
const ggai = new GoogleGenerativeAI(keys.GOOGLE_API_KEY);
let gemini_history = []
async function gemini_pro(query, msg) {
  const model = ggai.getGenerativeModel({model: "gemini-pro"})
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
    err = "Big brother is watching"

    gemini_history = []
    msg.react("😵")
    msg.reply(errReply(err))
  }
}

// Huggingface

async function sdxl(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      data: {inputs: query+", " + Math.random().toString()},
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
      if (attempt < 10) setTimeout(async () => sdxl(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function sdxlm(query, msg) {
  try {
    query = encodeURI(query)
    let res = await axios({
      method: 'GET',
      url: 'https://modal-labs--stable-diffusion-xl-app.modal.run/infer/' + query,
      data: {inputs: query+", " + Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
       "x-use-cache": false,
       "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/png"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    msg.reply(ans)
  } catch(err) {
    msg.reply(errReply(err))
  }
}

async function stable(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      data: {inputs: query+", " + Math.random().toString()},
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
      else msg.reply(errReply(giveup))
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
      data: {inputs: query+", masterpiece, best quality, ultra-detailed, " + Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received instead of waifu. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
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
      data: {inputs: query+", masterpiece, best quality, ultra-detailed, " + Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received instead of waifu. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
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
      data: {inputs: query+", modern disney style, " + Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
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
      data: {inputs: query+", modelshoot style, analog style, mdjrny-v4 style, " + Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function pixel(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/nerijs/pixel-art-xl',
      data: {inputs: query+", " + Math.random().toString()},
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
      if (attempt < 10) setTimeout(async () => pixel(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
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
      data: {inputs: query+", mdjrny-v4 style, " + Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
      return
    }
    msg.reply(errReply(err)) 
  }
}

async function logo(query, msg, attempt = 0) {
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/artificialguybr/LogoRedmond-LogoLoraForSDXL-V2',
      data: {inputs: "LogoRedmAF, " + query + ", " + Math.random().toString()},
      responseType: 'arraybuffer',
      headers: {
        "x-use-cache": false,
        "Authorization": "Bearer "+keys.HF_API_KEY
      }
    })
    let ans = new MessageMedia
    ans.mimetype = "image/jpeg"
    ans.data = Buffer.from(res.data, 'binary').toString('base64')
    let blacc = (ans.data.match(/KKKKACiiigAooooA/g) || []).length
    if (blacc < 170) msg.reply(ans)
    else msg.reply("Black image was received. Saad.\nBlacc: " + blacc.toString())
  } catch (err) {
    console.log(err)
    if (err.toString().includes("503")) {
      if (!attempt) msg.react("⏳")
      attempt++
      if (attempt < 10) setTimeout(async () => something(query, msg, attempt), 60000)
      else msg.reply(errReply(giveup))
      return
    }
    msg.reply(errReply(err)) 
  }
}

// Always

let fkr = "7102"
let hehe_curse = false
let curse
function fkr_hehe(msg) {
  if (!msg.author) return
  try {
    const regex = /h\s*e\s*h\s*e\s*/i
    if (msg.author.includes(fkr) && regex.test(msg.body)) {
      msg.reply("h3h3 or heehee 👿")
      if (hehe_curse) clearTimeout(curse)
      hehe_curse = true
      curse = setTimeout(() => {
        hehe_curse = false
      }, 60000*60*24*7)
    }
    if (msg.author.includes(fkr) && hehe_curse) {
      let dr_sec = Math.random()*120
      setTimeout(() => {
        msg.react("😡")
      }, dr_sec*1000)
    }
  } catch (err) {
    console.log(err)
  }
}

async function meme(msg, query) {
  try {
    let memereq = {
      "text" : query,
      "safe": true,
      "redirect": true
    }

    let memeres = await axios({
      method: 'post',
      url: "https://api.memegen.link/images/automatic",
      data: JSON.stringify(memereq),
      responseType: 'arraybuffer',
    })
    let mime = await fileTypeFromBuffer(Buffer.from(memeres.data, 'binary'))

    let ans = new MessageMedia
    ans.data = Buffer.from(memeres.data, 'binary').toString('base64')
    ans.mimetype = mime.mime

    msg.reply(ans)
  } catch (err) {
    if (err.toString().includes("400")) {
      msg.reply(errReply(`Bad meem: ${query}`))
    }
    else msg.reply(errReply(err))
  }
}

// Gacha

async function tokke(msg) {
  if (Math.random() > 0.02) return
  let aians = "none"
  try {
    if (msg.body == "") msg.body = getRandThing()
    let query = msg.body
    let aires = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "system", content: "Respond to user messages with two sentences at most." +
                                           "Be as memey as possible."}, 
      {role: "user", content: query}],
      temperature: 1.5,
      max_tokens: 2000,
      frequency_penalty: 2,
      presence_penalty: 0.0,
    })
    aians = aires.data.choices[0].message.content

    if (aians.length > 100)
    aians = aians.split(/\s+/).slice(0, 2).join(" ")
    
    let memereq = {
      "text" : aians,
      "safe": true,
      "redirect": true
    }

    let memeres = await axios({
      method: 'post',
      url: "https://api.memegen.link/images/automatic",
      data: JSON.stringify(memereq),
      responseType: 'arraybuffer',
    })
    let mime = await fileTypeFromBuffer(Buffer.from(memeres.data, 'binary'))

    let ans = new MessageMedia
    ans.data = Buffer.from(memeres.data, 'binary').toString('base64')
    ans.mimetype = mime.mime

    msg.reply(ans)
  } catch (err) {
    if (err.toString().includes("400")) {
      msg.reply(errReply(`Bad meem: ${aians}`))
    }
    else msg.reply(errReply(err))
  }
}

// Utils

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandThing(){
  let name1 = ["abandoned","able","absolute","adorable","adventurous","academic","acceptable","acclaimed","accomplished","accurate","aching","acidic","acrobatic","active","actual","adept","admirable","admired","adolescent","adorable","adored","advanced","afraid","affectionate","aged","aggravating","aggressive","agile","agitated","agonizing","agreeable","ajar","alarmed","alarming","alert","alienated","alive","all","altruistic","amazing","ambitious","ample","amused","amusing","anchored","ancient","angelic","angry","anguished","animated","annual","another","antique","anxious","any","apprehensive","appropriate","apt","arctic","arid","aromatic","artistic","ashamed","assured","astonishing","athletic","attached","attentive","attractive","austere","authentic","authorized","automatic","avaricious","average","aware","awesome","awful","awkward","babyish","bad","back","baggy","bare","barren","basic","beautiful","belated","beloved","beneficial","better","best","bewitched","big","big-hearted","biodegradable","bite-sized","bitter","black","black-and-white","bland","blank","blaring","bleak","blind","blissful","blond","blue","blushing","bogus","boiling","bold","bony","boring","bossy","both","bouncy","bountiful","bowed","brave","breakable","brief","bright","brilliant","brisk","broken","bronze","brown","bruised","bubbly","bulky","bumpy","buoyant","burdensome","burly","bustling","busy","buttery","buzzing","calculating","calm","candid","canine","capital","carefree","careful","careless","caring","cautious","cavernous","celebrated","charming","cheap","cheerful","cheery","chief","chilly","chubby","circular","classic","clean","clear","clear-cut","clever","close","closed","cloudy","clueless","clumsy","cluttered","coarse","cold","colorful","colorless","colossal","comfortable","common","compassionate","competent","complete","complex","complicated","composed","concerned","concrete","confused","conscious","considerate","constant","content","conventional","cooked","cool","cooperative","coordinated","corny","corrupt","costly","courageous","courteous","crafty","crazy","creamy","creative","creepy","criminal","crisp","critical","crooked","crowded","cruel","crushing","cuddly","cultivated","cultured","cumbersome","curly","curvy","cute","cylindrical","damaged","damp","dangerous","dapper","daring","darling","dark","dazzling","dead","deadly","deafening","dear","dearest","decent","decimal","decisive","deep","defenseless","defensive","defiant","deficient","definite","definitive","delayed","delectable","delicious","delightful","delirious","demanding","dense","dental","dependable","dependent","descriptive","deserted","detailed","determined","devoted","different","difficult","digital","diligent","dim","dimpled","dimwitted","direct","disastrous","discrete","disfigured","disgusting","disloyal","dismal","distant","downright","dreary","dirty","disguised","dishonest","dismal","distant","distinct","distorted","dizzy","dopey","doting","double","downright","drab","drafty","dramatic","dreary","droopy","dry","dual","dull","dutiful","each","eager","earnest","early","easy","easy-going","ecstatic","edible","educated","elaborate","elastic","elated","elderly","electric","elegant","elementary","elliptical","embarrassed","embellished","eminent","emotional","empty","enchanted","enchanting","energetic","enlightened","enormous","enraged","entire","envious","equal","equatorial","essential","esteemed","ethical","euphoric","even","evergreen","everlasting","every","evil","exalted","excellent","exemplary","exhausted","excitable","excited","exciting","exotic","expensive","experienced","expert","extraneous","extroverted","extra-large","extra-small","fabulous","failing","faint","fair","faithful","fake","false","familiar","famous","fancy","fantastic","far","faraway","far-flung","far-off","fast","fat","fatal","fatherly","favorable","favorite","fearful","fearless","feisty","feline","female","feminine","few","fickle","filthy","fine","finished","firm","first","firsthand","fitting","fixed","flaky","flamboyant","flashy","flat","flawed","flawless","flickering","flimsy","flippant","flowery","fluffy","fluid","flustered","focused","fond","foolhardy","foolish","forceful","forked","formal","forsaken","forthright","fortunate","fragrant","frail","frank","frayed","free","French","fresh","frequent","friendly","frightened","frightening","frigid","frilly","frizzy","frivolous","front","frosty","frozen","frugal","fruitful","full","fumbling","functional","funny","fussy","fuzzy","gargantuan","gaseous","general","generous","gentle","genuine","giant","giddy","gigantic","gifted","giving","glamorous","glaring","glass","gleaming","gleeful","glistening","glittering","gloomy","glorious","glossy","glum","golden","good","good-natured","gorgeous","graceful","gracious","grand","grandiose","granular","grateful","grave","gray","great","greedy","green","gregarious","grim","grimy","gripping","grizzled","gross","grotesque","grouchy","grounded","growing","growling","grown","grubby","gruesome","grumpy","guilty","gullible","gummy","hairy","half","handmade","handsome","handy","happy","happy-go-lucky","hard","hard-to-find","harmful","harmless","harmonious","harsh","hasty","hateful","haunting","healthy","heartfelt","hearty","heavenly","heavy","hefty","helpful","helpless","hidden","hideous","high","high-level","hilarious","hoarse","hollow","homely","honest","honorable","honored","hopeful","horrible","hospitable","hot","huge","humble","humiliating","humming","humongous","hungry","hurtful","husky","icky","icy","ideal","idealistic","identical","idle","idiotic","idolized","ignorant","ill","illegal","ill-fated","ill-informed","illiterate","illustrious","imaginary","imaginative","immaculate","immaterial","immediate","immense","impassioned","impeccable","impartial","imperfect","imperturbable","impish","impolite","important","impossible","impractical","impressionable","impressive","improbable","impure","inborn","incomparable","incompatible","incomplete","inconsequential","incredible","indelible","inexperienced","indolent","infamous","infantile","infatuated","inferior","infinite","informal","innocent","insecure","insidious","insignificant","insistent","instructive","insubstantial","intelligent","intent","intentional","interesting","internal","international","intrepid","ironclad","irresponsible","irritating","itchy","jaded","jagged","jam-packed","jaunty","jealous","jittery","joint","jolly","jovial","joyful","joyous","jubilant","judicious","juicy","jumbo","junior","jumpy","juvenile","kaleidoscopic","keen","key","kind","kindhearted","kindly","klutzy","knobby","knotty","knowledgeable","knowing","known","kooky","kosher","lame","lanky","large","last","lasting","late","lavish","lawful","lazy","leading","lean","leafy","left","legal","legitimate","light","lighthearted","likable","likely","limited","limp","limping","linear","lined","liquid","little","live","lively","livid","loathsome","lone","lonely","long","long-term","loose","lopsided","lost","loud","lovable","lovely","loving","low","loyal","lucky","lumbering","luminous","lumpy","lustrous","luxurious","mad","made-up","magnificent","majestic","major","male","mammoth","married","marvelous","masculine","massive","mature","meager","mealy","mean","measly","meaty","medical","mediocre","medium","meek","mellow","melodic","memorable","menacing","merry","messy","metallic","mild","milky","mindless","miniature","minor","minty","miserable","miserly","misguided","misty","mixed","modern","modest","moist","monstrous","monthly","monumental","moral","mortified","motherly","motionless","mountainous","muddy","muffled","multicolored","mundane","murky","mushy","musty","muted","mysterious","naive","narrow","nasty","natural","naughty","nautical","near","neat","necessary","needy","negative","neglected","negligible","neighboring","nervous","new","next","nice","nifty","nimble","nippy","nocturnal","noisy","nonstop","normal","notable","noted","noteworthy","novel","noxious","numb","nutritious","nutty","obedient","obese","oblong","oily","oblong","obvious","occasional","odd","oddball","offbeat","offensive","official","old","old-fashioned","only","open","optimal","optimistic","opulent","orange","orderly","organic","ornate","ornery","ordinary","original","other","our","outlying","outgoing","outlandish","outrageous","outstanding","oval","overcooked","overdue","overjoyed","overlooked","palatable","pale","paltry","parallel","parched","partial","passionate","past","pastel","peaceful","peppery","perfect","perfumed","periodic","perky","personal","pertinent","pesky","pessimistic","petty","phony","physical","piercing","pink","pitiful","plain","plaintive","plastic","playful","pleasant","pleased","pleasing","plump","plush","polished","polite","political","pointed","pointless","poised","poor","popular","portly","posh","positive","possible","potable","powerful","powerless","practical","precious","present","prestigious","pretty","precious","previous","pricey","prickly","primary","prime","pristine","private","prize","probable","productive","profitable","profuse","proper","proud","prudent","punctual","pungent","puny","pure","purple","pushy","putrid","puzzled","puzzling","quaint","qualified","quarrelsome","quarterly","queasy","querulous","questionable","quick","quick-witted","quiet","quintessential","quirky","quixotic","quizzical","radiant","ragged","rapid","rare","rash","raw","recent","reckless","rectangular","ready","real","realistic","reasonable","red","reflecting","regal","regular","reliable","relieved","remarkable","remorseful","remote","repentant","required","respectful","responsible","repulsive","revolving","rewarding","rich","rigid","right","ringed","ripe","roasted","robust","rosy","rotating","rotten","rough","round","rowdy","royal","rubbery","rundown","ruddy","rude","runny","rural","rusty","sad","safe","salty","same","sandy","sane","sarcastic","sardonic","satisfied","scaly","scarce","scared","scary","scented","scholarly","scientific","scornful","scratchy","scrawny","second","secondary","second-hand","secret","self-assured","self-reliant","selfish","sentimental","separate","serene","serious","serpentine","several","severe","shabby","shadowy","shady","shallow","shameful","shameless","sharp","shimmering","shiny","shocked","shocking","shoddy","short","short-term","showy","shrill","shy","sick","silent","silky","silly","silver","similar","simple","simplistic","sinful","single","sizzling","skeletal","skinny","sleepy","slight","slim","slimy","slippery","slow","slushy","small","smart","smoggy","smooth","smug","snappy","snarling","sneaky","sniveling","snoopy","sociable","soft","soggy","solid","somber","some","spherical","sophisticated","sore","sorrowful","soulful","soupy","sour","Spanish","sparkling","sparse","specific","spectacular","speedy","spicy","spiffy","spirited","spiteful","splendid","spotless","spotted","spry","square","squeaky","squiggly","stable","staid","stained","stale","standard","starchy","stark","starry","steep","sticky","stiff","stimulating","stingy","stormy","straight","strange","steel","strict","strident","striking","striped","strong","studious","stunning","stupendous","stupid","sturdy","stylish","subdued","submissive","substantial","subtle","suburban","sudden","sugary","sunny","super","superb","superficial","superior","supportive","sure-footed","surprised","suspicious","svelte","sweaty","sweet","sweltering","swift","sympathetic","tall","talkative","tame","tan","tangible","tart","tasty","tattered","taut","tedious","teeming","tempting","tender","tense","tepid","terrible","terrific","testy","thankful","that","these","thick","thin","third","thirsty","this","thorough","thorny","those","thoughtful","threadbare","thrifty","thunderous","tidy","tight","timely","tinted","tiny","tired","torn","total","tough","traumatic","treasured","tremendous","tragic","trained","tremendous","triangular","tricky","trifling","trim","trivial","troubled","true","trusting","trustworthy","trusty","truthful","tubby","turbulent","twin","ugly","ultimate","unacceptable","unaware","uncomfortable","uncommon","unconscious","understated","unequaled","uneven","unfinished","unfit","unfolded","unfortunate","unhappy","unhealthy","uniform","unimportant","unique","united","unkempt","unknown","unlawful","unlined","unlucky","unnatural","unpleasant","unrealistic","unripe","unruly","unselfish","unsightly","unsteady","unsung","untidy","untimely","untried","untrue","unused","unusual","unwelcome","unwieldy","unwilling","unwitting","unwritten","upbeat","upright","upset","urban","usable","used","useful","useless","utilized","utter","vacant","vague","vain","valid","valuable","vapid","variable","vast","velvety","venerated","vengeful","verifiable","vibrant","vicious","victorious","vigilant","vigorous","villainous","violet","violent","virtual","virtuous","visible","vital","vivacious","vivid","voluminous","wan","warlike","warm","warmhearted","warped","wary","wasteful","watchful","waterlogged","watery","wavy","wealthy","weak","weary","webbed","wee","weekly","weepy","weighty","weird","welcome","well-documented","well-groomed","well-informed","well-lit","well-made","well-off","well-to-do","well-worn","wet","which","whimsical","whirlwind","whispered","white","whole","whopping","wicked","wide","wide-eyed","wiggly","wild","willing","wilted","winding","windy","winged","wiry","wise","witty","wobbly","woeful","wonderful","wooden","woozy","wordy","worldly","worn","worried","worrisome","worse","worst","worthless","worthwhile","worthy","wrathful","wretched","writhing","wrong","wry","yawning","yearly","yellow","yellowish","young","youthful","yummy","zany","zealous","zesty","zigzag","rocky"];
  let name2 = ["people","history","way","art","world","information","map","family","government","health","system","computer","meat","year","thanks","music","person","reading","method","data","food","understanding","theory","law","bird","literature","problem","software","control","knowledge","power","ability","economics","love","internet","television","science","library","nature","fact","product","idea","temperature","investment","area","society","activity","story","industry","media","thing","oven","community","definition","safety","quality","development","language","management","player","variety","video","week","security","country","exam","movie","organization","equipment","physics","analysis","policy","series","thought","basis","boyfriend","direction","strategy","technology","army","camera","freedom","paper","environment","child","instance","month","truth","marketing","university","writing","article","department","difference","goal","news","audience","fishing","growth","income","marriage","user","combination","failure","meaning","medicine","philosophy","teacher","communication","night","chemistry","disease","disk","energy","nation","road","role","soup","advertising","location","success","addition","apartment","education","math","moment","painting","politics","attention","decision","event","property","shopping","student","wood","competition","distribution","entertainment","office","population","president","unit","category","cigarette","context","introduction","opportunity","performance","driver","flight","length","magazine","newspaper","relationship","teaching","cell","dealer","debate","finding","lake","member","message","phone","scene","appearance","association","concept","customer","death","discussion","housing","inflation","insurance","mood","woman","advice","blood","effort","expression","importance","opinion","payment","reality","responsibility","situation","skill","statement","wealth","application","city","county","depth","estate","foundation","grandmother","heart","perspective","photo","recipe","studio","topic","collection","depression","imagination","passion","percentage","resource","setting","ad","agency","college","connection","criticism","debt","description","memory","patience","secretary","solution","administration","aspect","attitude","director","personality","psychology","recommendation","response","selection","storage","version","alcohol","argument","complaint","contract","emphasis","highway","loss","membership","possession","preparation","steak","union","agreement","cancer","currency","employment","engineering","entry","interaction","limit","mixture","preference","region","republic","seat","tradition","virus","actor","classroom","delivery","device","difficulty","drama","election","engine","football","guidance","hotel","match","owner","priority","protection","suggestion","tension","variation","anxiety","atmosphere","awareness","bread","climate","comparison","confusion","construction","elevator","emotion","employee","employer","guest","height","leadership","mall","manager","operation","recording","respect","sample","transportation","boring","charity","cousin","disaster","editor","efficiency","excitement","extent","feedback","guitar","homework","leader","mom","outcome","permission","presentation","promotion","reflection","refrigerator","resolution","revenue","session","singer","tennis","basket","bonus","cabinet","childhood","church","clothes","coffee","dinner","drawing","hair","hearing","initiative","judgment","lab","measurement","mode","mud","orange","poetry","police","possibility","procedure","queen","ratio","relation","restaurant","satisfaction","sector","signature","significance","song","tooth","town","vehicle","volume","wife","accident","airport","appointment","arrival","assumption","baseball","chapter","committee","conversation","database","enthusiasm","error","explanation","farmer","gate","girl","hall","historian","hospital","injury","instruction","maintenance","manufacturer","meal","perception","pie","poem","presence","proposal","reception","replacement","revolution","river","son","speech","tea","village","warning","winner","worker","writer","assistance","breath","buyer","chest","chocolate","conclusion","contribution","cookie","courage","desk","drawer","establishment","examination","garbage","grocery","honey","impression","improvement","independence","insect","inspection","inspector","king","ladder","menu","penalty","piano","potato","profession","professor","quantity","reaction","requirement","salad","sister","supermarket","tongue","weakness","wedding","affair","ambition","analyst","apple","assignment","assistant","bathroom","bedroom","beer","birthday","celebration","championship","cheek","client","consequence","departure","diamond","dirt","ear","fortune","friendship","funeral","gene","girlfriend","hat","indication","intention","lady","midnight","negotiation","obligation","passenger","pizza","platform","poet","pollution","recognition","reputation","shirt","speaker","stranger","surgery","sympathy","tale","throat","trainer","uncle","youth","time","work","film","water","money","example","while","business","study","game","life","form","air","day","place","number","part","field","fish","back","process","heat","hand","experience","job","book","end","point","type","home","economy","value","body","market","guide","interest","state","radio","course","company","price","size","card","list","mind","trade","line","care","group","risk","word","fat","force","key","light","training","name","school","top","amount","level","order","practice","research","sense","service","piece","web","boss","sport","fun","house","page","term","test","answer","sound","focus","matter","kind","soil","board","oil","picture","access","garden","range","rate","reason","future","site","demand","exercise","image","case","cause","coast","action","age","bad","boat","record","result","section","building","mouse","cash","class","period","plan","store","tax","side","subject","space","rule","stock","weather","chance","figure","man","model","source","beginning","earth","program","chicken","design","feature","head","material","purpose","question","rock","salt","act","birth","car","dog","object","scale","sun","note","profit","rent","speed","style","war","bank","craft","half","inside","outside","standard","bus","exchange","eye","fire","position","pressure","stress","advantage","benefit","box","frame","issue","step","cycle","face","item","metal","paint","review","room","screen","structure","view","account","ball","discipline","medium","share","balance","bit","black","bottom","choice","gift","impact","machine","shape","tool","wind","address","average","career","culture","morning","pot","sign","table","task","condition","contact","credit","egg","hope","ice","network","north","square","attempt","date","effect","link","post","star","voice","capital","challenge","friend","self","shot","brush","couple","exit","front","function","lack","living","plant","plastic","spot","summer","taste","theme","track","wing","brain","button","click","desire","foot","gas","influence","notice","rain","wall","base","damage","distance","feeling","pair","savings","staff","sugar","target","text","animal","author","budget","discount","file","ground","lesson","minute","officer","phase","reference","register","sky","stage","stick","title","trouble","bowl","bridge","campaign","character","club","edge","evidence","fan","letter","lock","maximum","novel","option","pack","park","quarter","skin","sort","weight","baby","background","carry","dish","factor","fruit","glass","joint","master","muscle","red","strength","traffic","trip","vegetable","appeal","chart","gear","ideal","kitchen","land","log","mother","net","party","principle","relative","sale","season","signal","spirit","street","tree","wave","belt","bench","commission","copy","drop","minimum","path","progress","project","sea","south","status","stuff","ticket","tour","angle","blue","breakfast","confidence","daughter","degree","doctor","dot","dream","duty","essay","father","fee","finance","hour","juice","luck","milk","mouth","peace","pipe","stable","storm","substance","team","trick","afternoon","bat","beach","blank","catch","chain","consideration","cream","crew","detail","gold","interview","kid","mark","mission","pain","pleasure","score","screw","sex","shop","shower","suit","tone","window","agent","band","bath","block","bone","calendar","candidate","cap","coat","contest","corner","court","cup","district","door","east","finger","garage","guarantee","hole","hook","implement","layer","lecture","lie","manner","meeting","nose","parking","partner","profile","rice","routine","schedule","swimming","telephone","tip","winter","airline","bag","battle","bed","bill","bother","cake","code","curve","designer","dimension","dress","ease","emergency","evening","extension","farm","fight","gap","grade","holiday","horror","horse","host","husband","loan","mistake","mountain","nail","noise","occasion","package","patient","pause","phrase","proof","race","relief","sand","sentence","shoulder","smoke","stomach","string","tourist","towel","vacation","west","wheel","wine","arm","aside","associate","bet","blow","border","branch","breast","brother","buddy","bunch","chip","coach","cross","document","draft","dust","expert","floor","god","golf","habit","iron","judge","knife","landscape","league","mail","mess","native","opening","parent","pattern","pin","pool","pound","request","salary","shame","shelter","shoe","silver","tackle","tank","trust","assist","bake","bar","bell","bike","blame","boy","brick","chair","closet","clue","collar","comment","conference","devil","diet","fear","fuel","glove","jacket","lunch","monitor","mortgage","nurse","pace","panic","peak","plane","reward","row","sandwich","shock","spite","spray","surprise","till","transition","weekend","welcome","yard","alarm","bend","bicycle","bite","blind","bottle","cable","candle","clerk","cloud","concert","counter","flower","grandfather","harm","knee","lawyer","leather","load","mirror","neck","pension","plate","purple","ruin","ship","skirt","slice","snow","specialist","stroke","switch","trash","tune","zone","anger","award","bid","bitter","boot","bug","camp","candy","carpet","cat","champion","channel","clock","comfort","cow","crack","engineer","entrance","fault","grass","guy","hell","highlight","incident","island","joke","jury","leg","lip","mate","motor","nerve","passage","pen","pride","priest","prize","promise","resident","resort","ring","roof","rope","sail","scheme","script","sock","station","toe","tower","truck","witness","can","will","other","use","make","good","look","help","go","great","being","still","public","read","keep","start","give","human","local","general","specific","long","play","feel","high","put","common","set","change","simple","past","big","possible","particular","major","personal","current","national","cut","natural","physical","show","try","check","second","call","move","pay","let","increase","single","individual","turn","ask","buy","guard","hold","main","offer","potential","professional","international","travel","cook","alternative","special","working","whole","dance","excuse","cold","commercial","low","purchase","deal","primary","worth","fall","necessary","positive","produce","search","present","spend","talk","creative","tell","cost","drive","green","support","glad","remove","return","run","complex","due","effective","middle","regular","reserve","independent","leave","original","reach","rest","serve","watch","beautiful","charge","active","break","negative","safe","stay","visit","visual","affect","cover","report","rise","walk","white","junior","pick","unique","classic","final","lift","mix","private","stop","teach","western","concern","familiar","fly","official","broad","comfortable","gain","rich","save","stand","young","heavy","lead","listen","valuable","worry","handle","leading","meet","release","sell","finish","normal","press","ride","secret","spread","spring","tough","wait","brown","deep","display","flow","hit","objective","shoot","touch","cancel","chemical","cry","dump","extreme","push","conflict","eat","fill","formal","jump","kick","opposite","pass","pitch","remote","total","treat","vast","abuse","beat","burn","deposit","print","raise","sleep","somewhere","advance","consist","dark","double","draw","equal","fix","hire","internal","join","kill","sensitive","tap","win","attack","claim","constant","drag","drink","guess","minor","pull","raw","soft","solid","wear","weird","wonder","annual","count","dead","doubt","feed","forever","impress","repeat","round","sing","slide","strip","wish","combine","command","dig","divide","equivalent","hang","hunt","initial","march","mention","spiritual","survey","tie","adult","brief","crazy","escape","gather","hate","prior","repair","rough","sad","scratch","sick","strike","employ","external","hurt","illegal","laugh","lay","mobile","nasty","ordinary","respond","royal","senior","split","strain","struggle","swim","train","upper","wash","yellow","convert","crash","dependent","fold","funny","grab","hide","miss","permit","quote","recover","resolve","roll","sink","slip","spare","suspect","sweet","swing","twist","upstairs","usual","abroad","brave","calm","concentrate","estimate","grand","male","mine","prompt","quiet","refuse","regret","reveal","rush","shake","shift","shine","steal","suck","surround","bear","brilliant","dare","dear","delay","drunk","female","hurry","inevitable","invite","kiss","neat","pop","punch","quit","reply","representative","resist","rip","rub","silly","smile","spell","stretch","stupid","tear","temporary","tomorrow","wake","wrap","yesterday","Thomas","Tom","Lieuwe"];

  let name = name1[getRandomInt(0, name1.length + 1)] + ' ' + name2[getRandomInt(0, name2.length + 1)];
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
