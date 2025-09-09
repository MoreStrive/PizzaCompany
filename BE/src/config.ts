'use strict';

import dotenv from 'dotenv';
dotenv.config();

const {
  ENV,
  PORT,
  HOST,
} = process.env;

export default {
  ENV,
  PORT,
  HOST,
};
