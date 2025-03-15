#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkPipelineStack } from '../lib/cdk-pipeline-stack';
import * as configs from './configs';

const app = new cdk.App();
new AwsCdkPipelineStack(app, 'AwsCdkStack', {
  stackName: configs.ProductName,
  env: configs.AwsEnv.tooling,
});