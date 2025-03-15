import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AwsEnv } from "../bin/configs";
import { AccountPrincipal, Role } from "aws-cdk-lib/aws-iam";

export class CrossAccountSupportStack extends Stack {

  public readonly iamRole: Role
  /**
   * 
   * @param scope This class is deprecated, as cdk can handle cross account by it own roles
   * @param id 
   * @param props 
   */
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.iamRole = new Role(this, 'IamRole', {
      assumedBy: new AccountPrincipal(AwsEnv.tooling),
    });
  }
}
