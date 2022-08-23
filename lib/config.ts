import Axios from 'axios';

import 'node-self';
const fs = require('fs')
let axios!: typeof Axios
let dataConfig!: { templateId: string; userIds: string[] }
{
  if (typeof require === 'undefined') {
    axios = Axios
  } else {
    axios = require('axios')
  }
  dataConfig = JSON.parse(fs.readFileSync('./data.json').toString())
  console.log('[ dataConfig ]', dataConfig)
}

/** 微信配置 */
export const wxConfig = {
  appID: '',
  appsecret: '',
}


export const apiConfig = {
  key: ''
}
const wxOrigin = import.meta.env.VITE_WX_API_URL
export const getToken = () => axios.get<{ access_token: string; expires_in: number }>(`${wxOrigin}/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appID}&secret=${wxConfig.appsecret}`)

export const sendMessage = (token: string, data: {
  date: { value: string, color: string },
  morning: { value: string, color: string },
  comment: { value: string, color: string },
}) => {
  dataConfig.userIds.forEach(uid => {
    axios.post(`${wxOrigin}/cgi-bin/message/template/send?access_token=${token}`, {
      touser: uid,
      template_id: dataConfig.templateId,
      data
    })
  })
}

export const getMorning = () => axios.get<{ newslist: { content: string, source: string }[] }>(`http://api.tianapi.com/zaoan/index?key=${apiConfig.key}`)
export const getComment = () => axios.get<{ newslist: { content: string, source: string }[] }>(`http://api.tianapi.com/hotreview/index?key=${apiConfig.key}`)