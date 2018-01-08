#
# getWhitePaperViaBitcoind.py
# 
# bitcoin-whitepaper-direct
#
# this code (with a correction for trailing nulls) is originally from:
# 
# https://bitcoin.stackexchange.com/questions/35959/how-is-the-whitepaper-decoded-from-the-blockchain-tx-with-1000x-m-of-n-multisi
#

import subprocess

# raw = full hex of raw Tx using Bitcoin-cli
raw = subprocess.check_output(["bitcoin-cli", "getrawtransaction", "54e48e5f5c656b26c3bca14a8c95aa583d07ebe84dde3b7dd4a78f4e4186e713"])

outputs = raw.split("0100000000000000")

pdf = ""
for output in outputs[1:-2]:
    # there are 3 65-byte parts in this that we need
    cur = 6
    pdf += output[cur:cur+130].decode('hex')
    cur += 132
    pdf += output[cur:cur+130].decode('hex')
    cur += 132
    pdf += output[cur:cur+130].decode('hex')

pdf += outputs[-2][6:-4].decode("hex")
f = open("bitcoin.pdf", "wb")
f.write(pdf[8:-8])
f.close()
