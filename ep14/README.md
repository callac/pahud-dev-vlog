# EP14 立即開箱 Eclipse Theia Cloud IDE

![](https://img.youtube.com/vi/h7VSNBVt09A/maxresdefault.jpg)
https://youtu.be/h7VSNBVt09A


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
