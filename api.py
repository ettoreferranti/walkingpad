#!/usr/bin/env python3

from fake_pad import FakeTreadmill
import logging
from quart import Quart
from quart import request
from quart_cors import cors, route_cors
from quart import jsonify
from pad import Treadmill
import yaml
from pathlib import Path


logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

app = Quart(__name__)
app = cors(app, allow_origin="*")
app.config["DEBUG"] = True

settings = {'name': 'r1 pro', 'simulation': False}

address = None

walkingPad = None

async def get_walking_pad():
    global address
    global walkingPad

    if walkingPad is not None:
        return

    if settings['simulation']:
        walkingPad = FakeTreadmill(await FakeTreadmill.scan(settings['name']))
    else:
        if address is None:
            logger.info(f"Getting the walking pad address ({settings['name']})")
            address = await Treadmill.scan(settings['name'])
            if address is None:
                logger.warning(f"Device {settings['name']} not found")
                walkingPad = None
                address = None
            else:
                walkingPad = Treadmill(address)


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
@route_cors(
    allow_headers=["content-type"],
    allow_methods=["POST"],
    allow_origin=["*"],
)
async def set_speed():
    global walkingPad

    if not request.is_json:
        return jsonify({
            "action": "Set Speed",
            "result": "Failure",
            "reason": "Request is not JSON"
        })
    speed_json = await request.get_json()
    speed = speed_json['speed']
    logger.info(f"Setting speed to {speed}")

    if walkingPad is not None:
        try:
            await walkingPad.set_speed(speed)
            return jsonify({
                "action": "Set Speed",
                "result": "Success",
                "value" : speed,
            })
        except:
            logger.exception("Set speed error")
        return jsonify({
            "action": "Set Speed",
            "result": "Failure",
            "reason": "Exception"
        })
    else:
        logger.warning("WalkingPad disconnected")
        return jsonify({
            "action": "Set Speed",
            "result": "Failure",
            "reason": "Disconnected"
        })

@app.route('/api/v1/resources/walkingpad/mode', methods=['POST'])
@route_cors(
    allow_headers=["content-type"],
    allow_methods=["POST"],
    allow_origin=["*"],
)
async def set_mode():
    global walkingPad

    if not request.is_json:
        return jsonify({
            "action": "Set Mode",
            "result": "Failure",
            "reason": "Request is not JSON"
        })
    mode_json = await request.get_json()
    mode = mode_json['mode']
    logger.info(f"Setting mode to {mode}")
    if mode < 0 or mode > 2:
        return jsonify({
            "action": "Set Mode",
            "result": "Failure",
            "reason": f"Mode out of range ({mode})"
        })
    if walkingPad is not None:
        try:
            await walkingPad.switch_mode(mode)
            return jsonify({
                "action": "Set Mode",
                "result": "Success",
                "value" : mode,
            })
        except:
            logger.exception("Mode changing error")
        return jsonify({
            "action": "Set Mode",
            "result": "Failure",
            "reason": "Exception"
        })
    else:
        logger.warning("WalkingPad disconnected")
        return jsonify({
            "action": "Set Mode",
            "result": "Failure",
            "reason": "Disconnected"
        })

def load_config():
    global settings

    path = 'api_settings.yaml'
    settings_file = Path(path)
    if settings_file.is_file():
        with open(r'api_settings.yaml') as file:
            settings = yaml.load(file, Loader=yaml.FullLoader)
            logger.info(f"Settings loaded: {settings}")
    else:
        with open(path, 'w') as file:
            yaml.dump(settings, file)


def main():
    load_config()
    app.run(host='0.0.0.0', port=8000)


if __name__ == "__main__":
    main()
