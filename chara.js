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
  new Chara("hakurei reimu", 
    "hakurei_reimu, hair_bow, red_bow, frilled_bow, frilled_hair_tubes, ", 
    "detached_sleeves, yellow_ascot, red_skirt, ribbon-trimmed_sleeves, wide_sleeves, white_sleeves, ", 
    ""),
]