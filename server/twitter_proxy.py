#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" A proxy to twitter APIs.

File: twitter_proxy.py
Author: SpaceLis
Email: Wen.Li@tudelft.nl
GitHub: http://github.com/spacelis

"""
import json
from flask import Flask
from flask import Response
from flask import request
from flask import send_from_directory
from requests_oauthlib import OAuth1Session


with open('cred.json') as fin:
    CRED = json.load(fin)
    twitter = OAuth1Session(CRED['client_key'],
                            CRED['client_secret'],
                            CRED['access_token'],
                            CRED['access_token_secret'])

app = Flask(__name__, static_folder='static', static_url_path='/static')

@app.route('/tp/<path:path>', methods=['GET', 'POST'])
def reroute(path):
    """ Sign a message call
    :returns: @todo

    """
    print path
    if request.query_string:
        path = "/%s?%s" % (path, request.query_string)
    else:
        path = '/' + path
    r = twitter.get('https://api.twitter.com' + path)
    hdrs = dict(r.headers)
    del hdrs['content-encoding']
    return (r.text, r.status_code, hdrs.iteritems())

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('../client', path)

if __name__ == "__main__":
    app.debug = True
    app.run(port=9090)
