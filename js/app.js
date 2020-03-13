/* Components
======================================= */

const Title = (titleText) => {
	return myApp.createElement('h1', {className: 'main-title'}, titleText);
}

const Header = (nav, activeCategory) => {
	return (
		myApp.createElement(
			'header',
			{className: 'head'},
			myApp.createElement(
				'nav',
				null,
				nav.map(link => 
					myApp.createElement(
						'a',
						{href: link.href, className: `nav-link ${link.href == activeCategory ? 'active' : ''}`},
						link.text
					)
				)
			)
		)
	);
}

const TvList = (dataList) => {
	return (
		myApp.createElement(
			'section',
			{className: 'tvshows-list'},
			dataList.map(item =>
				myApp.createElement(
					'div',
					{
						className: 'poster',
						style: {backgroundImage: `url(http://image.tmdb.org/t/p/w185//${item.poster_path})`},
						innerHTML: `<div class="poster-title"><h3><a href="/get-tv/id/${item.id}">${item.name}</a></h3></div>`
					}
				)
			)
		)
	);
}

const PageSwitcher = (pages) => {
	let firstLink = `${pages.link}/1`,
		lastLink = `${pages.link}/${pages.total}`,
		btnsPerPage = 11,
		linkList = [];

	let prevParams = pages.current - 1 > 0 ? {className: 'prev primary-btn', href: `${pages.link}/${pages.current - 1}`} : {className: 'prev primary-btn disabled'},
		nextParams = pages.current + 1 <= pages.total ? {className: 'next primary-btn', href: `${pages.link}/${pages.current + 1}`} : {className: 'next primary-btn disabled'};

	for(let i = pages.current - 2, j = 0; j <= btnsPerPage; j++, i++){
		if(i > 0 && i <= pages.total){
			let isActive = pages.current == i ? 'active' : '';
			linkList.push(
				myApp.createElement('a', {href: `${pages.link}/${i}`, className: `page-link ${isActive}`}, i)
			);
		}
	}

	return (
		myApp.createElement(
			'div',
			{className: 'page-switcher'},
			[
				myApp.createElement('a', prevParams, 'Prev'),
				myApp.createElement(
					'div',
					{className: 'page-list'},
					[
						myApp.createElement('a', {className: 'page-link first', href: firstLink}, '\<\<'),
						...linkList,
						myApp.createElement('a', {className: 'page-link last', href: lastLink}, '\>\>')
					]
				),
				myApp.createElement('a', nextParams, 'Next')
			]
		)
	);
}

const Popular = (data) => {
	return ([
		Title('TV shows library. Popular'),
		Header(nav, '/popular'),
		TvList(data.results),
		PageSwitcher({current: data.page, total: data.total_pages, link: '/popular/page'})
	]);
}

const TopRated = (data) => {
	return ([
		Title('TV shows library. Top rated'),
		Header(nav, '/top-rated'),
		TvList(data.results),
		PageSwitcher({current: data.page, total: data.total_pages, link: '/top-rated/page'})
	]);
}

const TvInfo = (data) => {
	console.log(data)

	return (
		myApp.createElement(
			'div',
			{
				className: 'tv-intro',
				style: {backgroundImage: `radial-gradient(circle at 20% 50%, rgba(36.08%, 20.00%, 9.02%, 0.78) 0%, rgba(44.31%, 26.67%, 14.90%, 0.68) 100%), url('https://image.tmdb.org/t/p/w1400_and_h450_face${data.backdrop_path}')`}
			},
			myApp.createElement(
				'div',
				{className: 'wrapper'},
				[
					myApp.createElement(
						'div',
						{
							className: 'tv-poster',
							style: {backgroundImage: `url(http://image.tmdb.org/t/p/w300//${data.poster_path})`},
						}
					),
					myApp.createElement(
						'div',
						{className: 'tv-info'},
						[
							myApp.createElement(
								'h2',
								{className: 'tv-name'},
								data.name
							),
							myApp.createElement(
								'div',
								{className: 'tv-rate'},
								data.vote_average
							),
							myApp.createElement(
								'div',
								{
									className: 'tv-overview',
									innerHTML: `<h3>Overview</h3><div class="tv-overview-text">${data.overview}</div>`
								}
							)
						]
					)
				]
			)
		)
	);
}