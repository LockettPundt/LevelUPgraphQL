const movies = [
  {
    id: "1",
    title: "5 deadly Venoms",
    releaseDate: "10/10/1983",
    rating: 5,
    actors: [{
      id: "22"
    },
    {
      id: "23",
    }
    ]
  },
  {
    id: "2",
    title: "another movie",
    releaseDate: "01/08/1976",
    rating: 3,
    actors: [{
      id: "22",
    }]
  },
];

const actors = [
  {
    id: "22",
    name: "Lockett"
  },
  {
    id: "23",
    name: "Chauncey",
  },
];



module.exports = {movies, actors};