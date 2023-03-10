import axios from "axios";
import React from "react";
import { useState } from "react";
import Header from "../../components/Header/Header";
import { useDate, useSqlDate, useUserdata } from "../../utils/hook";

/**
 *Component to add post
 * @return {*}
 */
const AddPost = () => {
  //Custom Hook
  const { userData } = useUserdata();
  const { date } = useDate();
  const { sqlDate } = useSqlDate();

  //Component State
  const [selectedImage, setSelectedImage] = useState();
  const [content, setContent] = useState("");

  /**
   *Captute Onclick and add file to SelectedImage state
   * @param {*} e
   */
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  /**
   *Capture OnClick and remove file of memory
   *and reinitializing selectImage state
   */
  const removeSelectedImage = () => {
    URL.revokeObjectURL(selectedImage);
    setSelectedImage();
  };

  //const publish = () => publishPost(content, sqlDate, selectedImage);

  /**
   *Capture OnClick and add post
   *Send states content,sqlDate,selectedImage to backend
   */
  const publish = () => {
    const token = localStorage.getItem("token");
    let formData = new FormData();

    formData.append("content", content);
    formData.append("created_date", sqlDate);
    formData.append("image", selectedImage);
    axios
      .post("https://minidev.fr:5443/api/post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        window.location.href = "/";
        console.log(res.data);
      })

      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header userData={userData} />
      <main>
        <h1>Publier un post</h1>
        <article className="post post--appear">
          <header className="post__header">
            <div>
              <div className="post__header__picture">{userData.picture_url === null ? <i className="fa-solid fa-circle-user"></i> : <img src={userData.picture_url} alt="post"></img>}</div>

              <h2>
                {userData.nom} <br /> {userData.prenom}
              </h2>
            </div>

            <time>{date}</time>
          </header>

          <form className="post__content post__content--publish">
            <label htmlFor="file" className="button">
              Choisir une image
            </label>

            <input type="file" accept="image/*" name="picture" id="file" onChange={imageChange}></input>

            {selectedImage && (
              <div className="img_container">
                <img src={URL.createObjectURL(selectedImage)} alt="Thumb" />
                <button onClick={removeSelectedImage}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            )}

            <textarea rows="5" placeholder="Ecrivez ici..." title="texte du post" onChange={(e) => setContent(e.target.value)} />
          </form>

          <footer className="post__footer post__footer--publish" onClick={publish}>
            <span>Publier</span>
          </footer>
        </article>
      </main>
      <div className="left-decoration"></div>
    </>
  );
};

export default AddPost;
