const crypto = require('crypto');
const qrcode = require('qrcode');

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const SECRET_BYTES = 20;

function base32Encode(buffer) {
    let bits = 0, value = 0, output = '';
    for (let i = 0; i < buffer.length; i++) {
        value = (value << 8) | buffer[i];
        bits += 8;
        while (bits >= 5) {
            output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    return output;
}

function base32Decode(str) {
    const cleaned = String(str).toUpperCase().replace(/[^A-Z2-7]/g, '');
    const buffer = [];
    let bits = 0, value = 0;
    for (let i = 0; i < cleaned.length; i++) {
        value = (value << 5) | BASE32_ALPHABET.indexOf(cleaned[i]);
        bits += 5;
        if (bits >= 8) {
            buffer.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(buffer);
}

function generateSecret() {
    return base32Encode(crypto.randomBytes(SECRET_BYTES));
}

function getTOTP(secret, timestamp) {
    const counter = Math.floor(timestamp / 1000 / 30);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
    counterBuffer.writeUInt32BE(counter >>> 0, 4);
    const key = base32Decode(secret);
    const hmac = crypto.createHmac('sha1', key).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binCode = ((hmac[offset] & 0x7f) << 24) | ((hmac[offset + 1] & 0xff) << 16) | ((hmac[offset + 2] & 0xff) << 8) | (hmac[offset + 3] & 0xff);
    return String(binCode % 1000000).padStart(6, '0');
}

function verifyTOTP(secret, code, window = 1) {
    const cleaned = String(code).replace(/\s+/g, '');
    if (!/^\d{6}$/.test(cleaned)) return false;
    const now = Date.now();
    for (let w = -window; w <= window; w++) {
        if (getTOTP(secret, now + w * 30000) === cleaned) return true;
    }
    return false;
}

function buildOtpauthUrl(secret, email) {
    const issuer = 'TrendyWardrobe';
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${encodeURIComponent(secret)}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

async function generateQRDataUrl(secret, email) {
    return qrcode.toDataURL(buildOtpauthUrl(secret, email), { width: 220, margin: 1 });
}

module.exports = { generateSecret, verifyTOTP, buildOtpauthUrl, generateQRDataUrl };
