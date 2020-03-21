#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Ep7Stack } from '../lib/ep7-stack';

const app = new cdk.App();
new Ep7Stack(app, 'Ep7Stack');
