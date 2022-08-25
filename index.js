"use strict";
var dist = {};
var toadScheduler = {};
var SimpleIntervalEngine$1 = {};
var SchedulerEngine$1 = {};
Object.defineProperty(SchedulerEngine$1, "__esModule", { value: true });
SchedulerEngine$1.SchedulerEngine = void 0;
class SchedulerEngine {
}
SchedulerEngine$1.SchedulerEngine = SchedulerEngine;
Object.defineProperty(SimpleIntervalEngine$1, "__esModule", { value: true });
SimpleIntervalEngine$1.SimpleIntervalEngine = void 0;
const SchedulerEngine_1 = SchedulerEngine$1;
class SimpleIntervalEngine extends SchedulerEngine_1.SchedulerEngine {
  constructor() {
    super();
    this.jobs = [];
  }
  add(job) {
    this.jobs.push(job);
    job.start();
  }
  stop() {
    for (const job of this.jobs) {
      job.stop();
    }
  }
}
SimpleIntervalEngine$1.SimpleIntervalEngine = SimpleIntervalEngine;
Object.defineProperty(toadScheduler, "__esModule", { value: true });
toadScheduler.ToadScheduler = void 0;
const SimpleIntervalEngine_1 = SimpleIntervalEngine$1;
class ToadScheduler {
  constructor() {
    this.engines = {};
    this.jobRegistry = {};
  }
  addIntervalJob(job) {
    if (!this.engines.simpleIntervalEngine) {
      this.engines.simpleIntervalEngine = new SimpleIntervalEngine_1.SimpleIntervalEngine();
    }
    if (job.id) {
      if (this.jobRegistry[job.id]) {
        throw new Error(`Job with an id ${job.id} is already registered.`);
      }
      this.jobRegistry[job.id] = job;
    }
    this.engines.simpleIntervalEngine.add(job);
  }
  addLongIntervalJob(job) {
    return this.addIntervalJob(job);
  }
  addSimpleIntervalJob(job) {
    return this.addIntervalJob(job);
  }
  stop() {
    for (const engine of Object.values(this.engines)) {
      engine === null || engine === void 0 ? void 0 : engine.stop();
    }
  }
  getById(id) {
    const job = this.jobRegistry[id];
    if (!job) {
      throw new Error(`Job with an id ${id} is not registered.`);
    }
    return job;
  }
  removeById(id) {
    const job = this.jobRegistry[id];
    if (!job) {
      return;
    }
    job.stop();
    delete this.jobRegistry[id];
    return job;
  }
  stopById(id) {
    const job = this.getById(id);
    job.stop();
  }
  startById(id) {
    const job = this.getById(id);
    job.start();
  }
}
toadScheduler.ToadScheduler = ToadScheduler;
var AsyncTask$1 = {};
var Logger = {};
Object.defineProperty(Logger, "__esModule", { value: true });
Logger.loggingErrorHandler = Logger.defaultErrorHandler = void 0;
function defaultErrorHandler(id) {
  return (err) => {
    console.error(`Error while handling task ${id}: ${err.message}`);
  };
}
Logger.defaultErrorHandler = defaultErrorHandler;
function loggingErrorHandler(originalError) {
  return (err) => {
    console.error(`Error while trying to log an error: ${err.message}`);
    console.error(`Original error: ${originalError.message}`);
  };
}
Logger.loggingErrorHandler = loggingErrorHandler;
var Utils = {};
Object.defineProperty(Utils, "__esModule", { value: true });
Utils.isPromise = void 0;
function isPromise(value) {
  return value && value.then !== void 0 ? true : false;
}
Utils.isPromise = isPromise;
Object.defineProperty(AsyncTask$1, "__esModule", { value: true });
AsyncTask$1.AsyncTask = void 0;
const Logger_1$1 = Logger;
const Utils_1$1 = Utils;
class AsyncTask {
  constructor(id, handler, errorHandler) {
    this.id = id;
    this.handler = handler;
    this.errorHandler = errorHandler || (0, Logger_1$1.defaultErrorHandler)(this.id);
  }
  execute() {
    this.handler().catch((err) => {
      const errorHandleResult = this.errorHandler(err);
      if ((0, Utils_1$1.isPromise)(errorHandleResult)) {
        errorHandleResult.catch((0, Logger_1$1.loggingErrorHandler)(err));
      }
    });
  }
}
AsyncTask$1.AsyncTask = AsyncTask;
var Task$1 = {};
Object.defineProperty(Task$1, "__esModule", { value: true });
Task$1.Task = void 0;
const Logger_1 = Logger;
const Utils_1 = Utils;
class Task {
  constructor(id, handler, errorHandler) {
    this.id = id;
    this.handler = handler;
    this.errorHandler = errorHandler || (0, Logger_1.defaultErrorHandler)(this.id);
  }
  execute() {
    try {
      this.handler();
    } catch (err) {
      const errorHandleResult = this.errorHandler(err);
      if ((0, Utils_1.isPromise)(errorHandleResult)) {
        errorHandleResult.catch((0, Logger_1.loggingErrorHandler)(err));
      }
    }
  }
}
Task$1.Task = Task;
var Job = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Job = exports.JobStatus = void 0;
  (function(JobStatus) {
    JobStatus["RUNNING"] = "running";
    JobStatus["STOPPED"] = "stopped";
  })(exports.JobStatus || (exports.JobStatus = {}));
  class Job2 {
    constructor(id) {
      this.id = id;
    }
  }
  exports.Job = Job2;
})(Job);
var SimpleIntervalJob$1 = {};
var SimpleIntervalSchedule = {};
Object.defineProperty(SimpleIntervalSchedule, "__esModule", { value: true });
SimpleIntervalSchedule.toMsecs = void 0;
function toMsecs(schedule) {
  var _a, _b, _c, _d, _e;
  const days = (_a = schedule.days) !== null && _a !== void 0 ? _a : 0;
  const hours = (_b = schedule.hours) !== null && _b !== void 0 ? _b : 0;
  const minutes = (_c = schedule.minutes) !== null && _c !== void 0 ? _c : 0;
  const seconds = (_d = schedule.seconds) !== null && _d !== void 0 ? _d : 0;
  const milliseconds = (_e = schedule.milliseconds) !== null && _e !== void 0 ? _e : 0;
  return milliseconds + seconds * 1e3 + minutes * 60 * 1e3 + hours * 60 * 60 * 1e3 + days * 24 * 60 * 60 * 1e3;
}
SimpleIntervalSchedule.toMsecs = toMsecs;
Object.defineProperty(SimpleIntervalJob$1, "__esModule", { value: true });
SimpleIntervalJob$1.SimpleIntervalJob = void 0;
const Job_1$1 = Job;
const SimpleIntervalSchedule_1$1 = SimpleIntervalSchedule;
class SimpleIntervalJob extends Job_1$1.Job {
  constructor(schedule, task2, id) {
    super(id);
    this.schedule = schedule;
    this.task = task2;
  }
  start() {
    const time = (0, SimpleIntervalSchedule_1$1.toMsecs)(this.schedule);
    if (time >= 2147483647) {
      throw new Error("Due to setInterval limitations, no intervals longer than 24.85 days can be scheduled correctly. Please create LongIntervalJob instead.");
    }
    if (this.timer) {
      this.stop();
    }
    if (this.schedule.runImmediately) {
      this.task.execute();
    }
    this.timer = setInterval(() => {
      this.task.execute();
    }, time);
  }
  stop() {
    if (!this.timer) {
      return;
    }
    clearInterval(this.timer);
    this.timer = void 0;
  }
  getStatus() {
    if (this.timer) {
      return Job_1$1.JobStatus.RUNNING;
    }
    return Job_1$1.JobStatus.STOPPED;
  }
}
SimpleIntervalJob$1.SimpleIntervalJob = SimpleIntervalJob;
var LongIntervalJob$1 = {};
Object.defineProperty(LongIntervalJob$1, "__esModule", { value: true });
LongIntervalJob$1.LongIntervalJob = void 0;
const Job_1 = Job;
const Task_1 = Task$1;
const SimpleIntervalJob_1 = SimpleIntervalJob$1;
const SimpleIntervalSchedule_1 = SimpleIntervalSchedule;
const MAX_TIMEOUT_DURATION_MS = 2147483647;
class LongIntervalJob extends Job_1.Job {
  constructor(schedule, task2, id) {
    super(id);
    this.schedule = schedule;
    this.task = task2;
    const taskPeriod = (0, SimpleIntervalSchedule_1.toMsecs)(schedule);
    if (taskPeriod >= MAX_TIMEOUT_DURATION_MS) {
      this.setTimeEatingJob(taskPeriod);
    }
  }
  setTimeEatingJob(taskPeriod) {
    var _a;
    const mainTaskExecutionDate = new Date();
    mainTaskExecutionDate.setTime(Date.now() + taskPeriod);
    const mainTaskExecutionTime = mainTaskExecutionDate.getTime();
    const startingRemainingMs = mainTaskExecutionTime - Date.now();
    const timeEater = new Task_1.Task("time eating task", () => {
      var _a2, _b;
      const remainingMs = mainTaskExecutionTime - Date.now();
      if (remainingMs >= MAX_TIMEOUT_DURATION_MS) {
        (_a2 = this.childJob) === null || _a2 === void 0 ? void 0 : _a2.stop();
        this.childJob = new SimpleIntervalJob_1.SimpleIntervalJob({
          milliseconds: Math.min(MAX_TIMEOUT_DURATION_MS - 1, remainingMs)
        }, timeEater);
        this.childJob.start();
      } else {
        (_b = this.childJob) === null || _b === void 0 ? void 0 : _b.stop();
        this.childJob = new SimpleIntervalJob_1.SimpleIntervalJob({
          milliseconds: Math.min(MAX_TIMEOUT_DURATION_MS - 1, remainingMs)
        }, new Task_1.Task("Final mile task", () => {
          this.setTimeEatingJob((0, SimpleIntervalSchedule_1.toMsecs)(this.schedule));
          return this.task.execute();
        }));
        this.childJob.start();
      }
    });
    (_a = this.childJob) === null || _a === void 0 ? void 0 : _a.stop();
    this.childJob = new SimpleIntervalJob_1.SimpleIntervalJob({
      milliseconds: Math.min(MAX_TIMEOUT_DURATION_MS - 1, startingRemainingMs)
    }, timeEater);
    this.childJob.start();
  }
  start() {
    if (this.childJob) {
      return this.childJob.start();
    }
    const time = (0, SimpleIntervalSchedule_1.toMsecs)(this.schedule);
    if (this.timer) {
      this.stop();
    }
    if (this.schedule.runImmediately) {
      this.task.execute();
    }
    this.timer = setInterval(() => {
      this.task.execute();
    }, time);
  }
  stop() {
    if (this.childJob) {
      return this.childJob.stop();
    }
    if (!this.timer) {
      return;
    }
    clearInterval(this.timer);
    this.timer = void 0;
  }
  getStatus() {
    if (this.childJob) {
      return this.childJob.getStatus();
    }
    if (this.timer) {
      return Job_1.JobStatus.RUNNING;
    }
    return Job_1.JobStatus.STOPPED;
  }
}
LongIntervalJob$1.LongIntervalJob = LongIntervalJob;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.LongIntervalJob = exports.SimpleIntervalJob = exports.JobStatus = exports.Job = exports.Task = exports.AsyncTask = exports.ToadScheduler = void 0;
  var toadScheduler_1 = toadScheduler;
  Object.defineProperty(exports, "ToadScheduler", { enumerable: true, get: function() {
    return toadScheduler_1.ToadScheduler;
  } });
  var AsyncTask_1 = AsyncTask$1;
  Object.defineProperty(exports, "AsyncTask", { enumerable: true, get: function() {
    return AsyncTask_1.AsyncTask;
  } });
  var Task_12 = Task$1;
  Object.defineProperty(exports, "Task", { enumerable: true, get: function() {
    return Task_12.Task;
  } });
  var Job_12 = Job;
  Object.defineProperty(exports, "Job", { enumerable: true, get: function() {
    return Job_12.Job;
  } });
  var Job_2 = Job;
  Object.defineProperty(exports, "JobStatus", { enumerable: true, get: function() {
    return Job_2.JobStatus;
  } });
  var SimpleIntervalJob_12 = SimpleIntervalJob$1;
  Object.defineProperty(exports, "SimpleIntervalJob", { enumerable: true, get: function() {
    return SimpleIntervalJob_12.SimpleIntervalJob;
  } });
  var LongIntervalJob_1 = LongIntervalJob$1;
  Object.defineProperty(exports, "LongIntervalJob", { enumerable: true, get: function() {
    return LongIntervalJob_1.LongIntervalJob;
  } });
})(dist);
let i = 1;
const scheduler = new dist.ToadScheduler();
const task = new dist.Task("simple task", () => {
  console.log("Task triggered", i);
  i++;
});
const job1 = new dist.SimpleIntervalJob(
  { seconds: 1, runImmediately: true },
  task,
  "id_1"
);
scheduler.addSimpleIntervalJob(job1);
