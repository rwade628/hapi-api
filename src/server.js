'user strict';

import Path from 'path';
import Hapi from 'hapi';
import Inert from 'inert';
import sharp from 'sharp';

const albumList = [
	{src: 'api/photos/1.jpeg', width:4, height:3, name: 'Album 1'},
	{src: 'api/photos/2.jpeg', width:1, height:1, name: 'Album 2'},
];

const photos = [
    {src: '/api/photos/1.jpeg', width:800, height:600},
    {src: '/api/photos/2.jpeg', width:800, height:800},
    {src: '/api/photos/3.jpeg', width:600, height:800},
    {src: '/api/photos/4.jpeg', width:600, height:800},
    {src: '/api/photos/5.jpeg', width:600, height:800},
    {src: '/api/photos/6.jpeg', width:800, height:600},
    {src: '/api/photos/7.jpeg', width:600, height:800},
    {src: '/api/photos/8.jpeg', width:800, height:600},
    {src: '/api/photos/9.jpeg', width:800, height:600}
];

var respond = function(path) {
    
};

const server = new Hapi.Server({
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

const provision = async () => {

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/api/{param*}',
        handler: (request, h) => {
            return new Promise(
              (resolve,reject) => {
                let path = Path.join(__dirname+'/public', request.params.param)
                sharp(path)
                    .jpeg({quality: 80, progressive: true, chromaSubsampling: '4:4:4'})
                    .toBuffer()
                    .then( data => {
                        resolve(
                            h.response(data)
                            .header('Content-type','image/jpeg')
                        )
                    })
                    .catch( err => {
                        resolve(h.response('err', err))
                    });
              }
            ) 
        }
    });

    server.route({
        method: 'GET',
        path: '/api/list/{folder}',
        handler: function (request, h) {
            return albumList;
        }
    });

    server.route({
        method: 'GET',
        path: '/api/gallery/{location}/{gallery}',
        handler: function (request, h) {
            return photos;
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

provision();