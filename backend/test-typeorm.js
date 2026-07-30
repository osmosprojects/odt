const { DataSource } = require('typeorm');
const { OfferDetailsEntity } = require('./dist/database/migrations/offer-details.entity');
const { CustDetailsEntity } = require('./dist/database/migrations/cust-details.entity');

async function testTypeORM() {
  const ds = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test',
    entities: [OfferDetailsEntity, CustDetailsEntity],
    synchronize: false,
    logging: true,
  });

  await ds.initialize();
  console.log('DataSource initialized.');

  const repo = ds.getRepository(OfferDetailsEntity);

  const customerCode = '13302828';
  const custIdStr = '13302828';
  const executiveCode = '';
  const customerName = 'AUTOMOTIVE';

  const code = (customerCode || '').trim();
  const custId = (custIdStr || '').trim();
  const execCode = (executiveCode || '').trim();
  const name = (customerName || '').trim();

  const qb = repo
    .createQueryBuilder('od')
    .select([
      'od.*',
      'cd.customer_name_text AS customer_name_text',
      'cd.bp_sales_rep_text AS bp_sales_rep_text',
      'cd.cust_state AS cust_state',
      'cd.segment_text AS segment_text',
      'cd.sub_segment_text AS sub_segment_text',
      'cd.customer_distributor_jde_ab_no_text AS customer_distributor_jde_ab_no_text',
      'cd.customer_turfview_no_text AS customer_turfview_no_text',
    ])
    .leftJoin(CustDetailsEntity, 'cd', 'od.offer_id = cd.offer_id')
    .where("od.offer_status NOT IN ('DEL')");

  const codes = [code, custId].filter(Boolean);
  const orConditions = [];
  const params = {};

  if (codes.length > 0) {
    orConditions.push(
      `(cd.customer_distributor_jde_ab_no_text IS NOT NULL AND cd.customer_distributor_jde_ab_no_text IN (:...codes))`
    );
    orConditions.push(
      `(cd.customer_turfview_no_text IS NOT NULL AND cd.customer_turfview_no_text IN (:...codes))`
    );
    params.codes = codes;
  }

  if (execCode) {
    orConditions.push(`(od.executive_code IS NOT NULL AND od.executive_code = :execCode)`);
    params.execCode = execCode;
  }

  if (name) {
    orConditions.push(
      `(cd.customer_name_text IS NOT NULL AND (TRIM(cd.customer_name_text) = :name OR cd.customer_name_text LIKE :likeName))`
    );
    params.name = name;
    params.likeName = `%${name}%`;
  }

  if (orConditions.length > 0) {
    qb.andWhere(`(${orConditions.join(' OR ')})`, params);
  }

  qb.orderBy('od.start_date', 'DESC').addOrderBy('od.id', 'DESC');

  console.log('[Generated SQL]:', qb.getSql());
  console.log('[SQL Parameters]:', JSON.stringify(params));

  console.log('Executing qb.getRawMany()...');
  try {
    const offers = await qb.getRawMany();
    console.log('Rows Returned:', offers.length);
    if (offers.length > 0) {
      console.log('First Row offer_id:', offers[0].offer_id);
    }
  } catch (error) {
    console.error('SQL ERROR caught during getRawMany():', error);
  }

  await ds.destroy();
}

testTypeORM().catch(console.error);
