import { api, formatDate } from '@wsl/js-tools'
import fs from 'fs'
import { jsonc } from 'jsonc'
import path from 'path'
api.setOptions({ checkSuccessStatusKey: 'code' })
type Config = {
  wxAppId: string,
  wxAppsecret: string,
  /** 天行数据api的key */
  apiKey: string,

  /** 模板信息 */
  templateInfo: {
    id: string
    colors: {
      /** 属性 */
      [x: string]: string
    }
  },
  userInfos: {
    /** 用户id */
    [x: string]: {
      name: string
      /** 星座 */
      constellation: string
      /** 城市 */
      city: string
    }
  }
}
type ApiResponse<T = any> = {
  code: number,
  message: string
  newslist: T[]
}

let config!: Config
try {
  config = jsonc.parse(fs.readFileSync(path.resolve('config.json')).toString())
} catch (error) {
  console.log('[ json解析异常 ]', error)
}
const { wxAppId, wxAppsecret, apiKey, templateInfo, userInfos } = config

export const getToken = async () => {
  try {
    const res = await api.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxAppId}&secret=${wxAppsecret}`)
    const toekn = res.data.access_token
    return toekn
  } catch (error) {
    console.log('[ 获取token异常 ]', error)
  }
}

export const getWeather = async (city: string) => {
  try {
    const res = await api.get<ApiResponse>(`http://api.tianapi.com/tianqi/index?key=${apiKey}&city=${encodeURIComponent(city)}`)
    const { area, weather, real, lowest, highest, wind, tips } = res.data.newslist[0]
    return {
      /** 地区 */
      area,
      /** 天气说明 */
      weather,
      /** 当前温度 */
      real,
      /** 最低温度 */
      lowest,
      /** 最高温度 */
      highest,
      /** 风向 */
      wind,
      /** 建议 */
      tips
    }
  } catch (error) {
    console.log('[ 获取天气异常 ]', error)
    return {}
  }
}

/**
 * 朋友圈文案
 */
export const getPyqWenAn = async () => {
  try {
    const res = await api.get<ApiResponse>(`http://api.tianapi.com/pyqwenan/index?key=${apiKey}`)
    const { content, source } = res.data.newslist[0]
    return `${content} —— ${source}`
  } catch (error) {
    console.log('[ 获取朋友圈文案异常 ]', error)

  }
}

/** 获取农历 */
export const getLunar = async () => {
  try {
    const res = await api.get<ApiResponse>(`http://api.tianapi.com/lunar/index?key=${apiKey}&date=${formatDate(new Date(), 'yyyy-MM-dd')}`)
    const { lubarmonth, lunarday } = res.data.newslist[0]
    return {
      /** 农历的月份 */
      lubarmonth,
      /** 农历的天份 */
      lunarday
    }
  } catch (error) {
    console.log('[ 获取农历异常 ]', error)
    return {}
  }
}

/**
 * 获取星座信息,这里只获取了今日概述
 * @param astro 星座的英文
 */
export const getHoroscope = async (astro: string) => {
  try {
    const res = await api.get<ApiResponse>(`http://api.tianapi.com/star/index?key=${apiKey}&astro=${astro}`)
    return res.data.newslist.find(v => v.type === '今日概述').content
  } catch (error) {
    console.log('[ 获取星座信息异常 ]', error)
  }
}


export const send = async () => {
  const token = await getToken()
  const { lubarmonth, lunarday } = await getLunar()
  const date = `${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss EEE')} ${lubarmonth} ${lunarday} `
  console.log('[ date ]', date)
  const pyqwenan = await getPyqWenAn()
  console.log('[ pyqwenan ]', pyqwenan)
  Object.keys(userInfos).forEach(async uid => {
    const city = userInfos[uid].city
    const { area, highest, lowest, real, tips, weather, wind } = await getWeather(city)
    console.log('[ weather ]', area, weather, wind, `${lowest} ~${highest}`, real, tips)
    const horoscope = await getHoroscope(userInfos[uid].constellation)
    console.log('[ horoscope ]', horoscope)
  })

}
// /** 星座运势,与用户对应 */
// const horoscopeInfo: any = {}
// /** 获取星座运势 */
// export const getHoroscope1 = () => {
//   userIds.forEach(async uid => {
//     api.get<ApiResponse>(`http://api.tianapi.com/star/index?key=${apiKey}&astro=${constellation[uid]}`)
//       .then(res => {
//         console.log(`${res.data.newslist.find(v => v.type === '今日概述').content}`);
//         horoscopeInfo[uid] = `${res.data.newslist.find(v => v.type === '今日概述').content}`
//       })
//   })
// }


/** 发送消息 */
// export const sendMessage = (
//   token: string,
//   data: {
//     date: { value: string; color: string }
//     loveWord: { value: string; color: string }
//     star: { value: string; color: string }
//     comment: { value: string; color: string }
//   }
// ) => {
//   userIds.forEach(uid => {
//     data.star.value = horoscopeInfo[uid]
//     axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`, {
//       touser: uid,
//       template_id: templateId,
//       data
//     })
//   })
// }

/** token */
    // const token = (await getToken()).data.access_token
/** 发送消息 */
    // sendMessage(token, {
    //   date: { value: date, color: '#364f6b' },
    //   loveWord: { value: loveWords, color: '#5E46E3' },
    //   comment: { value: comment, color: '#fc5185' },
    //   star: { value: '', color: '#0d6c78' },
    // })