import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Directive, Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType("DealershipOrg")
@Directive('@Key(fields: "id")')
export class DealershipOrg extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  street_address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  @Column({ type: "int", nullable: true })
  zip?: number;

  @Column({ type: "integer" })
  root_user: number;

  @Column("simple-array")
  admins: number[];

  @Field()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
