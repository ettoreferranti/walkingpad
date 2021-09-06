#!/usr/bin/env python3

import logging
import asyncio
import threading
import time

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

#Belt: standby, idle, running, starting

#Mode: auto, manual, standby

class FakeTreadmill:

    def __init__(self, address):
        self.minimal_cmd_space = 0.69
        self.connected = False
        self.address = address
        self.status = {
            'steps': 0,
            'distance': 0,
            'time': 0,
            'speed': 0,
            'mode': 1,
            'belt_state': 'idle'
        }
        self.update_thread = None
        

    def update(self):
        while(self.status['belt_state'] == 'running'):
            self.status['steps'] = self.status['steps']+2
            self.status['distance'] = self.status['distance']+0.1
            self.status['time'] = self.status['time']+1
            time.sleep(1.0)

    @staticmethod
    async def scan(name):
        return "FA:KE:AD:DR:ES:S0"

    async def connect(self):
        self.connected = True

    async def disconnect(self):
        self.connected = False

    async def read_stats(self):
        logger.info(f"Reading status from {self.address}")

        return self.status

    async def start_walking(self):
        logger.info("Starting to walk")
        self.status['belt_state'] = 'running'
        self.status['speed']=3.0
        self.update_thread = threading.Thread(target=self.update)
        self.update_thread.start()
        await asyncio.sleep(self.minimal_cmd_space)

    async def stop_walking(self):
        logger.info("Starting to walk")
        self.status['belt_state'] = 'idle'
        self.status['speed'] = 0
        self.update_thread.join()
        await asyncio.sleep(self.minimal_cmd_space)

    async def set_speed(self, speed):
        logger.info(f"Setting speed to {speed}")
        self.status['speed'] = speed
        await asyncio.sleep(self.minimal_cmd_space)

    async def switch_mode(self,mode):
        logger.info(f"Setting mode to {mode}")
        self.status['mode'] = mode
        await asyncio.sleep(self.minimal_cmd_space)