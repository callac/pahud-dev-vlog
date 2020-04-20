import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Ep15 = require('../lib/ep15-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Ep15.Ep15Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
