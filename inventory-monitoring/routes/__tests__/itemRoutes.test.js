import mongoose from 'mongoose';

describe('get cpu data', () => {
  let connection;
  let db;
  const MONGO_URI = process.env.URI;

  beforeAll(async () => {
    connection = await mongoose.connect();
    db = await connection.db(MONGO_URI);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const cpu = db.collection('cpudatas');

    
   const cpuData =  await cpu.find();

    
    expect(response.status).toEqual(201);
  });
});