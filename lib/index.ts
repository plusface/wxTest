
// send()
import schedule from 'node-schedule';
console.log('[ schedule ]', schedule)

const job = schedule.scheduleJob('52 14 * * *', function () {
  console.log('The answer to life, the universe, and everything!');
});
// import { SimpleIntervalJob, Task, ToadScheduler } from 'toad-scheduler';
// let i = 1
// const scheduler = new ToadScheduler();
// const task = new Task('simple task', () => {
//   console.log('Task triggered');
//   i++
//   if (i >= 100) {
//     scheduler.stopById('id_1')
//   }
// });

// const job1 = new SimpleIntervalJob(
//   { seconds: 1, runImmediately: true },
//   task,
//   'id_1'
// );


// //create and start jobs
// scheduler.addSimpleIntervalJob(job1);

// stop job with ID: id_2
// scheduler.stopById('id_2');

// remove job with ID: id_1
// scheduler.removeById('id_1');

// check status of jobs
// console.log(scheduler.getById('id_1').getStatus()); // returns Error (job not found)

// console.log(scheduler.getById('id_2').getStatus()); // returns "stopped" and can be started again