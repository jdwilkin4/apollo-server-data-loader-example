const { gql } = require("apollo-server");
const { GraphQLDecimal } = require("graphql-type-decimal");
const typeDefs = gql`
  scalar Decimal

  type Accessory {
    id: ID!
    product: String!
    price: Decimal
    brandId: Int
  }

  type Brand {
    id: ID!
    brandName: String!
    accessories: [Accessory]
  }

  type Query {
    brands: [Brand]
    accessory(id: Int): Accessory
  }
`;

module.exports = typeDefs;
