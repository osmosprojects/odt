import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('odt_item_master')
export class ItemMasterEntity {
  @PrimaryGeneratedColumn()
  item_id!: number;

  @Column({ length: 10 })
  stream!: string;

  @Column({ length: 60, nullable: true })
  sku_code!: string;

  @Column({ length: 60, nullable: true })
  base_sku!: string;

  @Column({ length: 255, nullable: true })
  product_key!: string;

  @Column({ length: 100, nullable: true })
  brand_name!: string;

  @Column({ length: 32, nullable: true })
  oem_code!: string;

  @Column({ length: 60, nullable: true })
  packsize!: string;

  @Column({ length: 20, nullable: true })
  uom!: string;

  @Column({ length: 60, nullable: true })
  new_price!: string;

  @Column({ length: 60, nullable: true })
  new_mrp!: string;

  @Column({ length: 20, nullable: true, default: '0' })
  cogs!: string;

  @Column({ length: 60, nullable: true })
  net_hard_floor!: string;

  @Column({ length: 10, nullable: true })
  gm_level!: string;

  @Column({ length: 255, nullable: true })
  lbm?: string;

  @Column({ length: 255, nullable: true })
  pv?: string;
}
