# EP15 - 立即開箱 Bottlerocket with AWS CDK

![](https://img.youtube.com/vi/WQ3k75qgFgM/maxresdefault.jpg)
https://youtu.be/WQ3k75qgFgM


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
