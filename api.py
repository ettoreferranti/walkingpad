#!/usr/bin/env python3

import logging
from quart import Quart
from quart import request
from quart_cors import cors
from quart import jsonify
from pad import WalkingPad
import asyncio

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARN)

app = Quart(__name__)
app = cors(app, allow_origin="*")
app.config["DEBUG"] = True

name = "r1 pro"

address = None

walkingPad = None


async def get_walking_pad():
    global address
    global walkingPad

    if address is None:
        logger.info(f"Getting the walking pad address ({name})")
        # address = await WalkingPad.get_address_by_name(name)
        address = await WalkingPad.scan(name)
        if address is None:
            logger.warning(f"Device {name} not found")
            walkingPad = None
    if walkingPad is None:
        walkingPad = WalkingPad(address)


@app.route('/', methods=['GET'])
def home():
    return "<h1>Home Office Manager</h1><p>This site offers an API to manage your home office remotely.</p>"


@app.route('/api/v1/resources/walkingpad/connect', methods=['POST'])
async def connect():
    global walkingPad

    await get_walking_pad()

    if walkingPad is not None:
        try:
            await walkingPad.connect()
            return jsonify({
                "action": "Connect",
                "result": "Success"
            })
        except:
            logger.exception("Connect error")
            return jsonify({
                "action": "Connect",
                "result": "Failure",
                "reason": "Exception"
            })

    else:
        return jsonify({
            "action": "Connect",
            "result": "Failure",
            "reason": "Disconnected"
        })


@app.route('/api/v1/resources/walkingpad/disconnect', methods=['POST'])
async def disconnect():
    global walkingPad

    if walkingPad is not None:
        try:
            await walkingPad.disconnect()
            walkingPad = None
            return jsonify({
                "action": "Disconnect",
                "result": "Success"
            })
        except:
            logger.exception("Status error")
            return jsonify({
                "action": "Disconnect",
                "result": "Failure",
                "reason": "Exception"
            })
    else:
        logger.warning("WalkingPad already disconnected")
        return jsonify({
            "action": "Disconnect",
            "result": "Failure",
            "reason": "Disconnected"
        })


@app.route('/api/v1/resources/walkingpad/status', methods=['GET'])
async def status():
    global walkingPad

    if walkingPad is not None:
        try:
            return await walkingPad.read_stats()
        except:
            logger.exception("Status error")
        return jsonify({
            "action": "Status",
            "result": "Failure",
            "reason": "Exception"
        })
    else:
        logger.warning("WalkingPad disconnected")
        return jsonify({
            "action": "Status",
            "result": "Failure",
            "reason": "Disconnected"
        })


@app.route('/api/v1/resources/walkingpad/start', methods=['POST'])
async def start_walking():
    global walkingPad

    if walkingPad is not None:
        try:
            await walkingPad.start_walking()
            return jsonify({
                "action": "Start",
                "result": "Success"
            })
        except:
            logger.exception("Status error")
            return jsonify({
                "action": "Start",
                "result": "Failure",
                "reason": "Exception"
            })
    else:
        logger.warning("WalkingPad disconnected")
        return jsonify({
            "action": "Start",
            "result": "Failure",
            "reason": "Disconnected"
        })


@app.route('/api/v1/resources/walkingpad/stop', methods=['POST'])
async def stop_walking():
    global walkingPad

    if walkingPad is not None:
        try:
            await walkingPad.stop_walking()
            return jsonify({
                "action": "Stop",
                "result": "Success"
            })
        except:
            logger.exception("Stop walking error")
        return jsonify({
            "action": "Stop",
            "result": "Failure",
            "reason": "Exception"
        })
    else:
        logger.warning("WalkingPad disconnected")
        return jsonify({
            "action": "Stop",
            "result": "Failure",
            "reason": "Disconnected"
        })


@app.route('/api/v1/resources/walkingpad/speed', methods=['POST'])
async def set_speed():
    speed = request.json['speed']
    logger.info(f"Setting speed to {speed}")


def main():
    app.run(host='0.0.0.0', port=8000)


if __name__ == "__main__":
    # execute only if run as a script
    main()
