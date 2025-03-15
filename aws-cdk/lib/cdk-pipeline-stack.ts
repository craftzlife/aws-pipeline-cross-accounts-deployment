import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsEnv } from '../bin/configs';
import * as cdk from 'aws-cdk-lib';

export class AwsCdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const artifactEncryptKey = new cdk.aws_kms.Key(this, 'ArtifactEncryptKey', {
      enableKeyRotation: true,
    });
    const artifactBucket = new cdk.aws_s3.Bucket(this, 'Artifacts', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketKeyEnabled: true,
      encryptionKey: artifactEncryptKey,
      encryption: cdk.aws_s3.BucketEncryption.KMS,
      enforceSSL: true,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
    });

    const cdkPipeline = new cdk.pipelines.CodePipeline(this, 'CdkPipeline', {
      pipelineName: 'CdkPipeline',
      artifactBucket: artifactBucket,
      synth: new cdk.pipelines.ShellStep('Synth', {
        input: cdk.pipelines.CodePipelineSource.gitHub('khaihoan2711/aws-pipeline-cross-accounts-deployment', 'main', {
          authentication: cdk.SecretValue.secretsManager('github-token'),
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
      selfMutation: true,
    });

    const _WebAppHostingStage = new WebAppHostingStage(this, 'WebAppHostingStage');
    cdkPipeline.addStage(_WebAppHostingStage);

    // const _CrossAccountSupportStage = new CrossAccountSupportStage(this, 'CrossAccountSupportStage');
    // cdkPipeline.addStage(_CrossAccountSupportStage);
  }
}

export class CrossAccountSupportStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new cdk.Stack(this, 'CrossAccountSupportStack', {
      stackName: 'CrossAccountSupportStack',
      env: AwsEnv.tooling,
    });
  }
}

export class WebAppHostingStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new cdk.Stack(this, 'WebAppHostingStack', {
      stackName: 'WebAppHostingStack',
      env: AwsEnv.develop,
    });
  }
}