tunnel22.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ tunnel22.showFirefoxContextMenu(e); }, false);
};

tunnel22.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-tunnel22").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { tunnel22.onFirefoxLoad(); }, false);
