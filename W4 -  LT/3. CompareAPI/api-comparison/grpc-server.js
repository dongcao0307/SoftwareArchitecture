const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const books = require('./data');

const packageDef = protoLoader.loadSync('book.proto');
const bookProto = grpc.loadPackageDefinition(packageDef);

const server = new grpc.Server();
server.addService(bookProto.BookService.service, {
    getBook: (call, callback) => {
        const book = books.find(b => b.id === call.request.id);
        callback(null, book);
    }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('✅ gRPC Server: Running on port 50051');
    server.start();
});