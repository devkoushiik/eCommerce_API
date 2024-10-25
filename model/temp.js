[
  {
    $match: {
      product: new ObjectId("671b1a0b383aebc2924d4696"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
