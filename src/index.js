const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const bodyParser = require('./helpers/bodyParser');

const server = http.createServer((request, response) => {
    
    const pasrsedUrl = new URL(`http://localhost:3000${request.url}`)
    
    let { pathname } = pasrsedUrl;
    let id = null;

    // o filter(Bolean) funciona da seguinte maneira, ele pega o valor atual do objeto
    // e converte para boolean, caso true, retorna o objeto, caso false não retorna
    const splitEndPoint = pathname.split('/').filter(Boolean);
    
    if(splitEndPoint.length > 1) {

        pathname = `/${splitEndPoint[0]}/:id`
        id = splitEndPoint[1];
    }

    const route = routes.find((routeObj) => ( // retorna o objeto que contem a rota e seu manipulador
    
        routeObj.endpoint == pathname && routeObj.method == request.method
    
    ));

    if(route) { // Se encontrar alguma rota, chama a manipuladora
        
        // fromEntires serve para converter o Iterator para um objeto
        request.query = Object.fromEntries(pasrsedUrl.searchParams); // searchParams possui uma instânciua da classe URLSearchParams, que é um itereator
        request.params = { id };

        response.send = ((statusCode, body) => {

            response.writeHead(statusCode, { 'content-type': 'application/json' });
            response.end(JSON.stringify(body));

        });

        if(['POST', 'PUT', 'PATCH'].includes(request.method)) {
        
            bodyParser(request, () => route.handler(request, response));
        
        } else {

            route.handler(request, response);
        }

    } else {

        response.writeHead(400, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ error: `Cannot ${request.method}` }));
    
    }

});

server.listen(3000, () => console.log(' Server started at http://localhost:3000'));