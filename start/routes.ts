/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

/*
 * Configuração para aplicação rode as URLs /api.
 * Todas as rotas dentro desse grupo serão rotas de API.
 * Criamos essa função com o prefixo no final, que indica ser uma API.
 * Ou seja todas nossas rotas agora possuem o prefixo /api.
 */
Route.group(()=>{
  Route.get('/', async () => {
    return { hello: 'world' }
  })
  
  //Resource já inclui na rota (put, post, delete, etc)
  //apiOnly() define que a fota é refente a uma do tipo API apenas.
  Route.resource("/moments", "MomentsController").apiOnly();

  //Rota de Comentários, no exemplo abaixo fito apenas para post. Mas poderia
  //ter sido um Resouce, mas no exmplo fizemos apenas para inserção de dados.
  Route.post("/moments/:momentId/comments", "CommentsController.store");

}).prefix('/api')

