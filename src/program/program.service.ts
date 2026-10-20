import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgramService {
    private items: any[] = [];

    create(data: any) {
        const newItem = { id: this.items.length + 1, ...data };
        this.items.push(newItem);
        return newItem;
    }

    findAll() {
        return this.items;
    }

    findOne(id: number) {
        return this.items.find(i => i.id === id);
    }

    update(id: number, data: any) {
        const index = this.items.findIndex(i => i.id === id);
        this.items[index] = { ...this.items[index], ...data };
        return this.items[index];
    }

    remove(id: number) {
        this.items = this.items.filter(i => i.id !== id);
    }
}