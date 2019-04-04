"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimeDelay_1 = require("../Util/TimeDelay");
/**
 * 任务管理器
 */
var TaskMgr = /** @class */ (function () {
    function TaskMgr(failureStop, finished) {
        /**
         * 任务数
         */
        this.mTaskNum = 0;
        /**
         * 遇到错误是否停止
         */
        this.mFailureStop = true;
        /**
         * 并行任务
         */
        this.mParallelTask = new Array();
        /**
         * 顺序任务
         */
        this.mSequence = new Array();
        /**
         * 是否在执行任务
         */
        this.mIsRuning = false;
        /**
        * 任务进度
        */
        this.progress = 0;
        /**
         * 当前任务
         */
        this.currentTask = null;
        /**
         * 当前任务是否完成
         */
        this.isFinished = false;
        this.mFinished = finished;
        this.mParallelTask.splice(0, this.mParallelTask.length);
        this.mSequence.splice(0, this.mSequence.length);
        TimeDelay_1.TimeDelay.Instance.Remove(this.Update, this);
        TimeDelay_1.TimeDelay.Instance.AddUpdate(this.Update, this);
    }
    /**
     * 添加一个任务
     * @param task 任务对象
     * @param isSequence 是否是需要时序
     * @return 任务id -1则为添加失败
     */
    TaskMgr.prototype.AddTask = function (task, isSequence) {
        if (isSequence === void 0) { isSequence = true; }
        var array;
        var ret = -1;
        if (isSequence) {
            array = this.mSequence;
        }
        else {
            array = this.mParallelTask;
        }
        var index = array.findIndex(function (value, index, obj) {
            return value == task;
        });
        if (index == -1) {
            task.Id = this.mTaskNum;
            ret = task.Id;
            array.push(task);
            this.mTaskNum = this.mSequence.length + this.mParallelTask.length;
        }
        return ret;
    };
    TaskMgr.prototype.Update = function () {
        if (!this.mIsRuning) {
            return;
        }
        this.OnUpdate();
    };
    TaskMgr.prototype.OnUpdate = function () {
        for (var index = 0; index < this.mParallelTask.length; index++) {
            var element = this.mParallelTask[index];
            if (element.IsRuning && element.IsDone) {
                this.mParallelTask.splice(index, 1);
                index--;
                this.progress = (this.mTaskNum - (this.mSequence.length + this.mParallelTask.length)) / this.mTaskNum * 100;
                var error = element.Error;
                if (error != null && this.mFailureStop) {
                    this.Finished(error);
                }
                else {
                    if (this.mTaskItemFinished) {
                        this.mTaskItemFinished.Invoke(element, this.progress);
                    }
                }
            }
            else if (!element.IsRuning && !element.IsDone) {
                element.OnExecute();
                this.currentTask = element;
            }
        }
        for (var index = 0; index < this.mSequence.length; index++) {
            var element = this.mSequence[index];
            if (element.IsRuning) {
                if (element.IsDone) {
                    this.mSequence.splice(index, 1);
                    index--;
                    var error = element.Error;
                    if (error != null && this.mFailureStop) {
                        this.Finished(error);
                    }
                    else {
                        this.progress = (this.mTaskNum - (this.mSequence.length + this.mParallelTask.length)) / this.mTaskNum * 100;
                        if (this.mTaskItemFinished) {
                            this.mTaskItemFinished.Invoke(element, this.progress);
                        }
                    }
                }
                break;
            }
            else if (!element.IsDone) {
                this.currentTask = element;
                element.OnExecute();
            }
        }
        if (this.mSequence.length + this.mParallelTask.length <= 0) {
            this.Finished();
        }
    };
    TaskMgr.prototype.Finished = function (error) {
        if (error === void 0) { error = null; }
        this.isFinished = true;
        this.mIsRuning = false;
        this.progress = 100;
        if (this.mFinished != null) {
            this.mFinished.Invoke(error);
        }
        if (error) {
            TimeDelay_1.TimeDelay.Instance.Remove(this.Update, this);
        }
    };
    /**
     *
     * @param id 任务id
     */
    TaskMgr.prototype.HasTask = function (id) {
        var index = this.mSequence.findIndex(function (value, index, obj) {
            return value.Id == id;
        });
        index = this.mParallelTask.findIndex(function (value, index, obj) {
            return value.Id == id;
        });
        return index != -1;
    };
    TaskMgr.prototype.Stop = function () {
        this.mIsRuning = false;
        //TimeDelay.Instance.Remove(this.Update, this)
    };
    TaskMgr.prototype.Execute = function () {
        this.mIsRuning = true;
    };
    return TaskMgr;
}());
exports.TaskMgr = TaskMgr;
/**
 * 任务基类
 */
var TaskBase = /** @class */ (function () {
    function TaskBase() {
        this.IsRuning = false;
        this.Id = 0;
        this.IsDone = false;
        this.Error = null;
    }
    TaskBase.prototype.TaskName = function () {
        return null;
    };
    TaskBase.prototype.OnExecute = function () {
        this.IsRuning = true;
    };
    TaskBase.prototype.Reset = function () {
        this.IsRuning = false;
    };
    return TaskBase;
}());
exports.TaskBase = TaskBase;
