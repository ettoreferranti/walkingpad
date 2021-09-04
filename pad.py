#!/usr/bin/env python3

from bleak import BleakScanner, discover
from ph4_walkingpad.pad import Controller, WalkingPad
import logging
import asyncio

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class Treadmill:

    address = None
    controller = None
    minimal_cmd_space = 0.69

    def __init__(self, address):
        self.address = address
        self.controller = Controller()

    @staticmethod
    async def scan(name):
        devices_dict = {}
        devices_list = []
        walking_belt_candidates = []

        logger.info("Scanning for peripherals...")
        dev = await discover()
        for i in range(len(dev)):
            # Print the devices discovered
            info_str = ', '.join(["[%2d]" % i, str(dev[i].address), str(
                dev[i].name), str(dev[i].metadata["uuids"])])
            logger.info("Device: %s" % info_str)

            # Put devices information into list
            devices_dict[dev[i].address] = []
            devices_dict[dev[i].address].append(dev[i].name)
            devices_dict[dev[i].address].append(dev[i].metadata["uuids"])
            devices_list.append(dev[i].address)

            if name in dev[i].name.lower():
                walking_belt_candidates.append(dev[i])

        if len(walking_belt_candidates) > 0:
            return walking_belt_candidates[0]
        else:
            return None

    async def connect(self):
        logger.info(f"Connecting to {self.address}")
        await self.controller.run(self.address)
        await asyncio.sleep(self.minimal_cmd_space)

    async def disconnect(self):
        logger.info(f"Disconnecting from {self.address}")
        await self.controller.disconnect()
        await asyncio.sleep(self.minimal_cmd_space)

    async def read_history(self):
        logger.info(f"Reading history from {self.address}")
        await self.controller.ask_hist(0)
        await asyncio.sleep(self.minimal_cmd_space)

    async def read_stats(self):
        logger.info(f"Reading status from {self.address}")
        await self.controller.ask_stats()
        await asyncio.sleep(self.minimal_cmd_space)
        stats = self.controller.last_status
        mode = stats.manual_mode
        belt_state = stats.belt_state

        if (mode == WalkingPad.MODE_STANDBY):
            mode = "standby"
        elif (mode == WalkingPad.MODE_MANUAL):
            mode = "manual"
        elif (mode == WalkingPad.MODE_AUTOMAT):
            mode = "auto"

        if (belt_state == 5):
            belt_state = "standby"
        elif (belt_state == 0):
            belt_state = "idle"
        elif (belt_state == 1):
            belt_state = "running"
        elif (belt_state >=6):
            belt_state = "starting"

        distance_in_km = stats.dist / 100.0
        speed_in_km = stats.speed / 10.0

        latest_status = {}

        latest_status['steps'] = stats.steps
        latest_status['distance'] = distance_in_km
        latest_status['time'] = stats.time
        latest_status['speed'] = speed_in_km
        latest_status['mode'] = mode
        latest_status['belt'] = belt_state

        return latest_status

    async def start_walking(self):
        logger.info("Starting to walk")
        await self.controller.start_belt()
        await asyncio.sleep(self.minimal_cmd_space)

    async def stop_walking(self):
        logger.info("Starting to walk")
        await self.controller.stop_belt()
        await asyncio.sleep(self.minimal_cmd_space)

    async def set_speed(self,speed):
        logger.info(f"Setting speed to {speed}")
        await self.controller.change_speed(int(speed*10.0))
        await asyncio.sleep(self.minimal_cmd_space)
