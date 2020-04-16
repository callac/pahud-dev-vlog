# EP14 立即開箱 Eclipse Theia Cloud IDE

![](https://img.youtube.com/vi/h7VSNBVt09A/maxresdefault.jpg)
https://youtu.be/h7VSNBVt09A


# About

This sample deploys the Eplipse Theia Cloud IDE in Amazon ECS with AWS Fargate. 

# Access Control
The ALB security group will only allow your `HOME_IP` as well as the [CloudFlare IPv4 CIDR adresses](https://www.cloudflare.com/ips-v4) so you can enable the [CloudFlare Access](https://www.cloudflare.com/zh-tw/products/cloudflare-access/) for access control.



# Deploy Steps

```bash
# install packages from package.json
$ npm i
# bootstrap only for the first time for the target region
$ cdk bootstrap
$ cdk diff -c DOMAIN_NAME=<YOUR_DOMAIN_NAME> -c ACM_ARN=<YOUR_ACM_ARN> -c HOME_IP=$(curl -s myip.today)
$ cdk deploy -c DOMAIN_NAME=<YOUR_DOMAIN_NAME> -c ACM_ARN=<YOUR_ACM_ARN> -c HOME_IP=$(curl -s myip.today)
$ cdk destroy
```
