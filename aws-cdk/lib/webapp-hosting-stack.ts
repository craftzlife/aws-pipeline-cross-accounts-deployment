import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsEnv } from '../bin/configs';
import path = require('path');

export class WebAppHostingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const _HostingBucket = new cdk.aws_s3.Bucket(this, 'HostingBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketKeyEnabled: false,
      encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
    });
    
    const _S3Deployment = new cdk.aws_s3_deployment.BucketDeployment(this, 'S3Deployment', {
      sources: [
        cdk.aws_s3_deployment.Source.asset(path.resolve(process.cwd(), '../angular-static-webapp'), {
          bundling: {
            image: cdk.DockerImage.fromRegistry('node:22'),
            command: [
              'sh', '-c', 
              [
                'npm i',
                'npm run build',
                'cp -r dist /asset-output'
              ].join(' && ')
            ],
            user: 'root',
          }
        }),
      ],
      destinationBucket: _HostingBucket,
      serverSideEncryptionAwsKmsKeyId: 'alias/aws/s3',
    });
    
    // Temporary disable cloudfront as AWS require account to be verified before using
    // const _CloudFrontDistribution = new cdk.aws_cloudfront.Distribution(this, 'CloudfrontDistribution', {
    //   defaultBehavior: {
    //     origin: cdk.aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(_HostingBucket),
    //     allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
    //     cachedMethods: cdk.aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
    //     viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //   }
    // });
  }
}