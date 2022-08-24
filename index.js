"use strict";
const jsTools = require("@wsl/js-tools");
const axios = require("axios");
const fs = require("fs");
const jsonc = require("jsonc");
const path = require("path");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
const axios__default = /* @__PURE__ */ _interopDefaultLegacy(axios);
const fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
const path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const { wxAppId, wxAppsecret, apiKey, templateId, userIds, constellation } = jsonc.jsonc.parse(fs__default.default.readFileSync(path__default.default.resolve("data.json")).toString());
const getToken = () => jsTools.api.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxAppId}&secret=${wxAppsecret}`);
const getComment = () => jsTools.api.get(`http://api.tianapi.com/hotreview/index?key=${apiKey}`);
const getLoveWords = () => jsTools.api.get(`http://api.tianapi.com/saylove/index?key=${apiKey}`);
const horoscopeInfo = {};
const getHoroscope = () => {
  userIds.forEach(async (uid) => {
    jsTools.api.get(`http://api.tianapi.com/star/index?key=${apiKey}&astro=${constellation[uid]}`).then((res) => {
      console.log(`${res.data.newslist.find((v) => v.type === "\u4ECA\u65E5\u6982\u8FF0").content}`);
      horoscopeInfo[uid] = `${res.data.newslist.find((v) => v.type === "\u4ECA\u65E5\u6982\u8FF0").content}`;
    });
  });
};
const getLunar = () => jsTools.api.get(`http://api.tianapi.com/lunar/index?key=${apiKey}&date=${jsTools.formatDate(new Date(), "yyyy-MM-dd")}`);
const sendMessage = (token, data) => {
  userIds.forEach((uid) => {
    data.star.value = horoscopeInfo[uid];
    axios__default.default.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`, {
      touser: uid,
      template_id: templateId,
      data
    });
  });
};
const start = async () => {
  try {
    const loveWords = (await getLoveWords()).data.newslist[0].content;
    console.log("[ loveWordsStr ]", loveWords);
    const { content, source } = (await getComment()).data.newslist[0];
    const comment = `${content}    --- \u300A${source}\u300B`;
    console.log("[ comment ]", comment);
    const { lubarmonth, lunarday } = (await getLunar()).data.newslist[0];
    const date = `${lubarmonth} ${lunarday} ${jsTools.formatDate(new Date(), "EEE HH:mm:ss")}`;
    console.log("[ date ]", date);
    getHoroscope();
    const token = (await getToken()).data.access_token;
    sendMessage(token, {
      date: { value: date, color: "#364f6b" },
      loveWord: { value: loveWords, color: "#5E46E3" },
      comment: { value: comment, color: "#fc5185" },
      star: { value: "", color: "#0d6c78" }
    });
  } catch (error) {
    console.log("[ error ]", error);
  }
};
start();
