/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
const Joi = require('joi');


describe('Testes da Funcionalidade Usuários', () => {

  it('[GET] Deve validar contrato de usuários', () => {
    const schema = Joi.object({
      quantidade: Joi.number().required(),
      usuarios: Joi.array().items(
        Joi.object({
          nome: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().optional(),
          administrador: Joi.string().valid('true', 'false').required(),
          _id: Joi.string().required()
        })
      ).required()
    });

    // Requisição e validação
    cy.request('/usuarios').then((res) => {
      expect(res.status).to.eq(200);
      const valid = schema.validate(res.body);

      // Se der erro de contrato, falha o teste mostrando o motivo
      if (valid.error) {
        throw new Error(valid.error);
      }
    });
  });

  it('[GET] Deve listar usuários cadastrados', () => {
    
    cy.request('/usuarios').then((res) => {
      expect(res.status).to.eq(200);

      expect(res.body).to.have.property('usuarios');
      expect(res.body.usuarios).to.be.an('array');

      cy.log(`Quantidade de usuários: ${res.body.quantidade}`);
    
    });
  });

  it('[POST] Deve cadastrar um usuário com sucesso', () => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const password = '123456';

    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: nome,
        email: email,
        password: password,
        administrador: 'true'
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(res.body).to.have.property('_id');
    })
  });

  it('[POST] Deve validar um usuário com email inválido', () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: 'emailinvalido',
      password: '123456',
      administrador: 'true'
    };
    
    cy.request({
    method: 'POST',
    url: '/usuarios',
    body: usuario,
    failOnStatusCode: false
  }).then((res) => {
    expect(res.status).to.eq(400);
    expect(res.body).to.have.property('email', 'email deve ser um email válido');
    })
  });

  it('[PUT] Deve editar um usuário previamente cadastrado', () => {
    const usuarioInicial = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: '123456',
    administrador: 'true'
  };

  cy.request('POST', '/usuarios', usuarioInicial).then((resCriacao) => {
    expect(resCriacao.status).to.eq(201);
    const idUsuario = resCriacao.body._id;

    
    const usuarioEditado = {
      nome: 'Usuário Editado ' + faker.person.firstName(),
      email: faker.internet.email(),
      password: '654321',
      administrador: 'false'
    };

    
    cy.request({
      method: 'PUT',
      url: `/usuarios/${idUsuario}`,
      body: usuarioEditado
    }).then((resEdicao) => {
      expect(resEdicao.status).to.eq(200);
      expect(resEdicao.body).to.have.property('message', 'Registro alterado com sucesso');
    });
  });
  });

  it('[DELETE] Deve deletar um usuário previamente cadastrado', () => {
    const usuario = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: '123456',
    administrador: 'true'
  };

  cy.request('POST', '/usuarios', usuario).then((resCriacao) => {
    expect(resCriacao.status).to.eq(201);
    const idUsuario = resCriacao.body._id;

    // 2) Requisição de exclusão (DELETE)
    cy.request({
      method: 'DELETE',
      url: `/usuarios/${idUsuario}`
    }).then((resDelete) => {
      expect(resDelete.status).to.eq(200);
      expect(resDelete.body).to.have.property('message', 'Registro excluído com sucesso');
    });
  });
  });
  
});