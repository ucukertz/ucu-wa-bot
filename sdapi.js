import axios from "axios"
import { url, keys } from "./const.js"
import { Chara, chara } from "./chara.js"

class Ckpt {
    /**
     * @param {string} name 
     * @param {string} sampler 
     * @param {number} n_sample
     */
    constructor(name, sampler="Euler a", n_sample=40) {
        this.name = name
        this.sampler = sampler
        this.n_sample = n_sample
    }

    ADD(addpos="", addneg="") {
        this.addpos = addpos
        this.addneg = addneg
        return this
    }

    PD() {
        this.addpos = this.addpos.concat(" ",
            "BREAK score_9, score_8_up, score_7_up, score_6_up ",
            "BREAK source_anime, masterpiece, best quality, shiny_skin"
        )
        this.addneg = this.addneg.concat(" ",
            "deformed anatomy, deformed fingers, censored, realistic, 3d, bald, chibi ",
            "BREAK score_4, score_5, score_6, low quality, worst quality"
        )
        return this
    }

    name = ""
    sampler = ""
    n_sample = 40
    addpos = ""
    addneg = ""
}

class SDprompt {
    /**
     * @param {string} pos 
     * @param {string} neg 
     */
    constructor(pos, neg) {
        this.pos = pos
        this.neg = neg
    }

    pos = ""
    neg = ""
}


/**
 * @type {Ckpt[]}
 */
const checkpoints = [
    new Ckpt("fox", "DPM++ 2M").PD(),
    new Ckpt("nai3").PD(),
    new Ckpt("jugg10"),
]

/**
 * @param {string} ckpt_name 
 * @returns {Ckpt}
 */
function search_ckpt(ckpt_name) {
    for (let i = 0; i < checkpoints.length; i++) {
        if (ckpt_name == checkpoints[i].name)
        return checkpoints[i]
    }
    return checkpoints[0]
}

/**
 * @param {string} query 
 */
function search_chara(query) {
    for (let i = 0; i < chara.length; i++) {
        if (query.toLowerCase().includes(chara[i].id))
        return chara[i]
    }
    return null
}
    

/**
 * @param {string} query 
 * @return {SDprompt}
 */
function query2sdprompt(query) {
    query = query.replace("\n", "")
    if (query.includes("Nega")) {
        let split = query.split("Nega")
        let pos = split[0]
        let neg = split[1].concat(", ")
        return new SDprompt(pos, neg)
    }
    return new SDprompt(query, "")
}

function AbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);

    return abortController.signal;
}

async function is_sd_ready() {
    console.log('CHECKING SD READINESS')
    let res = await axios({
        method: 'get',
        url: url.SD_API_BASE + "/sdapi/v1/sd-models",
        auth: {
            username: keys.SD_API_USERNAME,
            password: keys.SD_API_PASSWORD
        },
        signal: AbortSignal(50000),
    }).catch(() => {return false})

    if (res.status != 200) return false
    return true
} 

/**
 * @param {SDprompt} prompt 
 * @param {Ckpt} ckpt 
 * @param {Chara} chara 
 * @returns {Promise<string>}
 */
async function sd_exec(prompt, ckpt, chara) {
    console.log("SD START", new Date().toLocaleString())
    console.log("CKPT", ckpt.name)
    prompt.pos = prompt.pos.toLowerCase()
    let ti_base = prompt.pos.includes("nsfw") ? "zPDXLxxx" : "zPDXL"

    // Handle ckpt
    prompt.pos = prompt.pos.concat(ckpt.addpos)
    prompt.neg = prompt.neg.concat(ckpt.addneg)

    // Handle chara
    if (chara) {
        console.log("CHARA", chara.id)
        prompt.pos = prompt.pos.includes("cosplay") ? 
        prompt.pos.replace("cosplay", "") : chara.clothes.concat(prompt.pos)

        prompt.pos = prompt.pos.replace(chara.id, "")
        prompt.pos = chara.traits.concat(prompt.pos)

        prompt.pos = chara.addpos.concat(prompt.pos)
        prompt.neg = chara.addneg.concat(prompt.neg)

        prompt.pos = prompt.pos.concat(`, [:${ti_base}:${chara.tis}]`)
        prompt.neg = prompt.neg.concat(`, [:${ti_base}-neg:${chara.tis}]`)
    } else {
        prompt.pos = prompt.pos.concat(`, ${ti_base}]`)
        prompt.neg = prompt.neg.concat(`, ${ti_base}-neg]`)
    }
    prompt.pos = prompt.pos.replace(", , ,", ",")
    prompt.pos = prompt.pos.replace(", ,", ",")

    let ready = await is_sd_ready()
    if (!ready) throw new Error("SD NOT READY")

    console.log("[POSITIVE]", prompt.pos)
    console.log("[NEGATIVE]", prompt.neg)

    let body = {
        "prompt": prompt.pos,
        "negative_prompt": prompt.neg,
        "sampler_name": ckpt.sampler,
        "steps": ckpt.n_sample,
        "cfg_scale": 7,
        "width": 1024,
        "height": 1024,
        "override_settings": {"sd_model_checkpoint": ckpt.name}
    }

    // Dummy quick gen
    await axios({
    method: 'post',
    url: url.SD_API_BASE + "/sdapi/v1/txt2img",
    data: {"prompt":"dog", "steps":1},
    headers: {
        "x-use-cache": false,
    },
    auth: {
        username: keys.SD_API_USERNAME,
        password: keys.SD_API_PASSWORD
    },
    signal: AbortSignal(10000)
    })

    console.log("[POSITIVE]", prompt.pos)
    console.log("[NEGATIVE]", prompt.neg)
    let res = await axios({
    method: 'post',
    url: url.SD_API_BASE + "/sdapi/v1/txt2img",
    data: body,
    headers: {
        "x-use-cache": false,
    },
    auth: {
        username: keys.SD_API_USERNAME,
        password: keys.SD_API_PASSWORD
    },
    signal: AbortSignal(40000)
    })

    if (!res.data.images[0]) {
    throw new Error("SD NO IMAGE")
    }
    return res.data.images[0]
}

/**
 * @param {string} ckpt_name 
 * @param {string} query 
 * @returns {Promise<string>}
 */
export default async function sd_api(ckpt_name, query) {
    let ckpt = search_ckpt(ckpt_name)
    let character = search_chara(query)
    let prompt = query2sdprompt(query)

    return await sd_exec(prompt, ckpt, character)
}