#!/bin/bash

sudo docker logs rancher-demo 2>&1 | grep "Bootstrap Password:"
