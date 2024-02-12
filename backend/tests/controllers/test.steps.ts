import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import { prismaMock } from '../../setupTests';
import { Restaurant } from '@prisma/client';

const feature = loadFeature('tests/features/tests.feature');
const request = supertest(app);

defineFeature(feature, (test) => {
  let response: supertest.Response;
  let restaurants: Restaurant[] = [];
  test('Leitura de restaurantes do sistema', async ({
    given,
    when,
    then,
    and,
  }) => {
    given(
      /^existe um restaurante cadastrado no sistema com os dados "(.*)" "(.*)", email "(.*)" e senha "(.*)"$/,
      async (name: string, cnpj: string, email: string, password: string) => {
        restaurants.push({ id: 1, name, cnpj, email, password });
      }
    );

    and(
      /^existe um restaurante cadastrado no sistema com os dados "(.*)" "(.*)", email "(.*)" e senha "(.*)"$/,
      async (name: string, cnpj: string, email: string, password: string) => {
        restaurants.push({ id: 2, name, cnpj, email, password });
        prismaMock.restaurant.findMany.mockResolvedValue(restaurants);
      }
    );

    when(/^uma requisição GET é enviada para "(.*)"$/, async (url) => {
      response = await request.get(url);
    });

    then(
      /^é retornada uma mensagem com o status "(.*)"$/,
      async (statusCode) => {
        await expect(response.status).toBe(parseInt(statusCode, 10));
      }
    );

    and(
      /^a mensagem contém "(.*)", "(.*)", "(.*)"$/,
      async (name, cnpj, email) => {
        await expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name, cnpj, email }),
          ])
        );
      }
    );

    and(
      /^a mensagem contém "(.*)", "(.*)", "(.*)"$/,
      async (name, cnpj, email) => {
        await expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name, cnpj, email }),
          ])
        );
      }
    );
  });
});
