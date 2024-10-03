import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

let games = [
  { id: "1", title: "Zelda, Tears of the Kingdom", platform: ["Switch"] },
  { id: "2", title: "Final Fantasy 7 Remake", platform: ["PS5", "Xbox"] },
  { id: "3", title: "Elden Ring", platform: ["PS5", "Xbox", "PC"] },
  { id: "4", title: "Mario Kart", platform: ["Switch"] },
  { id: "5", title: "Pokemon Scarlet", platform: ["PS5", "Xbox", "PC"] },
]

let authors = [
  { id: "1", name: "mario", verified: true },
  { id: "2", name: "yoshi", verified: false },
  { id: "3", name: "peach", verified: true },
]

let reviews = [
  { id: "1", rating: 9, content: "lorem ipsum", author_id: "1", game_id: "2" },
  { id: "2", rating: 10, content: "lorem ipsum", author_id: "2", game_id: "1" },
  { id: "3", rating: 7, content: "lorem ipsum", author_id: "3", game_id: "3" },
  { id: "4", rating: 5, content: "lorem ipsum", author_id: "2", game_id: "4" },
  { id: "5", rating: 8, content: "lorem ipsum", author_id: "2", game_id: "5" },
  { id: "6", rating: 7, content: "lorem ipsum", author_id: "1", game_id: "2" },
  { id: "7", rating: 10, content: "lorem ipsum", author_id: "3", game_id: "1" },
]

const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
  }
  type Review {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
  }
  type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
  }
  type Query {
    games: [Game]
    game(id: ID!): Game
    reviews: [Review]
    review(id: ID!): Review
    authors: [Author]
    author(id: ID!): Author
  }

  type Mutation {
    deleteGame(id: ID!): [Game]
    updateGame(game: updateInput): Game
  }

  input updateInput {
    id: ID!
    title: String
    platform: String
  }
`

const resolvers = {
  Query: {
    games() {
      return games
    },
    game(_, args) {
      return games.find((game) => game.id === args.id)
    },
    authors() {
      return authors
    },
    author(_, args) {
      return authors.find((author) => author.id === args.id)
    },
    reviews() {
      return reviews
    },
    review(_, args) {
      return reviews.find((review) => review.id === args.id)
    },
  },
  Game: {
    reviews(parent) {
      return reviews.filter((review) => review.game_id === parent.id)
    },
  },
  Author: {
    reviews(parent) {
      return reviews.filter((review) => review.author_id === parent.id)
    },
  },
  Review: {
    author(parent) {
      return authors.find((author) => author.id === parent.author_id)
    },
    game(parent) {
      return games.find((game) => game.id === parent.game_id)
    },
  },
  Mutation: {
    deleteGame(_, args) {
      games = games.filter((g) => g.id !== args.id)
      return games
    },
    updateGame(_, args) {
      games.forEach((g) => {
        if (g.id === args.game.id) {
          g.title = args.game.title
        }
      })
      return games.find((g) => g.id)
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
