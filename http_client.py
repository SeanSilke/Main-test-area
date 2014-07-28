#python http client

import httplib

# ip of receiver 172.30.0.42
conn = httplib.HTTPConnection('sergey-vn:8888')
conn.request("GET", "")
r1 = conn.getresponse()
#print r1.status, r1.reason,"\n", r1.getheaders()

print r1.read()
