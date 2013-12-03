
/*Configuration*/
var FrancesVersion = "1.0.0",
    defaultDomain = 'jabbermisalabs.com',
    defaultConferenceServer = 'conference.jabbermisalabs.com',
    defaultBOSH = 'http://jabbermisalabs.com:5280/xmpp-httpbind',
    roomChat = "frances",
    NS_MUC = "http://jabber.org/protocol/muc";

var Frances = {
        registrationConnection: null,
        connection: null,
        room: null,
        nickname: null,
        on_public_message: function(message){
            var body = $(message).children("body").text();
            $("#general_msg").html(body);
            return true;
        }
    },
    loginCredentials = new Array();

$(document).ready(function(){
    $("#version").text(FrancesVersion);
    $("#init_frances").click(function(){
        Frances.room = roomChat+"@"+defaultConferenceServer;
        loginCredentials[0] = generateStringRandom();
        loginCredentials[1] = generateStringRandom();
        Frances.nickname = loginCredentials[0];
        registerUserXMPP(loginCredentials[0], loginCredentials[1]);
        loginUserXMPP(loginCredentials[0], loginCredentials[1]);
    });

    $("#stop_frances").click(function(){
        logoutXMPP();
    });

    $(window).unload(function(){
        logoutXMPP();
    });

    $("#send_txt").click(function(){
        sendMessage($("#txt_val").val());
        $("#txt_val").val(null);
    });
});


/***************************************
Function help to Connection XMPP Server
****************************************/

function registerUserXMPP(username, password){
    //Register a new user on the XMPP Server
    var registrationConnection = new Strophe.Connection(defaultBOSH);
    registrationConnection.register.connect(
        defaultDomain, function(status) {
        if (status === Strophe.Status.REGISTER) {
            registrationConnection.register.fields.username = username;
            registrationConnection.register.fields.password = password;
            registrationConnection.register.submit();
        }
        else if (status === Strophe.Status.REGISTERED) {
            registrationConnection.disconnect();
            delete registrationConnection;
            return true;
        }
        else if (status === Strophe.Status.SBMTFAIL) {
            return false;
        }
    });
}


function loginUserXMPP(username, password){
    //Login into XMPP Server
    Frances.connection = new Strophe.Connection(defaultBOSH);
    Frances.connection.connect(
        username+"@"+defaultDomain, password,
        function(status){
            if(status == Strophe.Status.CONNECTED){
                connected();
                return true;
            }else if(status === Strophe.Status.DISCONNECTED){
                disconnected();
                return false;
            }
        });
}


function logoutXMPP(){
    //Display disconnected
    disconnected();
    Frances.connection.send($pres({to: Frances.room+"/"+Frances.nickname,
                            type: "unavailable"}));
    Frances.connection.disconnect();
    window.location.reload(true);
    return true;
}


function connected(){

    $("#status_service").html("Conectado!");
    Frances.connection.send($pres().c("priority").t("-1"));
    initHandlers();
    Frances.connection.send($pres({
        to: Frances.room+"/"+Frances.nickname
    }).c("x", {xmlns: NS_MUC}));
    return true;
}


function disconnected(){
    $("#status_service").html("Desconectado!");
    return true;
}


function initHandlers(){
    Frances.connection.addHandler(Frances.on_public_message, null, "message", "groupchat");
    return true;
}

/*************************************
Function to connecct to vuala
**************************************/

function sendMessage(body){
    Frances.connection.send(
        $msg({
            to: Frances.room,
            type: "groupchat"}).c("body").t(body));
}

/*************************************
Several Functions 
**************************************/
function generateStringRandom(){
    //Generate String for User/Pass Ejjaberd
    var m="";
    for(i=0;i<10;i++){
        m+=String.fromCharCode(Math.random()*25+0x41);
    }
    return m
}
