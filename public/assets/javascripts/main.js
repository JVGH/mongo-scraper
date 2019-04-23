'use strict';

// JQuery PUT/DELETE AJAX Call methods
jQuery.each(['put', 'delete'], function(i, method) {
	jQuery[method] = function(url, data, callback, type) {
		if (jQuery.isFunction(data)) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback,
		});
	};
});

// "Like Post" logic
const likePost = (id) => {
	$.ajax(`/api/posts/like/${id}`, { type: 'PUT' }).then((res) => {
		let post = $(`sup[data-id='${id}']`)[0];
		post.textContent = res.likeCount;
	});
};

// "Remove Post" logic
const removePost = (id) => {
	$.ajax(`/api/posts/${id}`, { type: 'DELETE' }).then((res) => {
		$('#modal-post #posts').remove(`article[data-id='${id}']`);
	});
};

// "Expand/Collapse Favorite Article(s)" logic
const toggleFavArticle = (id) => {
	let article = $(`.card[data-id='${id}']`);
	article.toggleClass('is-collapsed');
};

// "Un-Favorite Article" logic
const removeFavArticle = (id) => {
	$.ajax(`/api/articles/toggleIsLiked/${id}`, { type: 'PUT' }).then((res) => {
		$('.fav-item').remove(`section[data-id='${id}']`);
	});
};

// All Logic post-document.ready
$(document).ready(() => {
	// BULMA Burger Icon logic
	const burger = $('.burger');
	const menu = $('.navbar-menu');

	$(burger).on('click', function(e) {
		e.preventDefault();
		$(burger).toggleClass('is-active');
		$(menu).toggleClass('is-active');
	});

	// "Close Modal on Close Click" logic
	$('.toggle-modal').click(function(e) {
		e.stopPropagation();
		$('.modal.is-active').removeClass('is-active');
		location.reload();
	});

	// "Close Modal on a Background Click" logic
	$(document).on('click', function(e) {
		e.stopPropagation();
		if (e.target.outerHTML == $('.modal-background')[0].outerHTML) {
			$('.modal.is-active').removeClass('is-active');
			location.reload();
		}
	});

	// "Scrape New Article(s)" logic
	$('#scrapeDataBTN').on('click', (e) => {
		e.preventDefault();
		const topic = $('.tabs li.is-active').data('tab');
		$.ajax(`/html/articles/scrape/${topic}`, {
			type: 'GET',
			beforeSend: function() {
				$('#scrapeDataBTN').removeClass('is-outlined is-inverted');
				$('#scrapeDataBTN').toggleClass('is-loading');
			},
			complete: function() {
				$('#scrapeDataBTN').toggleClass('is-loading');
				$('#scrapeDataBTN').addClass('is-outlined is-inverted');
			},
		})
			.then((res) => {
				location.reload();
			})
			.catch((err) => {
				console.error(err);
			});
	});

	// "Mark Article as Favorite" logic
	$('.like-icon').on('click', function(e) {
		e.preventDefault();
		const likeIcon = $(this);

		const dataId = $(likeIcon)
			.closest('[data-id]')
			.data('id');

		$.ajax(`/api/articles/toggleIsLiked/${dataId}`, {
			type: 'PUT',
		})
			.then((res) => {
				const iconDiv = likeIcon.children('div')[0];
				if (
					$(iconDiv)
						.children()
						.attr('data-prefix') == 'fas'
				) {
					$(iconDiv).html('<i class="far fa-heart fa-lg"></i>');
				} else {
					$(iconDiv).html('<i class="fas fa-heart fa-lg"></i>');
				}
			})
			.catch((err) => {
				console.error(err);
			});
	});

	// "Show Comments" Logic
	$('.comment-icon').click(function(e) {
		e.preventDefault();

		const id = $(this)
			.closest('[data-id]')
			.data('id');

		const article = $(`article[data-id='${id}']`).data();
		$('#modal-post').attr('data-article', JSON.stringify(article));

		$.ajax(`/api/articles/${id}`, { type: 'GET' })
			.then((res) => {
				let comments = '';

				res.posts.forEach((post) => {
					const nowTime = new Date().getTime();
					const postTime = new Date(post.postedOnDate).getTime();
					const timeDiff = Math.floor((nowTime - postTime) / 60000 / 60);

					comments += `
          <article id="posts" class="media" data-id=${post._id}>
            <figure class='media-left'>
              <p class='image is-64x64'>
                <img src="https://bulma.io/images/placeholders/128x128.png">
              </p>
            </figure>
            <div class='media-content'>
              <div class='content'>
                <strong>${post.author}</strong>
                <br>
                ${post.postText}
                <div class="level is-mobile">
                  <div class="level-left">
                    <p class="level-item">
                        <a class="comment-like" onclick="likePost('${
													post._id
												}')" data-id=${post._id}>
                          <span class="icon is-medium"><i class="fas fa-heart fa-sm"></i></span>
                        </a>
                        <small><sup data-id=${post._id}>${
						post.likeCount
					}</sup> - ${timeDiff} min(s) ago</small>
                    </p>
                  </div>
                  <div class="level-right">
                    <p class="level-item">
                      <a class="comment-remove" onclick="removePost('${
												post._id
											}')" data-id=${post._id}>
                        <div class="icon is-medium"><i class="fas fa-trash fa-sm"></i></div>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>`;
				});

				$('#modal-post #posts').html($.parseHTML(comments));
			})
			.catch((err) => {
				console.error(err);
			});

		$('#modal-post').addClass('is-active');
		$('#modal-post #title')[0].textContent = article.title;
	});

	// "Add a New Post" logic
	$('#submit').click(function(e) {
		e.preventDefault();

		const article = $('#modal-post').data('article');
		const comments = $('#comments').val();
		const name = $('#name').val();
		const data = {
			article: article.id,
			postText: comments,
			author: name,
		};

		$.ajax(`/api/posts`, { type: 'POST', data: data })
			.then((res) => {
				let comment = $(
					`.comment-icon[data-id='${data.article}'] .fa-comments`,
				);
				if (!$(comment).hasClass('fas')) {
					comment.addClass('fas');
					comment.removeClass('far');
				}

				$('#comments').val('');
				$('#name').val('');

				$('.modal.is-active').removeClass('is-active');
				location.reload();
			})
			.catch((err) => {
				console.error(err);
			});
	});

	// "Show Favorite(s)" logic
	$('.favorite-icon').click(function(e) {
		e.preventDefault();

		$.ajax(`/api/articles/`, {
			type: 'GET',
			data: { isLiked: true },
		})
			.then((res) => {
				let favorites = '';

				res.forEach((article) => {
					favorites += `
          <section class="section fav-item" data-id=${article._id}>
            <div class="card is-collapsed" data-id=${article._id}>
              <header class="card-header">
                <p class="card-header-title">
                  ${article.title}
                </p>
                <a class="card-header-icon" data-id=${
									article._id
								} onclick="toggleFavArticle('${article._id}')">
                  <span class="icon">
                    <i class="fa fa-angle-down"></i>
                  </span>
                </a>
              </header>
              <div class="card-content">
                <div class="content notification">
									<small>${article.summary}</small>
									<br>
                  <nav class="level is-mobile">
                    <div class="level-left">
                      <span class="level-item" aria-label="tag">
                        <span class="tag is-info is-normal">${
													article.topic
												}</span>
                      </span>
                      <a class="level-item" aria-label="like" onclick="removeFavArticle('${
												article._id
											}')">
                        <span class="icon is-small">
                          <i class="fas fa-heart" aria-hidden="true" ></i>
                        </span>
											</a>
											<a class="level-item" aria-label="link" href="https://www.nytimes.com${
												article.articleURL
											}" target="_blank">
                        <span class="icon is-small">
													<i class="fas fa-external-link-alt" aria-hidden="true" ></i>
                        </span>
											</a>
                    </div>
                    <div class="level-right">
                      <p class="level-item">
                        <span><small><i class="far fa-calendar-alt"></i></small>&nbsp;<small>${moment(
													article.publishedOnDate,
												).format('ll')}</small></span>
                      </p>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </section>`;
				});
				$('#modal-favorite #favs').html($.parseHTML(favorites));
			})
			.catch((err) => {
				console.error(err);
			});

		$('#modal-favorite').addClass('is-active');
	});
});
