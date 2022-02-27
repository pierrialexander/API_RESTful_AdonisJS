// Pacote utilizado para criar o nome único da imagem no banco de dados
// 
import { v4 as uuidv4 } from 'uuid';

// HttpContextContract: Contém todas a informações da requisição
// Parametros de rota, body que são os dados enviados para inserir, 
// tudo que é enviado na request.
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

// Importar o model Moment que conterá os dados a serem inseridos
import Moment from 'App/Models/Moment';
import Application from "@ioc:Adonis/Core/Application";


export default class MomentsController {

  /*
   * objeto com a configuraçao da requisição image.
   */
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  /*
   * STORE
   * Função que fará a inserção no banco de dados
   */
  // Primeiro desestruturar o que vem do HttpContextContract que é
  // o request, e response.
  public async store({request, response}: HttpContextContract) {
    // aqui pega todos os dados que vem no body da requição.
    const body = request.body()
    const image = request.file('image', this.validationOptions)

    if(image){
      // cria o nome, uuid e a extenção.
      const imageName = `${uuidv4()}.${image.extname}`
      // aguarda a resposta e move para a pasta indicada, aplicando o nome.
      await image.move(Application.tmpPath('uploads'), {
        name: imageName
      })

      // aqui aplica o nome da imagem no servidor, pois na pasta já salvou
      // com o nome correto, agora envia para a requisão para ser salvo no 
      // banco de dados o nome
      body.image = imageName
    }

    // variavel que irá receber os dados vindos no body da requisição
    // e irá aplicar o método create da ORM que irá dar o 
    // insert no banco de dados. Operação Asíncrona.
    const moment = await Moment.create(body);

    response.status(201);

    // envia a entidade que acabou de ser criada "moment"
    return {
      message: "Momento criado com sucesso!",
      data: moment,
    }
  }

  // MÉTODO INDEX. IRÁ RESGATAR OS DADOS DO BANCO
  public async index() {
    //resgator todos os registros sem um where, inclusive trazendo os 
    // comentarios relacionados. Se não ouvessem comentários, seria apenas
    // a opção .all() no lugar do .query()
    const moments = await Moment.query().preload("comments");

    // retorna em data (que são os dados) o que vem em moments.
    return {
      data: moments,
    }
  }

  // MÉTODO SHOW. IRÁ RESTAGAR UM ÚNICO DADO ATRAVÉS DE SUA ID
  public async show({params}: HttpContextContract) {
    // usando "findOrFail" se falhar, dá um erro.
    const moment = await Moment.findOrFail(params.id);

    // trazer os comentários também
    await moment.load('comments');

    return {
      data: moment,
    }
  }

  // MÉTODO DESTROY. DELETA REGISTRO DO BANCO DE DADOS
  public async destroy({params}: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id);

    await moment.delete();

    return {
      message: "Momento excluído com sucesso!",
      data: moment,
    }
  }

  // MÉTODO DESTROY. DELETA REGISTRO DO BANCO DE DADOS
  public async update({params, request}: HttpContextContract) {
    // pega o body da requisição
    const body = request.body()
    // encontra o momento desejado
    const moment = await Moment.findOrFail(params.id);

    // atualizamos as informações, pegamos os dados vindos do boby
    // e jogamos 
    moment.title = body.title
    moment.description = body.description

    // ROTINA DE VERIFICAÇÃO E ATUALIZAÇÃO DA IMAGEM
    if(moment.image != body.image || !moment.image){
        const image = request.file('image', this.validationOptions)  
        
        if (image){
            const imageName = `${uuidv4()}.${image.extname}`
            await image.move(Application.tmpPath('uploads'), {
              name: imageName
            })

            moment.image = imageName
        }
    }

    await moment.save()

    return {
      message: "Momento atualizado com sucesso!",
      data: moment,
    }
  }
}
