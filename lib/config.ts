import { api, formatDate } from '@wsl/js-tools'
import axios from 'axios'
import fs from 'fs'
import { jsonc } from 'jsonc'
import path from 'path'

type Config = {
  wxAppId: string,
  wxAppsecret: string,
  /** 天行数据api的key */
  apiKey: string,
  /** 模板id */
  templateId: string;
  /** 用户id */
  userIds: string[],
  /** 用户对应星座 */
  constellation: { [x: string]: string },
}
type ApiResponse<T = { content: string; source: string; type: string }> = {
  code: number,
  message: string
  newslist: T[]
}

const { wxAppId, wxAppsecret, apiKey, templateId, userIds, constellation }: Config = jsonc.parse(fs.readFileSync(path.resolve('data.json')).toString())


export const getToken = () => api.get<ApiResponse>(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxAppId}&secret=${wxAppsecret}`)

/** 早安话 */
export const getMorning = () => api.get<ApiResponse>(`http://api.tianapi.com/zaoan/index?key=${apiKey}`)
/** 音乐热评 */
export const getComment = () => api.get<ApiResponse>(`http://api.tianapi.com/hotreview/index?key=${apiKey}`)
/** 土味情话 */
export const getLoveWords = () => api.get<ApiResponse>(`http://api.tianapi.com/saylove/index?key=${apiKey}`)

/** 星座运势,与用户对应 */
const horoscopeInfo: any = {}
/** 获取星座运势 */
export const getHoroscope = () => {
  userIds.forEach(async uid => {
    api.get<ApiResponse>(`http://api.tianapi.com/star/index?key=${apiKey}&astro=${constellation[uid]}`)
      .then(res => {
        console.log(`${res.data.newslist.find(v => v.type === '今日概述').content}`);
        horoscopeInfo[uid] = `${res.data.newslist.find(v => v.type === '今日概述').content}`
      })
  })
}

/** 获取农历 */
export const getLunar = () => api.get<ApiResponse<{
  lubarmonth: string
  lunarday: string
  wuxingjiazi: string
  wuxingnayear: string
  wuxingnamonth: string
  jieqi?: string
}>>(`http://api.tianapi.com/lunar/index?key=${apiKey}&date=${formatDate(new Date(), 'yyyy-MM-dd')}`)

/** 发送消息 */
export const sendMessage = (
  token: string,
  data: {
    date: { value: string; color: string }
    loveWord: { value: string; color: string }
    star: { value: string; color: string }
    comment: { value: string; color: string }
  }
) => {
  userIds.forEach(uid => {
    data.star.value = horoscopeInfo[uid]
    axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`, {
      touser: uid,
      template_id: templateId,
      data
    })
  })
}