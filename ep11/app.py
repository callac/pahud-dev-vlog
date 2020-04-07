#!/usr/bin/env python3

from aws_cdk import core

from ep11.ep11_stack import Ep11Stack

import os


app = core.App()

ACCOUNT = app.node.try_get_context('account') or os.environ.get(
    'CDK_DEFAULT_ACCOUNT', 'unknown')
REGION = app.node.try_get_context('region') or os.environ.get(
    'CDK_DEFAULT_REGION', 'unknown')

env = core.Environment(region=REGION, account=ACCOUNT)

Ep11Stack(app, "ep11", env=env)

app.synth()
