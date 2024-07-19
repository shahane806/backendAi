const fs = require("fs");
const natural = require("natural");
const nlp = async (req, res) => {
  const sentense = req?.headers?.data?.toLowerCase();
  try {
    sentense != '' && res?.send(sentense+" from Yuiitsu");
    sentense == '' && res?.send("You are sending null string");
    console.log(sentense)
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  nlp,
};
