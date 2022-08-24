import { formatDate } from "@wsl/js-tools"
import { getComment, getHoroscope, getLoveWords, getLunar, getToken, sendMessage } from "./config"
const start = async () => {
  try {

    /** 土味情话 */
    const loveWords = (await getLoveWords()).data.newslist[0].content
    console.log('[ loveWordsStr ]', loveWords)

    /** 网易云热评 */
    const { content, source } = (await getComment()).data.newslist[0]
    const comment = `${content}    --- 《${source}》`
    console.log('[ comment ]', comment)

    /** 农历 */
    const { lubarmonth, lunarday } = (await getLunar()).data.newslist[0]
    const date = `${lubarmonth} ${lunarday} ${formatDate(new Date(), 'EEE HH:mm:ss')}`
    console.log('[ date ]', date)

    // 获取用户星座信息
    getHoroscope()

    /** token */
    const token = (await getToken()).data.access_token
    /** 发送消息 */
    sendMessage(token, {
      date: { value: date, color: '#364f6b' },
      loveWord: { value: loveWords, color: '#5E46E3' },
      comment: { value: comment, color: '#fc5185' },
      star: { value: '', color: '#0d6c78' },
    })
  } catch (error) {
    console.log('[ error ]', error)
  }
}
start()