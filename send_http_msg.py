import xmpp
import sys

userID   = 'asim@jabbermisalabs.com'
password = 'asim'
ressource = 'asim'
room = "frances@conference.jabbermisalabs.com"

jid  = xmpp.protocol.JID(userID)
jabber = xmpp.Client(jid.getDomain(), debug=[])

connection = jabber.connect()
if not connection:
    sys.stderr.write('Could not connect\n')
else:
    sys.stderr.write('Connected with %s\n' % connection)

auth = jabber.auth(jid.getNode(), password, ressource)
if not auth:
    sys.stderr.write("Could not authenticate\n")
else:
    sys.stderr.write('Authenticate using %s\n' % auth)

jabber.sendInitPresence(requestRoster=1)
message = xmpp.Message(room, "Hola soy Python!!")
message.setAttr('type', 'groupchat')
jabber.send(message)
