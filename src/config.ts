import axios from 'axios';
import fs from 'fs';
import 'node-self';
import path from 'path';

const dataConfig = JSON.parse(fs.readFileSync(path.resolve('data.json')).toString())
/** 微信配置 */
export const wxConfig = {
  appID: 'wxb5212b3e9fa96237',
  appsecret: '6a86d003014af740cd04542a9f9e5582',
  // templateId: 'QP5h0u4gABQFxEWWGAWblTb8JcQoajDopJzVgruPrI0',
  // userIds: ['ohUtg6ScKxpychUerozoLWP0Q8MA']
}

export const apiConfig = {
  key: '8db0004e90c145dc9b146c8ad0d002f9'
}
const wxOrigin = 'https://api.weixin.qq.com'
export const getToken = () =>
  axios.get<{ access_token: string; expires_in: number }>(
    `${wxOrigin}/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appID}&secret=${wxConfig.appsecret}`
  )

export const sendMessage = (
  token: string,
  data: {
    date: { value: string; color: string }
    morning: { value: string; color: string }
    comment: { value: string; color: string }
  }
) => {
  dataConfig.userIds.forEach(uid => {
    axios.post(`${wxOrigin}/cgi-bin/message/template/send?access_token=${token}`, {
      touser: uid,
      template_id: dataConfig.templateId,
      data
    })
  })
}

export const getMorning = () =>
  axios.get<{ newslist: { content: string; source: string }[] }>(
    `http://api.tianapi.com/zaoan/index?key=${apiConfig.key}`
  )
export const getComment = () =>
  axios.get<{ newslist: { content: string; source: string }[] }>(
    `http://api.tianapi.com/hotreview/index?key=${apiConfig.key}`
  )
