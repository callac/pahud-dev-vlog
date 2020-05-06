import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2'
import * as lambda from '@aws-cdk/aws-lambda';

export class Ep17Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigatewayv2.HttpApi(this, 'Api', {
      defaultIntegration: new apigatewayv2.HttpProxyIntegration({
        url: 'https://pahud.dev',
      })
    });

    const echoHandler = new lambda.Function(this, 'echoHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: JSON.stringify(event) }; };'),
    });

    const listBooksHandler = new lambda.Function(this, 'listBooksHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "list books" }; };'),
    });

    const bookHandler = new lambda.Function(this, 'bookHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "Here you are: book_id=" + event.pathParameters.book_id }; };'),
    });

    // HTTP ANY /echo
    api.addRoutes({
      integration: new apigatewayv2.LambdaProxyIntegration({
        handler: echoHandler
      }),
      path: '/echo'
    });

    // HTTP GET|POST /books
    api.addRoutes({
      integration: new apigatewayv2.LambdaProxyIntegration({
        handler: listBooksHandler
      }),
      path: '/books',
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.POST]
    });

    // HTTP GET DELETE POST /books/{book_id}
    api.addRoutes({
      integration: new apigatewayv2.LambdaProxyIntegration({
        handler: bookHandler
      }),
      path: '/books/{book_id}',
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.POST]
    });

    api.addStage('BetaStage', {
      stageName: 'beta',
      autoDeploy: true
    });

    new cdk.CfnOutput(this, 'ApiURL', { value: api.url! });
    new cdk.CfnOutput(this, 'BetaApiURL', { value: `${api.url}/beta` });
    new cdk.CfnOutput(this, 'EchoURL', { value: `${api.url}/echo` });
    new cdk.CfnOutput(this, 'ListBooksURL', { value: `${api.url}/books` });
    new cdk.CfnOutput(this, 'BookURL', { value: `${api.url}/books/{book_id}` });

  }
}
