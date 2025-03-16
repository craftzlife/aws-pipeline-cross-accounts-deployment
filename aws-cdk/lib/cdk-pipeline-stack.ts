import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsEnv } from '../bin/configs';
import * as cdk from 'aws-cdk-lib';
import { FrontEndStack as FrontEndStack } from './frontend-stack';
import { CrossAccountSupportStack } from './cross-account-support-stack';
import * as configs from '../bin/configs';
import { WebAPIStack } from './backend/webapi-stack';
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

    const pipeline = new cdk.aws_codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket: artifactBucket,
      // restartExecutionOnUpdate: true,
      pipelineType: cdk.aws_codepipeline.PipelineType.V2
    });
    const cdkPipeline = new cdk.pipelines.CodePipeline(this, 'CdkPipeline', {
      // pipelineName: 'CdkPipeline',
      codePipeline: pipeline,
      // artifactBucket: artifactBucket,
      synth: new cdk.pipelines.ShellStep('Synth', {
        input: cdk.pipelines.CodePipelineSource.gitHub('khaihoan2711/aws-pipeline-cross-accounts-deployment', 'main', {
          authentication: cdk.SecretValue.secretsManager('github-token'),
        }),
        commands: ['cd aws-cdk', 'npm ci', 'npm run build', 'npx cdk synth'],
        primaryOutputDirectory: 'aws-cdk/cdk.out',
      }),
      selfMutation: true,
      publishAssetsInParallel: false,
    });

    const deployDev = new CdkPipelineDeployStage(this, 'DeployDevelop', {
      env: AwsEnv.develop,
      alias: 'dev',
    });
    cdkPipeline.addStage(deployDev);

    const deployStaging = new CdkPipelineDeployStage(this, 'DeployStaging', {
      env: AwsEnv.staging,
      alias: 'stg',
    });
    cdkPipeline.addStage(deployStaging).addPre(new cdk.pipelines.ManualApprovalStep('ApproveStagingDeployment'));
    
    const deployProduction = new CdkPipelineDeployStage(this, 'DeployProduction', {
      env: AwsEnv.product,
      alias: 'prod',
    });
    cdkPipeline.addStage(deployProduction).addPre(new cdk.pipelines.ManualApprovalStep('ApproveProductionDeployment'));
    // Add Approve step before execute CloudFormation changeset

    // const _FrontendDeployStage = new FrontEndDeployStage(scope, 'FrontEnd', {
    //   restApiId: _WebAPIDeployStage.restApiUrl
    // });
    // cdkPipeline.addStage(_FrontendDeployStage);

  }
}

// export class CrossAccountSupportStage extends cdk.Stage {
//   constructor(scope: Construct, id: string, props?: cdk.StageProps) {
//     super(scope, id, props);

//     new CrossAccountSupportStack(this, 'CrossAccountSupportStack', {
//       env: AwsEnv.develop
//     });
//   }
// }

export interface CdkPipelineDeployStageProps extends cdk.StageProps {
  /** Alias of the application, used to name the stack */
  alias?: string
}
export class CdkPipelineDeployStage extends cdk.Stage {

  constructor(scope: Construct, id: string, props?: CdkPipelineDeployStageProps) {
    super(scope, id, props);

    const webapi = new WebAPIStack(this, 'WebAPI', {
      stackName: [configs.ProductName, props?.alias, 'WebAPI'].join('-')
    });

    const frontend = new FrontEndStack(this, 'FrontEnd', {
      stackName: [configs.ProductName, props?.alias, 'FrontEnd'].join('-'),
      restApiId: webapi.restApiId
    });
  }
}

// export class FrontEndDeployStage extends cdk.Stage {
//   constructor(scope: Construct, id: string, props: cdk.StageProps) {
//     super(scope, id, props);

//     const frontend = new FrontEndStack(this, 'WebAppHosting', {
//       stackName: [configs.ProductName, 'WebAppHosting'].join('-'),
//       env: AwsEnv.develop,
//       // restApiId: props.restApiId
//     });
//   }
// }