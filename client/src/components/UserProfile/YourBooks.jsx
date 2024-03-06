import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const YourBooks = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        // Assuming you store user ID in local storage or manage via context/auth
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        const response = await axios.get(
          `http://localhost:3001/user-favorites/${userId}`
        );
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error("Error fetching favorite books:", error);
        // Handle error (e.g., display a message)
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <div>Loading your favorite books...</div>;

  return (
    <div className="container">
      <div className="text-center mb-10 max-w-[600px] mx-auto">
        <h1 className="text-3xl font-bold">Your Favraite Books</h1>
      </div>
      {favorites.length > 0 ? (
        // <ul>
        //   {favorites.map((book) => (
        //     <li key={book._id} >
        //       <img src={book.bkImagePath} alt={book.bkName} style={{width: '100px', height: '150px'}} /> {/* Adjust image path as necessary */}
        //       <h3>{book.bkName}</h3>
        //       <p>{book.authName}</p>
        //       {/* Additional book details here */}
        //     </li>
        //   ))}
        // </ul>
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 ">
            {favorites.map((book) => (
              <div key={book._id} className="div space-y-3">
                <BooksCard book={book} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>You have no favorite books.</p>
      )}
    </div>
  );
};

export default YourBooks;
export const BooksCard = ({ book }) => {
  return (
    <>
      <div className=" div  w-auto h-auto flex flex-col gap-5 shadow-xl text-black scale-90 hover:scale-95 hover:bg-orange-500 ease-in-out duration-300 rounded-xl active:scale-90 overflow-hidden">
        <Link to={`/admin/books/book-detail/${book.bkName}`} target="_parent">
          <img
            src={book.bkImagePath}
            alt=""
            className="h-[220px] w-[150px] object-cover rounded-md"
          />
        </Link>
        <div>
          <h3 className="font-semibold dark:text-white">{book.bkName}</h3>
          <p className="text-sm text-stone-700">{book.authName}</p>
        </div>
      </div>
    </>
  );
};

{
  /*import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../loading";
import { Link } from "react-router-dom";

const YourBooks = () => {
  const [bookdata, setBookdata] = useState();
  const fetchbooks = async () => {
    const bookColl = "books";

    try {
      axios
        .post("http://localhost:3001/get-dbcollections", bookColl)
        .then((res) => {
          const databook = res.data.data;
          // alert(res.data.message);
          setBookdata(databook);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!bookdata) {
      fetchbooks();
    }
  });
  return (
    <div className="container">
      <div className="text-center mb-10 max-w-[600px] mx-auto">
        <h1 className="text-3xl font-bold">All Books</h1>
      </div>
      {bookdata == undefined && <Loading />}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 ">
        {bookdata != undefined &&
          bookdata.map((i) => (
            <div key={i?.bkname} className="div space-y-3">
              <BooksCard i={i} />
            </div>
          ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
        {bookdata && bookdata.length}
      </div>
    </div>
  );
};

export default YourBooks;

export const BooksCard = (props) => {
  const { i } = props;
  return (
    <>
      <div className=" div  w-auto h-auto flex flex-col gap-5 shadow-xl text-black scale-90 hover:scale-95 hover:bg-orange-500 ease-in-out duration-300 rounded-xl active:scale-90 overflow-hidden">
        {/* <div className="w-full h-[85%] bg-[#F8F8F8] overflow-hidden"> 
        <Link
          to={`/admin/books/book-detail/${i?.bkname ?? "name"}`}
          target="_parent"
          // className="h-full flex items-center"
        >
          <img
            src={i?.bkimage ?? "img"}
            alt=""
            className="h-[220px] w-[150px] object-cover rounded-md"
          />
        </Link>
        {/* </div> *
        <div>
          <h3 className="font-semibold dark:text-white">
            {i.bkname ?? "name"}
          </h3>
          <p className="text-sm text-stone-700 ">{i.authname}</p>
        </div>
      </div>
    </>
  );
};
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YourBooks = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = /* logic to get user id *
        const response = await axios.get(`http://localhost:3001/get-favorites/${userId}`);
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error('Error fetching favorites', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      {/* Render favorite books here 
      {favorites.map(book => (
        <div key={book._id}>
          {/* Render book details 
        </div>
      ))}
    </div>
  );
};

export default YourBooks;


<button onClick={addToFavorites} className="favorite-button">
Add to Favorites
</button>*/
}
