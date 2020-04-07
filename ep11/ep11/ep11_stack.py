from aws_cdk import (
    core,
    aws_ec2 as ec2,
    aws_eks as eks,
    aws_ecs as ecs,
    aws_iam as iam
)


class Ep11Stack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        vpc = ec2.Vpc.from_lookup(self, 'Vpc', is_default=True)
        # vpc = ec2.Vpc(self, 'Vpc', max_azs=3, nat_gateways=1)

        admin_role = iam.Role(self, 'AdminRole', assumed_by=iam.AccountRootPrincipal())

        cluster = eks.Cluster(self, 'Cluster',
                              vpc=vpc,
                              masters_role=admin_role,
                              version='1.15',
                              default_capacity=2)

        cluster.add_capacity('SpotCapacity',
                             instance_type=ec2.InstanceType('t3.large'),
                             spot_price='0.1088',
                             min_capacity=4)

        core.CfnOutput(self, 'Region', value=self.region)
        core.CfnOutput(self, 'VpcId', value=vpc.vpc_id)

        # The code that defines your stack goes here
