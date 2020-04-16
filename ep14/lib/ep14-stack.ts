import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

export class Ep14Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const DOMAIN_NAME = this.node.tryGetContext('DOMAIN_NAME');
    const ACM_ARN = this.node.tryGetContext('ACM_ARN');

    const cert = acm.Certificate.fromCertificateArn(this, 'Cert', ACM_ARN)

    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true })

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc })

    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,      
    })

    const tg = new elbv2.ApplicationTargetGroup(this, 'TG', {
      vpc,
      protocol: elbv2.ApplicationProtocol.HTTP
    })

    const listener = new elbv2.ApplicationListener(this, 'Listener', {
      loadBalancer: alb,
      certificates: [ cert ],
      defaultTargetGroups:  [ tg ],
      protocol: elbv2.ApplicationProtocol.HTTPS,
      open: false
    })

    const taskDefinition = new ecs.TaskDefinition(this, 'Task', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '512',
      memoryMiB: '1024',
    })

    taskDefinition.addContainer('Theia', {
      image: ecs.ContainerImage.fromRegistry('theiaide/theia:latest')
    }).addPortMappings({
      containerPort: 3000
    })

    const svc = new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
    })

    tg.addTarget(svc)

    const homeIp = this.node.tryGetContext('HOME_IP');
    alb.connections.allowFrom(ec2.Peer.ipv4(`${homeIp}/32`), ec2.Port.tcp(443));
    // alb.connections.allowFrom(ec2.Peer.ipv4(`${homeIp}/32`), ec2.Port.tcp(80));


    /**
     * protect it with Cloudflare Access and allow all CloudFlare CIDRs
     * see - https://www.cloudflare.com/ips-v4
     */
    const cloudflareIpList = [
      '173.245.48.0/20',
      '103.21.244.0/22',
      '103.22.200.0/22',
      '103.31.4.0/22',
      '141.101.64.0/18',
      '108.162.192.0/18',
      '190.93.240.0/20',
      '188.114.96.0/20',
      '197.234.240.0/22',
      '198.41.128.0/17',
      '162.158.0.0/15',
      '104.16.0.0/12',
      '172.64.0.0/13',
      '131.0.72.0/22'
    ]

    cloudflareIpList.map(m => alb.connections.allowFrom(ec2.Peer.ipv4(m), ec2.Port.tcp(443)))

    new cdk.CfnOutput(this, 'URL', { value: `https://${DOMAIN_NAME}`});
    new cdk.CfnOutput(this, 'ALBDNS', { value: alb.loadBalancerDnsName })

  }
}
