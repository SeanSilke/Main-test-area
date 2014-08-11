import re

str = 'command: http://www.google.com/'
match = re.search(r"(^\w+):\s(.+$)", str)
# If-statement after search() tests if it succeeded
if match:
	print 'found__', match.group(2) ## 'found word:cat'
else:
	print 'did not find'
