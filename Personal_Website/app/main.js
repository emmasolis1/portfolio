import fs from 'fs'
import path from 'path';

function servePublicFile(filename, httpRequest, httpResponse) {
  const full_path = path.join(process.cwd(), 'public', 'assets',filename);
  console.log(`Serve public ${full_path}`);
  fs.readFile(full_path, /*Event handler in error case*/ (error, content) => { // error-first functions.
    if (error) {
      serveNotFoundPage(httpRequest, httpResponse);
    } else {
      //httpResponse.setHeader('Content-Type', 'text/html');
      httpResponse.writeHead(200, 'text/html');
      httpResponse.write(content);
      httpResponse.end();
    }
  });
}

function serveHomePage(httpRequest, httpResponse) {
  // httpResponse.statusCode = 404
  servePublicFile('index.html', httpRequest, httpResponse);
}

function serveNotFoundPage(httpRequest, httpResponse) {
  const full_path = path.join(process.cwd(), 'public', 'assets', '404-error.html');
  console.log(`Serve public ${full_path}`);
  fs.readFile(full_path, /*Event handler in error case*/ (error, content) => { // error-first functions.
    if (error) {
      serveNotFoundPage(httpRequest, httpResponse);
    } else {
      //httpResponse.setHeader('Content-Type', 'text/html');
      httpResponse.writeHead(404, 'text/html');
      httpResponse.write(content);
      httpResponse.end();
    }
  });
}

// If we use export default we can only export one thing but the * I don't need it from where I import.
export function handleHttpRequest(httpRequest, httpResponse) {
  console.log(`${httpRequest.method} ${httpRequest.url}`);
  //console.log(httpRequest);
  if(httpRequest.method === "GET" && httpRequest.url === '/') {
    return serveHomePage(httpRequest, httpResponse);
  } else {
    // Serve 404 error page.
    return servePublicFile(httpRequest.url, httpRequest, httpResponse);
  }
}
// This is a way to do it, the other is to declare module.exports = {} up
// and put module.exports.handleHttpRequest = func...
//module.exports = {handleHttpRequest : handleHttpRequest}
