/* Components
======================================= */

const Title = (titleText) => {
	return myApp.createElement('h1', { className: 'main-title' }, titleText);
}

const SearchBar = (type) => {

	function goSearch() {
		let text = searchInp.value;

		if(text)
			myApp.redirect(`/search/type/${type}/q/${text}`)
	}

	const searchInp = myApp.createElement(
		'input',
		{
			type: 'text', name: 'search-input', placeholder: 'Type to search...',
			onkeydown: e => {
				if(e.keyCode == 13)
					goSearch()
			} 
		}
	);

	const searchBtn = myApp.createElement(
		'button',
		{ className: 'search-btn primary-btn', onclick: goSearch },
		'Search'
	);

	return (
		myApp.createElement(
			'div',
			{ className: 'search-bar' },
			[
				searchInp,
				searchBtn
			]
		)
	)
}

const Header = (nav, activeCategory, searchType) => {
	return (
		myApp.createElement(
			'header',
			{ className: 'head' },
			[
				myApp.createElement(
					'nav',
					null,
					nav.map(link => 
						myApp.createElement(
							'a',
							{ href: link.href, className: `nav-link ${link.href == activeCategory ? 'active' : '' }`},
							link.text
						)
					)
				),
				SearchBar(searchType)
			]
		)
	);
}

const TvList = (dataList, linkProp) => {
	return (
		myApp.createElement(
			'section',
			{  className: 'tvshows-list'  },
			dataList.map(item =>
				myApp.createElement(
					'div',
					{
						className: 'poster',
						style: { backgroundImage: `url(http://image.tmdb.org/t/p/w185//${item.poster_path })`},
						innerHTML: `<div class="poster-title"><h3><a href="/tv/id/${ item.id }">${ item.name.length <= 30 ? item.name : item.name.slice(0, 30) + '...' }</a></h3></div>`
					}
				)
			)
		)
	);
}

const MvList = (dataList) => {
	return (
		myApp.createElement(
			'section',
			{ className: 'tvshows-list' },
			dataList.map(item =>
				myApp.createElement(
					'div',
					{
						className: 'poster',
						style: { backgroundImage: `url(http://image.tmdb.org/t/p/w185//${ item.poster_path })`},
						innerHTML: `<div class="poster-title"><h3><a href="/movie/id/${ item.id }">${ item.title.length <= 30 ? item.title : item.title.slice(0, 30) + '...'}</a></h3></div>`
					}
				)
			)
		)
	);
}

const Recommendation = (item, type) => {
	let title = type == 'tv' ? item.name : item.title;

	return (
		myApp.createElement(
			'div',
			{ className: 'recommendation-item' },
			myApp.createElement(
				'a',
				{ href: `/${type}/id/${item.id}` },
				title.length <= 15 ? title : title.slice(0, 15) + '...'
			)
		)
	);
}

const PageSwitcher = (pages) => {
	let firstLink = `${ pages.link }/1`,
		lastLink = `${ pages.link }/${ pages.total }`,
		btnsPerPage = 11,
		linkList = [];

	let prevParams = pages.current - 1 > 0 ? { className: 'prev primary-btn', href: `${ pages.link }/${ pages.current - 1 }`} : { className: 'prev primary-btn disabled' },
		nextParams = pages.current + 1 <= pages.total ? { className: 'next primary-btn', href: `${ pages.link }/${ pages.current + 1 }`} : { className: 'next primary-btn disabled' };

	for(let i = pages.current - 2, j = 0; j <= btnsPerPage; j++, i++){
		if(i > 0 && i <= pages.total){
			let isActive = pages.current == i ? 'active' : '';
			linkList.push(
				myApp.createElement('a', { href: `${ pages.link }/${ i }`, className: `page-link ${ isActive }`, title: `Page ${i} of ${pages.total}` }, i)
			);
		}
	}

	return (
		myApp.createElement(
			'div',
			{ className: 'page-switcher' },
			[
				myApp.createElement('a', prevParams, 'Prev'),
				myApp.createElement(
					'div',
					{ className: 'page-list' },
					[
						myApp.createElement('a', { className: 'page-link first', href: firstLink, title: 'Page 1' }, '\<\<'),
						...linkList,
						myApp.createElement('a', { className: 'page-link last', href: lastLink, title: `Page ${pages.total}` }, '\>\>')
					]
				),
				myApp.createElement('a', nextParams, 'Next')
			]
		)
	);
}

const Search = (data) => {
	let type = myApp.urlParams.type,
		q = myApp.urlParams.q;
	return ([
		Title(`Search results for '${q}'`),
		Header(nav, `/trending/${type == 'tv' ? 'tv' : 'movies'}`, type),
		(type == 'tv' ? TvList(data.results) : MvList(data.results)),
		PageSwitcher({ current: data.page, total: data.total_pages, link: `/search/type/${type}/q/${q}/page` })
	]);
}

const TrendingTV = (data) => {
	return ([
		Title('TV shows library. Tranding This week'),
		Header(nav, '/trending/tv', 'tv'),
		TvList(data.results),
		PageSwitcher({ current: data.page, total: data.total_pages, link: '/trending/tv' })
	]);
}

const TrendingMovies = (data) => {
	return ([
		Title('TV shows library. Tranding This week'),
		Header(nav, '/trending/movies', 'movie'),
		MvList(data.results),
		PageSwitcher({ current: data.page, total: data.total_pages, link: '/trending/movies' })
	]);
}

const TvInfo = (data) => {
	console.log(data)

	return (
		myApp.createElement(
			'div',
			{
				className: 'tv-intro',
				style: { backgroundImage: `radial-gradient(circle at 20% 50%, rgba(36.08%, 20.00%, 9.02%, 0.78) 0%, rgba(44.31%, 26.67%, 14.90%, 0.68) 100%), url('https://image.tmdb.org/t/p/w1400_and_h450_face${data.backdrop_path }')`}
			},
			myApp.createElement(
				'div',
				{ className: 'wrapper' },
				[
					myApp.createElement('div', {className: 'back-btn', onclick: () => history.back()}, '< Go back'),
					myApp.createElement(
						'div',
						{
							className: 'tv-poster',
							style: { backgroundImage: `url(http://image.tmdb.org/t/p/w300//${data.poster_path })`},
						}
					),
					myApp.createElement(
						'div',
						{ className: 'tv-info' },
						[
							myApp.createElement(
								'h2',
								{ className: 'tv-name' },
								data.name || data.title
							),
							myApp.createElement(
								'div',
								{ className: 'tv-rate' },
								data.vote_average
							),
							myApp.createElement(
								'div',
								{
									className: 'tv-overview',
									innerHTML: `<h3>Overview</h3><div class="tv-overview-text">${ data.overview }</div>`
								}
							),
							myApp.createElement(
								'div',
								{ className: 'tv-recommendations' },
								[
									myApp.createElement('h4', null, 'Related'),
									myApp.createElement(
										'div',
										{ className: 'recommendation-list' }
									)
								]
							)
						]
					)
				]
			)
		)
	);
}