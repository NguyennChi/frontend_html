const articleId = parseInt(getQueryParam('id'));
console.log('articleId', articleId);

// if (!ARTICLES_SEEN.includes(articleId)) ARTICLES_SEEN.push(articleId);

let ARTICLES_SEEN = JSON.parse(localStorage.getItem('ARTICLES_SEEN')) || [];
let COMMENTS = JSON.parse(localStorage.getItem('COMMENTS')) || {};
let articleComments = COMMENTS[articleId] || [];

const elArticleTitle = document.getElementById('article-title');
const elArticlePublishDate = document.getElementById('article-publish-date');
const elArticleAuthor = document.getElementById('article-author');
const elArticleCategory = document.getElementById('article-category');
const elArticleThumb = document.getElementById('article-thumb');
const elArticleContent = document.getElementById('article-content');
const elComments = document.getElementById('comments');
const elMessageComment = document.getElementById('message-comment');
const btnPostComment = document.getElementById('btn-post-comment');
const inputCommentName = document.getElementById('comment-name');
const inputCommentMessage = document.getElementById('comment-message');
let parent = null;

renderCommentList(articleComments);

fetch(`${BASE_URL}articles/${articleId}`)
  .then((response) => response.json())
  .then((res) => {
    const article = res.data;
    elArticleTitle.innerText = article.title;
    elArticlePublishDate.innerText = article.publish_date;
    elArticleAuthor.innerText = article.author;
    elArticleCategory.innerText = article.category.name;
    elArticleCategory.parentElement.href = `category.html?id=${article.category_id}`;
    elArticleThumb.src = article.thumb;
    elArticleContent.innerHTML = article.content;
    document.querySelector('title').innerText = article.title;
  })
  .catch((error) => {
    window.location.href = '404.html';
  });

// call api
/**
 * fetch(xxxx)
 * .then()
 * .then() {
 *  // do du lieu chi tiet bai viet
 * luu id cua bai viet hien tai vao localstorage
 * kiem tra xem id da chua, neu chua co thi luu vao, da co khong xu ly
 * if (!ARTICLES_SEEN.includes(articleId)) ARTICLES_SEEN.push(articleId);
 * }
 *
 */

btnPostComment.addEventListener('click', () => {
  const name = inputCommentName.value.trim();
  const message = inputCommentMessage.value.trim();
  if (!name || !message) {
    alert('Vui lòng nhập đầy đủ tên và nội dung bình luận!');
  } else {
    const newComment = {
      id: createId(),
      name,
      message,
      datetime: dayjs().format('YYYY-MM-DD H:mm:ss'),
      articleId,
      parent,
    };
    COMMENTS = saveLocalComment(newComment);
    renderCommentList(COMMENTS[articleId]);
  }
});

elComments.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('btn-reply')) {
    parent = el.dataset.parent;
    elMessageComment.innerHTML = /* html */ `
    Phản hồi bình luận của 
    <span class="text-info">${parent}</span> 
    <span class="btn-remove-reply btn btn-sm btn-danger">X</span>`;
    btnPostComment.innerText = 'Gửi phản hồi';
  }
});

document.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('btn-remove-reply')) {
    parent = null;
    elMessageComment.innerHTML = '';
    btnPostComment.innerText = 'Gửi bình luận';
  }
});

function saveLocalComment(newComment) {
  let items = JSON.parse(localStorage.getItem('COMMENTS')) || {};
  if (newComment.parent) {
    // binh luan con
    // tìm vị trị của comment cha trong danh sách
    const idx = items[articleId].findIndex((item) => item.id === newComment.parent);
    if (items[articleId][idx].child) {
      // da co du lieu
      items[articleId][idx].child.unshift(newComment);
    } else {
      // chua co du lieu
      items[articleId][idx].child = [newComment];
    }
  } else {
    if (!items[articleId]) {
      items[articleId] = [newComment];
    } else {
      items[articleId].unshift(newComment);
    }
  }

  localStorage.setItem('COMMENTS', JSON.stringify(items));
  return items;
}

// function renderCommentList(comments) {
//   let html = '';
//   comments.forEach((comment) => {
//     let CommentId = comment.id

//     html += renderCommentItem(comment);
    
//     if (comment.hasOwnProperty('child')) {
//       let result = comment.child.filter(commentChild => comment.parent === CommentId)
//       let htmlChild = '';
//       result.forEach(child => {
//         console.log(child);
//       })  
//     }
 
//   });

//   elComments.innerHTML = html;
// }

// function renderCommentItem(comment) {
//   return /* html */ `
//   <div class="media-grid">
//     <div class="media" style="grid-template-columns: 85px auto">
//       <a class="comment-img" href="#url"><img src="assets/images/a1.jpg" class="img-responsive"
//           width="100px" alt="placeholder image"></a>
//       <div class="media-body comments-grid-right">
//         <h5>${comment.name} - ${comment.id}</h5>
//         <ul class="p-0 comment">
//           <li class="">${comment.datetime}</li>
//           <li>
//             <a href="#comment" class="text-primary btn-reply" data-parent="${comment.id}">Reply</a>
//           </li>
//         </ul>
//         <p>${comment.message}</p>
//       </div>
//     </div>
//   </div>`;
// }

// Danh sách các bình luận
function renderCommentList(comments) {
    let html = '';
    comments.forEach(comment => {
      html += renderComment(comment);
    });
    elComments.innerHTML = html;
}

function renderComment (comment){
  let xHtmlChild = ''
  if (comment.hasOwnProperty('child')) {
  comment.child.forEach(child => {
  xHtmlChild += `
  <div class="media mt-4 mb-0 border-0 px-0 pb-0">
     <a class="comment-img" href="#url"><img src="assets/images/a3.jpg" class="img-responsive"
        width="100px" alt="placeholder image"></a>
     <div class="media-body comments-grid-right">
        <h5>${child.name}</h5>
        <ul class="p-0 comment">
           <li class="">${child.datetime}</li>
           <li>
              <a href="#comment" class="text-primary btn-reply" data-parent="${child.id}">Reply</a>
           </li>
        </ul>
        <p>${child.message}</p>
     </div>
  </div>
  `
  })  
  }
  return /* html */ ` 
  <div class="media-grid">
     <div class="media">
        <a class="comment-img" href="#url"><img src="assets/images/a2.jpg" class="img-responsive"
           width="100px" alt="placeholder image"></a>
        <div class="media-body comments-grid-right">
           <h5>${comment.name} - ${comment.id}</h5>
           <ul class="p-0 comment">
              <li class="">${comment.datetime} </li>
              <li>
                 <a href="#comment" class="text-primary btn-reply" data-parent="${comment.id}">Reply</a>
              </li>
           </ul>
           <p>${comment.message}</p>
           ${xHtmlChild}
        </div>
     </div>
  </div>`
}