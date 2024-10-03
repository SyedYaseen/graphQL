import { ObjectType, Int, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  //@PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  //@Column()
  @Field()
  username: string;

  //@Column({ nullable: true })
  @Field({ nullable: true })
  displayName?: string;

  //@OneToOne(() => UserSetting)
  //@JoinColumn()
  //@Field({ nullable: true })
  //settings?: UserSetting;
}
