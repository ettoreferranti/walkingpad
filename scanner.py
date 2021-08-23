#!/usr/bin/env python3

from bleak import BleakScanner, BleakClient, BleakError
from ph4_walkingpad.pad import Controller
import logging
import asyncio
from pad import WalkingPad

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


async def run():
    #devices = await BleakScanner.discover()
    #for d in devices:
    #    logger.info(d)

    device = await BleakScanner.find_device_by_filter(
         lambda d, ad: d.name and d.name.lower() == "r1 pro"
    )
    if device is not None:
        logger.info(f"{device} found!")
    else:
        logger.info("R1 Pro not found, quitting...")
        quit()

    walkingPad = WalkingPad(device.address)

def main():

    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())

if __name__ == "__main__":
    # execute only if run as a script
    main()

