// This function will be called to give the necessary privileges to your JAR files
function policyAdd (loader, urls) {
    try {
        //If have trouble with the policy try changing it to
        //edu.mit.simile.javaFirefoxExtensionUtils.URLSetPolicy
        var str = 'edu.mit.simile.javaFirefoxExtensionUtils.URLSetPolicy';
        var policyClass = java.lang.Class.forName(
               str,
               true,
               loader
        );
        var policy = policyClass.newInstance();
        policy.setOuterPolicy(java.security.Policy.getPolicy());
        java.security.Policy.setPolicy(policy);
        policy.addPermission(new java.security.AllPermission());
        for (var j=0; j < urls.length; j++) {
            policy.addURL(urls[j]);
        }
    }catch(e) {
       alert(e+'::'+e.lineNumber);
    }
}

var cl;
//var tunnel22_sessions=new Array();
//var tunnel22_tabs=new Array();
var tunnelContainer=null;

function saveSession(host, uname, s_port, d_port){
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
    Components.utils.import("resource://gre/modules/NetUtil.jsm");
    var data=""+host+"|"+uname+"|"+s_port+"|"+d_port+"\n";

    var file = FileUtils.getFile("ProfD", ["tunnel22_connections"]);
    var ostream = FileUtils.openSafeFileOutputStream(file)

    var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
                createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    var istream = converter.convertToInputStream(data);

    NetUtil.asyncCopy(istream, ostream);
}

var tunnel22 = {

  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("tunnel22-strings");
    
    try{


        //Get extension folder installation path... (this works in firefox 3.x, for firefox 4.x use  AddonManager.getAddonByID)
//        var extensionPath = Components.classes["@mozilla.org/extensions/manager;1"].
//                getService(Components.interfaces.nsIExtensionManager).
//                getInstallLocation("tunnel22@libre-infosec.co.uk"). // guid of extension
//                getItemLocation("tunnel22@libre-infosec.co.uk");

        //For firefox version 4.*
        AddonManager.getAddonByID("tunnel22@libre-infosec.co.uk", function(addon){
            var extensionPath = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file.path;
            //The path logic would work if we include em:unpack for ff 4.x, for ff 3.x since things are unpacked by default things work

            // Get path to the JAR files (the following assumes your JARs are within a
            // directory called "java" at the root of your extension's folder hierarchy)
            // You must add this utilities (classloader) JAR to give your extension full privileges
            var extensionUrl = "file:///" + extensionPath.replace(/\\/g,"/");

            var classLoaderJarpath = extensionUrl + "/java/javaFirefoxExtensionUtils.jar";
            // Add the paths for all the other JAR files that you will be using
            var myJarpath = extensionUrl + "/java/lib/tunnel22.jar";
            var jschPath=extensionUrl + "/java/lib/jsch.jar";

            var urlArray = []; // Build a regular JavaScript array (LiveConnect will auto-convert to a Java array)
            urlArray[0] = new java.net.URL(myJarpath);
            urlArray[1] = new java.net.URL(jschPath);
            urlArray[2] = new java.net.URL(classLoaderJarpath);

            cl = java.net.URLClassLoader.newInstance(urlArray);

            //Set security policies using the above policyAdd() function
            policyAdd(cl, urlArray);
            var aClass = java.lang.Class.forName("com.tunnel22.TunnelContainer", true, cl);
            tunnelContainer = aClass.newInstance();
            

        });


        

    }
    catch(e){
        alert(e.toString());
    }
  },

  onMenuItemCommand: function(e) {
    //var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
//                                  .getService(Components.interfaces.nsIPromptService);

    var params={inn:null, out:null}
    window.openDialog(
      "chrome://tunnel22/content/connection-setup.xul",
      "window_tunnel22_tunnelSetup",
      "chrome,centerscreen,modal", params);
    if(params.out){
        var host, uname, d_port, s_port, save_conn;
        
        host=params.out.host;
        uname=params.out.uname;
        s_port=parseInt(params.out.s_port);
        d_port=parseInt(params.out.d_port);
        save_conn=params.out.save_conn;
//        alert("continue...");
        if(save_conn){
            saveSession(host, uname, s_port, d_port);
        }

        try{
//            alert("container: "+tunnelContainer);
            if(tunnelContainer.lTunnelExists(uname,host,s_port,d_port)&&tunnelContainer.lTunnelIsOpen(uname,host,s_port,d_port)){
                alert("A session with the specified parameters already exists.");
                return;                
            }

/*            if(tunnel22_sessions[""+uname+"@"+host+":"+s_port+"->"+d_port]!=null){
                //var bClass = java.lang.Class.forName("com.jcraft.jsch.Session", true, cl);
                var session=tunnel22_sessions[""+uname+"@"+host+":"+s_port+"->"+d_port];
                if(session.isConnected()){
                }

                tunnel22_sessions[""+uname+"@"+host+":"+s_port+"->"+d_port]=null;
            }
*/



            //var testvar = new java.net.URL("nothing");
            //var aClass = java.lang.Class.forName("com.tunnel22.TunnelContainer", true, cl);
            //var sshTunnel = aClass.newInstance();
//            alert("Now create tunnel");
            tunnelContainer.openTunnelL(uname, host, s_port, d_port);
            //tunnel22_sessions[""+uname+"@"+host+":"+s_port+"->"+d_port]=sshTunnel.getSession();


            //setTimeout(function (){url.open("http://127.0.0.1:"+s_port, "tunnel22 - "+host);}, 1000);
            var myUrl = "http://127.0.0.1:"+s_port;
            //var container = gBrowser.tabContainer;
            //var tBrowser = document.getElementById("content");
            var tunnel22tab = gBrowser.addTab(myUrl);
            
            gBrowser.selectedTab=tunnel22tab;
//            tunnel22tab.tunnel22Id=''+uname+'@'+host+':'+s_port+'->'+d_port;
            tunnel22tab.tunnel22Id="L|"+host+"|"+uname+"|"+s_port+"|"+d_port;
            tunnel22tab.addEventListener("TabClose", tunnel22TabRemoved, false);
        }
        catch(e){
           alert("passed "+e.toString());
        }
        //sshTunnel.open(host, uname, s_port, d_port);
        //alert("greeting");

    }
    //else{alert("no params.out");}
  },

  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    tunnel22.onMenuItemCommand(e);
  }
};

window.addEventListener("load", function () {tunnel22.onLoad();}, false);

function tunnel22TabRemoved(event) {
  var browser = gBrowser.getBrowserForTab(event.target);
  if(event.target.tunnel22Id!=null){
      tunnelContainer.closeTunnel(event.target.tunnel22Id);
      alert("Closed sshd tunnel: "+event.target.tunnel22Id);
  }
  
}


