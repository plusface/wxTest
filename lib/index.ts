

import schedule from 'node-schedule';
import { send, time } from './config';

// 每天8点半定时执行
const job = schedule.scheduleJob(`${time} * * *`, function () {
  send()
});
send()