#!/usr/bin/env python3

import logging
import flask
from flask import jsonify
from pad import WalkingPad
import asyncio

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

app = flask.Flask(__name__)
app.config["DEBUG"] = True

walkingPad = None

@app.route('/', methods=['GET'])
def home():
    return "<h1>Home Office Manager</h1><p>This site offers an API to manage your home office remotely.</p>"

@app.route('/api/v1/resources/walkingpad/status')
def status():
    walkingPad.connect()
    walkingPad.read_status()
    walkingPad.disconnect()
    return jsonify(walkingPad.get_status())

async def run():

    name = "r1 pro"

    logger.info(f"Getting the pad by name ({name})")
    walkingPad = await WalkingPad.get_pad_by_name(name)

    app.run()

def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())

if __name__ == "__main__":
    # execute only if run as a script
    main()