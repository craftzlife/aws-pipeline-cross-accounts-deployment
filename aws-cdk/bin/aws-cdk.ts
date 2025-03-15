#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkPipelineStack } from '../lib/cdk-pipeline-stack';
import { AwsEnv } from './configs';

const app = new cdk.App();
new AwsCdkPipelineStack(app, 'AwsCdkStack', {
  env: AwsEnv.tooling,
});