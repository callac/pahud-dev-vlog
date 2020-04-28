## VPC

### get or create a vpc

Sometimes I don't want to create a new VPC and would like to use the existing one either the default vpc or 
by specifying any vpc id. If I really need to create a new one, I prefer the shared single NAT across subnets.


```ts
 // use an existing vpc or create a new one
 const vpc = this.node.tryGetContext('use_default_vpc') === '1' ?
   ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }) :
   this.node.tryGetContext('use_vpc_id') ?
     ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: this.node.tryGetContext('use_vpc_id') }) :
     new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });
```

Sample

```sh
# deply in the default vpc
$ AWS_REGION={SPECIFIC_REGION} cdk deploy -c use_default_vpc=1

# deply in a specific existing vpc
$ AWS_REGION={SPECIFIC_REGION} cdk deploy -c use_vpc_id=vpc-1f5b7e78

# deply in a new vpc with shared NAT gateway
$ AWS_REGION={SPECIFIC_REGION} cdk deploy
```
