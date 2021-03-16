import json
import os
import subprocess


import sys

import webview

import signal
from subprocess import Popen, PIPE
#from freeport import * #Linux only

port=3000



def getData():
    f = open('manifest.json')
    data=json.load(f)
    f.close()
    return data
def geturl():
    port=getData()['port']
    return f"http://localhost:{port}/"
def _exit():
    #window.closed()
    killProcess(process)
    print("Exiting.")
   
def initNode():
    return subprocess.Popen("npm start", shell=True)

def killProcess(p):
    #LINUX USERS:
    
    subprocess.call(["kill", "-9", "%d" % int(p.pid+1)])
    subprocess.call(["kill", "-9", "%d" % int(p.pid)])
    os.system(f"freeport {port}")
    #-------------------------------------------------------#

    #WINDOWS USERS:        
    
    #command = f"netstat -ano | findstr {port}"
    #c = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr = subprocess.PIPE)
    #stdout, stderr = c.communicate()
    #pid = int(stdout.decode().strip().split(' ')[-1])
    #os.kill(pid, signal.SIGTERM)
    #-------------------------------------------------------#

port=getData()['port']
url = geturl()
window=webview.create_window('NeDB UI', geturl())
process=initNode()

try:
    #web.show()
    #process = initNode() 
    webview.start()
    
except:
    print("Error trying to show window.")

sys.exit(_exit())
