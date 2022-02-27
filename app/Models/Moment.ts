import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
// DEVIDO AO RELACIONAMENTO FEITO EM COMMENTS IMPORTAMOS ELE
import Comment from './Comment';

export default class Moment extends BaseModel {
  // ele tem muitos comentários
  // para resgatar os comentários da tabela comment
  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public image: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
