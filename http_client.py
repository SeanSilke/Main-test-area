#python http client

import httplib

# ip of receiver 172.30.0.42
conn = httplib.HTTPConnection('172.30.0.42:80')
conn.request("GET", "/index.html")
r1 = conn.getresponse()
#print dir(r1)
print r1.status, r1.reason,"\n", r1.getheaders()
data1 = r1.read()
print data1

"""
conn.request("GET", "/parrot.spam")
r2 = conn.getresponse()
print r2.status, r2.reason

data2 = r2.read()
conn.close()
"""
