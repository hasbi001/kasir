import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ListOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;
  
  @Column()
  itemId: number;

  @Column()
  quantity: number;

  @Column()
  totalprice: number;
}