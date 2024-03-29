import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
// Ensure the CSS file path matches your file structure
import "./MagazineDetails.css";

const MagazineDetails = () => {
  const { magName } = useParams();
  const [magaDetail, setmagaDetail] = useState(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const uData = JSON.parse(localStorage.getItem("user") || '{}');
  const isPremium = uData?.isPremium;

  useEffect(() => {
    fetchMagazineDetails();
  }, [magName]); // Removed the incorrect if condition and simplified

  
    const fetchMagazineDetails = async () => {
      try {
        // Assuming the endpoint is adjusted to match the magazine name
        const res = await axios.get(`http://localhost:3001/get-mag/${magName}`);
        setmagaDetail([res.data]); 
      fetchComments(); // Assuming fetchComments does not require magazineDetail to be set in state beforehand
      checkFavoriteStatus();
      calculateAverageRating(); // Moved this call outside of checkFavoriteStatus function
    } catch (err) {
      console.error("Error fetching magazine details:", err);
    }
  };


  const checkFavoriteStatus = async () => {
    // This should not directly rely on magazineDetail state since its state update might not have been completed
    if (uData._id && magName) {
      try {
        const res = await axios.post('http://localhost:3001/magis-favorited', {
          userId: uData._id,
          magazineId: magName // Assuming magName is used to identify the magazine
        });
        setIsFavorited(res.data.isFavorited);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    }
  };

  const fetchComments = async () => {
    // Now uses magName directly instead of relying on magazineDetail's state
    if (magName) {
      try {
        const res = await axios.get(`http://localhost:3001/magcomments/${magName}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (isPremium && magName && newComment.trim()) {
      try {
        await axios.post('http://localhost:3001/magsubmit-comment', {
          magazineId: magName, // Directly use magName
          username: uData.username,
          comment: newComment
        });
        setNewComment('');
        fetchComments(); // Refresh comments after submission
      } catch (err) {
        console.error("Error submitting comment:", err);
      }
    } else {
      alert("Only premium users can submit comments.");
    }
  };

  const addToFavorites = async () => {
    if (magName) { // Use magName for consistency
      try {
        await axios.post('http://localhost:3001/magadd-to-favorites', {
          userId: uData._id,
          magazineId: magName
        });
        setIsFavorited(true);
      } catch (err) {
        console.error("Error adding to favorites:", err);
      }
    }
  };

  const removeFromFavorites = async () => {
    if (magName) { // Use magName for consistency
      try {
        await axios.post('http://localhost:3001/magremove-from-favorites', {
          userId: uData._id,
          magazineId: magName
        });
        setIsFavorited(false);
      } catch (err) {
        console.error("Error removing from favorites:", err);
      }
    }
  };

  const StarRating = ({ rating, onRating }) => {
    return (
      <div className="rating-section">
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                key={index}
                className={index <= rating ? "text-orange-500" : "text-gray-400"}
                onClick={() => onRating(index)}
                style={{ fontSize: "24px" }}
              >
                ★
              </button>
            );
          })}
        </div>
        <div className="your-rating-text">Your Rating</div>
      </div>
    );
  };
  const calculateAverageRating = () => {
    if (magName && magName.ratings && magName.ratings.length > 0) {
      const sum = magName.ratings.reduce(
        (accumulator, current) => accumulator + current.rating,
        0
      );
      const avg = sum / magName.ratings.length;
      setAverageRating(avg.toFixed(1)); // Set the average rating, round to 1 decimal place
    }
  };

  // The submitRating function was modified to ensure it uses the right identifiers and checks
  const submitRating = (newRating) => {
    if (magName && uData._id) { // Ensure these values are present before submitting
      axios
        .post("http://localhost:3001/magsubmit-rating", {
          magazineId: magName,
          userId: uData._id,
          username: uData.username,
          rating: newRating,
        })
        .then((response) => {
          console.log(response.data);
          setUserRating(newRating); // Update the local user rating state
          // Optionally, fetch magazine details again to update any dependent data
        })
        .catch((error) => console.error("Error submitting rating", error));
    }
  };

 

  return (
    <>
      <div className="w-full h-auto bg-gray-200 dark:bg-neutral-900 dark:text-white duration-200  relative">
        {!magaDetail ? (
          <div className="w-full h-screen text-center text-3xl p-4">
            Loading...
          </div>
        ) : (
          <>
             <div className="p-16">
              <div className="p-8 bg-white dark:bg-neutral-700  shadow-lg mt-24 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="text-center">

                    <div className="rating-section">
                      <StarRating rating={userRating} onRating={submitRating} />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-44 h-44 bg-indigo-100 mx-auto shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center">
                      <img
                        src={magaDetail[0]?.magImage ?? "img"}
                        alt=""
                        className="w-auto rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                    <Link
                      to={"#"}
                      className="text-white py-2 px-4 flex items-center justify-center uppercase rounded bg-blue-400 dark:bg-amber-500 hover:bg-blue-500 dark:hover:bg-amber-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 active:-translate-y-2"
                    >
                      View Author Profile
                    </Link>
                    <Link
                      to={magaDetail[0]?.magCon ?? "book-content"}
                      target="_blank"
                      className="text-white flex items-center justify-center py-2 px-4 uppercase rounded bg-gray-700 dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 active:-translate-y-2"
                    >
                      Read book
                    </Link>
                  </div>
                </div>
                <div className="mt-20 text-center border-b pb-12 capitalize">
                  <h1 className="text-4xl font-semibold text-gray-700 dark:text-white">
                    {magaDetail[0]?.magName ?? "audiobook-name"}
                  </h1>
                  {isFavorited ? (
                    <button
                      onClick={removeFromFavorites}
                      className="mt-4 favorite-button mx-auto shadow-2xl relative inset-x-0 top-0 -mt-24 flex items-center justify-center"
                    >
                      <AiFillHeart className="mr-2" /> Remove from Favorites
                    </button>
                  ) : (
                    <button
                      onClick={addToFavorites}
                      className="mt-4 favorite-button mx-auto shadow-2xl relative inset-x-0 top-0 -mt-24 flex items-center justify-center"
                    >
                      <AiFillHeart className="mr-2" /> Add to Favorites
                    </button>
                  )}
                  <p className="mt-4 text-gray-500 dark:text-gray-200">
                    {magaDetail[0]?.magGenre ?? "book-genre"}
                  </p>
                  <p className="mt-2 text-gray-500 dark:text-gray-300">
                    Author : {magaDetail[0]?.magAuthName ?? "book-author"}
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Rating: {averageRating} ★
                  </p>
                </div>
                {isPremium && (
                    <form className="comment-form-container" onSubmit={submitComment}>
                      <input
                        type="text"
                        className="input-class placeholder-white outline-none shadow-sm shadow-primary"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        required
                      />
                      <button type="submit" className="border p-2 rounded-xl bg-primary hover:-translate-y-1 active:translate-y-1 shadow-sm shadow-primary ease-in-out duration-200">
                        Submit Comment
                      </button>
                    </form>
                  )}

                  <button
                    onClick={() => setCommentOpen(!commentOpen)}
                    className="text-indigo-500 py-2 px-4 font-medium mt-4 dark:text-cyan-400"
                  >
                    Show comments
                  </button>

                  {commentOpen && (
                    <div className="opacity-100 ease-in-out duration-200 mt-5 h-auto shadow-xl flex flex-col gap-1 p-4 border rounded-lg bg-white dark:bg-neutral-700 dark:text-white text-black">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment?._id} className="flex gap-10">
                            <div className="w-20 h-20 rounded-full overflow-hidden">
                              <div className="comment-profile-pic">
                                <img
                                  src={comment?.profileimage ?? "/assests/booksanime-ezgif.com-crop.gif"}
                                  alt={`${comment?.username}'s profile`}
                                  className="profile-photo"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="text-xl text-primary justify-between">
                                <span>{comment.username}</span>
                              </div>
                              <p className="text-xl">{comment.comment}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No comments yet.</p>
                      )}
                    </div>
                  )}

                </div>
              </div>
            
          </>
        )}
      </div>
    </>
  );
};

export default MagazineDetails;
