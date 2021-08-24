#!/usr/bin/env python3

from bleak import BleakScanner, BleakClient, BleakError
from ph4_walkingpad.pad import Controller, WalkingPad
import logging
import asyncio

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class WalkingPad:

    address = None
    controller = None

    latest_status = {
        "steps": None,
        "distance": None,
        "time": None
    }

    def __init__(self, address):
        self.address = address
        self.controller = Controller()
        self.controller.handler_last_status = self.on_new_latest_status
        self.controller.handler_cur_status = self.on_new_cur_status

    @staticmethod
    async def get_address_by_name(name="r1 pro"):
        logger.info(f"Getting the pad address by name ({name})")
        device = await BleakScanner.find_device_by_filter(
         lambda d, ad: d.name and d.name.lower() == name
        )
        if device is not None:
            logger.info(f"{device} found!")
        else:
            logger.error("R1 Pro not found, quitting...")
            quit()

        return device.address

    async def connect(self):
        logger.info(f"Connecting to {self.address}")
        await self.controller.run(self.address)
        await asyncio.sleep(1.0)

    async def disconnect(self):
        logger.info(f"Disconnecting from {self.address}")
        await self.controller.disconnect()
        await asyncio.sleep(1.0)

    async def read_history(self):
        logger.info(f"Reading history from {self.address}")
        await self.controller.ask_hist(0)
        await asyncio.sleep(1.0)

    async def read_stats(self):
        logger.info(f"Reading status from {self.address}")
        await self.controller.ask_stats()
        await asyncio.sleep(1.0)

    def get_status(self):
        return self.latest_status

    def on_new_latest_status(self, sender, status):
        logger.info(f"Latest status received: {status}")
        distance_in_km = status.dist / 100.0

        logger.info("Received Record:")
        logger.info(f"Distance: {distance_in_km}km")
        logger.info(f"Time: {status.time} seconds")
        logger.info(f"Steps: {status.steps}")

        self.latest_status['steps'] = status.steps
        self.latest_status['distance'] = distance_in_km
        self.latest_status['time'] = status.time

    def on_new_cur_status(self, sender, status):
        logger.info(f"Current status received: {status}")
        distance_in_km = status.dist / 100.0

        logger.info("Received Record:")
        logger.info(f"Distance: {distance_in_km}km")
        logger.info(f"Time: {status.time} seconds")
        logger.info(f"Steps: {status.steps}")

        self.latest_status['steps'] = status.steps
        self.latest_status['distance'] = distance_in_km
        self.latest_status['time'] = status.time