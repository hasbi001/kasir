import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Item } from './item.entity';
import { ListOrderItem } from './listorderitem.entity';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class OrderService {
    private client: ClientProxy;

    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(Item) private itemRepo: Repository<Item>,
        @InjectRepository(ListOrderItem) private listOrderItemRepo: Repository<ListOrderItem>
    ) {
        this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://root:root@rabbitmq:5672'],
            queue: 'orders',
            queueOptions: { durable: true },
        },
        });
    }

    async create(orderData: Partial<Order>) {
        const order = await this.orderRepo.save(orderData);
        this.client.emit('order_created', order);
        return order;
    }

    async findAll(): Promise<Order[]> {
        return this.orderRepo.find();
    }

    async findOne(id: number): Promise<Order | undefined> {
        const order = await this.orderRepo.findOne({ where: { id } });
        return order === null ? undefined : order;
    }

    async update(id: number, orderData: Partial<Order>): Promise<Order | undefined> {
        await this.orderRepo.update(id, orderData);
        return this.findOne(id);
    }
}
