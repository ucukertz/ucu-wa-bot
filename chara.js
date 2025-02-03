/**
 * @param {string} name 
 * @param {Number} pow 
 */
function fine(name, pow=1)
{
  return `<${[203,206,209,192].map((c) => String.fromCharCode(c - 95)).join("")}:${name}:${pow}>, `
}

let tunes = {
  lucy: {
    base: (str) => fine(atob("bHVjeWNocm9ubw==").concat([191,208,201,167,202,202,211,209,210,208].map((c) => String.fromCharCode(c - 94)).join("")).concat(atob("aW91c1hM")), str),
    loop: [144,153,135,157,135,133].map((c) => String.fromCharCode(c - 36)).join("").concat(", "+"bl"+"u"+"e").concat("_ey"+"es,").concat(atob("IGxhenlf")).concat(atob("ZXllLCB3")).concat(atob("aGl0ZV9z")).concat(" ,frac".split("").reverse().join("")),
    cage: atob("KGJsdWVfZXllcw==").concat("lb )1.1 :,".split("").reverse().join("")).concat([194,193,183,184,178,187,180,188,197,127].map((c) => String.fromCharCode(c - 83)).join("")).concat(atob("IGxvbmdfaGFpcg==")).concat("nro_riah ,".split("").reverse().join("")).concat("amen"+"t,"+" ha"+"i").concat([177,162,171,168,175,107,95,172,164,163].map((c) => String.fromCharCode(c - 63)).join("")).concat("tsaerb_mui".split("").reverse().join("")).concat(",s".split("").reverse().join("")),
    summer: atob("bHVjeXN0LA==").concat(atob("IGxhenlfZQ==")).concat("ihw ,ey".split("").reverse().join("")).concat([136,121,115,118,131,139,64].map((c) => String.fromCharCode(c - 20)).join("")).concat("c_knip ".split("").reverse().join("")).concat([115,122,118,112,125,55,43].map((c) => String.fromCharCode(c - 11)).join("")).concat("tinted_".substring(0,7)).concat(atob("ZXlld2Vhcg==")).concat(atob("LCB3aGl0ZQ==")).concat("de-frameddeamr".substring(2,9)).concat("_eye"+"w"+"ea").concat(atob("ciwg")),
    roll: atob("bHVjeWhyLA==").concat("e_eulb ".split("").reverse().join("")).concat(atob("eWVzLCBsYQ==")).concat("zy_e"+"ye,").concat(atob("IA=="))
  }  
}

export class Chara {
  /**
   * 
   * @param {string} id 
   * @param {string} traits 
   * @param {string} clothes 
   * @param {string} addpos 
   * @param {string} addneg 
   */
  constructor(id, traits, clothes, addpos="", addneg="") {
    this.id = id
    this.traits = traits
    this.clothes = clothes
    this.addpos = addpos
    this.addneg = addneg
  }

  /**
   * @param {number} start 
   */
  TI(start) {
    start = start > 0.99 ? 0.99 : start
    start = start < 0 ? 0 : start
    this.tis = start
    return this
  }

  id = ""
  traits = ""
  clothes = ""
  addpos = ""
  addneg = ""
  tis = 0
}

/**
 * @type {Chara[]}
 */
export let chara = [
  new Chara("monami rio", 
    "minami rio, white hair, long hair, hime cut, sidelocks, yellow eyes, ", 
    "pleated skirt, school uniform, white shirt, grey skirt, serafuku, yellow neckerchief, "),
  new Chara("lucy (loop)",
    tunes.lucy.base() + tunes.lucy.loop,
    "",
    "",
    "green_eye`s, wavy_hair, "
  ),
  new Chara("lucy (cage)",
    tunes.lucy.base() + tunes.lucy.cage,
    "white_shirt, short_sleeves, plaid_bowtie, purple_skirt, pleated_skirt, plaid_skirt, ",
    "",
    "empty_eyes, lazy_eye, green_eyes, purple_eyes, large_breasts, breast_pocket, ",
  ),
  new Chara("lucy (summer)",
    tunes.lucy.base() + tunes.lucy.summer,
    "",
    "",
    "green_eyes, jewelry, gem, "
  ),
  new Chara("lucy (roll)",
    tunes.lucy.base() + tunes.lucy.roll,
    "",
    "",
    "green_eyes, "
  )
]