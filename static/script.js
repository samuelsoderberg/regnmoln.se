const keyPress = e => {
  if (e.keyCode == 13 || e.which == 13) {
    saveWallPost();
  }
};

const getBaseUrl = () => {
  return location.protocol + "//" + window.location.hostname;
};

const getWallPosts = () => {
  console.log("getWallPosts()");

  fetch(getBaseUrl() + "/getWallPosts")
    .then(response => response.json())
    .then(wallPosts => {
      if (wallPosts && wallPosts.length > 0) {
        let wallPostsElement = document.getElementById("wallPosts");

        while (wallPostsElement.firstChild) {
          wallPostsElement.removeChild(wallPostsElement.firstChild);
        }

        wallPosts.forEach(post => {
          wallPostsElement.insertRow();

          Object.entries(post).forEach(value => {
            let newCell = wallPostsElement.rows[
              wallPostsElement.rows.length - 1
            ].insertCell();

            newCell.textContent = value[1];
          });
        });
      }
    })
    .catch(error => console.error("Error:", error));
};

const saveWallPost = () => {
  console.log("saveWallPost()");

  let nameElement = document.getElementById("name");
  let textElement = document.getElementById("text");

  if (nameElement && textElement) {
    name = nameElement.value;
    text = textElement.value;

    if (name && text && name.length <= 15 && text.length <= 50) {
      let json = JSON.stringify({ name: name, text: text });

      fetch(getBaseUrl() + "/saveWallPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: json
      })
        .then(() => {
          nameElement.value = "";
          textElement.value = "";

          getWallPosts();
        })
        .catch(error => console.error("Error:", error));
    }
  }
};
