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

name = "r1 pro"

address = None

walkingPad = None

@app.route('/', methods=['GET'])
def home():
    return "<h1>Home Office Manager</h1><p>This site offers an API to manage your home office remotely.</p>"

@app.route('/api/v1/resources/walkingpad/status')
async def status():
    global address
    global walkingPad

    await get_walking_pad()

    #await walkingPad.connect()
    await walkingPad.read_stats()
    #await walkingPad.disconnect()

    return jsonify(walkingPad.get_status())

async def get_walking_pad():
    global address
    global walkingPad

    if address is None:
        logger.info(f"Getting the walking pad address ({name})")
        address = await WalkingPad.get_address_by_name(name)
        walkingPad = WalkingPad(address)
        await walkingPad.connect()


def main():
    #loop = asyncio.get_event_loop()
    #loop.run_until_complete(init_pad())

    app.run(host='0.0.0.0', port=3000)
    
   
if __name__ == "__main__":
    # execute only if run as a script
    main()