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
        repliedContainer.appendChild(repliedComments)
        commented.appendChild(repliedContainer)
    }
    document.querySelector('.json-comments').appendChild(commented)
    
}

// Adding input field for new comment and putting image of current user
let addComment = addCommentInput();

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

    document.querySelector('.json-comments').appendChild(commented)
    sendButton.previousElementSibling.value = '';
    upVote();
    downVote();
    deleteComment();
    cancelDelete();
    editComment();
    replyComment();
  }
}))

// Made a function to make a comment
function makeComment(id,score,image,username,createdAt,content, replied = null) {     
  let comment = `
          <div id='${id}' class="comment">
            <div class="vote">
              <button class="vote-icon plus"><svg class='plus-svg' width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></button>
              <span class="vote-number">${score}</span>
              <butto class="vote-icon minus"><svg class='minus-svg' width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></butto>
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
                  <svg class='edit-svg' width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>                              Edit
                  </button>
                </div>
                ` : 
                `<div class="action">
                <button class="reply ${id}">
                <svg class='reply-svg' width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                Reply
              </button>
              </div>`
              }
                 
              </div>
              <p class="comment__content">
              ${replied !== null ? `<span class="replied-name">@${replied}</span>` : ''}
              ${content}
              </p>
            </div>`;
            return comment;
}

// Make a function to Upvote a comment

upVote();
downVote();
cancelDelete();
deleteComment();
editComment();
replyComment();

function replyComment(){
  const replyButtons = document.querySelectorAll('.reply');
  replyButtons.forEach(replyButton => replyButton.removeEventListener('click', replyCommentListener))
  replyButtons.forEach(replyButton => replyButton.addEventListener('click', replyCommentListener))
}

// Make a function to delete a comment
function deleteComment() {
  const deleteButtons = document.querySelectorAll('.delete');
  deleteButtons.forEach(deleteButton => deleteButton.removeEventListener('click', deleteCommentListener))
  deleteButtons.forEach(deleteButton => deleteButton.addEventListener('click', deleteCommentListener))
}

// Make a function to Cancel deleting a comment
function cancelDelete() {
  document.querySelector('.cancel-delete').addEventListener('click', () => {
    document.querySelector('.delete-comment').style.display = 'none';
    document.body.classList.remove('delete')
  })
}

function upVote() {
  const plusButtons = document.querySelectorAll('.plus');
  plusButtons.forEach(plusButton => plusButton.removeEventListener('click', upVoteListener))
  plusButtons.forEach(plusButton => plusButton.addEventListener('click', upVoteListener))
}

// Make a function to Downvote a comment
function downVote() {
  const minusButtons = document.querySelectorAll('.minus');
  minusButtons.forEach(minusButton => minusButton.addEventListener('click', downVoteListener))
}

function editComment() {
  const editButtons = document.querySelectorAll('.edit');
  editButtons.forEach(editButton => editButton.removeEventListener('click', editCommentListener))
  editButtons.forEach(editButton => editButton.addEventListener('click', editCommentListener))
}

function addCommentInput(click = null, textAreaValue = '') {
  let addComment = `   
  <div class="add-comment">
  ${click === null ? `<img class="comment-author-image" src="${data.currentUser.image.png}" alt="">` : ''}
  <textarea name="add-comment" class="add-comment-area" placeholder="${click === null ? 'Add a comment' : click === 'update' ? 'Update a comment' : 'Reply a comment'}" ${click === null ? '' : textAreaValue}></textarea>
  ${click === null ? '<button class="send button">Send</button>' : click === 'update' ? '<button class="update button">Update</button>' : '<button class="reply-button button">Reply</button>'}
</div>
`
return addComment;
}



function upVoteListener(event) {
  let button;
  if(event.target.classList.contains('plus')){
    button = event.target;
  }else if(event.target.classList.contains('plus-svg')){
    button = event.target.parentElement;
  }else {
    button = event.target.parentElement.parentElement;
  }
  let vote = +button.nextElementSibling.innerHTML;
    if(button.parentElement.querySelector('.minus').classList.contains('active')){
      vote++;
      button.nextElementSibling.innerHTML = vote;
      button.parentElement.querySelector('.minus').classList.remove('active')
    }
    if(button.classList.contains('active')){
      button.classList.remove('active')
      vote--;
      button.nextElementSibling.innerHTML = vote
    }else{
      button.classList.add('active');
      vote++;
      button.nextElementSibling.innerHTML = vote
    }
}

function downVoteListener(event) {
  let button;
  if(event.target.classList.contains('minus')){
    button = event.target;
  }else if(event.target.classList.contains('minus-svg')){
    button = event.target.parentElement;
  }else {
    button = event.target.parentElement.parentElement;
  }
  let vote = +button.previousElementSibling.innerHTML;
  if(button.parentElement.querySelector('.plus').classList.contains('active')){
    vote--;
    button.previousElementSibling.innerHTML = vote;
    button.parentElement.querySelector('.plus').classList.remove('active')
  }
  if(button.classList.contains('active')){
    button.classList.remove('active')
    vote++;
    button.previousElementSibling.innerHTML = vote
  }else{
    button.classList.add('active');
    vote--;
    button.previousElementSibling.innerHTML = vote
  }
}

function deleteCommentListener(event){
  document.querySelector('.delete-comment').style.display = 'flex';
  document.body.classList.add('delete')
  document.querySelector('.agree-delete').addEventListener('click', () => {
    let id = event.target.classList[1];
    if(document.getElementById(id)?.parentElement.classList.contains('replied-comments') && document.getElementById(id)?.parentElement.childElementCount > 1) {
      document.getElementById(id).remove();
    }else if(document.getElementById(id)?.parentElement.classList.contains('comment-reply')){
      document.getElementById(id)?.parentElement.remove();
    }else{
      document.getElementById(id)?.parentElement.parentElement.remove();
    }
    document.querySelector('.delete-comment').style.display = 'none';
    document.body.classList.remove('delete')
  })
}

function editCommentListener(event){
  let button;
  if(event.target.classList.contains('edit')){
    button = event.target;
  }else if(event.target.classList.contains('edit-svg')){
    button = event.target.parentElement;
  }else {
    button = event.target.parentElement.parentElement;
  }
  let id = button.classList[1];
  let previousComment = document.getElementById(id).querySelector('.comment__content');
  let previousCommentText = previousComment.textContent;
  if(!document.getElementById(id).querySelector('.add-comment')){
    let commentInput = addCommentInput('update', previousCommentText);
    previousComment.parentElement.insertAdjacentHTML('beforeend', commentInput);
  }
  previousComment.style.display = 'none';
  document.getElementById(id).querySelector('.update').addEventListener('click', () => {
    let commentInput = document.getElementById(id).querySelector('textarea');
    previousCommentText = commentInput.value;
    previousComment.textContent = previousCommentText;
    previousComment.style.display = 'block';
    commentInput.parentElement.remove();
  })

}

function replyCommentListener(event){
  let button;
  if(event.target.classList.contains('reply')){
    button = event.target;
  }else if(event.target.classList.contains('reply-svg')){
    button = event.target.parentElement;
  }else {
    button = event.target.parentElement.parentElement;
  }
  let id = button.classList[1];
  let comment = document.getElementById(id);
  if(!document.getElementById(id).parentElement.querySelector('.add-comment')){
    let commentInput = addCommentInput('reply');
    comment.parentElement.insertAdjacentHTML('beforeend', commentInput)
    let textAreaValue = comment.parentElement.querySelector('.add-comment-area');
    textAreaValue.focus();
    const replyButtons = document.querySelectorAll('.reply-button');
      replyButtons.forEach(replyButton => replyButton.addEventListener('click', () => {
        if(textAreaValue.value.length > 0){
          let randomId = Math.round(Date.now() + Math.random());
          let date = new Date;
      
          let commented = makeComment(randomId, 0, data.currentUser.image.png, data.currentUser.username, `${date.toLocaleDateString()}`, textAreaValue.value, comment.querySelector('.comment-author-name').textContent);
          let replied;
          if(!comment.parentElement.querySelector('.replied') && comment.parentElement.classList.contains('comment-reply')){
            replied = document.createElement('div')
            replied.classList.add('replied');
            replied.appendChild(document.createElement('hr'))
          }else if(comment.parentElement.classList.contains('replied-comments')) {
            replied = comment.parentElement.parentElement;
          }else{
            replied = comment.parentElement.querySelector('.replied')
          }

          let repliedComments;
          if(!comment.parentElement.querySelector('.replied-comments') && !comment.parentElement.classList.contains('replied-comments')){
            repliedComments = document.createElement('div');
            repliedComments.classList.add('replied-comments');
            replied.appendChild(repliedComments);
          }else if(comment.parentElement.querySelector('.replied-comments')){
            repliedComments = comment.parentElement.querySelector('.replied-comments');
          }else{
            repliedComments = comment.parentElement;
          }
          repliedComments.insertAdjacentHTML('afterbegin', commented)
          if(!comment.parentElement.querySelector('.replied') && comment.parentElement.classList.contains('replied')){
            comment.parentElement.appendChild(replied)
          }
          textAreaValue.parentElement.remove();
          upVote();
          downVote();
          cancelDelete();
          deleteComment();
          editComment();
          replyComment();
        }
  }))
  }
}