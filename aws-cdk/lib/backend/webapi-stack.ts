import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsEnv } from '../../bin/configs';

export class WebAPIStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const _WebAPI = new cdk.aws_apigateway.LambdaRestApi(this, 'WebAPI', {
      handler: new cdk.aws_lambda.Function(this, 'LambdaFunction', {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: cdk.aws_lambda.Code.fromInline(`
          exports.handler = async (event, context, callback) => {
            const response = {
              statusCode: 200,
              body: 'Hello from Lambda!',
            };
            return response;
          };
        `),
      }),
    });
  }

}