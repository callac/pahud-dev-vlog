# EP17 - 立即開箱 Amazon API Gateway HTTP API with AWS CDK

![](https://img.youtube.com/vi/9Jr928vb1Yc/maxresdefault.jpg)
https://youtu.be/9Jr928vb1Yc


# Deploy Steps

```bash
# install packages from package.json
$ npm i
# bootstrap only for the first time for the target region
$ cdk bootstrap
$ cdk diff -c use_default_vpc=1
$ cdk deploy -c use_default_vpc=1
$ cdk destroy
```
