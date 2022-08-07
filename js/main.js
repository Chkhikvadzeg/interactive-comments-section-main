// Importing the data from the json file
import data from '../data.json' assert {type: 'json'}; 

// Adding Comments from JSON File
for(let i = 0; i < data.comments.length; i++){
    let comment = data.comments[i];
    let commented = document.createElement('div');
    commented.classList.add('comment-reply');
    let mainComment = makeComment(comment.id, comment.score, comment.user.image.png, comment.user.username, comment.createdAt, comment.content);

    commented.insertAdjacentHTML('afterbegin', mainComment)

    let repliedContainer = document.createElement('div');
    repliedContainer.classList.add('replied');
    repliedContainer.appendChild(document.createElement('hr'));

    let repliedComments = document.createElement('div');
    repliedComments.classList.add('replied-comments');
    for(let j = 0; j < comment.replies.length; j++){
        if(comment.replies.length > 0){
          let repliedItem = comment.replies[j];
            let repliedComment = makeComment(repliedItem.id, repliedItem.score ,repliedItem.user.image.png, repliedItem.user.username, repliedItem.createdAt, repliedItem.content, repliedItem.replyingTo)
            repliedComments.insertAdjacentHTML("beforeend",repliedComment);
        } 
        repliedContainer.append(repliedComments)
        commented.append(repliedContainer)
    }
    document.querySelector('.json-comments').append(commented)
    
}
// Adding input field for new comment and putting image of current user
let addComment = `   
  <div class="add-comment">
  <img class="comment-author-image" src="${data.currentUser.image.png}" alt="">
  <textarea name="add-comment" id="add-comment" placeholder="Add a comment..."></textarea>
  <button class="send">Send</button>
</div>
`
// Inserting new comment into the DOM
document.querySelector('.my-comment').insertAdjacentHTML("beforeend",addComment)

// Adding event listener to send button
const sendButtons = document.querySelectorAll('.send');

sendButtons.forEach(sendButton => sendButton.addEventListener('click', () => {
  if(sendButton.previousElementSibling.value.length > 0){
    let randomId = Math.round(Date.now() + Math.random());
    let date = new Date;

    let comment = makeComment(randomId, 0, data.currentUser.image.png, data.currentUser.username, `${date.toLocaleDateString()}`, sendButton.previousElementSibling.value);
    let commented = document.createElement('div');
    commented.classList.add('comment-reply');
    commented.insertAdjacentHTML('afterbegin', comment)

    document.querySelector('.json-comments').append(commented)
    sendButton.previousElementSibling.value = '';
  }
}))

// Made a function to make a comment
function makeComment(id,score,image,username,createdAt,content, replied = null) {     
  let comment = `
          <div id='${id}' class="comment">
            <div class="vote">
              <button class="vote-icon plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></button>
              <span class="vote-number">${score}</span>
              <butto class="vote-icon minus"><svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></butto>
            </div>
            <div class="comment__body">
              <div class="comment__body-top">
                <div class="comment-author">
                  <img class="comment-author-image" src="${image}" alt="avatar">
                  <span class="comment-author-name">${username}</span>
                  ${username === data.currentUser.username ? '<span class="you">you</span>' : ''}
                  <span class="comment-date">${createdAt}</span>
                </div>
                ${username === data.currentUser.username ? `
                <div class="action">
                  <button class="delete ${id}">
                  <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>                              Delete
                  </button>
                  <button class="edit ${id}">
                  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>                              Edit
                  </button>
                </div>
                ` : 
                `<div class="action">
                <button class="reply ${id}">
                <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                Reply
              </button>
              </div>`
              }
                 
              </div>
              <p class="comment__content">
              <span class="replied-name">${replied !== null ? `@${replied}` : ''}</span> ${content}
              </p>
            </div>`;
            return comment;
}

upVote();
downVote()

// Make a function to delete a comment
deleteButtons.forEach(deleteButton => deleteButton.addEventListener('click', () => {
  document.querySelector('.delete-comment').style.display = 'flex';
  document.body.classList.add('delete')
  document.querySelector('.agree-delete').addEventListener('click', () => {
    let id = deleteButton.classList[1];
    document.getElementById(id).remove();
    document.querySelector('.delete-comment').style.display = 'none';
    document.body.classList.remove('delete')
  })
}))

// Make a function to Cancel deleting a comment
document.querySelector('.cancel-delete').addEventListener('click', () => {
  document.querySelector('.delete-comment').style.display = 'none';
  document.body.classList.remove('delete')
})

// Make a function to Upvote a comment
function upVote() {
  const plusButtons = document.querySelectorAll('.plus');
  plusButtons.forEach(plusButton => plusButton.addEventListener('click', () => {
    let vote = +plusButton.nextElementSibling.innerHTML;
    if(plusButton.parentElement.querySelector('.minus').classList.contains('active')){
      vote++;
      plusButton.nextElementSibling.innerHTML = vote;
      plusButton.parentElement.querySelector('.minus').classList.remove('active')
    }
    if(plusButton.classList.contains('active')){
      plusButton.classList.remove('active')
      vote--;
      plusButton.nextElementSibling.innerHTML = vote
    }else{
      plusButton.classList.add('active');
      vote++;
      plusButton.nextElementSibling.innerHTML = vote
    }
  }))
}

// Make a function to Downvote a comment
function downVote() {
  const minusButtons = document.querySelectorAll('.minus');
  minusButtons.forEach(minusButton => minusButton.addEventListener('click', () => {
    let vote = +minusButton.previousElementSibling.innerHTML;
    if(minusButton.parentElement.querySelector('.plus').classList.contains('active')){
      vote--;
      minusButton.previousElementSibling.innerHTML = vote;
      minusButton.parentElement.querySelector('.plus').classList.remove('active')
    }
    if(minusButton.classList.contains('active')){
      minusButton.classList.remove('active')
      vote++;
      minusButton.previousElementSibling.innerHTML = vote
    }else{
      minusButton.classList.add('active');
      vote--;
      minusButton.previousElementSibling.innerHTML = vote
    }
  }))
}