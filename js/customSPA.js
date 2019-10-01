const API_KEY = '15f915153fba0c51928dd08b3e866299';

class App {
	constructor(sett) {
		this.appElm = document.querySelector(sett.elm);
		this.props = sett.propereties;
		this.routes = [];
		this.urlParams = {};

		let links = this.qsa('a:not([target=_blank])');
		// console.log(links);
		links.forEach(item => {
			item.addEventListener('click', e =>  {
				let url = e.target.getAttribute('href');

				history.pushState(null, null, url);
				this.onRelocate();

				window.addEventListener('popstate', e => {
					this.onRelocate();
				});

				e.preventDefault();
				e.stopPropagation();
			});
		});
		
		// this.onRelocate();
	}
	

	qs(query) {
		return this.appElm.querySelector(query);
	}

	qsa(query) {
		return Array.from(this.appElm.querySelectorAll(query));
	}

	onRelocate() {
		let uri = location.pathname,
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
			let pattern = route.path.map(item => item.replace(/^\/$/g, '^\/$')).join('|');

			if(uri.match(pattern) != null) {
				matchCount++;
				route.callback(this.urlParams);
			}
			console.log(`pattern: ${pattern}\nuri:${uri}\nmatches: ${JSON.stringify(uri.match(pattern))}\nmatchCount: ${matchCount}`);
			
		}

		if(matchCount === 0)
			this.appElm.innerHTML = "<h2><center>Sorry, page you requested not exist.</center></h2>";
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
}