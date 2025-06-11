import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ItemService {
    private client: ClientProxy;

    constructor(
        @InjectRepository(Item) private itemRepo: Repository<Item>
    ) {
        this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://user:password@rabbitmq:5672'],
            queue: 'order.items',
            queueOptions: { durable: true },
        },
        });
    }

    async create(itemData: Partial<Item>) {
        const order = await this.itemRepo.save(itemData);
        this.client.emit('item_created', order);
        return order;
    }

    async findAll(): Promise<Item[]> {
        return this.itemRepo.find();
    }

    async findOne(id: number): Promise<Item | undefined> {
        const item = await this.itemRepo.findOne({ where: { id } });
        return item === null ? undefined : item;
    }
}
