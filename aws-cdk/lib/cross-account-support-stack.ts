import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AwsEnv } from "../bin/configs";
import { AccountPrincipal, Role } from "aws-cdk-lib/aws-iam";

export class CrossAccountSupportStack extends Stack {

  public readonly iamRole: Role
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.iamRole = new Role(this, 'IamRole', {
      assumedBy: new AccountPrincipal(AwsEnv.tooling),
    });
  }
}
