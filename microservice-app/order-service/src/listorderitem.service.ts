import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListOrderItem } from './listorderitem.entity';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ListOrderItemService {
    private client: ClientProxy;

    constructor(
        @InjectRepository(ListOrderItem) private listOrderItemRepo: Repository<ListOrderItem>
    ) {
        this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://user:password@rabbitmq:5672'],
            queue: 'order.list_order_items',
            queueOptions: { durable: true },
        },
        });
    }

    async create(listOrderItem: Partial<ListOrderItem>) {
        const order = await this.listOrderItemRepo.save(listOrderItem);
        this.client.emit('list_order_item_created', order);
        return order;
    }

    async findAll(orderId:number): Promise<ListOrderItem[]> {
        return this.listOrderItemRepo.find({ where: { orderId: orderId } });
    }
}
