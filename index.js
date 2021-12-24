require('dotenv').config();

const axios = require('axios');
const aesCmac = require('node-aes-cmac').aesCmac;

let wm2_cmd = async () => {

    let sesame_id = process.env.SESAME_UUID;
    let sesame_api_key = process.env.SESAME_API_KEY;
    let key_secret_hex = process.env.KEY_SECRET_HEX;
    let cmd = 88  //(toggle:88,lock:82,unlock:83)
    let history = "Toggled via API"
    let base64_history = Buffer.from(history).toString('base64');

    let sign = generateRandomTag(key_secret_hex)
    let after_cmd = await axios({
        method: 'post',
        url: `https://app.candyhouse.co/api/sesame2/${sesame_id}/cmd`,
        headers: {'x-api-key': sesame_api_key},
        data: {
            cmd: cmd,
            history: base64_history,
            sign: sign
        }
    })
};


function generateRandomTag(secret) {
    let key = Buffer.from(secret, 'hex')
    const date = Math.floor(Date.now() / 1000);
    const dateDate = Buffer.allocUnsafe(4);
    dateDate.writeUInt32LE(date);
    const message = Buffer.from(dateDate.slice(1, 4));
    return aesCmac(key, message);
}

wm2_cmd()