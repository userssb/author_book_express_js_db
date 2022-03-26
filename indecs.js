const express = require("express");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "goodreads.db");
let db = null;
const initialiseDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};
initialiseDBAndServer();

//getBooks api
app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    select * from book order by book_id;
    `;
  const result = await db.all(getBooksQuery);
  response.send(result);
});

//update book api
// app.put("/books/:bookId", async (request, response) => {
//   const { bookId } = request.params;
//   const bookDetails = request.body;
//   const {
//     title,
//     authorId,
//     rating,
//     ratingCount,
//     reviewCount,
//     description,
//     pages,
//     dateOfPublication,
//     editionLanguage,
//     price,
//     onlineStores,
//   } = bookDetails;

//   const updateBookQuery = `
//     UPDATE
//       book
//     SET
//       title='${title}',
//       author_id=${authorId},
//       rating=${rating},
//       rating_count=${ratingCount},
//       review_count=${reviewCount},
//       description='${description}',
//       pages=${pages},
//       date_of_publication='${dateOfPublication}',
//       edition_language='${editionLanguage}',
//       price= ${price},
//       online_stores='${onlineStores}'
//     WHERE
//       book_id = ${bookId};`;
//   const respBody = await db.run(updateBookQuery);
//   response.send(respBody);
// });

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const updateBookQuery = `
    UPDATE
      book
    SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      rating_count=${ratingCount},
      review_count=${reviewCount},
      description='${description}',
      pages=${pages},
      date_of_publication='${dateOfPublication}',
      edition_language='${editionLanguage}',
      price=${price},
      online_stores='${onlineStores}'
    WHERE
      book_id = ${bookId};`;
  await db.run(updateBookQuery);
  response.send("Book Updated Successfully");
});

//add book api

app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});

//delete book api
app.delete("/books/:bookId", (request, response) => {
  const { bookId } = request.params;
  const delBookQuery = `
    delete from book where book_id=${bookId};
    `;
  const delResult = db.run(delBookQuery);
  response.send("Book deleted successfully....!");
});

//get author books
app.get("/authors/:authorId/books", async (request, response) => {
  const { authorId } = request.params;
  const getAuthorBooksQuery = `
        select * from book where author_id=${authorId};
    `;
  const authBookArray = await db.all(getAuthorBooksQuery);
  response.send(authBookArray);
});
