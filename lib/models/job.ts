import { Schema, model, Model, Document } from 'mongoose';
import { User } from './user';

export interface Trigger {
  type: string;
  author: User['_id'];
  message: string;
  timestamp: Date;
  url: string;
  source: any;
}

export interface Phase {
  duration: number;
  finished: Date;
  exitCode: number;
  commands: [
    {
      started: Date;
      duration: number;
      command: string;
      comment: boolean;
      plugin: string;
      out: string;
      err: string;
      merged: string;
    }
  ];
}

const TriggerNotSchema = {
  type: { type: String },
  author: {
    id: { type: Schema.Types.ObjectId, ref: 'user' },
    url: String,
    name: String,
    email: String,
    image: String,
    username: String,
  },
  message: String,
  timestamp: Date,
  url: String,
  source: {},
  // source looks like:
  // { type: "plugin", plugin: "github" } ||
  // { type: "UI", page: "dashboard" } ||
  // { type: "API", app: "MyApp" }
};

const PhaseNotSchema = {
  duration: Number,
  finished: Date,
  exitCode: Number,
  commands: [
    {
      started: Date,
      duration: Number,
      command: String,
      comment: Boolean,
      plugin: String,
      out: String,
      err: String,
      merged: String,
    },
  ],
};

export interface Job extends Document {
  type: string;
  user_id: User['_id'];
  project: string;
  ref: any;
  trigger: Trigger;
  phases: {
    environment: Phase;
    prepare: Phase;
    test: Phase;
    deploy: Phase;
    cleanup: Phase;
  };
  plugin_data: any;
  warnings: [
    {
      plugin: string;
      title: string;
      description: string;
      severity: string;
    }
  ];
  std: {
    out: string;
    err: string;
    merged: string;
  };
  duration: number;
  created: Date;
  queued: Date;
  started: Date;
  finished: Date;
  archived: Date;
  test_exitcode: number;
  deploy_exitcode: number;
  status: string;
  errored: boolean;
  error: {
    message: string;
    stack: string;
  };
  runner: {
    id: string;
    data: any;
  };
}

const JobSchema = new Schema({
  type: { type: String },
  user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  project: { type: String, index: true }, // should always be lower case
  ref: {
    // not every job is on a branch, and want arbitrary stuff here.
    // so we can't specify branch, but we still want an index on it
    // branch: { type: String, index: true, sparse: true }
  },
  trigger: TriggerNotSchema,
  phases: {
    environment: PhaseNotSchema,
    prepare: PhaseNotSchema,
    test: PhaseNotSchema,
    deploy: PhaseNotSchema,
    cleanup: PhaseNotSchema,
  },
  // plugins can store any extra data here
  plugin_data: {},
  warnings: [
    {
      plugin: String,
      title: String,
      description: String,
      severity: { type: String, default: 'major', enum: ['major', 'minor'] },
    },
  ],
  std: {
    out: String,
    err: String,
    merged: String,
  },
  duration: Number,
  created: { type: Date, index: true },
  queued: Date,
  started: Date,
  finished: { type: Date, index: true },
  archived: { type: Date, index: true },
  test_exitcode: Number,
  deploy_exitcode: Number,
  status: { type: String },
  errored: { type: Boolean, default: false },
  error: {
    message: String,
    stack: String,
  },
  runner: {
    id: String,
    data: {},
  },
});

JobSchema.index({ archived: 1, project: 1, finished: -1 });

export default model<Job>('Job', JobSchema);
