#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Ep17Stack } from '../lib/ep17-stack';

const app = new cdk.App();
new Ep17Stack(app, 'Ep17Stack');
