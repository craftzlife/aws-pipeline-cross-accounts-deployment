import * as cdk from 'aws-cdk-lib';

export const ProductName = 'CdkPipelineCrossAccount';
export const ProductId = 'CPCA';

export enum AWS {
    tooling = 'tooling',
    develop = 'develop',
    product = 'product',
}
export const AwsEnv: { [key in AWS]: cdk.Environment } = {
    [AWS.tooling]: { account: '475174330998', region: 'ap-southeast-1' },
    [AWS.develop]: { account: '941377147791', region: 'ap-southeast-1' },
    [AWS.product]: { account: '825765401882', region: 'ap-southeast-1' },
};