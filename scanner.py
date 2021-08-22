#!/usr/bin/env python3

from bleak import BleakScanner, BleakClient, BleakError
import logging
import asyncio

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

@asyncio.coroutine
def run():
    devices = yield from BleakScanner.discover()
    for d in devices:
        print(d)

    # device = await BleakScanner.find_device_by_filter(
    #     lambda d, ad: d.name and d.name.lower() == "R1 Pro"
    # )
    # print(device)

@asyncio.coroutine
def print_services(ble_address: str):
    device = yield from BleakScanner.find_device_by_address(ble_address, timeout=20.0)
    if not device:
        raise BleakError(f"A device with address {ble_address} could not be found.")
    #@asyncio.coroutine
    with BleakClient(device) as client:
        svcs = yield from client.get_services()
        print("Services:")
        for service in svcs:
            print(service)



def main():

    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    #loop.run_until_complete(print_services("C536F86F-95EB-43FE-B7E1-E72A4FD8F802"))

    

if __name__ == "__main__":
    # execute only if run as a script
    main()

