/// <reference types="cypress" />
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

  it('Deve listar usuários cadastrados', () => {
    
    cy.request('/usuarios').then((res) => {
      expect(res.status).to.eq(200);

      expect(res.body).to.have.property('usuarios');
      expect(res.body.usuarios).to.be.an('array');

      cy.log(`Quantidade de usuários: ${res.body.quantidade}`);
    
    });
  });
 
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    //TODO: 
  });

  it('Deve validar um usuário com email inválido', () => {
    //TODO: 
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    //TODO: 
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    //TODO: 
  });

