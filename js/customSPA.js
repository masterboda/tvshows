const API_KEY = '15f915153fba0c51928dd08b3e866299';

class App {
	constructor(sett) {
		this.appElm = document.querySelector(sett.elm);
		this.props = sett.propereties;
		this.routes = [];
		this.urlParams = {};

		this.catchLinks();
		
		// this.onRelocate();
	}
	

	qs(query) {
		return this.appElm.querySelector(query);
	}

	qsa(query) {
		return Array.from(this.appElm.querySelectorAll(query));
	}

	onRelocate() {
		let uri = location.pathname,//.replace(/(\?\S+)|(\#\S+)$/, ''),
			uriParts = uri.replace(/^\/|\/$/g, '').split('/'),
			module = uriParts.shift(),
			matchCount = 0;

		// generate url parameters array (/home/page/3 => params = {page: 3})
		if(uriParts.length > 0) {
			if(uriParts.length == 1)
				this.urlParams[module] = uriParts[0];
			else
				for(let i = 0; i < uriParts.length; i++) this.urlParams[uriParts[i]] = uriParts[++i]; 
		}
		
		for(let route of this.routes) {
			route.path = (typeof route.path == 'object') ? route.path : [route.path];
			let pattern = route.path.map(item => item.replace(/^\/$/g, '^\/$').replace(/^\//g, '^\/')).join('|');

			if(uri.match(pattern) != null) {
				matchCount++;
				route.callback(this.urlParams);
			}
			console.log(`pattern: ${pattern}\nuri:${uri}\nmatches: ${JSON.stringify(uri.match(pattern))}\nmatchCount: ${matchCount}`);
			
		}

		if(matchCount === 0)
			this.appElm.innerHTML = "<h2><center>Sorry, page you requested not exist.</center></h2>";
	}

	catchLinks() {
		let links = this.qsa('a:not([target=_blank]):not([href=""]):not([href^="#"])');

		links.forEach(item => {
			item.onclick = e =>  {
				let url = e.target.getAttribute('href');

				history.pushState(null, null, url);
				this.onRelocate();

				window.addEventListener('popstate', e => {
					this.onRelocate();
				});

				e.preventDefault();
				e.stopPropagation();
			};
		});
	}

	routeGet(route, func) {
		this.routes.push({path: route, callback: func});
	}

	requestAPI(opt) {
		return fetch(`https://api.themoviedb.org/3/${opt.props}?api_key=${API_KEY}&${this.urlencode(opt.params)}`);
	}


	urlencode(obj) {
		let encoded = [];
		for(let key in obj) {
			encoded.push(`${key}=${encodeURIComponent(obj[key])}`);
		}
		return encoded.join('&');
	}

	crElm(name, params) {
		let elm = document.createElement(name);
		
		for(let p in params)
			elm[p] = params[p];
		
		return elm;
	}

	applyTmpParams(tmp, params) {
		return tmp.replace(/{{(.*)}}/g, (match, key) => {
			key = key.trim();
			if(params[key] !== undefined)
				return params[key];
			else
				return match;
		})
	}

	//pages: {current, total, link}
	doPageSwitcher(pages) {
		// let elm = !this.qs('.page-switcher') ? this.appElm.appendChild(this.crElm('div', {className: 'page-switcher'})) : this.qs('page-switcher');
		let tmpParams = {list: '', firstLink: pages.link + '/1', lastLink: pages.link + `/${pages.total}`},
			btnsPerPage = 11;
		let tmp = `
		<div class="page-switcher">
			<a href="{{prevLink}}" class="prev primary-btn">Prev</a>
			<div class="page-list">
				<a href="{{firstLink}}" class="page-link first" >\<\<</a>
				{{list}}
				<a href="{{lastLink}}" class="page-link last" >\>\></a>
			</div>
			<a href="{{nextLink}}" class="next primary-btn">Next</a>
		</div>
		`;

		for(let i = pages.current - 2, j = 0; j <= btnsPerPage; j++, i++){
			if(i > 0 && i <= pages.total){
				let isActive = pages.current == i ? 'active' : '';
				tmpParams.list += `<a href="${pages.link}/${i}" class="page-link ${isActive}" >${i}</a>`;
			}
		}

		this.appElm.insertAdjacentHTML('beforeend', this.applyTmpParams(tmp, tmpParams));

		this.catchLinks();
	}

	doTvList(data) {
		let tmpParams = {list: ''};
		let tmp = `
			<section class="tvshows-list">
				{{list}}
			</section>
		`;

		for(let result of data.results) {
			// console.log(result);
			tmpParams.list += `
				<div class="poster" style="background-image: url(http://image.tmdb.org/t/p/w185//${result.poster_path})">
					<div class="poster-title"><h3><a href="/get-tv/id/${result.id}">${result.name}</a></h3></div>
				</div>
			`;
		}

		this.appElm.insertAdjacentHTML('beforeend', this.applyTmpParams(tmp, tmpParams));
		this.catchLinks();
	}

	// navLinks: [{href, text}]
	doHeader(title, navLinks, catergoryHref) {
		let tmpParams = {title: title, navList: ''};
		let tmp = `
			<h1 class="main-title">{{title}}</h1>
			<header class="head">
				<nav>
					{{navList}}
				</nav>
			</header>
		`;

		for(let link of navLinks) {
			let isActive = link.href == catergoryHref ? 'active' : ''; 
			tmpParams.navList += `<a href="${link.href}" class="nav-link ${isActive}" >${link.text}</a>`;
		}


		this.appElm.insertAdjacentHTML('afterbegin', this.applyTmpParams(tmp, tmpParams));
		this.catchLinks();
	}
}