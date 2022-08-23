import { formatDate } from "@wsl/js-tools"
import { getComment, getMorning, getToken, sendMessage } from "./config"
const start = async () => {
  try {
    /** 早安话语 */
    const morning = (await getMorning()).data.newslist[0].content
    console.log('[ morning ]', morning)

    /** 网易云热评 */
    const comment = (await getComment()).data.newslist[0]
    const commentStr = `${comment.content} 
                  - 《${comment.source}》`
    console.log('[ commentStr ]', commentStr)

    /** token */
    const token = (await getToken()).data.access_token

    /** 发送消息 */
    sendMessage(token, {
      date: { value: formatDate(new Date(), 'yyyy-MM-dd EEE'), color: '#364f6b' },
      morning: { value: morning, color: '#5E46E3' },
      comment: { value: commentStr, color: '#fc5185' }
    })
  } catch (error) {
    console.log('[ error ]', error)
  }
}
start()