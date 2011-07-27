//window.onload=refreshTM();

var tunnelContainer=window.arguments[0].inn;
if(tunnelContainer==null){
	alert("Error: No tunnel container instance");
}
//var tunnelIDs="";

function refreshTM(){
	var tmBox = document.getElementById("TMbox");
	  
	//Empty the tmBox
	while (tmBox.firstChild) {
		tmBox.removeChild(tmBox.firstChild);
	}
	  
	var tunnelIDs=tunnelContainer.getKeysString();
	//var tunnelIDs="test1\ntest2";
//	alert("keystring: "+tunnelIDs);
	var tunnels=tunnelIDs.split("\n");
	var i=0;
	
	var testxt=[];
	var closeButton=[];
	var txtbutt=[];
	var separ=[];
	while(i<tunnels.length){
		var tunnelID=tunnels[i];
		if(tunnelID!=""){
//			alert("id: "+tunnelID+" i="+i);
			//Now add elements
			testxt[i]=document.createElement("text");
			testxt[i].setAttribute("value", ""+tunnelID);

			closeButton[i]=document.createElement("button");
			closeButton[i].setAttribute=("name", tunnelID);
			txtbutt[i]=document.createElement("text");
			txtbutt[i].setAttribute("value", "Close");
			closeButton[i].onclick=function() { tunnelContainer.closeTunnel(tunnelID); refreshTM(); };
			closeButton[i].appendChild(txtbutt[i]);
			
			tmBox.appendChild(testxt[i]);
			tmBox.appendChild(closeButton[i]);
		}
		i++;
	}
}

function closeTunnels(){
	alert("This will close all tunnels");
	tunnelContainer.closeAll();
	refreshTM();
}

/*
function closeTunnel(e){
	var tunnelID="idt??";
	alert("This will close tunnel "+tunnelID);
	//tunnelContainer.closeTunnel(tunnelID);
	refreshTM();
}
*/

function doClose(){
	return true;
}