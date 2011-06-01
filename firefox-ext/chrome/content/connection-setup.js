// Called once when the dialog displays
//function onLoad() {
//  // Use the arguments passed to us by the caller
//  document.getElementById("name").value = window.arguments[0].inn.name;
//  document.getElementById("description").value = window.arguments[0].inn.description;
//  document.getElementById("enabled").checked = window.arguments[0].inn.enabled;
//}

// Called once if and only if the user clicks OK
function doOK() {
   // Return the changed arguments.
   // Notice if user clicks cancel, window.arguments[0].out remains null
   // because this function is never called
    if(document.getElementById("host").value==""){
        alert("No host entered");
        return false;
    }
    if(document.getElementById("uname").value==""){
        alert("No username entered");
        return false;
    }
    if(isNaN(parseInt(document.getElementById("s_port").value))||parseInt(document.getElementById("s_port").value)<0){
        alert("Invalid source port");
        return false;
    }
    if(isNaN(parseInt(document.getElementById("d_port").value))||parseInt(document.getElementById("d_port").value)<0){
        alert("Invalid destination port");
        return false;
    }
   window.arguments[0].out = {host:document.getElementById("host").value,
        uname:document.getElementById("uname").value,
        s_port:document.getElementById("s_port").value,
        d_port:document.getElementById("d_port").value,
        save_conn:document.getElementById("save_conn").checked};
   return true;
}

function doCancel(){
    return true;
}