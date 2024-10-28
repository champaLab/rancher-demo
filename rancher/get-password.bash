#!/bin/bash

sudo docker logs ranchers 2>&1 | grep "Bootstrap Password:"
