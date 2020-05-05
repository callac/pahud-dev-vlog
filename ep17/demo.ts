import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'APIDemo');

const api = new apigatewayv2.HttpApi(stack, 'Api', {
  defaultIntegration: new apigatewayv2.HttpProxyIntegration({
    url: 'https://pahud.dev',
  })
});

const echoHandler = new lambda.Function(stack, 'echoHandler', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: JSON.stringify(event) }; };'),
});

const listBooksHandler = new lambda.Function(stack, 'listBooksHandler', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "list books" }; };'),
});

const bookHandler = new lambda.Function(stack, 'bookHandler', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "Here you are: book_id=" + event.pathParameters.book_id }; };'),
});

// HTTP ANY /echo
api.addRoutes({
  integration: new apigatewayv2.LambdaProxyIntegration({
    handler: echoHandler
  }),
  path: '/echonow'
});

// HTTP GET|POST /books
api.addRoutes({
  integration: new apigatewayv2.LambdaProxyIntegration({
    handler: listBooksHandler
  }),
  path: '/books',
  methods: [ apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.POST ]
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

const endpointUrl = `https://${api.httpApiId}.execute-api.${cdk.Stack.of(stack).region}.${cdk.Stack.of(stack).urlSuffix
}`;

new cdk.CfnOutput(stack, 'ApiURL', { value: endpointUrl });
new cdk.CfnOutput(stack, 'BetaApiURL', { value: `${endpointUrl}/beta` });
new cdk.CfnOutput(stack, 'EchoURL', { value: `${endpointUrl}/echo` });
new cdk.CfnOutput(stack, 'ListBooksURL', { value: `${endpointUrl}/books`});
new cdk.CfnOutput(stack, 'BookURL', { value: `${endpointUrl}/books/{book_id}`});
