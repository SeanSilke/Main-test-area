# Import smtplib for the actual sending function
import smtplib

# Import the email modules we'll need
from email.mime.text import MIMEText

# Open a plain text file for reading.  For this example, assume that
# the text file contains only ASCII characters.
textfile = "textfile"
fp = open(textfile, 'rb')
# Create a text/plain message
msg = MIMEText(fp.read())
fp.close()

# me == the sender's email address
# you == the recipient's email address
msg['Subject'] = 'The contents of %s' % textfile
msg['From'] = "OrlovMail@gmail.com"
msg['To'] = "OrlovMail@gmail.com"

# Send the message via our own SMTP server, but don't include the
# envelope header.
server = smtplib.SMTP('127.0.0.1', 25)
server.sendmail("OrlovMail@gmail.com", ["OrlovMail@gmail.com"], msg.as_string())
server.quit()
