const { describe, expect, test } = require('@jest/globals');
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

describe('GET expenses endpoint', () => {
  test('Returns 200', (done) => {
    request(app).get('/api/expenses').expect(200, done);
  });
  test('Returns valid JSON', async () => {
    const response = await request(app)
      .get('/api/expenses')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          date: '2022-12-20T22:00:00.000Z',
          amount: 100,
          category: 'Ruoka',
          shop: 'Prisma',
        }),
        expect.objectContaining({
          id: 2,
          date: '2022-12-21T22:00:00.000Z',
          amount: 220.45,
          category: 'Bensa',
          shop: 'Neste',
        }),
      ]),
    );
  });
  test('Returns 1 expense', async () => {
    const response = await request(app)
      .get('/api/expenses/1')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        date: '2022-12-20T22:00:00.000Z',
        amount: 100,
        category: 'Ruoka',
        shop: 'Prisma',
      }),
    );
  });

  test('Returns 404 and Not Found', async () => {
    const response = await request(app).get('/api/expenses/404');
    expect(response.status).toEqual(404);
    expect(response.body).toContain('Not Found');
  });
});

describe('POST expenses endpoint', () => {
  afterAll(async () => {
    // eslint-disable-next-line quotes
    const deleteQuery = `DELETE FROM expenses WHERE shop LIKE 'Testikauppa';`;
    connection.query(deleteQuery, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  test('Creates a new expense', async () => {
    const expense = {
      date: '2022-01-03',
      amount: 76.54,
      category: 'Ruoka',
      shop: 'Testikauppa',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(201);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.id).toBeTruthy();
    expect(response.body.date).toEqual('2022-01-03');
    expect(response.body.amount).toEqual(76.54);
    expect(response.body.category).toEqual('Ruoka');
    expect(response.body.shop).toEqual('Testikauppa');
  });
  test('Should not allow no date ', async () => {
    const expense = {
      amount: 76.54,
      category: 'Ruoka',
      shop: 'Testikauppa',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"date" is required');
  });
  test('Should not allow empty date ', async () => {
    const expense = {
      date: '',
      amount: 76.54,
      category: 'Ruoka',
      shop: 'Testikauppa',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"date" is not allowed to be empty');
  });
  test('Should not allow no amount ', async () => {
    const expense = {
      date: '2022-01-03',
      category: 'Ruoka',
      shop: 'Testikauppa',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"amount" is required');
  });
  test('Should not allow amount to be any other than a number ', async () => {
    const expense = {
      date: '2022-01-03',
      amount: 'raha',
      category: 'Ruoka',
      shop: 'Testikauppa',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"amount" must be a number');
  });
  test('Should not allow no category ', async () => {
    const expense = {
      date: '2022-01-03',
      amount: 76.54,
      shop: 'Testikauppa',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" is required');
  });
  test('Should not allow empty category ', async () => {
    const expense = {
      date: '2022-01-03',
      amount: 76.54,
      category: '',
      shop: 'Testikauppa',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" is not allowed to be empty');
  });
  test('Should not allow no shop ', async () => {
    const expense = {
      date: '2022-01-03',
      amount: 76.54,
      category: 'Ruoka',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" is required');
  });
  test('Should not allow empty shop ', async () => {
    const expense = {
      date: '2022-01-03',
      amount: 76.54,
      category: 'Ruoka',
      shop: '',
    };

    const response = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" is not allowed to be empty');
  });
});

describe('DELETE expenses endpoint', () => {
  test('Deletes an expense by id', async () => {
    const expense = {
      date: '2022-01-08',
      amount: 76.54,
      category: 'Ruoka',
      shop: 'Testikauppa',
    };
    const postResponse = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);
    const postId = postResponse.body.id;

    const response = await request(app)
      .delete(`/api/expenses/${postId}`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('Expense deleted');
  });
  test('Checks that expense with given id exists', async () => {
    const response = await request(app)
      .delete('/api/expenses/404')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(response.text).toEqual('Not Found');
  });
});

describe('PUT expenses endpoint', () => {
  let postId;
  beforeAll(async () => {
    const expense = {
      date: '2022-01-04',
      amount: 76.54,
      category: 'Ruoka',
      shop: 'Testikauppa',
    };
    const postResponse = await request(app)
      .post('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);
    postId = postResponse.body.id;
  });

  test('Updates the expense with given id', async () => {
    const expense = {
      id: postId,
      date: '2022-01-04',
      amount: 100,
      category: 'Testi',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(postId);
    expect(response.body.date).toEqual('2022-01-04');
    expect(response.body.amount).toEqual(100);
    expect(response.body.category).toEqual('Testi');
    expect(response.body.shop).toEqual('Testikauppa');
  });
  test('Checks that id is an integer', async () => {
    const expense = {
      id: 1.2,
      date: '2022-01-04',
      amount: 100.02,
      category: 'Testi',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"id" must be an integer');
  });
  test('Should not allow no id', async () => {
    const expense = {
      date: '2022-01-04',
      amount: 100.02,
      category: 'Testi',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"id" is required');
  });
  test('Should not allow no date', async () => {
    const expense = {
      id: postId,
      amount: 100.02,
      category: 'Testi',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"date" is required');
  });
  test('Should not allow empty date', async () => {
    const expense = {
      id: postId,
      date: '',
      amount: 100.02,
      category: 'Testi',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"date" is not allowed to be empty');
  });
  test('Should not allow no amount', async () => {
    const expense = {
      id: postId,
      date: '2022-01-04',
      category: 'Testi',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"amount" is required');
  });
  test('Should not allow amount to be any other than a number', async () => {
    const expense = {
      id: postId,
      date: '2022-01-04',
      amount: 'string',
      category: 'Testi',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"amount" must be a number');
  });
  test('Should not allow no category', async () => {
    const expense = {
      id: postId,
      date: '2022-01-04',
      amount: 100.02,
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"category" is required');
  });
  test('Should not allow empty category', async () => {
    const expense = {
      id: postId,
      date: '2022-01-04',
      amount: 100.02,
      category: '',
      shop: 'Testikauppa',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"category" is not allowed to be empty');
  });
  test('Should not allow no shop', async () => {
    const expense = {
      id: postId,
      date: '2022-01-04',
      amount: 100.02,
      category: 'Testi',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"shop" is required');
  });
  test('Should not allow empty shop', async () => {
    const expense = {
      id: postId,
      date: '2022-01-04',
      amount: 100.02,
      category: 'Testi',
      shop: '',
    };
    const response = await request(app)
      .put('/api/expenses/')
      .set('Accept', 'application/json')
      .send(expense);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"shop" is not allowed to be empty');
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/expenses/${postId}`)
      .set('Accept', 'application/json');
    connection.end();
  });
});
