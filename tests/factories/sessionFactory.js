const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const id = "646dd18c7213187bd273f6a4";
  const sessionObject = { passport: { user: user._id.toString() } };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  const sig = keygrip.sign("session=" + session);
  return { session, sig };
};
