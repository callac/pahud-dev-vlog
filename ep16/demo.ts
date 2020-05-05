import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT
};

const stack = new cdk.Stack(app, 'PahudDevDemo', { env });

const echoHandler = new lambda.Function(stack, 'echoHandler', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: JSON.stringify(event) }; };'),
});

const listHandler = new lambda.Function(stack, 'listHandler', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "list books" }; };'),
});

const getBookHandler = new lambda.Function(stack, 'getBookHandler', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "here you are: book_id=" + event.pathParameters.book_id }; };'),
});

const api = new apigatewayv2.HttpApi(stack, 'HttpApi', {
  defaultIntegration: new apigatewayv2.HttpProxyIntegration({
    url: 'https://pahud.dev'
  })
});

// ANY /echo
api.addRoutes({
  integration: new apigatewayv2.LambdaProxyIntegration({ handler: echoHandler }),
  path: '/echo',
});

// GET /books
api.addRoutes({
  integration: new apigatewayv2.LambdaProxyIntegration({ handler: listHandler }),
  path: '/books',
  methods: [ apigatewayv2.HttpMethod.GET ]
});

// GET /books/{book_id}
api.addRoutes({
  integration: new apigatewayv2.LambdaProxyIntegration({ handler: getBookHandler }),
  path: '/books/{book_id}',
  methods: [apigatewayv2.HttpMethod.GET]
});

new cdk.CfnOutput(stack, 'ApiUrl', {
  value: `https://${api.httpApiId}.execute-api.${cdk.Stack.of(stack).region}.${cdk.Stack.of(stack).urlSuffix}`
});

new cdk.CfnOutput(stack, 'listBooks', {
  value: `https://${api.httpApiId}.execute-api.${cdk.Stack.of(stack).region}.${cdk.Stack.of(stack).urlSuffix}/books`
});

new cdk.CfnOutput(stack, 'getBooks', {
  value: `https://${api.httpApiId}.execute-api.${cdk.Stack.of(stack).region}.${cdk.Stack.of(stack).urlSuffix}/books/{book_id}`
});
