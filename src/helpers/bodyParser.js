/**
 * 
 * @param {http.IncomingMessagew} request 
 * @param {Function} callback handler responsável por lidar com os dados enviados
 */
function bodyParser(request, callback) {

    let body = '';
    // esse event lsitener é utilizado pois as informações chegam por meio de streams,
    // ou seja, são enviados pequenos pacotes, que podem ou não chegarem ao mesmo tempo
    // por isso é necessário juntar todos os pacotes para formamos a informação 
    request.on('data', chunk => body += chunk);

    request.on('end', () => { // event listner que verifica quando todos os pacotes já foram transmitidos
        
        body = JSON.parse(body);
        request.body = body;
        callback();

    });
    
}


module.exports = bodyParser;