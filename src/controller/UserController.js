let users = require('../mocks/users');

module.exports = {
    
    listUsers(request, response) {

        const { order } = request.query;
        
        const sortedUsers = users.sort((a, b) => {

            if ( order == 'asc' ) {

                return a.id < b.id ? 1 : -1;

            }

            return a.id > b.id ? 1 : -1;

        });

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(sortedUsers));
    
    },
    
    getUserById(request, response) {
        
        const id = request.id

        const user = users.find(user => user.id == Number(id));

        if(!user) {

            return response.send(400, { error: `Cannot get /${id}` });
             
        }

        response.send(200, user); 

    },
    
    createUser(request, response) {

        const { body } = request;
        const lastUserId = users[users.length -1].id;

        const newUser = {
            id: lastUserId + 1,
            name: body.name 
        }

        users.push(newUser);
        response.send(200, newUser);

    },

    updateUser(request, response) {

        const { name } = request.body;
        const { id } = request.params;
        
        const user = users.find(user => user.id == Number(id));

        if(!user) {

            return response.send(400, { error: `User not found` });
            
        }

        user.name = name;
        response.send(200, user);

    },

    deleteUser(request, response) {

        const { id } = request.params;
        const user = users.find(user => user.id == Number(id));

        if(!user) {

            return response.send(400, { error: `User not found` });

        }

        users = users.filter(user => user.id != id);
        response.send(200, { sucess: 'User deleted successfully' });




    }
    
}