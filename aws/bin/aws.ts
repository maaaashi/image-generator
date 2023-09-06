#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MaaaashiImageGenerator } from '../lib/aws-stack';

const app = new cdk.App();
new MaaaashiImageGenerator(app, 'MaaaashiImageGenerator');