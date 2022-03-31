# Parametros

--require dotenv/config
--port= <port> // Default 8080
--mode='<cluster | fork>' // Default Fork

# Comandos de inicio de servidor

npm run start-dev.--> Ejecuta el servidor con nodemon y modo cluster.
npx forever start --watch indexjs + parámetros. --> Ejecuta el servidor con forever.
npm run fork --> Ejecuta el servidor con pm2 en modo fork.
npm run cluster --> Ejecuta el servidor con pm2 en modo cluster.
