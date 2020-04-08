import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';
import * as ec2 from '@aws-cdk/aws-ec2';
import { NodegroupAmiType, DefaultCapacityType } from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';

export class Ep13Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true });

    const adminRole = new iam.Role(this, 'AdminRole', { assumedBy: new iam.AccountRootPrincipal() })

    const cluster = new eks.Cluster(this, 'Cluster', { 
      vpc, 
      mastersRole: adminRole,
      version: '1.15',
      defaultCapacityInstance: new ec2.InstanceType('t3.large'),
      defaultCapacity: 3,
      // defaultCapacityType: DefaultCapacityType.EC2
    });

    cluster.addNodegroup('ExtraNG');

    cluster.addCapacity('SpotASG', {
      instanceType: new ec2.InstanceType('t3.large'),
      spotPrice: '0.1088',
      minCapacity: 10,
      maxCapacity: 20,
    })

    cluster.addFargateProfile('FargateProfile', {
      selectors: [
        { namespace: 'kube-system' },
        { namespace: 'default' }
      ]
    })

    // The code that defines your stack goes here
  }
}
