const fs = require("fs")
const myargs = process.argv.slice(2)
const { createCanvas, loadImage } = require("canvas")
const { layers, width, height } = require("./input/config")
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d")


const edition = myargs.length > 0 ? Number(myargs[0]) : 1;


let metadata = []
let attributes = []
let hash = []
let decodedHash = []


const saveLayer = (_canvas, _edition) => {
    fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer("image/png"))
    console.log("Image Created!")
}


const addMetadata = (_edition) => {
    let dateTime = Date.now()
    let tempMetadata = {
        hash: hash.join(""),
        decodedHash: decodedHash,
        edition: _edition,
        date: dateTime,
        attributes
    }
    metadata.push(tempMetadata);
    attributes = []
    hash = []
    decodedHash = []
}


const addAttributes = (_element, _layer) => {
    let tempAttr = {
        id: _element.id,
        layer: _layer.name,
        name: _element.name,
        rarity: _element.rarity
    }
    attributes.push(tempAttr)
    hash.push(_layer.id)
    hash.push(_element.id)
    decodedHash.push({ [_layer.id]: _element.id })
}


const drawLayer = async (_layer, _edition) => {
    let element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)]
    addAttributes(element, _layer)
    const image = await loadImage(`${_layer.location}/${element.fileName}`);
    ctx.drawImage(image, _layer.position.x, _layer.position.y, _layer.size.width, _layer.size.height);
    console.log("Layer created " + _layer.name + " layer, and choose element " + element.name)
    saveLayer(canvas, _edition)
}

for (let i = 1; i <= edition; i++) {

    layers.forEach(layer => {
        drawLayer(layer, i)
    })

    addMetadata(i)
    console.log("Creating edition: " + i)
}



fs.readFile("./output/_metadata.json", (err, data) => {
    if (err) {
        throw err
    }
    fs.writeFileSync("./output/_metadata.json", JSON.stringify(metadata))
})

