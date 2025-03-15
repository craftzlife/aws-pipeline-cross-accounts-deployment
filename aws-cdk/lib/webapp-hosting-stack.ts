import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsEnv } from '../bin/configs';

export class WebAppHostingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const _HostingBucket = new cdk.aws_s3.Bucket(this, 'HostingBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    // const _S3Deployment = new cdk.aws_s3_deployment.BucketDeployment(this, 'S3Deployment', {
    //   sources: [
    //     cdk.aws_s3_deployment.Source.asset('../webapp/dist'),
    //   ],
    //   destinationBucket: _HostingBucket,
    // });
    const _CloudFrontDistribution = new cdk.aws_cloudfront.Distribution(this, 'CloudfrontDistribution', {
      defaultBehavior: {
        origin: cdk.aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(_HostingBucket),
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        cachedMethods: cdk.aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    });
  }
}