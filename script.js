function embedded() {
  try {
    return window.self !== window.top;
  } catch(e) {
    return true;
  }
}

if(embedded()){
  alertmodal("", "Please open this in a new tab.", ok="Open").then(() => {window.open("https://Zombie-TanKar.srikarbonala1.repl.co" + location.pathname)});
}