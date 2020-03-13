const API_KEY = '15f915153fba0c51928dd08b3e866299';

class App {
	constructor(sett) {
		this.appElm = document.querySelector(sett.elm);
		this.props = sett.propereties;
		this.router = {routes: [], default: () => this.appElm.innerHTML = "<h2 style='padding: 50px 0' ><center>Sorry, page you requested not exist.</center></h2>"};
		this.urlParams = {};

		this.updateUrlParams();
		this.catchLinks();
	}
	

	qs(query) {
		return this.appElm.querySelector(query);
	}

	qsa(query) {
		return Array.from(this.appElm.querySelectorAll(query));
	}

	updateUrlParams() {
		console.log('Update url params');

		let uri = location.pathname,//.replace(/(\?\S+)|(\#\S+)$/, ''),
			uriParts = uri.replace(/^\/|\/$/g, '').split('/'),
			module = uriParts.shift();

		// generate url parameters array (/home/page/3 => params = {page: 3})
		if(uriParts.length > 0) {
			if(uriParts.length == 1)
				this.urlParams[module] = uriParts[0];
			else
				for(let i = 0; i < uriParts.length; i++)
					this.urlParams[uriParts[i]] = uriParts[++i]; 
		}
		else
			this.urlParams = {};
	}

	onRelocate() {
		console.log('On relocate');

		this.updateUrlParams();
		this.handleRoutes();
	}

	catchLinks() {
		console.log('Catch links');
		let links = this.qsa('a:not([target=_blank]):not([href=""]):not([href^="#"])');

		links.forEach(item => {
			item.onclick = e =>  {
				let url = e.target.getAttribute('href');

				history.pushState(null, null, url);
				this.onRelocate();

				window.onpopstate = e => {
					this.onRelocate();
				}

				e.preventDefault();
				e.stopPropagation();
			};
		});
	}

	Router(routeList) {
		this.router.routes = routeList;
		this.handleRoutes();
	}

	handleRoutes() {
		console.log('Route get');
		let matches = 0;

		for (let route of this.router.routes) {
			route.path = (route.path instanceof Array) ? route.path : [route.path];
			let uri = location.pathname,
				pattern = route.path.map(item => item.replace(/^\/$/g, '^\/+$').replace(/^\//g, '^\/')).join('|');

			if(uri.match(pattern) != null) {

				if(route.component)
					this.render(route.component);

				if(route.callback && route.callback instanceof Function)
					route.callback(this.urlParams);

				matches++;
				console.log(`pattern: ${pattern}\nuri:${uri}\nmatches: ${JSON.stringify(uri.match(pattern))}\nmatchCount: $\{matchCount\}`);
			}
		}

		if(matches == 0)
			this.router.default()
		
	}

	render(component, elm) {
		elm = elm || this.appElm;
		elm.innerHTML = '';
		component = component instanceof Array ? component : [component];

		if(!(elm instanceof Node)){
			throw new Error('Expected an html node as render container');
			return;
		}
		
		for(let item of component) {
			if(item instanceof Node)
				elm.appendChild(item);
			else
				throw new Error('Expected an html node as component');	
		}

		this.catchLinks();
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

	createElement(name, props, innerContent) {
		const elm = document.createElement(name);

		for (let prop in props) {
			if (typeof props[prop] === 'object')
				Object.assign(elm[prop], props[prop]);
			else
				elm[prop] = props[prop];
		}

		if (innerContent) {

			if(!(innerContent instanceof Array))
				innerContent = [innerContent];

			for (let item of innerContent) {
				let append = item instanceof Node ? item : document.createTextNode(item);
				elm.appendChild(append)
			}

		}

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

}