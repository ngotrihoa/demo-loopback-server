import {Entity, model, property} from '@loopback/repository';

@model()
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @property({
    type: 'string',
    required: true,
  })
  barcode: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  category: object[];

  @property({
    type: 'object',
    required: true,
  })
  brand: object;

  @property({
    type: 'number',
    required: true,
  })
  price: object;

  @property({
    type: 'date',
    required: true,
  })
  create_at: string;

  @property({
    type: 'date',
    required: true,
  })
  update_at: string;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
