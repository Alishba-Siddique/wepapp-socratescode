chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
  console.error("socratescode could not enable the toolbar panel. Reload the extension from Chrome's extension settings.");
});
