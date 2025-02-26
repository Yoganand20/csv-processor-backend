import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const csvJobSchema = new Schema({

  jobId: String,

  inputFile: String,

  outputFile: String,

  status: String,

});

const CSVJOB = model('csvJob', csvJobSchema);

export default CSVJOB;