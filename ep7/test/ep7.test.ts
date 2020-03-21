import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Ep7 = require('../lib/ep7-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Ep7.Ep7Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
