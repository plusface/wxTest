

// import schedule from 'node-schedule';
// import { send } from './config';

// // 每天8点半定时执行
// schedule.scheduleJob('30 8 * * *', send);

import { SimpleIntervalJob, Task, ToadScheduler } from 'toad-scheduler';
let i = 1
const scheduler = new ToadScheduler();
const task = new Task('simple task', () => {
  console.log('Task triggered', i);
  i++
});

const job1 = new SimpleIntervalJob(
  { seconds: 1, runImmediately: true },
  task,
  'id_1'
);


scheduler.addSimpleIntervalJob(job1);