import {
  BaseEntity,
  Column,
  CreateDateColumn,  
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Directive, Field, Int, ObjectType } from "type-graphql";

@ObjectType("DealershipInv")
@Entity()
@Directive('@Key(fields: "id")')
export class DealershipInv extends BaseEntity {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, unique: true })
  unit_id?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  is_published?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  is_on_sale?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  is_sold?: boolean;

  @Field({ nullable: true })
  @Column({ type: "int", nullable: true })
  price?: number;

  @Field({ nullable: true })
  @Column({ type: "int", nullable: true })
  sales_price?: number;

  @Field({ nullable: true })
  @Column({ type: "int", nullable: true })
  published_price?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string

  @Field()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}

/* 
Dealership_inventory Schema






notes: string // Textfield - option
*/
