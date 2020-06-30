const { Spinner } = require('cli-spinner');
module.exports = class Progress {
  constructor(processes) {
    this.processes = processes;
    this.processIndex = 0;
    this.createProcess();
  }
  proceed() {
    this.process.stop(true);
    this.processIndex++;
    this.createProcess();
  }
  createProcess() {
    if (this.processIndex >= this.processes.length) return;
    this.process = new Spinner(this.processes[this.processIndex]);
    this.process.start();
  }
};
